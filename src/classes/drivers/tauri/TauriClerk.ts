import { IClerkDriver } from 'src/types/drivers/IClerkDriver'
import { OpenedFile } from 'src/types/OpenedFile'

export class TauriClerk implements IClerkDriver {
  openImage(): Promise<OpenedFile | null> {
    return Promise.resolve(null)
  }
}
