import { IDriverClass } from 'src/types/generic/IDriverClass.ts'
import { OpenedFile } from 'src/types/OpenedFile'

/*
  The clerk contains platform specific implementations for helper methods
 */
export interface IClerkDriver extends IDriverClass {
  openImage(): Promise<OpenedFile | null>
}
