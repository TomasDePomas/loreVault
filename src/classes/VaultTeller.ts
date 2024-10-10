import DriverableSingleton from 'src/classes/generic/DriverableSingleton.ts'
import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver.ts'

class VaultTeller extends DriverableSingleton<IVaultTellerDriver> {
  constructor() {
    super(VaultTeller)
  }
}

export default new VaultTeller()
