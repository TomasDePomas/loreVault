import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver'
import { LoreRecord } from 'src/types/LoreRecord'

export class TauriLedger implements ILedgerDriver {
  addRecord(record: LoreRecord): Promise<boolean> {
    return Promise.resolve(false)
  }

  addRecords(records: Array<LoreRecord>): Promise<boolean> {
    return Promise.resolve(false)
  }

  clear(): Promise<boolean> {
    return Promise.resolve(false)
  }
}
