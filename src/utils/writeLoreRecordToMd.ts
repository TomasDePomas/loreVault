import { LoreRecord } from 'src/types/LoreRecord'
// @ts-ignore
import strip from 'strip'

export const writeLoreRecordToMd = (
  record: LoreRecord,
  content: string,
): { mdContent: string; assets: { path: string; base64: string }[] } => {
  try {
    const assets: { path: string; base64: string }[] = []
    let mdContent: string = `# ${record.identifier} \n\n`

    for (const categoryName in record.categories) {
      mdContent += `* ${categoryName}\n`
      for (const categoryValue of record.categories[categoryName]) {
        console.log({ categoryValue })
        if (categoryValue.link) {
          mdContent += `\t* [${categoryValue.value}](${categoryValue.link})\n`
        } else {
          mdContent += `\t* ${categoryValue.value}\n`
        }
      }
    }
    mdContent += ''

    const anchorTagMatches = [...content.matchAll(/<img[^>]+>/gi)]

    for (const anchorTagMatch of anchorTagMatches) {
      const anchorTag = anchorTagMatch[0]
      const title = anchorTag.match(/title="([^"]+)"/i)?.at(1)
      const base64 = anchorTag.match(/src="([^"]+)"/i)?.at(1)
      const path = anchorTag.match(/alt="([^"]+)"/i)?.at(1)

      if (!title || !base64 || !path) {
        throw 'Unable to read anchor tag from content'
      }
      assets.push({
        path,
        base64,
      })
      content = content.replace(
        anchorTag,
        `![${title}](assets/${path} "${path}")`,
      )
    }
    content = content.replaceAll('&nbsp;', ' ')
    content = content.replaceAll(
      /<h2>(.*?)<\/h2>/gi,
      (_match: string, group: string): string => {
        return `## ${group.trim()}`
      },
    )
    content = content.replaceAll(
      /<b>(.*?)<\/b>/gi,
      (_match: string, group: string): string => {
        return `__${group.trim()}__`
      },
    )
    content = content.replaceAll(
      /<i>(.*?)<\/i>/gi,
      (_match: string, group: string): string => {
        return `_${group.trim()}_`
      },
    )
    content = content.replaceAll(
      /<strike>(.*?)<\/strike>/gi,
      (_match: string, group: string): string => {
        return `~~${group.trim()}~~`
      },
    )
    mdContent += `\n## Description\n\n ${strip(content)}`

    return { mdContent, assets }
  } catch (e) {
    throw `Unable to convert LoreRecord to MD: ${e}`
  }
}
