import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver'
import { LoreRecord } from 'src/types/LoreRecord'

export class TauriLedger implements ILedgerDriver {
  addRecord(record: LoreRecord): Promise<void> {
    return Promise.resolve(undefined)
  }

  addRecords(records: Array<LoreRecord>): Promise<void> {
    return Promise.resolve(undefined)
  }

  clear(): Promise<void> {
    return Promise.resolve(undefined)
  }

  findRecords(term: string): Promise<LoreRecord[]> {
    return Promise.resolve([])
  }
}
