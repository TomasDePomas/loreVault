import { IKeyStorageDriver } from 'src/types/drivers/IKeyStorageDriver'

export class BrowserKeyStorage implements IKeyStorageDriver {
  async has(key: string): Promise<boolean> {
    const value = window.localStorage.getItem(key)
    return value !== null
  }

  async get(key: string, fallback: any = undefined): Promise<any> {
    const value = window.localStorage.getItem(key)
    if (value === null) {
      if (fallback === undefined) {
        throw `Key [${key}] is not set`
      }
      return fallback
    }
    try {
      return JSON.parse(value)
    } catch {
      throw `Unable to read [${key}] from storage`
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
