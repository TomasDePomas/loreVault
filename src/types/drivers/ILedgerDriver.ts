import { IDriverClass } from 'src/types/generic/IDriverClass.ts'
import { LoreRecord } from 'src/types/LoreRecord.ts'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'

/*
  The ledger is a searchable interface for the chests contents and allows
  individual records to be found and updated in the ledger
 */
export interface ILedgerDriver extends IDriverClass {
  upsertRecord(record: LoreRecord): Promise<void>
  findRecords(term: string): Promise<LoreRecord[]>
  getCategories(): Promise<Record<string, LoreRecordCategory['value'][]>>
  clear(): Promise<void>
}
