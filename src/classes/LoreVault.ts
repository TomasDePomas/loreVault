import { Plugin, App } from 'vue'
import { IKeyStorageDriver } from 'src/types/drivers/IKeyStorageDriver'
import { BrowserKeyStorage } from 'src/classes/drivers/browser/BrowserKeyStorage'
import { TauriKeyStorage } from 'src/classes/drivers/tauri/TauriKeyStorage'
import KeyStorage from 'src/classes/KeyStorage'

type LoreVaultDrivers = {
  keyStorage: new () => IKeyStorageDriver
}
export const LoreVault: Plugin = {
  install(_app: App, driverOverwrites: Partial<LoreVaultDrivers> = {}): void {
    let drivers: LoreVaultDrivers
    if (!window.tauriContainer) {
      drivers = {
        keyStorage: BrowserKeyStorage,
        ...driverOverwrites,
      }
    } else {
      drivers = {
        keyStorage: TauriKeyStorage,
        ...driverOverwrites,
      }
    }

    KeyStorage.initialize(new drivers.keyStorage())
      .catch(e => {
        console.error('Unable to initialize key storage driver', e)
      })
  },
}
