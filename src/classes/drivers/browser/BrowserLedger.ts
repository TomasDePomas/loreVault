import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver'
import { LoreRecord } from 'src/types/LoreRecord'
import Dexie from 'dexie'
import { BrowserLoreCategoryEntity } from 'src/types/browser/BrowserLoreCategoryEntity'
import { BrowserLoreRecordCategoryEntity } from 'src/types/browser/BrowserLoreRecordCategoryEntity'
import { BrowserLoreVaultDB } from 'src/types/browser/BrowserLoreVaultDB'
import { BrowserLoreRecordEntity } from 'src/types/browser/BrowserLoreRecordEntity'

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

  async addRecord(record: LoreRecord): Promise<void> {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    const categories: BrowserLoreCategoryEntity[] = []
    const recordCategories: BrowserLoreRecordCategoryEntity[] = []

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

    this.db.records.put({
      identifier: record.identifier,
    })
    this.db.categories.bulkPut(categories)
    this.db.recordCategories.bulkPut(recordCategories)
    console.log(record)
  }

  async addRecords(records: Array<LoreRecord>): Promise<void> {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    await Promise.all(records.map((record) => this.addRecord(record)))
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

    console.log({ identifiers })

    const recordCategories = await this.db.recordCategories
      .where('recordIdentifier')
      .anyOf(identifiers.map(({ identifier }) => identifier))
      .toArray()

    const records: Record<LoreRecord['identifier'], LoreRecord> = []

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
  async clear(): Promise<void> {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    await Promise.all(this.db.tables.map((table) => table.clear()))
  }
}
