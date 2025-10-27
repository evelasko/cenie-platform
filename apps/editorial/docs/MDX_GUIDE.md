# MDX Implementation Guide - CENIE Editorial

This guide explains how to use the MDX system in the CENIE Editorial application.

## Overview

The MDX system allows you to create rich, interactive content for articles and news using Markdown with embedded React components. MDX files are located in:

- **Articles**: `src/contents/articles/`
- **News**: `src/contents/news/`

## File Structure

### Article MDX Files

Articles require the following frontmatter:

```mdx
---
title: 'Article Title'
description: 'A brief description for SEO and previews'
author: 'Author Name'
publishedDate: 'YYYY-MM-DD'
updatedDate: 'YYYY-MM-DD' # Optional
category: 'Category Name' # Optional
tags: ['tag1', 'tag2'] # Optional
featured: true # Optional (boolean)
coverImage: '/path/to/image.jpg' # Optional
coverImageAlt: 'Image description' # Optional
---
```

### News MDX Files

News items require slightly different frontmatter (no author field):

```mdx
---
title: 'News Title'
description: 'A brief description'
publishedDate: 'YYYY-MM-DD'
category: 'Category Name' # Optional
tags: ['tag1', 'tag2'] # Optional
featured: true # Optional
coverImage: '/path/to/image.jpg' # Optional
coverImageAlt: 'Image description' # Optional
---
```

## Creating Content

### 1. Create a New MDX File

Create a new `.mdx` file in the appropriate directory:

- Articles: `src/contents/articles/your-slug.mdx`
- News: `src/contents/news/your-slug.mdx`

The filename (without extension) becomes the URL slug:

- `ejemplo-articulo.mdx` → `/articulos/ejemplo-articulo`
- `nueva-noticia.mdx` → `/noticias/nueva-noticia`

### 2. Add Frontmatter

Start your file with YAML frontmatter containing metadata:

```mdx
---
title: 'My Article Title'
description: 'This appears in search results and social media'
author: 'Dr. Jane Smith'
publishedDate: '2024-03-15'
category: 'Research'
tags: ['academic', 'publishing']
featured: true
---
```

### 3. Write Your Content

After the frontmatter, write your content using Markdown:

```mdx
# Main Heading

This is a paragraph with **bold text** and _italic text_.

## Subheading

- List item 1
- List item 2
- List item 3

### Another Subheading

1. Numbered item
2. Another item

> This is a blockquote

[Link to another page](/articulos/another-article)
```

## Supported Markdown Features

### Headings

Use `#` for headings (h1 through h6). All headings automatically get anchor links for easy navigation.

```mdx
# H1 Heading

## H2 Heading

### H3 Heading

#### H4 Heading

##### H5 Heading

###### H6 Heading
```

### Text Formatting

```mdx
**Bold text**
_Italic text_
**_Bold and italic_**
`Inline code`
```

### Lists

Unordered lists:

```mdx
- Item 1
- Item 2
  - Nested item
```

Ordered lists:

```mdx
1. First item
2. Second item
3. Third item
```

### Links

Internal links:

```mdx
[Link to another article](/articulos/slug)
```

External links (automatically open in new tab):

```mdx
[External link](https://example.com)
```

### Images

```mdx
![Alt text](/path/to/image.jpg)
```

Images are automatically responsive and optimized.

### Code Blocks

Inline code:

```mdx
Use the `useState` hook for state management.
```

Code blocks with syntax highlighting:

````mdx
```python
def hello_world():
    print("Hello, World!")
```
````

````mdx
```javascript
const greeting = 'Hello, World!'
console.log(greeting)
```
````

### Blockquotes

```mdx
> This is a blockquote.
> It can span multiple lines.
```

### Tables

```mdx
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Horizontal Rules

```mdx
---
```

## Styling

The MDX content is automatically styled using the global CSS classes defined in `globals.css`. The `.prose-content` class applies professional typography and spacing to all elements.

## Reading Time

Reading time is automatically calculated and displayed based on the content length (assuming 200 words per minute in Spanish).

## SEO and Metadata

All MDX pages automatically generate:

- Page title and description
- Open Graph tags for social media
- Twitter Card tags
- Canonical URLs
- JSON-LD structured data

## URLs and Routing

- Articles are accessed at: `/articulos/[slug]`
- News are accessed at: `/noticias/[slug]`

The slug is derived from the filename (without the `.mdx` extension).

## Static Generation

All MDX pages are statically generated at build time using Next.js's `generateStaticParams`. This ensures:

- Fast page loads
- Better SEO
- Reduced server load

## Utility Functions

The following functions are available in `src/lib/mdx.ts`:

### Get All Content Slugs

```typescript
import { getContentSlugs } from '@/lib/mdx'

const slugs = getContentSlugs('articles') // or 'news'
```

### Get Content by Slug

```typescript
import { getContentBySlug } from '@/lib/mdx'

const article = await getContentBySlug('articles', 'my-article-slug')
```

### Get All Content

```typescript
import { getAllContent } from '@/lib/mdx'

const allArticles = await getAllContent('articles')
```

### Get Featured Content

```typescript
import { getFeaturedContent } from '@/lib/mdx'

const featured = await getFeaturedContent('articles', 3) // Get 3 featured
```

### Get Content by Category

```typescript
import { getContentByCategory } from '@/lib/mdx'

const research = await getContentByCategory('articles', 'Research')
```

### Get Content by Tag

```typescript
import { getContentByTag } from '@/lib/mdx'

const tagged = await getContentByTag('articles', 'publishing')
```

## Best Practices

1. **Use Descriptive Slugs**: Make filenames clear and SEO-friendly
   - ✅ `metodologia-investigacion-moderna.mdx`
   - ❌ `article1.mdx`

2. **Write Good Descriptions**: Descriptions should be 120-160 characters for optimal SEO

3. **Use Headings Hierarchically**: Don't skip heading levels (h1 → h2 → h3)

4. **Add Alt Text to Images**: Always provide meaningful alt text for accessibility

5. **Tag Consistently**: Use a consistent set of tags across your content

6. **Set Featured Content Carefully**: Only mark truly important content as featured

7. **Update Dates**: Include `updatedDate` when making significant changes

## Examples

See the sample files in:

- `src/contents/articles/ejemplo-articulo-academico.mdx`
- `src/contents/articles/metodologia-investigacion-moderna.mdx`
- `src/contents/news/nueva-plataforma-lanzamiento.mdx`
- `src/contents/news/conferencia-anual-2024.mdx`

## Troubleshooting

### Page Not Found

If you create a new MDX file and get a 404 error:

1. Ensure the file is in the correct directory
2. Check that the frontmatter is valid YAML
3. Restart the development server

### Styling Issues

If content doesn't look right:

1. Check that the `.prose-content` class is applied
2. Verify your MDX components are properly imported
3. Check for conflicting CSS

### Build Errors

If you get build errors:

1. Validate your frontmatter YAML syntax
2. Ensure all required frontmatter fields are present
3. Check for invalid Markdown syntax

## TypeScript Support

Full TypeScript support is included with proper types for:

- Frontmatter interfaces
- MDX content
- Compiled MDX

Import types as needed:

```typescript
import type { ArticleFrontmatter, NewsFrontmatter, MDXContent } from '@/lib/mdx'
```
