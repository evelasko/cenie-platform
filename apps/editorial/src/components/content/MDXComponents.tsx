import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface HeadingProps {
  children: ReactNode
  id?: string
}

// Custom heading components with anchor links
export function H1({ children, id }: HeadingProps) {
  return (
    <h1 id={id} className="type-heading-1 scroll-mt-24">
      {children}
    </h1>
  )
}

export function H2({ children, id }: HeadingProps) {
  return (
    <h2 id={id} className="type-heading-2 scroll-mt-24">
      {children}
    </h2>
  )
}

export function H3({ children, id }: HeadingProps) {
  return (
    <h3 id={id} className="type-heading-3 scroll-mt-24">
      {children}
    </h3>
  )
}

export function H4({ children, id }: HeadingProps) {
  return (
    <h4 id={id} className="type-heading-4 scroll-mt-24">
      {children}
    </h4>
  )
}

export function H5({ children, id }: HeadingProps) {
  return (
    <h5 id={id} className="type-heading-5 scroll-mt-24">
      {children}
    </h5>
  )
}

export function H6({ children, id }: HeadingProps) {
  return (
    <h6 id={id} className="type-heading-6 scroll-mt-24">
      {children}
    </h6>
  )
}

// Paragraph
export function P({ children }: { children: ReactNode }) {
  return <p className="type-body-large">{children}</p>
}

// Lists
export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>
}

export function OL({ children }: { children: ReactNode }) {
  return <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="type-body-base">{children}</li>
}

// Blockquote
export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-4 border-primary/30 pl-6 my-6 italic text-foreground/80">
      {children}
    </blockquote>
  )
}

// Code blocks
export function Code({ children, className }: { children: ReactNode; className?: string }) {
  const isInline = !className

  if (isInline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-sm">
        {children}
      </code>
    )
  }

  return <code className={className}>{children}</code>
}

export function Pre({ children }: { children: ReactNode }) {
  return (
    <pre className="p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto my-6">{children}</pre>
  )
}

// Links
interface AnchorProps {
  href?: string
  children: ReactNode
}

export function A({ href, children }: AnchorProps) {
  if (!href) return <a>{children}</a>

  // External links
  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
      >
        {children}
      </a>
    )
  }

  // Internal links
  return (
    <Link
      href={href}
      className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
    >
      {children}
    </Link>
  )
}

// Images
interface ImgProps {
  src?: string
  alt?: string
  title?: string
}

export function Img({ src, alt, title }: ImgProps) {
  if (!src) return null

  // For external images or when we can't determine size
  return (
    <span className="block my-8">
      <Image
        src={src}
        alt={alt || ''}
        title={title}
        width={800}
        height={600}
        className="rounded-lg w-full h-auto"
        style={{ objectFit: 'cover' }}
      />
      {(alt || title) && (
        <span className="block mt-2 text-center text-sm text-muted-foreground type-caption">
          {alt || title}
        </span>
      )}
    </span>
  )
}

// Horizontal rule
export function Hr() {
  return <hr className="my-8 border-border" />
}

// Table components
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse">{children}</table>
    </div>
  )
}

export function Thead({ children }: { children: ReactNode }) {
  return <thead className="bg-muted">{children}</thead>
}

export function Tbody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-b border-border">{children}</tr>
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-2 text-left font-semibold type-body-base">{children}</th>
}

export function Td({ children }: { children: ReactNode }) {
  return <td className="px-4 py-2 type-body-base">{children}</td>
}

// Strong and emphasis
export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}

export function Em({ children }: { children: ReactNode }) {
  return <em className="italic">{children}</em>
}

// Export all components as an object for MDXRemote
export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
  a: A,
  img: Img,
  hr: Hr,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  strong: Strong,
  em: Em,
}
