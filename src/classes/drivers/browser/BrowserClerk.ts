import { IClerkDriver } from 'src/types/drivers/IClerkDriver'
import { OpenedFile } from 'src/types/OpenedFile'

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
          const image = new Image()
          image.onerror = () => resolve(null)
          image.onload = () => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            if (!context) {
              return resolve(null)
            }
            canvas.width = 300
            canvas.height = (image.height / image.width) * 300
            context.drawImage(image, 0, 0, canvas.width, canvas.height)

            if (!filename.endsWith('png')) {
              filename = filename.replace(/jpg$/i, 'png')
            }
            resolve({
              filename,
              content: canvas.toDataURL(),
            })
          }
          image.src = base64
        }
      }
      input.click()
    })
  }
}
