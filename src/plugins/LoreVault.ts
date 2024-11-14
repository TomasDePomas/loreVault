import { Plugin, App } from 'vue'
import { IKeyStorageDriver } from 'src/types/drivers/IKeyStorageDriver'
import { BrowserKeyStorage } from 'src/classes/drivers/browser/BrowserKeyStorage'
import { TauriKeyStorage } from 'src/classes/drivers/tauri/TauriKeyStorage'
import KeyStorage from 'src/classes/KeyStorage'
import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver'
import { BrowserVaultTeller } from 'src/classes/drivers/browser/BrowserVaultTeller'
import { TauriVaultTeller } from 'src/classes/drivers/tauri/TauriVaultTeller'
import VaultTeller from 'src/classes/VaultTeller'
import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver'
import { BrowserLedger } from 'src/classes/drivers/browser/BrowserLedger'
import { TauriLedger } from 'src/classes/drivers/tauri/TauriLedger'
import Ledger from 'src/classes/Ledger'

type LoreVaultDrivers = {
  keyStorage: new () => IKeyStorageDriver
  vaultTeller: new () => IVaultTellerDriver
  ledger: new () => ILedgerDriver
}
export const LoreVault: Plugin = {
  install(_app: App, driverOverwrites: Partial<LoreVaultDrivers> = {}): void {
    let drivers: LoreVaultDrivers
    if (!window.tauriContainer) {
      console.info('Initializing browser drivers..')
      drivers = {
        keyStorage: BrowserKeyStorage,
        vaultTeller: BrowserVaultTeller,
        ledger: BrowserLedger,
        ...driverOverwrites,
      }
    } else {
      console.info('Initializing tauri drivers..')
      drivers = {
        keyStorage: TauriKeyStorage,
        vaultTeller: TauriVaultTeller,
        ledger: TauriLedger,
        ...driverOverwrites,
      }
    }

    KeyStorage.initialize(new drivers.keyStorage()).catch((e) => {
      console.error('Unable to initialize key storage driver', e)
    })
    VaultTeller.initialize(new drivers.vaultTeller()).catch((e) => {
      console.error('Unable to initialize vault teller driver', e)
    })
    Ledger.initialize(new drivers.ledger()).catch((e) => {
      console.error('Unable to initialize vault teller driver', e)
    })
  },
}
