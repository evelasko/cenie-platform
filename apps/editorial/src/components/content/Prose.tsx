'use client'

import { ReactNode } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from './MDXComponents'

interface ProseProps {
  children: ReactNode
  className?: string
}

export function Prose({ children, className = '' }: ProseProps) {
  return (
    <MDXProvider components={mdxComponents}>
      <article className={`prose-content max-w-4xl mx-auto ${className}`}>{children}</article>
    </MDXProvider>
  )
}
