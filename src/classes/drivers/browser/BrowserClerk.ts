import { IClerkDriver } from 'src/types/drivers/IClerkDriver'
import { OpenedFile } from 'src/types/OpenedFile'
import { resizeImage } from 'src/utils/resizeImage'

export class BrowserClerk implements IClerkDriver {
  openImage(): Promise<OpenedFile | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/png, image/jpeg'
      input.multiple = false

      input.onchange = () => {
        const files = input.files
        if (!files) {
          return resolve(null)
        }
        const file: File | null = files.item(0)
        if (!file) {
          return resolve(null)
        }
        let filename = file.name
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onerror = () => resolve(null)

        reader.onload = () => {
          const base64 = reader.result as string
          if (
            !base64.startsWith('data:image/jpeg') &&
            !base64.startsWith('data:image/png')
          ) {
            return resolve(null)
          }

          resizeImage(base64).then((content) => {
            if (!content) {
              return resolve(null)
            }

            if (!filename.endsWith('png')) {
              filename = filename.replace(/jpg$/i, 'png')
            }
            resolve({
              filename,
              content,
            })
          })
        }
      }
      input.click()
    })
  }
}
