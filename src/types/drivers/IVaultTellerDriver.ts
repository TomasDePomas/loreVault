import { IDriverClass } from 'src/types/generic/IDriverClass.ts'

export interface IVaultTellerDriver extends IDriverClass {
  /* Read chests from file into app storage */
  openChest(identifier: string): Promise<void>

  /* Store current open chest into file */
  closeChest(identifier: string): Promise<void>
}
