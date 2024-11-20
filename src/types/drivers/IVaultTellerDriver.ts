import { IDriverClass } from 'src/types/generic/IDriverClass.ts'

export interface IVaultTellerDriver extends IDriverClass {
  openChest(): Promise<boolean>

  fillLedger(): Promise<boolean>
  storeChest(): Promise<boolean>

  closeChest(): Promise<boolean>
}
