# Book Management System - Setup Guide

This guide will walk you through setting up the complete book management system for CENIE Editorial.

## Prerequisites

- Supabase project set up and running
- Cloudinary account (optional, for optimized images)
- Google Books API key (optional, but recommended)

## Step 1: Database Setup

### Run the Database Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file at `apps/editorial/src/lib/books/database.sql`
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **Run** to execute the migration

This will create:

- `books` table with full book metadata
- `book_imports` table for tracking imports
- `book_reviews` table for internal reviews
- All necessary indexes for performance
- Row Level Security (RLS) policies
- Helper functions for search

### Verify Database Setup

Run this query in the SQL Editor to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('books', 'book_imports', 'book_reviews');
```

You should see all three tables listed.

## Step 2: Environment Variables

### Option A: Using Root .env (Recommended)

The shared environment variables are already in the root `.env`:

```bash
# These are already configured in /Users/henry/Workbench/CENIE/platform/.env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_secret_key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Option B: Add App-Specific Variables

Create or update `apps/editorial/.env.local`:

```bash
# Google Books API Key (optional but recommended)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### Getting a Google Books API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Books API**:
   - Search for "Books API" in the API Library
   - Click Enable
4. Create credentials:
   - Go to **Credentials** > **Create Credentials** > **API Key**
   - Copy the generated key
5. (Optional) Restrict the key to Books API only for security

**Note**: The system works without an API key but has rate limits (100 requests/day).

## Step 3: Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
# From the monorepo root
pnpm install

# Or specifically for editorial app
pnpm install --filter=@cenie/editorial
```

## Step 4: Test the System

### Start the Development Server

```bash
pnpm dev --filter=@cenie/editorial
```

The app will run on [http://localhost:3001](http://localhost:3001)

### Access the Book Import Dashboard

Navigate to:

```url
http://localhost:3001/dashboard/books
```

### Test Book Search

1. Enter a search query (e.g., "theater design", "Shakespeare", "dance")
2. Optionally check "Filter by performing arts"
3. Click "Search Books"
4. You should see results from Google Books

### Test Book Import

1. After searching, click "Import" on any book card
2. Check your Supabase dashboard to verify the book was added to the `books` table
3. Check the `book_imports` table to see the import record

## Step 5: API Testing

### Test Search API

```bash
curl -X POST http://localhost:3001/api/books/search \
  -H "Content-Type: application/json" \
  -d '{"query": "performing arts", "maxResults": 5}'
```

### Test ISBN Lookup

```bash
curl http://localhost:3001/api/books/isbn/9780415773119
```

### Test Import API

You'll need to be authenticated for this. Use the app UI or include auth headers.

## Step 6: Cloudinary Setup (Optional)

If you want to optimize cover images with Cloudinary:

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add to root `.env`:

   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Images will automatically be uploaded to Cloudinary on import

## Troubleshooting

### Issue: "Authentication required" error

**Solution**: Make sure you're logged in. The import functionality requires authentication.

### Issue: Google Books rate limit exceeded

**Solution**:

- Add a Google Books API key to increase limits
- Reduce the frequency of searches
- Wait for the rate limit to reset (usually 24 hours)

### Issue: Supabase RLS blocking queries

**Solution**:

- Verify you're authenticated
- Check RLS policies in Supabase dashboard
- The policies allow authenticated users full access

### Issue: Cloudinary upload fails

**Solution**:

- Verify environment variables are set correctly
- Check Cloudinary dashboard for errors
- Images will still import with original URLs if Cloudinary fails

### Issue: Books not appearing after import

**Solution**:

- Check Supabase logs for errors
- Verify the `books` table exists
- Check RLS policies are enabled
- Look for errors in browser console

## Architecture Overview

```text
Book Search Flow:
User → BookSearchForm → useBookSearch hook → /api/books/search
→ Google Books API → Transform data → Return results

Book Import Flow:
User → BookCard → useBookImport hook → /api/books/import
→ Save to Supabase → (Optional) Upload to Cloudinary
→ Return success
```

## Next Steps

### Enhance the System

1. **Add filtering**: Filter by language, publication date, rating
2. **Bulk operations**: Export, update, delete multiple books
3. **Translation tracking**: UI for managing translation status
4. **Reviews system**: Add internal editorial reviews
5. **Search improvements**: Full-text search in Supabase data

### Integration Ideas

1. **Amazon scraping** (if needed): Add as secondary data source
2. **Open Library API**: Supplement Google Books data
3. **Goodreads API**: Add reader reviews
4. **Export to CSV/PDF**: Generate catalogs and reports

## Support

For issues or questions:

1. Check the [main README](README.md) for API documentation
2. Review the database schema in [database.sql](src/lib/books/database.sql)
3. Inspect the code in `src/lib/books/` for implementation details

## Summary

You now have a complete book management system with:

✅ Google Books API integration
✅ Type-safe TypeScript/Zod validation
✅ Supabase database storage
✅ Cloudinary CDN integration
✅ React hooks for easy frontend integration
✅ Admin dashboard UI
✅ Full authentication support
✅ Translation workflow tracking

Happy book importing! 📚
