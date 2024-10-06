import { IDriverClass } from 'src/types/generic/IDriverClass'

export default class Driverable<DriverClass extends IDriverClass> {
  protected driver: DriverClass | undefined
  private isInitialized: boolean = false
  private initializePromise: Promise<void> | undefined = undefined
  private resolveInitializePromise: (() => void) | undefined = undefined

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

  public awaitInitialized(): Promise<void> {
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
