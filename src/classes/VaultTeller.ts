import DriverableSingleton from 'src/classes/generic/DriverableSingleton.ts'
import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver.ts'
import { DrivenClass } from 'src/types/generic/IDriverClass'

class VaultTeller extends DriverableSingleton<IVaultTellerDriver> {
  constructor() {
    super(VaultTeller)
  }
}

export default new VaultTeller() as DrivenClass<IVaultTellerDriver>
