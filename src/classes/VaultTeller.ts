import DriverableSingleton from 'src/classes/generic/DriverableSingleton.ts'
import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver.ts'
import { DrivenClass } from 'src/types/generic/IDriverClass'

class VaultTeller extends DriverableSingleton<IVaultTellerDriver> {
  constructor() {
    super(VaultTeller)
  }

  async fillLedger(): Promise<boolean> {
    if (!this.driver) {
      throw 'VaultTeller driver not initialized'
    }

    return this.driver.fillLedger()
  }
}

export default new VaultTeller() as DrivenClass<IVaultTellerDriver>
