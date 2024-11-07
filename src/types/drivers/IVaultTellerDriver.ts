import { IDriverClass } from 'src/types/generic/IDriverClass.ts'

export interface IVaultTellerDriver extends IDriverClass {
  /* Read chests from file into app storage */
  openChest(): Promise<boolean>

  /* Store current open chest into file */
  storeChest(): Promise<boolean>
  closeChest(): Promise<boolean>
}
