import { IClerkDriver } from 'src/types/drivers/IClerkDriver'
import { OpenedFile } from 'src/types/OpenedFile'
import { open } from '@tauri-apps/plugin-dialog'
import { readFile } from '@tauri-apps/plugin-fs'
import { decodeBase64FromBytes } from 'src/utils/base64Conversion'
import { resizeImage } from 'src/utils/resizeImage'
import { basename } from '@tauri-apps/api/path'

export class TauriClerk implements IClerkDriver {
  async openImage(): Promise<OpenedFile | null> {
    const path = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: 'Image file',
          extensions: ['png', 'jpeg', 'jpg'],
        },
      ],
    })
    if (!path) {
      return null
    }
    let filename = await basename(path)
    const bytes = await readFile(path)
    let base64 = decodeBase64FromBytes(bytes)

    if (filename.endsWith('jpeg') || filename.endsWith('jpg')) {
      filename = filename.replace(/jpg$/i, 'png')
      base64 = `data:image/jpeg;base64,${base64}`
    } else if (filename.endsWith('png')) {
      base64 = `data:image/png;base64,${base64}`
    }
    console.log({filename})
    const content = await resizeImage(base64)
    if (!content) {
      return null
    }

    return {
      content,
      filename,
    }
  }
}
