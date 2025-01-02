import DriverableSingleton from 'src/classes/generic/DriverableSingleton.ts'
import { DrivenClass } from 'src/types/generic/IDriverClass'
import { IClerkDriver } from 'src/types/drivers/IClerkDriver'

class Clerk extends DriverableSingleton<IClerkDriver> {
  constructor() {
    super(Clerk)
  }
}

export default new Clerk() as DrivenClass<IClerkDriver>
