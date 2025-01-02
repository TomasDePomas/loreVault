import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver'
import { LoreRecord } from 'src/types/LoreRecord'
import Dexie from 'dexie'
import { uniq } from 'lodash'
import { BrowserLoreCategoryEntity } from 'src/types/browser/BrowserLoreCategoryEntity'
import { BrowserLoreRecordCategoryEntity } from 'src/types/browser/BrowserLoreRecordCategoryEntity'
import { BrowserLoreVaultDB } from 'src/types/browser/BrowserLoreVaultDB'
import { BrowserLoreRecordEntity } from 'src/types/browser/BrowserLoreRecordEntity'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'

export class BrowserLedger implements ILedgerDriver {
  private db: BrowserLoreVaultDB | null = null

  async initialize(): Promise<void> {
    this.db = new Dexie('loreVault') as BrowserLoreVaultDB
    this.db.version(1).stores({
      records: 'identifier',
      categories: 'categoryName',
      recordCategories: '[recordIdentifier+categoryName+value]',
    })
  }

  async upsertRecord(record: LoreRecord): Promise<void> {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    const categories: BrowserLoreCategoryEntity[] = []
    const recordCategories: BrowserLoreRecordCategoryEntity[] = []

    Object.keys(record.categories).forEach((categoryName) => {
      categories.push({
        categoryName,
        values: record.categories[categoryName].map(({ value }) => value),
      })

      record.categories[categoryName].forEach(({ value }) => {
        recordCategories.push({
          recordIdentifier: record.identifier,
          categoryName,
          value,
        })
      })
    })
    for (const category of categories) {
      const existingCategory = await this.db.categories.get(
        category.categoryName,
      )
      if (existingCategory) {
        category.values = uniq([...existingCategory.values, ...category.values])
      }
    }
    this.db.categories.bulkPut(categories)
    this.db.records.put({
      identifier: record.identifier,
    })
    this.db.recordCategories.bulkPut(recordCategories)
  }

  async findRecords(term: string): Promise<LoreRecord[]> {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    const pattern = new RegExp(term, 'i')
    const identifiers: BrowserLoreRecordEntity[] = await this.db.records
      .filter((record) => pattern.test(record.identifier))
      .limit(15)
      .toArray()

    const recordCategories = await this.db.recordCategories
      .where('recordIdentifier')
      .anyOf(identifiers.map(({ identifier }) => identifier))
      .toArray()

    const records: Record<LoreRecord['identifier'], LoreRecord> = {}

    for (const { recordIdentifier, categoryName, value } of recordCategories) {
      if (!records[recordIdentifier]) {
        records[recordIdentifier] = {
          identifier: recordIdentifier,
          categories: {},
        }
      }
      if (!records[recordIdentifier].categories[categoryName]) {
        records[recordIdentifier].categories[categoryName] = []
      }
      records[recordIdentifier].categories[categoryName].push({ value })
    }

    return Object.values(records)
  }

  async getCategories(): Promise<
    Record<string, LoreRecordCategory['value'][]>
  > {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    const dbCategories = await this.db.categories.toArray()
    const categoryValues: Record<string, LoreRecordCategory['value'][]> = {}

    for (const { categoryName, values } of dbCategories) {
      categoryValues[categoryName] = values
    }
    return categoryValues
  }

  async clear(): Promise<void> {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    await Promise.all(this.db.tables.map((table) => table.clear()))
  }
}
