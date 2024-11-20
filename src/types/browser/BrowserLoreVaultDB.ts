import Dexie, { EntityTable } from 'dexie'
import { BrowserLoreRecordEntity } from 'src/types/browser/BrowserLoreRecordEntity'
import { BrowserLoreCategoryEntity } from 'src/types/browser/BrowserLoreCategoryEntity'
import { BrowserLoreRecordCategoryEntity } from 'src/types/browser/BrowserLoreRecordCategoryEntity'

export type BrowserLoreVaultDB = Dexie & {
  records: EntityTable<BrowserLoreRecordEntity, 'identifier'>
  categories: EntityTable<BrowserLoreCategoryEntity, 'categoryName'>
  recordCategories: EntityTable<BrowserLoreRecordCategoryEntity>
}
