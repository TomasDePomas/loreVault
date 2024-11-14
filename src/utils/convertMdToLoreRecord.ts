import { LoreRecord } from 'src/types/LoreRecord'
// @ts-ignore
import { markdown } from 'markdown'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'

export const convertMdToLoreRecord = (mdContent: string): LoreRecord => {
  try {
    const tree = markdown.parse(mdContent)
    const mainHeader = tree.find(
      ([type, config]: [string, Record<any, any>]) => {
        return type === 'header' && config.level === 1
      },
    )
    if (!mainHeader) {
      throw 'missing level 1 header'
    }
    const categories: LoreRecord['categories'] = {}

    const categoryTree = tree.find(
      ([type]: [string]) => type === 'bulletlist',
    ) as any[]
    if (categoryTree) {
      categoryTree.shift()
      categoryTree.forEach((categoryBranch) => {
        categoryBranch.shift()
        const categoryType = categoryBranch.shift() as string
        const categoryValues = categoryBranch.shift() as [
          'listitem',
          string | ['link', { href: string }, string],
        ][]
        categoryValues.shift()
        categories[categoryType] = categoryValues.map(
          (categoryValye): LoreRecordCategory => {
            if (typeof categoryValye[1] === 'string') {
              return { value: categoryValye[1] }
            }
            return {
              value: categoryValye[1][2],
              link: categoryValye[1][1].href.replace(/\.md$/, ''),
            }
          },
        )
      })
    }
    return {
      identifier: mainHeader[2],
      categories,
    }
  } catch (e) {
    throw `Unable to convert MD to LoreRecord: ${e}`
  }
}
