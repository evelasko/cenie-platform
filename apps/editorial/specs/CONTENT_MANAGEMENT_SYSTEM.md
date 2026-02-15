# Content Implementation - CENIE Editorial

## Overview

This document describes the content management system for the CENIE Editorial application.

## MDX Content System

The application uses MDX (Markdown + JSX) for managing long-form content including articles and news.

### Documentation

- **[MDX_GUIDE.md](./MDX_GUIDE.md)**: User-facing guide for creating and managing MDX content
- **[MDX_IMPLEMENTATION.md](./MDX_IMPLEMENTATION.md)**: Technical implementation details
- **[MDX_QUICK_REFERENCE.md](./MDX_QUICK_REFERENCE.md)**: Quick reference for common tasks

### Content Types

1. **Articles** (`/articulos/[slug]`)
   - Academic articles and long-form content
   - Requires author information
   - Supports categories, tags, and featured status
   - Located in: `src/contents/articles/`

2. **News** (`/noticias/[slug]`)
   - News announcements and updates
   - No author field required
   - Supports categories, tags, and featured status
   - Located in: `src/contents/news/`

### Key Features

- ✅ Markdown-based content creation
- ✅ Frontmatter for metadata
- ✅ Automatic reading time calculation
- ✅ SEO optimization (Open Graph, Twitter Cards)
- ✅ Static generation for performance
- ✅ Responsive images with Next.js Image
- ✅ Syntax highlighting for code blocks
- ✅ GitHub Flavored Markdown support
- ✅ Custom styled components
- ✅ Typography system integration
- ✅ Featured content filtering
- ✅ Category and tag filtering

### File Structure

```tree
src/
├── app/
│   ├── articulos/[slug]/     # Article pages
│   └── noticias/[slug]/      # News pages
├── components/
│   └── content/              # MDX components and layouts
├── contents/
│   ├── articles/             # Article MDX files
│   └── news/                 # News MDX files
└── lib/
    └── mdx.ts                # MDX utilities
```

### Getting Started

1. **Create a new article**:

   ```bash
   touch src/contents/articles/your-article-slug.mdx
   ```

2. **Add frontmatter**:

   ```yaml
   ---
   title: 'Your Article Title'
   description: 'Brief description'
   author: 'Author Name'
   publishedDate: '2024-03-15'
   ---
   ```

3. **Write content using Markdown**

4. **Access at**: `/articulos/your-article-slug`

### Sample Content

Sample MDX files are provided in:

- `src/contents/articles/`
- `src/contents/news/`

Refer to these for examples of proper structure and formatting.

## Static Pages

Static pages (About, Contact, etc.) use a different system:

- Located in: `src/contents/pages/`
- Rendered through page components in `src/app/`

## Future Enhancements

Potential improvements to the content system:

- [ ] Full-text search
- [ ] Content tagging system UI
- [ ] Related content suggestions
- [ ] Table of contents auto-generation
- [ ] RSS feed
- [ ] CMS integration
- [ ] Draft preview system
- [ ] Multi-language support
- [ ] Comment system
- [ ] Social sharing buttons

## Maintenance

### Regular Tasks

1. Review and update content regularly
2. Check for broken links
3. Optimize images before uploading
4. Monitor page performance
5. Keep dependencies up to date

### Support

For questions or issues with the MDX system, refer to:

- [MDX_GUIDE.md](./MDX_GUIDE.md) for usage questions
- [MDX_IMPLEMENTATION.md](./MDX_IMPLEMENTATION.md) for technical details
