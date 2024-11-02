import { IDriverClass } from 'src/types/generic/IDriverClass.ts'

export interface ILedgerDriver extends IDriverClass {
  clear(): Promise<void>

  readChestIntoRecord(): Promise<void>
}
