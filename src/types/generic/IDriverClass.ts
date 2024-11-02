import DriverableSingleton from 'src/classes/generic/DriverableSingleton'

export interface IDriverClass {
  initialize?(): Promise<void>
}

export type IDriverable<DriverClass extends IDriverClass> = Omit<
  DriverClass,
  'initialize'
> & {
  initialize(driver: DriverClass): Promise<void>
  awaitInitialized(): Promise<void>
}
export type DrivenClass<DriverClass extends IDriverClass> = (DriverableSingleton<DriverClass> & DriverClass)
