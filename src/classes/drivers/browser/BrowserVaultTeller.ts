import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver'
import { useDialog } from 'src/mixins/useDialog'
import * as JSZip from 'jszip'
import {
  readLoreRecordContentFromMd,
  readLoreRecordMetaFromMd,
} from 'src/utils/readLoreRecordMetaFromMd'
import Ledger from 'src/classes/Ledger'
import { LoreRecord } from 'src/types/LoreRecord'
import VaultTeller from 'src/classes/VaultTeller'
const { showDialog, showToast } = useDialog()

export class BrowserVaultTeller implements IVaultTellerDriver {
  private chest: JSZip | null = null
  private chestName: string = 'chest'

  async openChest(): Promise<boolean> {
    const files = await showDialog<FileList>({
      title: 'Upload your Chest file',
      prompt: {
        type: 'file',
        model: '',
        accept: '.chest',
        multiple: false,
      },
    })
    if (!files) {
      return false
    }
    const file: File | null = files.item(0)
    if (!file) {
      return false
    }
    this.chestName = file.name.replace(/\.chest$/, '')
    this.chest = await JSZip.loadAsync(file)
    return true
  }

  async fillLedger(): Promise<boolean> {
    if (!this.chest) {
      console.error('No chest open to read into ledger')
      return false
    }
    const markdownFiles = this.chest.file(/\.md$/)
    for (const file of markdownFiles) {
      if (file.dir) {
        continue
      }
      try {
        const content: string = await file.async('text')
        const record = readLoreRecordMetaFromMd(content)
        await Ledger.addRecord(record)
      } catch (e) {
        console.error(e)
        await showToast({ message: 'Unable to read record' })
      }
    }
    return true
  }

  async getRecordContents(
    identifier: LoreRecord['identifier'],
  ): Promise<string> {
    if (!this.chest) {
      throw 'No chest open to read into ledger'
    }
    const file = this.chest.file(`${identifier}.md`)
    if (!file) {
      throw `Unable to find file [${identifier}] in chest`
    }
    const content: string = await file.async('text')
    return readLoreRecordContentFromMd(content, VaultTeller.replaceImage)
  }

  async replaceImage(imageUrl: string): Promise<string> {
    if (!this.chest) {
      throw 'No chest open to read into ledger'
    }
    const imageFile = this.chest.file(imageUrl)
    if (!imageFile) {
      throw 'Unable to find corresponding image'
    }
    const image = await imageFile.async('uint8array')
    let binary = ''
    for (let i = 0; i < image.byteLength; i++) {
      binary += String.fromCharCode(image[i])
    }
    const base64 = btoa(binary)

    if (imageUrl.endsWith('jpeg') || imageUrl.endsWith('jpg')) {
      return `data:image/jpeg;base64,${base64}`
    }

    if (imageUrl.endsWith('png')) {
      return `data:image/png;base64,${base64}`
    }
    throw 'Unknown file type'
  }

  async storeChest(): Promise<boolean> {
    if (!this.chest) {
      console.error('No chest open to store')
      return false
    }
    try {
      const blob = await this.chest.generateAsync({ type: 'blob' })
      const blobUrl = URL.createObjectURL(blob)

      const link: HTMLAnchorElement = document.createElement('a')
      link.href = blobUrl
      link.download = `${this.chestName}.chest`
      link.click()
    } catch (e) {
      console.error('Unable to save chest', e)
      return false
    }
    return true
  }

  async closeChest(): Promise<boolean> {
    this.chest = null
    return true
  }
}
