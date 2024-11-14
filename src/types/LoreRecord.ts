import { LoreRecordCategory } from 'src/types/LoreRecordCategory'

export type LoreRecord = {
  identifier: string
  categories: Record<string, LoreRecordCategory[]>
}
