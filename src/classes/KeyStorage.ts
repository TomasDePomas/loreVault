import { IKeyStorageDriver } from 'src/types/drivers/IKeyStorageDriver'
import DriverableSingleton from 'src/classes/generic/DriverableSingleton.ts'
import { DrivenClass } from 'src/types/generic/IDriverClass'

class KeyStorage extends DriverableSingleton<IKeyStorageDriver> {
  constructor() {
    super(KeyStorage)
  }
}

export default new KeyStorage() as DrivenClass<IKeyStorageDriver>
