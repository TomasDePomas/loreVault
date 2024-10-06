import { IStorageDriver } from 'src/types/generic/IStorageDriver'

export class LocalStorage implements IStorageDriver {
  async initialize(): Promise<void> {
    // No need to initialize
  }

  async has(key: string): Promise<boolean> {
    const value = window.localStorage.getItem(key)
    return value !== null
  }

  async get(key: string, fallback: any = undefined): Promise<any> {
    const value = window.localStorage.getItem(key)
    if (value === null) {
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
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  async forget(key: string): Promise<void> {
    window.localStorage.removeItem(key)
  }

  async flush(): Promise<void> {
    window.localStorage.clear()
  }
}
