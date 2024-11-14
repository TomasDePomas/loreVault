import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver'
import { LoreRecord } from 'src/types/LoreRecord'
import Dexie from 'dexie'
import { BrowserLoreCategoryEntity } from 'src/types/browser/BrowserLoreCategoryEntity'
import { BrowserLoreRecordCategoryEntity } from 'src/types/browser/BrowserLoreRecordCategoryEntity'
import { BrowserLoreVaultDB } from 'src/types/browser/BrowserLoreVaultDB'

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

    Object.keys(record.categories).forEach(categoryName => {
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
    this.db.categories.bulkPut(
      categories,
    )
    this.db.recordCategories.bulkPut(
      recordCategories,
    )
    console.log(record)
  }

  async addRecords(records: Array<LoreRecord>): Promise<void> {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    await Promise.all(records.map((record) => this.addRecord(record)))
  }

  async clear(): Promise<void> {
    if (!this.db) {
      throw 'BrowserLedger database not initialized'
    }
    await Promise.all(this.db.tables.map((table) => table.clear()))
  }
}
