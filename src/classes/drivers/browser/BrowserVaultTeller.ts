import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver'
import { useDialog } from 'src/mixins/useDialog'
import JSZip from 'jszip'
import {
  readLoreRecordContentFromMd,
  readLoreRecordMetaFromMd,
} from 'src/utils/readLoreRecordFromMd'
import Ledger from 'src/classes/Ledger'
import { LoreRecord } from 'src/types/LoreRecord'
import VaultTeller from 'src/classes/VaultTeller'
import { writeLoreRecordToMd } from 'src/utils/writeLoreRecordToMd'
import { decodeBase64FromBytes } from 'src/utils/base64Conversion'
const { showToast } = useDialog()

export class BrowserVaultTeller implements IVaultTellerDriver {
  private chest: JSZip | null = null
  private chestName: string = 'chest'

  async newChest(): Promise<void> {
    const { showPrompt } = useDialog()
    const name = await showPrompt('Name your new chest', 'New chest')
    if (!name) {
      return
    }
    this.chestName = name
    this.chest = new JSZip()
  }
  async openChest(): Promise<boolean> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.chest'
      input.multiple = false

      input.onchange = () => {
        const files = input.files
        if (!files) {
          return resolve(false)
        }
        const file: File | null = files.item(0)
        if (!file) {
          return resolve(false)
        }
        this.chestName = file.name.replace(/\.chest$/, '')
        JSZip.loadAsync(file)
          .then((contents) => {
            this.chest = contents
            resolve(true)
          })
          .catch((e) => {
            console.error('Unable to open chest', e)
            resolve(false)
          })
      }
      input.click()
    })
  }

  async fillLedger(): Promise<boolean> {
    if (!this.chest) {
      console.error('No chest open to read into ledger')
      return false
    }
    const markdownFiles = this.chest.file(/\.md$/)
    await Promise.all(
      markdownFiles.map(async (file): Promise<void> => {
        if (file.dir) {
          return
        }
        try {
          const content: string = await file.async('text')
          const record = readLoreRecordMetaFromMd(content)
          await Ledger.upsertRecord(record)
        } catch (e) {
          console.error(e)
          await showToast({ message: 'Unable to read record' })
        }
      }),
    )
    return true
  }

  async getRecordContents(
    identifier: LoreRecord['identifier'],
  ): Promise<string> {
    if (!this.chest) {
      throw 'No chest open to get record from'
    }
    const file = this.chest.file(`${identifier}.md`)
    if (!file) {
      throw `Unable to find file [${identifier}] in chest`
    }
    const content: string = await file.async('text')
    return readLoreRecordContentFromMd(content, VaultTeller.replaceImage)
  }

  async addRecord(record: LoreRecord, content: string): Promise<boolean> {
    const chest = this.chest
    if (!chest) {
      throw 'No chest open to add record to'
    }
    const { mdContent, assets } = writeLoreRecordToMd(record, content)
    await Promise.all(
      assets.map(async ({ path, base64 }): Promise<void> => {
        if (base64.startsWith('data:image/jpeg;base64,')) {
          path += '.jpg'
          base64 = base64.replace('data:image/jpeg;base64,', '')
        } else if (base64.startsWith('data:image/png;base64,')) {
          path += '.png'
          base64 = base64.replace('data:image/png;base64,', '')
        } else {
          throw 'Unknown file type'
        }
        chest.file(`assets/${path}`, base64, { base64: true })
      }),
    )
    chest.file(`${record.identifier}.md`, mdContent)
    await Ledger.upsertRecord(record)
    return true
  }
  async updateRecord(
    existingIdentifier: LoreRecord['identifier'],
    record: LoreRecord,
    content: string,
  ): Promise<boolean> {
    if (!this.chest) {
      throw 'No chest update record in'
    }
    if (existingIdentifier !== record.identifier) {
      this.chest.remove(`${existingIdentifier}.md`)
    }
    return VaultTeller.addRecord(record, content)
  }

  async replaceImage(imageUrl: string): Promise<string> {
    if (!this.chest) {
      throw 'No chest open to read into ledger'
    }
    const imageFile = this.chest.file(imageUrl)
    if (!imageFile) {
      throw 'Unable to find corresponding image'
    }
    const base64 = decodeBase64FromBytes(await imageFile.async('uint8array'))
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
