import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/api/fs'
import { get, has, set, unset } from 'lodash'
import { IStorageDriver } from 'src/types/generic/IStorageDriver'

const FILENAME = 'storage.json'

export class TauriStorage implements IStorageDriver {
  private content: Record<string, any> = {}
  private isInitialized: boolean = false

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }
    if (await exists(FILENAME, { dir: BaseDirectory.AppLocalData })) {
      try {
        const contents = await readTextFile(FILENAME, {
          dir: BaseDirectory.AppLocalData,
        })
        const parsedContents = JSON.parse(contents) as Record<string, any>
        if (!parsedContents || typeof parsedContents !== 'object') {
          throw Error('Corrupted storage file')
        }
        this.content = parsedContents
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Unable to load config from storage: ${error.message}`)
        } else {
          console.error('Unable to load config from storage')
        }
        this.content = {}
      } finally {
        this.isInitialized = true
      }
    }
  }

  async has(key: string): Promise<boolean> {
    return has(this.content, key)
  }

  async get(key: string, fallback: any = undefined): Promise<any> {
    const value = get(this.content, key)
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
    set(this.content, key, JSON.stringify(value))
    return this.persist()
  }

  async forget(key: string): Promise<void> {
    unset(this.content, key)
    return this.persist()
  }

  async flush(): Promise<void> {
    this.content = {}
    return this.persist()
  }

  async persist(): Promise<void> {
    const contents = JSON.stringify(this.content)
    await writeTextFile(FILENAME, contents, {
      dir: BaseDirectory.AppLocalData,
    })
  }
}
