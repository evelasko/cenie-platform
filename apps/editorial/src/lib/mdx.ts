import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { readingTime } from 'reading-time-estimator'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

// Define the base path for content
const CONTENT_PATH = path.join(process.cwd(), 'src/contents')

// Content types
export type ContentType = 'articles' | 'news'

// Frontmatter interfaces
export interface ArticleFrontmatter {
  title: string
  description: string
  author: string
  publishedDate: string
  updatedDate?: string
  category?: string
  tags?: string[]
  featured?: boolean
  coverImage?: string
  coverImageAlt?: string
}

export interface NewsFrontmatter {
  title: string
  description: string
  publishedDate: string
  category?: string
  tags?: string[]
  featured?: boolean
  coverImage?: string
  coverImageAlt?: string
}

export type Frontmatter = ArticleFrontmatter | NewsFrontmatter

// MDX Content interface
export interface MDXContent<T extends Frontmatter = Frontmatter> {
  slug: string
  frontmatter: T
  content: string
  readingTime: string
}

// Compiled MDX interface
export interface CompiledMDX<T extends Frontmatter = Frontmatter> {
  slug: string
  frontmatter: T
  content: React.ReactElement
  readingTime: string
}

/**
 * Get the directory path for a content type
 */
function getContentDirectory(type: ContentType): string {
  return path.join(CONTENT_PATH, type)
}

/**
 * Get all MDX file slugs for a content type
 */
export function getContentSlugs(type: ContentType): string[] {
  const contentDir = getContentDirectory(type)

  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    return []
  }

  const files = fs.readdirSync(contentDir)

  return files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.(mdx|md)$/, ''))
}

/**
 * Get MDX content by slug
 */
export async function getContentBySlug<T extends Frontmatter = Frontmatter>(
  type: ContentType,
  slug: string
): Promise<MDXContent<T> | null> {
  const contentDir = getContentDirectory(type)

  // Try .mdx first, then .md
  let filePath = path.join(contentDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(contentDir, `${slug}.md`)
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  // Calculate reading time
  const readingTimeResult = readingTime(content, { wordsPerMinute: 200 })

  return {
    slug,
    frontmatter: data as T,
    content,
    readingTime: `${readingTimeResult.minutes} min`,
  }
}

/**
 * Get all content for a type
 */
export async function getAllContent<T extends Frontmatter = Frontmatter>(
  type: ContentType
): Promise<MDXContent<T>[]> {
  const slugs = getContentSlugs(type)
  const contents = await Promise.all(slugs.map((slug) => getContentBySlug<T>(type, slug)))

  return contents.filter((content): content is MDXContent<T> => content !== null)
}

/**
 * Compile MDX content for rendering
 */
export async function compileMDXContent<T extends Frontmatter = Frontmatter>(
  source: string,
  frontmatter: T,
  slug: string,
  readingTime: string
): Promise<CompiledMDX<T>> {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false, // We already parsed it
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return {
    slug,
    frontmatter,
    content,
    readingTime,
  }
}

/**
 * Get compiled MDX by slug (ready to render)
 */
export async function getCompiledMDXBySlug<T extends Frontmatter = Frontmatter>(
  type: ContentType,
  slug: string
): Promise<CompiledMDX<T> | null> {
  const mdxContent = await getContentBySlug<T>(type, slug)

  if (!mdxContent) {
    return null
  }

  return compileMDXContent(
    mdxContent.content,
    mdxContent.frontmatter,
    mdxContent.slug,
    mdxContent.readingTime
  )
}

/**
 * Get featured content
 */
export async function getFeaturedContent<T extends Frontmatter = Frontmatter>(
  type: ContentType,
  limit?: number
): Promise<MDXContent<T>[]> {
  const allContent = await getAllContent<T>(type)

  const featured = allContent.filter((content) => content.frontmatter.featured === true)

  // Sort by publishedDate (newest first)
  const sorted = featured.sort((a, b) => {
    const dateA = new Date(a.frontmatter.publishedDate).getTime()
    const dateB = new Date(b.frontmatter.publishedDate).getTime()
    return dateB - dateA
  })

  return limit ? sorted.slice(0, limit) : sorted
}

/**
 * Get content by category
 */
export async function getContentByCategory<T extends Frontmatter = Frontmatter>(
  type: ContentType,
  category: string
): Promise<MDXContent<T>[]> {
  const allContent = await getAllContent<T>(type)

  return allContent.filter(
    (content) => content.frontmatter.category?.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Get content by tag
 */
export async function getContentByTag<T extends Frontmatter = Frontmatter>(
  type: ContentType,
  tag: string
): Promise<MDXContent<T>[]> {
  const allContent = await getAllContent<T>(type)

  return allContent.filter((content) => content.frontmatter.tags?.includes(tag))
}
