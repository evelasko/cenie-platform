import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import type { Components } from 'react-markdown'

interface MarkdownContentProps {
  content: string
  className?: string
}

/**
 * Renders markdown content as styled HTML.
 * Uses the same typography classes as MDXComponents for consistency.
 * react-markdown sanitizes output by default (no XSS).
 * Plain text renders as a paragraph (backward compatible).
 */
export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content?.trim()) {
    return null
  }

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 {...props} className="type-heading-1 scroll-mt-24">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 {...props} className="type-heading-2 scroll-mt-24">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} className="type-heading-3 scroll-mt-24">
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 {...props} className="type-heading-4 scroll-mt-24">
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 {...props} className="type-heading-5 scroll-mt-24">
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 {...props} className="type-heading-6 scroll-mt-24">
      {children}
    </h6>
  ),
  p: ({ children, ...props }) => (
    <p {...props} className="type-body-large">
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul {...props} className="list-disc pl-6 my-4 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="list-decimal pl-6 my-4 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="type-body-base">
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="border-l-4 border-primary/30 pl-6 my-6 italic text-foreground/80"
    >
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }) => (
    <strong {...props} className="font-semibold text-foreground">
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em {...props} className="italic">
      {children}
    </em>
  ),
  a: ({ href, children, node: _node, ...props }) => {
    if (!href) return <a {...props}>{children}</a>

    const linkClassName =
      'text-primary hover:text-primary/80 underline underline-offset-4 transition-colors'

    if (href.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          {...props}
        >
          {children}
        </a>
      )
    }

    return (
      <Link href={href} className={linkClassName}>
        {children}
      </Link>
    )
  },
}
