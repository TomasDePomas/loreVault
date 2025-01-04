import { LoreRecord } from 'src/types/LoreRecord'
import { BrowserLoreCategoryEntity } from 'src/types/browser/BrowserLoreCategoryEntity'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'

type LoreRecordCategoryEntity = {
  recordIdentifier: LoreRecord['identifier']
  categoryName: BrowserLoreCategoryEntity['categoryName']
  value: LoreRecordCategory['value']
}

export const convertEntitiesToRecords = (
  recordCategories: LoreRecordCategoryEntity[],
): LoreRecord[] => {
  const records: Record<LoreRecord['identifier'], LoreRecord> = {}

  for (const { recordIdentifier, categoryName, value } of recordCategories) {
    if (!records[recordIdentifier]) {
      records[recordIdentifier] = {
        identifier: recordIdentifier,
        categories: {},
      }
    }
    if (!records[recordIdentifier].categories[categoryName]) {
      records[recordIdentifier].categories[categoryName] = []
    }
    records[recordIdentifier].categories[categoryName].push({ value })
  }

  return Object.values(records)
}
