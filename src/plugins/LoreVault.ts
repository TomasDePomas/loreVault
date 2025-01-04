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
import Clerk from 'src/classes/Clerk'
import { IClerkDriver } from 'src/types/drivers/IClerkDriver'
import { TauriClerk } from 'src/classes/drivers/tauri/TauriClerk'
import { BrowserClerk } from 'src/classes/drivers/browser/BrowserClerk'

type LoreVaultDrivers = {
  keyStorage: new () => IKeyStorageDriver
  vaultTeller: new () => IVaultTellerDriver
  ledger: new () => ILedgerDriver
  clerk: new () => IClerkDriver
}
export const LoreVault: Plugin = {
  install(_app: App, driverOverwrites: Partial<LoreVaultDrivers> = {}): void {
    let drivers: LoreVaultDrivers
    if (!window.tauriContainer && (!import.meta.env.DEV || !window.isTauri)) {
      console.debug('Initializing browser drivers..')
      drivers = {
        keyStorage: BrowserKeyStorage,
        vaultTeller: BrowserVaultTeller,
        ledger: BrowserLedger,
        clerk: BrowserClerk,
        ...driverOverwrites,
      }
    } else {
      console.debug('Initializing tauri drivers..')
      drivers = {
        keyStorage: TauriKeyStorage,
        vaultTeller: TauriVaultTeller,
        ledger: TauriLedger,
        clerk: TauriClerk,
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
    Clerk.initialize(new drivers.clerk()).catch((e) => {
      console.error('Unable to initialize clerk driver', e)
    })
  },
}
