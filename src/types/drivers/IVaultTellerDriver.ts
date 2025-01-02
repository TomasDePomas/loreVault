import { IDriverClass } from 'src/types/generic/IDriverClass.ts'
import { LoreRecord } from 'src/types/LoreRecord'

/*
  The teller handles the current chest opening, closing and storing of chests,
   and reads their content into the ledger. It also handles the opening and
   storing of individual records
 */
export interface IVaultTellerDriver extends IDriverClass {
  newChest(name: string): Promise<void>
  openChest(): Promise<boolean>
  fillLedger(): Promise<boolean>
  getRecordContents(identifier: LoreRecord['identifier']): Promise<string>
  addRecord(record: LoreRecord, content: string): Promise<boolean>
  updateRecord(
    identifier: LoreRecord['identifier'],
    record: LoreRecord,
    content: string,
  ): Promise<boolean>
  replaceImage(imageUrl: string): Promise<string>
  storeChest(): Promise<boolean>
  closeChest(): Promise<boolean>
}
