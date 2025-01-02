import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver'
import { LoreRecord } from 'src/types/LoreRecord'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'

export class TauriLedger implements ILedgerDriver {
  clear(): Promise<void> {
    return Promise.resolve(undefined)
  }

  findRecords(_term: string): Promise<LoreRecord[]> {
    return Promise.resolve([])
  }

  getCategories(): Promise<Record<string, LoreRecordCategory['value'][]>> {
    return Promise.resolve({})
  }

  upsertRecord(_record: LoreRecord): Promise<void> {
    return Promise.resolve(undefined)
  }
}
