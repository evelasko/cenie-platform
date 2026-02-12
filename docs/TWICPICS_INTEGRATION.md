# TwicPics + Firebase Storage Integration Guide

## Architecture Overview

```
Editor uploads image via Dashboard
  → Next.js API route validates & processes
  → Firebase Admin SDK uploads to Firebase Storage
  → Storage path saved to Firestore (e.g. "editorial/covers/slug.jpg")
  → TwicPics CDN proxies from Firebase Storage public URL
  → TwicPics applies transforms (resize, crop, format) and caches
  → Browser receives optimized image
```

### Why This Architecture?

| Concern | Solution |
|---------|----------|
| **Persistent storage** | Firebase Storage (not local filesystem) |
| **Image optimization** | TwicPics CDN (auto format, resize, crop) |
| **No git bloat** | Images never committed to repository |
| **Works on Vercel** | No dependency on writable filesystem |
| **No vendor lock-in** | Images owned in Firebase Storage; TwicPics is just a CDN layer |
| **Cost-effective** | Firebase free tier (5GB storage); TwicPics for transforms only |

### Why TwicPics Over Cloudinary?

- **More cost-effective** for growing catalogs
- **Simpler API** - Path-based transformations (no complex SDKs)
- **Better performance** - Automatic format selection (WebP, AVIF)
- **Real-time transformations** - No upload presets needed
- **Clean DX** - Intuitive URL-based API

## Setup

### 1. Firebase Storage (Already Configured)

Firebase Storage is configured in the CENIE project (`cenie-platform`).

**Storage rules** (`services/cloud-functions/storage.rules`):
- `editorial/**` paths are publicly readable (so TwicPics can fetch originals)
- Writes are handled server-side via Admin SDK (bypasses rules)

**Deploy rules:**
```bash
cd services/cloud-functions
firebase deploy --only storage
```

### 2. TwicPics Configuration

**TwicPics Dashboard:**
1. Go to https://www.twicpics.com
2. Domain: `cenie.twic.pics`
3. **Source**: Configure to fetch from Firebase Storage:
   ```
   Origin URL: https://storage.googleapis.com/YOUR_BUCKET_NAME/
   Path prefix: (leave empty or match your domain path)
   ```
4. This tells TwicPics: when a request comes in for `editorial/covers/slug.jpg`,
   fetch the original from `https://storage.googleapis.com/BUCKET/editorial/covers/slug.jpg`

### 3. Environment Variables

Already configured in `.env`:

```bash
# TwicPics CDN
TWICPICS_DOMAIN=cenie.twic.pics
NEXT_PUBLIC_TWICPICS_DOMAIN=cenie.twic.pics
TWICPICS_API_KEY=your-twicpics-api-key  # Only needed for TwicPics API (optional)

# Firebase Storage (per-app .env.local)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
```

### 4. Database Pattern

**Store the storage path** in the database (not a full URL):
```typescript
// Database stores
cover_twicpics_path: "editorial/covers/stanislavski-acting.jpg"

// This path is both:
// 1. The Firebase Storage path
// 2. The TwicPics path (TwicPics maps it to Storage URL automatically)
```

## Usage

### Book Covers

**Database field:** `catalog_volumes.cover_twicpics_path`

**Display sizes (via TwicPics):**
```typescript
import { getBookCoverUrl } from '@/lib/twicpics'

// Thumbnail (200x300, grid view)
const thumbnail = getBookCoverUrl("editorial/covers/book.jpg", "thumbnail")

// Medium (400x600, detail page)
const medium = getBookCoverUrl("editorial/covers/book.jpg", "medium")

// Large (800x1200, full view)
const large = getBookCoverUrl("editorial/covers/book.jpg", "large")
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

```typescript
import { getContributorPhotoUrl } from '@/lib/twicpics'

// Circular avatar (200x200, face detection)
const avatar = getContributorPhotoUrl("editorial/contributors/elena-torres.jpg", 200)

// Profile photo (400x400)
const profile = getContributorPhotoUrl("editorial/contributors/elena-torres.jpg", 400)
```

## Upload Workflow

Uploads go through Next.js API routes that use the Firebase Admin SDK.

### Cover Upload

```
POST /api/upload/cover
Content-Type: multipart/form-data
Body: { file: File, slug: string }
Requires: editor role

→ Validates file (type, size, slug format)
→ Uploads to Firebase Storage: editorial/covers/{slug}.{ext}
→ Returns: { twicpics_path, display_url, filename, overwritten }
```

### Photo Upload

```
POST /api/upload/photo
Content-Type: multipart/form-data
Body: { file: File }
Requires: editor role

→ Validates file (type, size)
→ Uploads to Firebase Storage: editorial/contributors/{timestamp}-{name}.{ext}
→ Returns: { twicpics_path, display_url }
```

### Browse Existing Covers

```
GET /api/files/covers?search=keyword
Requires: editorial access

→ Lists files from Firebase Storage under editorial/covers/
→ Returns: { files: [...], total_count }
```

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

| Type | Crop | Example |
|------|------|---------|
| Portrait (standard) | `2:3` | Most book covers |
| Square | `1:1` | Contributor photos |
| Landscape (rare) | `3:2` | Wide format books |

### Example TwicPics URLs

**Book cover thumbnail:**
```
https://cenie.twic.pics/editorial/covers/stanislavski.jpg?twic=v1/cover=200x300
```

**Contributor photo (circular):**
```
https://cenie.twic.pics/editorial/contributors/elena-torres.jpg?twic=v1/cover=200x200/focus=faces
```

**High-res cover for detail page:**
```
https://cenie.twic.pics/editorial/covers/stanislavski.jpg?twic=v1/cover=800x1200/quality=90
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/twicpics.ts` | TwicPics URL generation helpers |
| `src/lib/firebase-storage.ts` | Firebase Storage upload/list/delete helpers |
| `src/app/api/upload/cover/route.ts` | Cover upload API route |
| `src/app/api/upload/photo/route.ts` | Contributor photo upload API route |
| `src/app/api/files/covers/route.ts` | Cover file browser API route |
| `src/components/dashboard/CoverManager.tsx` | Cover upload & browse UI component |
| `src/components/dashboard/ImageUpload.tsx` | Simple image upload UI component |

## Best Practices

### 1. Store Paths, Not URLs

```typescript
// Good - path can be used with both Firebase Storage and TwicPics
cover_twicpics_path: "editorial/covers/stanislavski-123456.jpg"

// Bad - locked to a specific CDN configuration
cover_url: "https://cenie.twic.pics/editorial/covers/stanislavski.jpg?twic=v1/cover=400x600"
```

### 2. Generate URLs Dynamically

Using `getBookCoverUrl()` and `getContributorPhotoUrl()` allows changing transformation
parameters without updating the database.

### 3. Consistent Naming

```
editorial/covers/{slug}.{ext}           → Book covers
editorial/contributors/{timestamp}-{name}.{ext} → Contributor photos
```

### 4. Use Responsive Images

```tsx
<Image
  src={coverPath}
  loader={({ src, width, quality }) =>
    `https://${domain}/${src}?twic=v1/cover=${width}/quality=${quality || 75}`
  }
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## Troubleshooting

### Image Not Loading via TwicPics
- Verify the file exists in Firebase Storage (`editorial/covers/filename.jpg`)
- Check TwicPics source is configured to point to your Firebase Storage bucket
- Verify storage rules allow public reads on `editorial/**`

### Image Not Loading Directly
- Check `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set correctly
- Verify storage rules are deployed: `firebase deploy --only storage`
- Test direct URL: `https://storage.googleapis.com/BUCKET/editorial/covers/filename.jpg`

### Upload Failing
- Ensure `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` are set
- Check the service account has `Storage Admin` or `Storage Object Creator` role
- Verify file type (JPG, PNG, WebP) and size (<5MB)

### Poor Quality
- Increase quality parameter: `quality=90`
- Use larger source images (minimum 800px width for covers)

### Slow First Load
- TwicPics caches transformed images after first request
- First load fetches from Firebase Storage and transforms -- subsequent loads are instant
- Consider preloading critical images

## Migration from Local Filesystem

If you previously had images in `public/images/`:

1. Upload existing images to Firebase Storage (see migration script below)
2. The storage paths match the old TwicPics paths, so no database changes needed
3. Remove tracked images from git:
   ```bash
   git rm --cached apps/editorial/public/images/covers/*
   git rm --cached apps/editorial/public/images/contributors/*
   ```

---

**Last Updated:** February 12, 2026
**Status:** Firebase Storage integration complete
