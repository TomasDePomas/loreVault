import { IDriverClass } from 'src/types/generic/IDriverClass.ts'
import { LedgerFilter } from 'src/types/LedgerFilter.ts'

export interface ILedgerDriver extends IDriverClass {
  clear(): Promise<void>

  rebuild(): Promise<void>

  search(term: string, filter: LedgerFilter): Promise<void>
}
