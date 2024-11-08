import { IDriverClass } from 'src/types/generic/IDriverClass'

export default class Driverable<DriverClass extends IDriverClass> {
  protected driver: DriverClass | undefined
  private isInitialized: boolean = false
  private initializePromise: Promise<void> | undefined = undefined
  private resolveInitializePromise: (() => void) | undefined = undefined

  constructor() {
    return new Proxy(this, {
      get(target, prop: string): any {
        if (prop in target) {
          // @ts-ignore
          // eslint-disable-next-line prefer-rest-params
          return Reflect.get(...arguments)
        }

        if (!target.driver) {
          throw 'Driver not initialized'
        }
        if (!(prop in target.driver)) {
          throw `Unknown [${prop}] called on driver`
        }
        const driverProp = target.driver[prop as keyof DriverClass]

        if (driverProp instanceof Function) {
          return function (...args: any[]): any {
            return driverProp.apply(target, args)
          }
        }
        return driverProp
      },
    })
  }

  public async initialize(driver: DriverClass): Promise<void> {
    if (this.driver) {
      return
    }

    this.driver = driver

    if (typeof this.driver.initialize === 'function') {
      await this.driver.initialize()
    }

    this.isInitialized = true
    if (this.resolveInitializePromise) {
      this.resolveInitializePromise()
    }
  }

  awaitInitialized(): Promise<void> {
    if (!this.initializePromise) {
      this.initializePromise = new Promise((resolve) => {
        if (this.isInitialized) {
          resolve()
        }
        this.resolveInitializePromise = resolve
      })
    }
    return this.initializePromise
  }
}
