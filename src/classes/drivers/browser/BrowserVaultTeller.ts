import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver'
import { useDialog } from 'src/mixins/useDialog'
import * as JSZip from 'jszip'
import { convertMdToLoreRecord } from 'src/utils/convertMdToLoreRecord'
import Ledger from 'src/classes/Ledger'

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
        const record = convertMdToLoreRecord(content)
        await Ledger.addRecord(record)
      } catch (e) {
        console.error(e)
        await showToast({ message: 'Unable to read record' })
      }
    }
    return true
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
