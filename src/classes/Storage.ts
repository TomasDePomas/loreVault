import { IStorageDriver } from 'src/types/generic/IStorageDriver'
import DriverableSingleton from 'src/classes/DriverableSingleton'

class Storage extends DriverableSingleton<IStorageDriver> {
  constructor() {
    super(Storage)
  }

  async has(key: string): Promise<boolean> {
    if (!this.driver) {
      throw Error('Storage not initialized')
    }
    return this.driver.has(key)
  }

  async get<TValue>(key: string, fallback: TValue): Promise<TValue>
  async get<TValue>(key: string): Promise<TValue | undefined>
  async get<TValue>(
    key: string,
    fallback?: TValue,
  ): Promise<TValue | undefined> {
    if (!this.driver) {
      throw Error('Storage not initialized')
    }
    return this.driver.get(key, fallback)
  }

  async pull<TValue>(
    key: string,
    fallback?: TValue,
  ): Promise<TValue | undefined> {
    if (!this.driver) {
      throw Error('Storage not initialized')
    }
    return this.driver.pull(key, fallback)
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.driver) {
      throw Error('Storage not initialized')
    }
    return this.driver.set(key, value)
  }

  async forget(key: string): Promise<void> {
    if (!this.driver) {
      throw Error('Storage not initialized')
    }
    return this.driver.forget(key)
  }

  async flush(): Promise<void> {
    if (!this.driver) {
      throw Error('Storage not initialized')
    }
    return this.driver.flush()
  }
}

export default new Storage()
