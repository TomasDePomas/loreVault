import { LoreRecord } from 'src/types/LoreRecord'
// @ts-ignore
import { markdown } from 'markdown'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'

export const readLoreRecordMetaFromMd = (mdContent: string): LoreRecord => {
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
export const readLoreRecordContentFromMd = async (
  mdContent: string,
  replaceImageCallback: (content: string) => Promise<string>,
): Promise<string> => {
  try {
    const tree = markdown.parse(mdContent)

    let line = tree.shift()
    while (
      line &&
      (typeof line === 'string' ||
        (line[0] === 'header' && line[1].level === 1) ||
        line[0] === 'bulletlist')
    ) {
      line = tree.shift()
    }
    tree.unshift(line)

    let html = markdown.renderJsonML(markdown.toHTMLTree(tree))
    const assets: string[] = html
      .matchAll(/src="([^"]+)"/gi)
      .map((match: string[]): string => match[1])

    await Promise.all(
      [...new Set(assets)].map(async (url): Promise<void> => {
        const base64 = await replaceImageCallback(url)
        html = html.replaceAll(url, base64)
      }),
    )
    return html
  } catch (e) {
    throw `Unable to convert MD to LoreRecord: ${e}`
  }
}
