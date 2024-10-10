import { ChestContentType } from 'src/types/ChestContentType.ts'

export type LedgerFilter = {
  types: Partial<Record<ChestContentType, boolean>>
}
