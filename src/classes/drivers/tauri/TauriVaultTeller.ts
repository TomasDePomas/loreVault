import { IVaultTellerDriver } from 'src/types/drivers/IVaultTellerDriver'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'
import { LoreRecord } from 'src/types/LoreRecord'

export class TauriVaultTeller implements IVaultTellerDriver {
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
    return true
  }

  async fillLedger(): Promise<boolean> {
    return true
  }

  async storeChest(path?: string | null): Promise<boolean> {
    path =
      path ||
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
    return true
  }

  async closeChest(): Promise<boolean> {
    try {
      await invoke('close_chest')
    } catch (e) {
      console.error('Unable to close chest', e)
      return false
    }
    return true
  }

  addRecord(_record: LoreRecord, _content: string): Promise<boolean> {
    return Promise.resolve(false)
  }

  getRecordContents(_identifier: LoreRecord['identifier']): Promise<string> {
    return Promise.resolve('')
  }

  replaceImage(_imageUrl: string): Promise<string> {
    return Promise.resolve('')
  }

  updateRecord(
    _identifier: LoreRecord['identifier'],
    _record: LoreRecord,
    _content: string,
  ): Promise<boolean> {
    return Promise.resolve(false)
  }

  newChest(_name: string): Promise<void> {
    return Promise.resolve(undefined)
  }
}
