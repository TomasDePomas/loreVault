export interface IStorageDriver {
  initialize(): Promise<void>

  has(key: string): Promise<boolean>

  get<TValue>(key: string): Promise<TValue | undefined>

  get<TValue>(key: string, fallback: TValue): Promise<TValue>

  pull<TValue>(key: string): Promise<TValue | undefined>

  pull<TValue>(key: string, fallback: TValue): Promise<TValue>

  set<TValue>(key: string, value: TValue): Promise<void>

  forget(key: string): Promise<void>

  flush(): Promise<void>
}
