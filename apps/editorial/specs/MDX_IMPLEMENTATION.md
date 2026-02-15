# MDX Implementation Summary - CENIE Editorial

## Overview

This document provides a technical overview of the MDX implementation for the CENIE Editorial application. The system enables content creators to write articles and news using MDX (Markdown + JSX), which are then automatically rendered with proper styling and SEO optimization.

## Architecture

### Directory Structure

```tree
apps/editorial/
├── src/
│   ├── app/
│   │   ├── articulos/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx         # Dynamic route for articles
│   │   │       └── not-found.tsx    # Custom 404 page
│   │   └── noticias/
│   │       └── [slug]/
│   │           ├── page.tsx         # Dynamic route for news
│   │           └── not-found.tsx    # Custom 404 page
│   ├── components/
│   │   └── content/
│   │       ├── ContentLayout.tsx    # Layout wrapper for content
│   │       ├── MDXComponents.tsx    # Custom MDX components
│   │       ├── Prose.tsx            # Prose wrapper with MDX provider
│   │       └── index.ts             # Barrel export
│   ├── contents/
│   │   ├── articles/                # Article MDX files
│   │   │   ├── ejemplo-articulo-academico.mdx
│   │   │   └── metodologia-investigacion-moderna.mdx
│   │   └── news/                    # News MDX files
│   │       ├── nueva-plataforma-lanzamiento.mdx
│   │       └── conferencia-anual-2024.mdx
│   └── lib/
│       └── mdx.ts                   # Core MDX utilities
├── MDX_GUIDE.md                     # User-facing documentation
└── MDX_IMPLEMENTATION.md            # This file
```

## Core Components

### 1. MDX Utility Library (`src/lib/mdx.ts`)

**Purpose**: Provides server-side functions for loading, parsing, and compiling MDX content.

**Key Functions**:

- `getContentSlugs(type)`: Returns all available slugs for a content type
- `getContentBySlug(type, slug)`: Loads and parses a single MDX file
- `getAllContent(type)`: Loads all content for a type
- `getCompiledMDXBySlug(type, slug)`: Returns compiled, ready-to-render MDX
- `getFeaturedContent(type, limit)`: Returns featured content
- `getContentByCategory(type, category)`: Filter by category
- `getContentByTag(type, tag)`: Filter by tag

**Features**:

- Gray-matter for frontmatter parsing
- Reading time calculation (200 WPM, Spanish)
- Type-safe with TypeScript interfaces
- Support for both `.md` and `.mdx` files
- Automatic compilation with `next-mdx-remote`

### 2. MDX Components (`src/components/content/MDXComponents.tsx`)

**Purpose**: Custom React components for rendering MDX elements with proper styling.

**Components**:

- Headings (H1-H6): With scroll margin for anchor links
- Paragraphs (P): Using type scale system
- Lists (UL, OL, LI): Styled with proper spacing
- Links (A): Internal/external link handling
- Images (Img): Responsive with Next.js Image
- Code (Code, Pre): Syntax-aware code blocks
- Tables (Table, Thead, Tbody, Tr, Th, Td): Responsive tables
- Blockquotes (Blockquote): Styled quotes
- Text formatting (Strong, Em): Bold and italic

**Design Decisions**:

- All components use the existing typography system from `globals.css`
- Headings use `scroll-mt-24` for smooth anchor navigation
- External links automatically open in new tabs
- Images are optimized with Next.js Image component
- Code blocks have dark theme styling

### 3. Content Layout (`src/components/content/ContentLayout.tsx`)

**Purpose**: Consistent layout wrapper for all article and news pages.

**Features**:

- Header with title, description, and metadata
- Category badge display
- Author information (for articles)
- Published date formatting (Spanish locale)
- Reading time display
- Tag display
- Optional cover image
- Update date in footer
- Responsive design with max-width constraints

### 4. Prose Component (`src/components/content/Prose.tsx`)

**Purpose**: Wrapper that provides MDX context and prose styling.

**Features**:

- MDXProvider integration
- Custom component mapping
- Prose content styling from globals.css
- Max-width container for readability

### 5. Dynamic Routes

#### Articles Route (`src/app/articulos/[slug]/page.tsx`)

**Features**:

- Static generation with `generateStaticParams`
- Dynamic metadata generation for SEO
- Open Graph and Twitter Card support
- Article-specific frontmatter handling
- 404 handling with `notFound()`

#### News Route (`src/app/noticias/[slug]/page.tsx`)

**Features**:

- Similar to articles but with news-specific frontmatter
- No author field
- Different metadata structure

## TypeScript Types

### Frontmatter Interfaces

```typescript
interface ArticleFrontmatter {
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

interface NewsFrontmatter {
  title: string
  description: string
  publishedDate: string
  category?: string
  tags?: string[]
  featured?: boolean
  coverImage?: string
  coverImageAlt?: string
}
```

### Content Interfaces

```typescript
interface MDXContent<T extends Frontmatter = Frontmatter> {
  slug: string
  frontmatter: T
  content: string
  readingTime: string
}

interface CompiledMDX<T extends Frontmatter = Frontmatter> {
  slug: string
  frontmatter: T
  content: React.ReactElement
  readingTime: string
}
```

## Dependencies

### Production Dependencies

- `@mdx-js/loader`: MDX webpack loader
- `@mdx-js/react`: MDX React integration
- `@next/mdx`: Next.js MDX plugin
- `next-mdx-remote`: Remote MDX compilation for RSC
- `gray-matter`: Frontmatter parsing
- `remark-gfm`: GitHub Flavored Markdown support
- `reading-time-estimator`: Reading time calculation

### Dev Dependencies

- `@types/mdx`: TypeScript types for MDX

## Configuration

### Next.js Config (`next.config.js`)

```javascript
{
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false, // Use JS-based compiler
  },
}
```

## Styling System

### CSS Classes Used

All styling leverages the existing design system in `globals.css`:

- **Typography**: Uses CSS custom properties for the type scale
  - Display: `type-display-1`, `type-display-2`
  - Headings: `type-heading-1` through `type-heading-6`
  - Body: `type-body-large`, `type-body-base`, `type-body-small`
  - UI: `type-lead`, `type-caption`, `type-button`, `type-label`

- **Prose Content**: `.prose-content` class applies comprehensive styling to:
  - All heading levels with proper spacing
  - Paragraphs with optimal line height
  - Lists with proper indentation
  - Links with underlines and hover states
  - Code blocks with syntax highlighting
  - Blockquotes with left border
  - Tables with borders

### Color System

Uses CSS custom properties for theming:

- `--color-primary`: Brand color
- `--color-foreground`: Main text color
- `--color-muted-foreground`: Secondary text
- `--color-background`: Background color
- `--color-border`: Border color

## Performance Optimizations

### Static Generation

All MDX pages are statically generated at build time:

1. `generateStaticParams` creates routes for all MDX files
2. Content is compiled during build
3. Resulting HTML is cached and served instantly
4. No runtime compilation

### Image Optimization

- Next.js Image component automatically optimizes images
- Lazy loading for better performance
- Responsive images with proper sizing

### Bundle Size

- MDX components are tree-shakeable
- Only used components are included in the bundle
- Server components minimize client JavaScript

## SEO Features

### Metadata Generation

Each page automatically generates:

- Page title from frontmatter
- Meta description
- Open Graph tags (title, description, type, dates, images)
- Twitter Card tags
- Author information
- Published and modified dates

### URL Structure

- Clean, semantic URLs: `/articulos/slug` and `/noticias/slug`
- Slug derived from filename (kebab-case recommended)

## Error Handling

### Not Found Pages

Custom 404 pages for both articles and news:

- User-friendly error message
- Links back to content listings
- Link to homepage
- Maintains site navigation

### Validation

- Gray-matter handles malformed frontmatter gracefully
- TypeScript ensures type safety
- Null checks prevent runtime errors

## Content Workflow

### Creating New Content

1. Create MDX file in appropriate directory
2. Add required frontmatter
3. Write content using Markdown
4. File is automatically detected
5. Static route generated at build time
6. Content accessible at `/articulos/[filename]` or `/noticias/[filename]`

### Updating Content

1. Edit MDX file
2. Update `updatedDate` in frontmatter
3. Changes reflected on next build

### Deleting Content

1. Delete MDX file
2. Route removed on next build
3. Requests return 404

## Testing

### Sample Content

Four sample MDX files provided:

**Articles**:

1. `ejemplo-articulo-academico.mdx`: Complete article with all features
2. `metodologia-investigacion-moderna.mdx`: Simpler article

**News**:

1. `nueva-plataforma-lanzamiento.mdx`: Feature announcement
2. `conferencia-anual-2024.mdx`: Event announcement

### Testing Checklist

- [ ] Articles render correctly at `/articulos/[slug]`
- [ ] News renders correctly at `/noticias/[slug]`
- [ ] All MDX components display properly
- [ ] Images load and are responsive
- [ ] Code blocks have syntax highlighting
- [ ] Links work (internal and external)
- [ ] Metadata appears in page source
- [ ] 404 pages show for invalid slugs
- [ ] Reading time is calculated
- [ ] Tags and categories display
- [ ] Featured content flag works

## Future Enhancements

### Potential Improvements

1. **Search**: Full-text search across all content
2. **Categories Page**: Browse by category
3. **Tags Page**: Browse by tag
4. **Related Content**: Show related articles/news
5. **Table of Contents**: Auto-generated TOC from headings
6. **Copy to Clipboard**: For code blocks
7. **Syntax Highlighting**: Enhanced with a library like Prism
8. **RSS Feed**: Auto-generated from MDX content
9. **Share Buttons**: Social media sharing
10. **Comments**: Comment system integration

### Content Management

Consider adding:

- CMS integration (e.g., Sanity, Contentful)
- Draft/preview system
- Content versioning
- Multi-author support
- Editorial workflow

## Maintenance

### Regular Tasks

1. **Content Audits**: Review and update old content
2. **Link Checking**: Verify external links still work
3. **Image Optimization**: Compress and optimize images
4. **Dependency Updates**: Keep MDX packages up to date
5. **Performance Monitoring**: Check page load times

### Troubleshooting

Common issues and solutions:

1. **404 on new content**: Rebuild the application
2. **Styling issues**: Check prose-content class is applied
3. **Build errors**: Validate frontmatter YAML syntax
4. **Type errors**: Ensure frontmatter matches interface

## Conclusion

This MDX implementation provides a robust, performant, and user-friendly system for managing long-form content in the CENIE Editorial application. It leverages Next.js's static generation, provides excellent SEO, and maintains a consistent design system.

For end-user documentation, refer to `MDX_GUIDE.md`.
