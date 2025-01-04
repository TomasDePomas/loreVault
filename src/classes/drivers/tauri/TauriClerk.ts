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
          extensions: ['png', 'jpeg'],
        },
      ],
    })
    if (!path) {
      return null
    }
    const bytes = await readFile(path)
    const base64 = decodeBase64FromBytes(bytes)
    const content = await resizeImage(base64)
    if (!content) {
      return null
    }
    let filename = await basename(path)

    if (!filename.endsWith('png')) {
      filename = filename.replace(/jpg$/i, 'png')
    }

    return {
      content,
      filename,
    }
  }
}
