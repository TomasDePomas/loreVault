import DriverableSingleton from 'src/classes/generic/DriverableSingleton.ts'
import { ILedgerDriver } from 'src/types/drivers/ILedgerDriver.ts'

class Ledger extends DriverableSingleton<ILedgerDriver> {
  constructor() {
    super(Ledger)
  }
}

export default new Ledger()
