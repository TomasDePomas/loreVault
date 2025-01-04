import { appCacheDir, resolve } from '@tauri-apps/api/path'
import { exists } from '@tauri-apps/plugin-fs'

export const resolveExtractedChestPath = async (): Promise<string> => {
  return await resolve(await appCacheDir(), 'openedChest')
}

export const hasExtractedChest = async (): Promise<boolean> => {
  return await exists(await resolveExtractedChestPath())
}
