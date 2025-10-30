# TwicPics Integration Guide

## Why TwicPics?

TwicPics was chosen over Cloudinary for several advantages:

✅ **More cost-effective** - Better pricing for growing catalogs  
✅ **Simpler API** - Path-based transformations (no complex SDKs)  
✅ **Better performance** - Automatic format selection (WebP, AVIF)  
✅ **Native responsive** - Built-in srcset generation  
✅ **Real-time transformations** - No upload presets needed  
✅ **Excellent DX** - Clean, intuitive API

## Setup

### 1. Create TwicPics Account

1. Go to https://www.twicpics.com
2. Sign up for free account
3. Create a domain (e.g., `cenie.twic.pics`)
4. Configure source (upload or external URL)

### 2. Environment Variables

Add to your `.env`:

```bash
TWICPICS_DOMAIN=cenie.twic.pics
NEXT_PUBLIC_TWICPICS_DOMAIN=cenie.twic.pics
```

### 3. Database Pattern

**Storage:**
- Store the **path** in database (not full URL)
- Generate URLs dynamically with transformations

**Example:**
```typescript
// Database stores
cover_twicpics_path: "covers/stanislavski-acting.jpg"

// Generate URL in code
const coverUrl = `https://${process.env.NEXT_PUBLIC_TWICPICS_DOMAIN}/cover?url=${cover_twicpics_path}&width=400&height=600`
```

## Usage

### Book Covers

**Database field:** `catalog_volumes.cover_twicpics_path`

**Display sizes:**
```typescript
// Thumbnail (grid view)
const thumbnailUrl = `https://${domain}/cover?url=${path}&width=200&height=300`

// Medium (detail page)
const mediumUrl = `https://${domain}/cover?url=${path}&width=400&height=600`

// Large (full view)
const largeUrl = `https://${domain}/cover?url=${path}&width=800&height=1200`
```

**Next.js Image Component:**
```tsx
import Image from 'next/image'

<Image
  src={`https://${process.env.NEXT_PUBLIC_TWICPICS_DOMAIN}/cover?url=${coverPath}`}
  alt={book.title}
  width={400}
  height={600}
  loader={({ src, width, quality }) => {
    return `${src}&width=${width}&quality=${quality || 75}`
  }}
/>
```

### Contributor Photos

**Database field:** `contributors.photo_twicpics_path`

**Circular avatar:**
```typescript
const avatarUrl = `https://${domain}/cover?url=${path}&width=200&height=200&crop=1:1&focus=faces`
```

**Profile photo:**
```typescript
const profileUrl = `https://${domain}/cover?url=${path}&width=400&height=400&crop=1:1`
```

## Upload Workflow

### Option 1: Direct Upload to TwicPics

```typescript
async function uploadToTwicPics(file: File, path: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)
  
  const response = await fetch(`https://api.twicpics.com/v1/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TWICPICS_API_KEY}`
    },
    body: formData
  })
  
  const data = await response.json()
  return data.path // Store this in database
}
```

### Option 2: Upload to Your Storage + TwicPics as Proxy

1. Upload image to your own storage (S3, Supabase Storage, etc.)
2. Configure TwicPics to use your storage as source
3. TwicPics will fetch and transform on-demand
4. Store the path in database

**Recommended:** Option 2 (more flexible, no vendor lock-in)

## Transformations

### Common Parameters

- `width=400` - Resize width
- `height=600` - Resize height
- `crop=16:9` - Crop to aspect ratio
- `focus=auto` - Smart cropping
- `focus=faces` - Focus on faces
- `quality=85` - JPEG quality (1-100)
- `output=webp` - Force format (auto by default)

### Aspect Ratios for Books

**Portrait books (most common):**
```
crop=2:3  // Standard book cover ratio
```

**Square covers:**
```
crop=1:1
```

**Landscape (rare):**
```
crop=3:2
```

### Example URLs

**Book cover thumbnail:**
```
https://cenie.twic.pics/cover?url=covers/stanislavski.jpg&width=200&height=300&crop=2:3
```

**Contributor photo (circular):**
```
https://cenie.twic.pics/cover?url=contributors/elena-torres.jpg&width=200&height=200&crop=1:1&focus=faces
```

**High-res cover for detail page:**
```
https://cenie.twic.pics/cover?url=covers/stanislavski.jpg&width=800&height=1200&quality=90
```

## React Component Example

```tsx
import { FC } from 'react'
import Image from 'next/image'

interface BookCoverProps {
  coverPath: string
  title: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { width: 200, height: 300 },
  md: { width: 400, height: 600 },
  lg: { width: 800, height: 1200 }
}

export const BookCover: FC<BookCoverProps> = ({ 
  coverPath, 
  title, 
  size = 'md' 
}) => {
  const { width, height } = sizeMap[size]
  const domain = process.env.NEXT_PUBLIC_TWICPICS_DOMAIN
  
  // Build TwicPics URL
  const src = `https://${domain}/cover?url=${coverPath}&width=${width}&height=${height}&crop=2:3`
  
  return (
    <Image
      src={src}
      alt={title}
      width={width}
      height={height}
      className="object-cover"
    />
  )
}
```

## Upload Component Example

```tsx
'use client'

import { useState } from 'react'

export function CoverUpload({ onUpload }: { onUpload: (path: string) => void }) {
  const [uploading, setUploading] = useState(false)
  
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    
    try {
      // Upload to your storage
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/cover', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      // data.path will be stored in database
      // TwicPics will fetch from your storage
      onUpload(data.path)
      
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  )
}
```

## API Route Example

```typescript
// app/api/upload/cover/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  
  // Generate unique filename
  const timestamp = Date.now()
  const sanitized = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase()
  const filename = `${timestamp}-${sanitized}`
  const path = `covers/${filename}`
  
  // Upload to your storage (example: Supabase Storage)
  // TwicPics will be configured to use your storage as source
  const bytes = await file.arrayBytes()
  const buffer = Buffer.from(bytes)
  
  // Upload to your storage...
  // await uploadToSupabaseStorage(path, buffer)
  
  // Return path to store in database
  return NextResponse.json({ path })
}
```

## Best Practices

### 1. Consistent Naming
```
covers/{slug}-{timestamp}.jpg
contributors/{slug}-{timestamp}.jpg
```

### 2. Store Paths, Not URLs
✅ Good:
```typescript
cover_twicpics_path: "covers/stanislavski-123456.jpg"
```

❌ Bad:
```typescript
cover_url: "https://cenie.twic.pics/cover?url=covers/stanislavski.jpg&width=400"
```

### 3. Generate URLs Dynamically
This allows you to change transformation parameters without updating database.

### 4. Use Next.js Image Loader
Leverage Next.js optimization with TwicPics transformations:

```tsx
<Image
  src={coverPath}
  loader={({ src, width, quality }) => 
    `https://${domain}/cover?url=${src}&width=${width}&quality=${quality || 75}`
  }
  // ...
/>
```

### 5. Responsive Images
Use srcset for different screen sizes:

```tsx
<Image
  src={coverPath}
  srcSet={`
    ${buildUrl(coverPath, 200)} 200w,
    ${buildUrl(coverPath, 400)} 400w,
    ${buildUrl(coverPath, 800)} 800w
  `}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // ...
/>
```

## Troubleshooting

### Image Not Loading
- Check path is correct in database
- Verify TwicPics domain is configured
- Ensure source (your storage) is accessible to TwicPics

### Poor Quality
- Increase quality parameter: `&quality=90`
- Use larger source images (minimum 800px width for covers)

### Slow Loading
- TwicPics caches transformed images after first request
- First load may be slower, subsequent loads are fast
- Consider preloading critical images

## Migration from Cloudinary

If you were using Cloudinary before:

**Database:**
```sql
-- Rename columns
ALTER TABLE contributors RENAME COLUMN photo_cloudinary_id TO photo_twicpics_path;
ALTER TABLE catalog_volumes RENAME COLUMN cover_cloudinary_id TO cover_twicpics_path;
ALTER TABLE books RENAME COLUMN temp_cover_cloudinary_id TO temp_cover_twicpics_path;
```

**Code:**
- Replace Cloudinary SDK calls with simple fetch or path construction
- Update environment variables
- Regenerate image URLs with TwicPics domain

## Resources

- [TwicPics Documentation](https://www.twicpics.com/docs)
- [TwicPics API Reference](https://www.twicpics.com/docs/api)
- [TwicPics Pricing](https://www.twicpics.com/pricing)

---

**Last Updated:** January 30, 2025  
**Status:** Ready for Phase 2 Implementation

