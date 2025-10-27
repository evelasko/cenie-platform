# MDX Quick Reference - CENIE Editorial

## Creating a New Article

```bash
# Create file
touch src/contents/articles/my-article-slug.mdx
```

```mdx
---
title: 'Article Title'
description: 'Brief description for SEO'
author: 'Author Name'
publishedDate: '2024-03-15'
category: 'Category'
tags: ['tag1', 'tag2']
featured: true
---

# Main Heading

Your content here...
```

**URL**: `/articulos/my-article-slug`

## Creating a News Item

```bash
# Create file
touch src/contents/news/my-news-slug.mdx
```

```mdx
---
title: 'News Title'
description: 'Brief description'
publishedDate: '2024-03-15'
category: 'Category'
tags: ['tag1', 'tag2']
---

# Main Heading

Your content here...
```

**URL**: `/noticias/my-news-slug`

## Common Syntax

### Headings

```mdx
# H1

## H2

### H3
```

### Text Formatting

```mdx
**bold** _italic_ `code`
```

### Links

```mdx
[Internal link](/articulos/slug)
[External link](https://example.com)
```

### Images

```mdx
![Alt text](/path/to/image.jpg)
```

### Lists

```mdx
- Item 1
- Item 2

1. First
2. Second
```

### Code Blocks

````mdx
```javascript
const code = 'here'
```
````

### Blockquotes

```mdx
> Quote text here
```

### Tables

```mdx
| Col 1 | Col 2 |
| ----- | ----- |
| A     | B     |
```

## Utility Functions

```typescript
// Get all articles
import { getAllContent } from '@/lib/mdx'
const articles = await getAllContent('articles')

// Get featured content
import { getFeaturedContent } from '@/lib/mdx'
const featured = await getFeaturedContent('articles', 3)

// Get by category
import { getContentByCategory } from '@/lib/mdx'
const research = await getContentByCategory('articles', 'Research')
```

## Development

```bash
# Start dev server
pnpm dev

# Build
pnpm build

# Check for errors
pnpm type-check
```

## Tips

✅ **DO**:

- Use descriptive slug filenames
- Write good meta descriptions (120-160 chars)
- Use hierarchical headings (h1 → h2 → h3)
- Add alt text to images
- Test on mobile

❌ **DON'T**:

- Skip heading levels
- Use generic slugs like "article-1"
- Forget to add dates
- Use very large images without optimization
