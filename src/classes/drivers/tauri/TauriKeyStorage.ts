import { IKeyStorageDriver } from 'src/types/drivers/IKeyStorageDriver'
import { load, Store } from '@tauri-apps/plugin-store'

const FILENAME = 'storage.json'

export class TauriKeyStorage implements IKeyStorageDriver {
  private store: Store | null = null

  async initialize(): Promise<void> {
    if (this.store) {
      return
    }
    this.store = await load(FILENAME, { autoSave: true })
  }

  async has(key: string): Promise<boolean> {
    if (!this.store) {
      throw 'Storage driver is not initialized'
    }
    return this.store.has(key)
  }

  async get(key: string, fallback: any = undefined): Promise<any> {
    if (!this.store) {
      throw 'Storage driver is not initialized'
    }
    const value = await this.store.get<string>(key)
    if (value === undefined) {
      if (fallback === undefined) {
        throw Error(`Key [${key}] is not set`)
      }
      return fallback
    }
    try {
      return JSON.parse(value)
    } catch {
      throw Error(`Unable to read [${key}] from storage`)
    }
  }

  async pull(key: string, fallback: any = undefined) {
    const value = await this.get(key, fallback)
    await this.forget(key)
    return value
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.store) {
      throw 'Storage driver is not initialized'
    }
    await this.store.set(key, JSON.stringify(value))
  }

  async forget(key: string): Promise<void> {
    if (!this.store) {
      throw 'Storage driver is not initialized'
    }
    await this.store.delete(key)
  }

  async flush(): Promise<void> {
    if (!this.store) {
      throw 'Storage driver is not initialized'
    }
    return this.store.clear()
  }
}
