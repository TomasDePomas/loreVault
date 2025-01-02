import { IClerkDriver } from 'src/types/drivers/IClerkDriver'

export class TauriClerk implements IClerkDriver {
  openImage(): Promise<string | null> {
    return Promise.resolve(null)
  }
}
