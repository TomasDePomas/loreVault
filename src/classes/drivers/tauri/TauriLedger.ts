import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver'
import { LoreRecord } from 'src/types/LoreRecord'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'
import Database from '@tauri-apps/plugin-sql'
import { TauriLoreCategoryEntity } from 'src/types/tauri/TauriLoreCategoryEntity'
import { TauriLoreRecordCategoryEntity } from 'src/types/tauri/TauriLoreRecordCategoryEntity'
import { TauriLoreRecordEntity } from 'src/types/tauri/TauriLoreRecordEntity'
import { convertEntitiesToRecords } from 'src/utils/convertEntitiesToRecords'

export class TauriLedger implements ILedgerDriver {
  private db: Database | null = null
  async initialize(): Promise<void> {
    this.db = await Database.load('sqlite:loreVault.db')
  }

  async findRecords(term: string): Promise<LoreRecord[]> {
    if (!this.db) {
      throw 'TauriLedger database not initialized'
    }

    const identifiers = await this.db.select<TauriLoreRecordEntity[]>(
      'SELECT identifier FROM records WHERE identifier LIKE $1',
      [`%${term}%`],
    )

    const recordCategories = await this.db.select<
      TauriLoreRecordCategoryEntity[]
    >(
      `SELECT * FROM record_categories WHERE record_categories.recordIdentifier IN (${identifiers
        .map(({ identifier }) => `"${identifier}"`)
        .join(',')})`,
    )
    return convertEntitiesToRecords(recordCategories)
  }

  async getCategories(): Promise<
    Record<string, LoreRecordCategory['value'][]>
  > {
    if (!this.db) {
      throw 'TauriLedger database not initialized'
    }
    const categories = await this.db.select<
      { categoryName: string; value: string }[]
    >('SELECT DISTINCT categoryName, value FROM record_categories')

    return categories.reduce((record, category) => {
      if (!(category.categoryName in record)) {
        record[category.categoryName] = []
      }
      record[category.categoryName].push(category.value)
      return record
    }, {} as Record<string, LoreRecordCategory['value'][]>)
  }

  async upsertRecord(record: LoreRecord): Promise<void> {
    const db = this.db
    if (!db) {
      throw 'TauriLedger database not initialized'
    }
    const categories: TauriLoreCategoryEntity[] = []
    const recordCategories: TauriLoreRecordCategoryEntity[] = []

    Object.keys(record.categories).forEach((categoryName) => {
      categories.push({ categoryName })

      record.categories[categoryName].forEach(({ value }) => {
        recordCategories.push({
          recordIdentifier: record.identifier,
          categoryName,
          value,
        })
      })
    })

    await db.execute(
      'INSERT INTO records (identifier) VALUES ($1) ON CONFLICT(identifier) DO NOTHING',
      [record.identifier],
    )
    for (const category of categories) {
      await db.execute(
        'INSERT INTO categories(categoryName) VALUES ($1) ON CONFLICT (categoryName) DO NOTHING',
        [category.categoryName],
      )
    }

    for (const recordCategory of recordCategories) {
      await db.execute(
        'INSERT INTO record_categories(recordIdentifier, categoryName, value) VALUES ($1, $2, $3) ON CONFLICT (recordIdentifier, categoryName) DO UPDATE SET value = excluded.value',
        [
          recordCategory.recordIdentifier,
          recordCategory.categoryName,
          recordCategory.value,
        ],
      )
    }
  }

  async clear(): Promise<void> {
    if (!this.db) {
      throw 'TauriLedger database not initialized'
    }
    await this.db.execute('DELETE FROM record_categories;')
    await this.db.execute('DELETE FROM records;')
    await this.db.execute('DELETE FROM categories;')
  }
}
