import { LoreRecord } from 'src/types/LoreRecord'
import { BrowserLoreCategoryEntity } from 'src/types/browser/BrowserLoreCategoryEntity'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'

export type TauriLoreRecordCategoryEntity = {
  recordIdentifier: LoreRecord['identifier']
  categoryName: BrowserLoreCategoryEntity['categoryName']
  value: LoreRecordCategory['value']
}
