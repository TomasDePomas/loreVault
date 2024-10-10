import { IStorageDriver } from 'src/types/drivers/IStorageDriver'
import DriverableSingleton from 'src/classes/generic/DriverableSingleton.ts'

class Storage extends DriverableSingleton<IStorageDriver> {
  constructor() {
    super(Storage)
  }
}

export default new Storage()
