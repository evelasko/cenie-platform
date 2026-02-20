'use client'

import { ReactNode } from 'react'
import { MDXProvider } from '@mdx-js/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { mdxComponents } from './MDXComponents'

interface ProseProps {
  /** Raw markdown string to parse and render */
  content?: string
  /** Pre-compiled MDX children */
  children?: ReactNode
  className?: string
}

export function Prose({ content, children, className = '' }: ProseProps) {
  return (
    <MDXProvider components={mdxComponents}>
      <article className={`prose-content max-w-4xl mx-auto ${className}`}>
        {content ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents as any}>
            {content}
          </ReactMarkdown>
        ) : (
          children
        )}
      </article>
    </MDXProvider>
  )
}
