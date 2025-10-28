# CENIE Editorial - Book Management System

## Overview

This system enables CENIE Editorial to search, curate, and manage performing arts books for translation from English to Spanish using the Google Books API.

## Architecture

### Data Strategy: Hybrid Reference Model

- **Minimal Database Storage**: Only essential metadata stored in Supabase
- **On-Demand Fetching**: Full book details fetched from Google Books API as needed
- **Smart Caching**: Client-side caching for performance optimization
- **Scalable Design**: Handles hundreds to thousands of books efficiently

### Key Components

1. **Database (Supabase)**
   - `books` - Core book registry with editorial metadata
   - `book_tags` - Categorization system
   - `book_reviews` - Internal editorial assessments

2. **Google Books API Integration**
   - Server-side wrapper at [src/lib/google-books.ts](src/lib/google-books.ts)
   - Search, retrieve, and enrich book data
   - Rate-limited (1000 requests/day free tier)

3. **Dashboard Interface**
   - Search books from Google Books
   - Add books to editorial database
   - Manage editorial workflow
   - Track translation status

## Database Schema

### `books` Table

Stores book references and editorial workflow data:

```typescript
{
  id: uuid                          // Primary key
  google_books_id: string           // Reference to Google Books API

  // Cached metadata (for searchability)
  title: string
  subtitle?: string
  authors?: string[]
  published_date?: string
  language?: string
  isbn_13?: string
  isbn_10?: string

  // Editorial workflow
  status: BookStatus                // discovered | under_review | selected | in_translation | published | rejected

  // Translation metadata
  translated_title?: string         // Spanish title
  selected_for_translation: boolean
  translation_priority?: 1-5        // 1 = highest priority

  // Assessment scores
  marketability_score?: 1-10
  relevance_score?: 1-10

  // Notes
  internal_notes?: string
  rejection_reason?: string

  // Tracking
  added_by?: uuid
  added_at: timestamp
  updated_at: timestamp
  reviewed_at?: timestamp
  reviewed_by?: uuid
}
```

### Workflow Statuses

1. **discovered** - Initially added from Google Books
2. **under_review** - Being evaluated by editorial team
3. **selected** - Approved for translation
4. **in_translation** - Currently being translated
5. **published** - Translation complete and published
6. **rejected** - Not suitable for translation

## API Routes

### Search Books

**GET** `/api/books/search?q={query}`

Search Google Books API for potential titles.

**Query Parameters:**

- `q` - Search query (required)
- `maxResults` - Results per page (default: 20, max: 40)
- `startIndex` - Pagination offset (default: 0)

**Response:**

```json
{
  "kind": "books#volumes",
  "totalItems": 150,
  "items": [GoogleBookVolume...]
}
```

### List Books

**GET** `/api/books`

List books from database with filtering.

**Query Parameters:**

- `status` - Filter by workflow status
- `selected` - Filter by translation selection (true/false)
- `limit` - Results limit (default: 50)

**Response:**

```json
{
  "books": [Book...]
}
```

### Add Book

**POST** `/api/books`

Add a book from Google Books to the database.

**Request Body:**

```json
{
  "googleBooksId": "H0lH-JZ8w9sC"
}
```

**Response:**

```json
{
  "book": Book
}
```

### Get Book Details

**GET** `/api/books/{id}`

Get a single book from database.

**Response:**

```json
{
  "book": Book
}
```

### Update Book

**PATCH** `/api/books/{id}`

Update editorial metadata for a book.

**Request Body:**

```json
{
  "status": "selected",
  "translated_title": "Teoría del Teatro",
  "selected_for_translation": true,
  "translation_priority": 1,
  "marketability_score": 8,
  "relevance_score": 9,
  "internal_notes": "Highly relevant for academic programs"
}
```

**Response:**

```json
{
  "book": Book
}
```

### Delete Book

**DELETE** `/api/books/{id}`

Remove a book from the database (admin only).

## Dashboard Routes

- `/dashboard` - Home with quick actions and workflow overview
- `/dashboard/books` - List all books with filtering
- `/dashboard/books/search` - Search Google Books and add to database
- `/dashboard/books/[id]` - View/edit book details and editorial metadata
- `/dashboard/stats` - Statistics dashboard (coming soon)

## Google Books API Integration

### Environment Variables

Required in root `.env`:

```bash
GOOGLE_API_KEY=your_api_key_here
```

### API Wrapper

The `GoogleBooksAPI` class provides:

- **search()** - Search books by query
- **getBook()** - Get specific book by volume ID
- **searchByISBN()** - Search by ISBN
- **searchByTitle()** - Search by title
- **searchByAuthor()** - Search by author
- **searchBySubject()** - Search by subject/category
- **getCoverImageUrl()** - Extract cover image
- **getISBNs()** - Extract ISBN identifiers
- **formatAuthors()** - Format author names
- **isPerformingArtsRelated()** - Check relevance to performing arts

### Search Operators

Google Books supports advanced search:

- `intitle:theater` - Search in title
- `inauthor:stanislavski` - Search by author
- `isbn:9780123456789` - Search by ISBN
- `subject:drama` - Search by subject
- `inpublisher:routledge` - Search by publisher

Combine operators: `intitle:acting inauthor:meisner subject:theater`

## Security

### Row Level Security (RLS)

**Books Table:**

- **SELECT**: Anyone can view (for public catalog)
- **INSERT**: Only authenticated editors/admins
- **UPDATE**: Only authenticated editors/admins
- **DELETE**: Only authenticated admins

### Role-Based Access

Roles defined in `user_app_access` table:

- **admin** - Full access including deletion
- **editor** - Can add and edit books
- **viewer** - Read-only access

## Usage Guide

### 1. Search for Books

1. Navigate to **Search Books** from dashboard
2. Enter search query (title, author, ISBN, or keywords)
3. Use search tips for advanced queries
4. Browse results with covers, descriptions, and metadata

### 2. Add Books to Database

1. Click **Add Book** button on search results
2. Book is saved with minimal metadata
3. Status automatically set to "discovered"
4. Navigate to book detail for full editing

### 3. Review and Evaluate

1. Open book from **Manage Books** list
2. View full Google Books data (cover, description, etc.)
3. Update editorial fields:
   - Status (move through workflow)
   - Translated title
   - Selection flag
   - Priority (1-5)
   - Scores (marketability, relevance)
   - Internal notes
4. Click **Save Changes**

### 4. Workflow Management

Track books through stages:

1. **Discovered** → Book added, pending review
2. **Under Review** → Being evaluated
3. **Selected** → Approved for translation
4. **In Translation** → Work in progress
5. **Published** → Translation complete
6. **Rejected** → Not suitable

## Performance Considerations

### Caching Strategy

- **Google Books API**: Next.js caching (1 hour for searches, 24 hours for books)
- **Database Queries**: Server-side caching via Supabase
- **Client-side**: React state management for active views

### Rate Limits

- **Google Books Free Tier**: 1000 requests/day
- **Supabase**: Based on plan tier
- **Recommended**: Cache aggressively, batch operations

### Optimization Tips

1. Use full-text search for database queries
2. Paginate large result sets
3. Lazy-load book covers
4. Minimize redundant API calls

## Future Enhancements

### Phase 2 Features

- [ ] Tags system implementation
- [ ] Review/rating system
- [ ] Bulk import from CSV/spreadsheet
- [ ] Advanced search filters (date range, categories)
- [ ] Export books list to CSV

### Phase 3 Features

- [ ] Public catalog page
- [ ] Book detail pages for website
- [ ] Translation progress tracking
- [ ] Collaboration tools (comments, assignments)
- [ ] Email notifications

### Phase 4 Features

- [ ] Statistics dashboard
- [ ] Analytics (popular searches, conversion rates)
- [ ] Automatic recommendations
- [ ] Integration with translation management system

## Troubleshooting

### Google Books API Issues

**Problem**: "Failed to search books"

- **Check**: API key is set in `.env`
- **Check**: Rate limits not exceeded
- **Solution**: Wait and retry, or upgrade API quota

**Problem**: Book not found by ID

- **Cause**: Invalid Google Books volume ID
- **Solution**: Search again and use correct ID

### Database Issues

**Problem**: "Book already exists"

- **Cause**: Attempting to add duplicate book
- **Solution**: Navigate to existing book and edit

**Problem**: "Insufficient permissions"

- **Cause**: User lacks editor/admin role
- **Solution**: Admin must grant role in `user_app_access` table

### Migration Issues

**Problem**: Migration fails to run

- **Check**: Supabase connection is configured
- **Check**: Migration file syntax is correct
- **Solution**: Run migration manually in Supabase SQL editor

## Support

For issues or questions:

1. Check this documentation
2. Review [CLAUDE.md](../../CLAUDE.md) for development commands
3. Consult Supabase documentation for database issues
4. Refer to Google Books API docs for integration questions

## Development

### Running Locally

```bash
# Start editorial app
pnpm dev --filter=@cenie/editorial

# App runs on http://localhost:3001
```

### Type Checking

```bash
pnpm type-check --filter=@cenie/editorial
```

### Database Migration

1. Copy migration file to Supabase project
2. Run in SQL editor or via Supabase CLI
3. Update `database.ts` types if schema changes

### Testing Flow

1. Sign in to dashboard
2. Search for "acting technique" or "theater history"
3. Add 2-3 books to database
4. Edit each book with editorial metadata
5. Filter by status in books list
6. Verify all data persists

---

**Last Updated**: January 27, 2025
**Version**: 1.0.0
