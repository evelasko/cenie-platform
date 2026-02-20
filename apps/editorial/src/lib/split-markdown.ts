import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'

/**
 * Splits a markdown string into two parts at the given root-level block index.
 * Uses the AST so headings, lists, blockquotes, etc. are never broken mid-block.
 */
export function splitMarkdownBlocks(
  content: string,
  afterBlock: number
): { preview: string; rest: string } {
  const processor = unified().use(remarkParse).use(remarkStringify)
  const tree = processor.parse(content)

  if (afterBlock >= tree.children.length) {
    return { preview: content, rest: '' }
  }

  const previewTree = { type: 'root' as const, children: tree.children.slice(0, afterBlock) }
  const restTree = { type: 'root' as const, children: tree.children.slice(afterBlock) }

  const preview = String(processor.stringify(previewTree))
  const rest = String(processor.stringify(restTree))

  return { preview, rest }
}
