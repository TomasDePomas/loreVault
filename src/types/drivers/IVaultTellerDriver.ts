import { IDriverClass } from 'src/types/generic/IDriverClass.ts'
import { LoreRecord } from 'src/types/LoreRecord'

export interface IVaultTellerDriver extends IDriverClass {
  openChest(): Promise<boolean>

  fillLedger(): Promise<boolean>
  getRecordContents(identifier: LoreRecord['identifier']): Promise<string>
  replaceImage(imageUrl: string): Promise<string>
  storeChest(): Promise<boolean>

  closeChest(): Promise<boolean>
}
