export interface IStorageDriver {
  initialize(): Promise<void>

  has(key: string): Promise<boolean>

  get(key: string, fallback: any): Promise<any>

  pull(key: string, fallback: any): Promise<any>

  set(key: string, value: any): Promise<void>

  forget(key: string): Promise<void>

  flush(): Promise<void>
}
