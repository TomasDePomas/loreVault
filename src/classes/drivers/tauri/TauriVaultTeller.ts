import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'
import { LoreRecord } from 'src/types/LoreRecord'
import {
  hasExtractedChest,
  resolveExtractedChestPath,
} from 'src/utils/tauri/projectPaths'
import {
  exists,
  readDir,
  readFile,
  readTextFile,
  remove,
  writeFile,
  writeTextFile,
} from '@tauri-apps/plugin-fs'
import {
  readLoreRecordContentFromMd,
  readLoreRecordMetaFromMd,
} from 'src/utils/readLoreRecordFromMd'
import Ledger from 'src/classes/Ledger'
import { useDialog } from 'src/mixins/useDialog'
import { resolve } from '@tauri-apps/api/path'
import VaultTeller from 'src/classes/VaultTeller'
import { writeLoreRecordToMd } from 'src/utils/writeLoreRecordToMd'
import {
  decodeBase64FromBytes,
  encodeBase64ToBytes,
} from 'src/utils/base64Conversion'
const { showToast } = useDialog()

export class TauriVaultTeller implements IVaultTellerDriver {
  private openedPath: string | null = null
  async newChest(): Promise<void> {
    await invoke('new_chest')
    this.openedPath = null
  }
  async openChest(): Promise<boolean> {
    const path = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: 'Lore Chest',
          extensions: ['chest'],
        },
      ],
    })

    if (!path) {
      return false
    }
    try {
      await invoke('open_chest', { path })
    } catch (e) {
      console.error('Unable to open chest', e)
      return false
    }
    this.openedPath = path
    return true
  }

  async fillLedger(): Promise<boolean> {
    if (!(await hasExtractedChest())) {
      console.error('No chest open to read into ledger')
      return false
    }
    const extractedProjectPath = await resolveExtractedChestPath()

    const files = await readDir(extractedProjectPath)
    const records: (LoreRecord | void)[] = await Promise.all(
      files.map(async (file): Promise<LoreRecord | undefined> => {
        if (!file.isFile || !file.name.endsWith('.md')) {
          return
        }
        try {
          const content: string = await readTextFile(
            await resolve(extractedProjectPath, file.name),
          )
          return readLoreRecordMetaFromMd(content)
        } catch (e) {
          console.error(e)
          await showToast({ message: 'Unable to read record' })
          return
        }
      }),
    )
    for (const record of records) {
      if (!record) {
        continue
      }
      await Ledger.upsertRecord(record)
    }
    return true
  }

  async getRecordContents(
    identifier: LoreRecord['identifier'],
  ): Promise<string> {
    if (!(await hasExtractedChest())) {
      throw 'No chest open to get record from'
    }
    const recordPath = await resolve(
      await resolveExtractedChestPath(),
      `${identifier}.md`,
    )
    if (!(await exists(recordPath))) {
      throw `Unable to find file [${identifier}] in chest`
    }
    const content: string = await readTextFile(recordPath)
    return readLoreRecordContentFromMd(content, VaultTeller.replaceImage)
  }

  async addRecord(record: LoreRecord, content: string): Promise<boolean> {
    if (!(await hasExtractedChest())) {
      throw 'No chest open to add record to'
    }
    const { mdContent, assets } = writeLoreRecordToMd(record, content)
    const extractedProjectPath = await resolveExtractedChestPath()
    await Promise.all(
      assets.map(async ({ path, base64 }): Promise<void> => {
        if (base64.startsWith('data:image/jpeg;base64,')) {
          base64 = base64.replace('data:image/jpeg;base64,', '')
        } else if (base64.startsWith('data:image/png;base64,')) {
          base64 = base64.replace('data:image/png;base64,', '')
        } else {
          throw 'Unknown file type'
        }
        const bytes = encodeBase64ToBytes(base64)
        await writeFile(
          await resolve(extractedProjectPath, 'assets', path),
          bytes,
        )
      }),
    )
    await writeTextFile(
      await resolve(extractedProjectPath, `${record.identifier}.md`),
      mdContent,
    )
    await Ledger.upsertRecord(record)
    return true
  }

  async updateRecord(
    existingIdentifier: LoreRecord['identifier'],
    record: LoreRecord,
    content: string,
  ): Promise<boolean> {
    if (!(await hasExtractedChest())) {
      throw 'No chest update record in'
    }
    if (existingIdentifier !== record.identifier) {
      const existingRecord = await resolve(
        await resolveExtractedChestPath(),
        `${existingIdentifier}.md`,
      )
      await remove(existingRecord)
    }
    return VaultTeller.addRecord(record, content)
  }

  async replaceImage(imageUrl: string): Promise<string> {
    if (!(await hasExtractedChest())) {
      throw 'No chest open to read into ledger'
    }
    const path = await resolve(await resolveExtractedChestPath(), imageUrl)
    if (!(await exists(path))) {
      throw 'Unable to find corresponding image'
    }
    const bytes = await readFile(path)
    const base64 = decodeBase64FromBytes(bytes)

    if (imageUrl.endsWith('jpeg') || imageUrl.endsWith('jpg')) {
      return `data:image/jpeg;base64,${base64}`
    }

    if (imageUrl.endsWith('png')) {
      return `data:image/png;base64,${base64}`
    }
    throw 'Unknown file type'
  }

  async storeChest(path?: string | null): Promise<boolean> {
    path =
      path ||
      this.openedPath ||
      (await save({
        filters: [
          {
            name: 'Lore Chest',
            extensions: ['chest'],
          },
        ],
      }))
    if (!path) {
      return false
    }
    try {
      await invoke('save_chest', { path })
    } catch (e) {
      console.error('Unable to save chest', e)
      return false
    }
    this.openedPath = path
    return true
  }

  async closeChest(): Promise<boolean> {
    try {
      await invoke('close_chest')
    } catch (e) {
      console.error('Unable to close chest', e)
      return false
    }
    this.openedPath = null
    return true
  }

  async hasOpenChest(): Promise<boolean> {
    return await hasExtractedChest()
  }
}
