import { IDriverClass } from 'src/types/generic/IDriverClass.ts'
import { LoreRecord } from 'src/types/LoreRecord.ts'

export interface ILedgerDriver extends IDriverClass {
  addRecord(record: LoreRecord): Promise<boolean>

  addRecords(records: Array<LoreRecord>): Promise<boolean>

  clear(): Promise<boolean>
}

// TODO: Write into record
// TODO: Update record
// TODO: Update record in chest
