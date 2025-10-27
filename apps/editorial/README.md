# CENIE Editorial

Academic publishing platform for translating performing arts books from English to Spanish.

## Features

### Book Management System

The Editorial app includes a comprehensive book management system for importing and managing books for translation:

- **Google Books API Integration**: Search and import books from Google's extensive catalog
- **Type-safe API**: Full TypeScript support with Zod validation
- **Database Storage**: Supabase-backed storage with advanced querying capabilities
- **Cloudinary CDN**: Optimized cover image delivery
- **Admin Dashboard**: User-friendly interface for searching and importing books

### Quick Start

1. **Set up environment variables** (see below)
2. **Run database migrations** in Supabase (see [database.sql](src/lib/books/database.sql))
3. **Access the dashboard** at `/dashboard/books`

## Book Management API

### Search Books

```typescript
import { searchBooks } from '@/lib/books';

const result = await searchBooks({
  query: 'theater design',
  maxResults: 10,
  subject: 'performing arts',
  orderBy: 'relevance',
});
```

### Get Book by ISBN

```typescript
import { getBookByISBN } from '@/lib/books';

const book = await getBookByISBN('9780123456789');
```

### Import Book to Database

```typescript
import { importBook } from '@/lib/books';

const result = await importBook(bookData);
```

## React Hooks

### useBookSearch

```typescript
import { useBookSearch } from '@/lib/books';

function MyComponent() {
  const { search, result, isLoading, error } = useBookSearch();

  const handleSearch = () => {
    search({
      query: 'performing arts',
      maxResults: 10,
    });
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {result?.books.map((book) => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

### useBookImport

```typescript
import { useBookImport } from '@/lib/books';

function MyComponent() {
  const { importBook, isImporting, lastResult } = useBookImport();

  const handleImport = async (book: BookData) => {
    const result = await importBook(book);
    if (result.success) {
      console.log('Book imported!');
    }
  };

  return <button onClick={() => handleImport(book)}>Import</button>;
}
```

## Environment Variables

### Required Variables

Add these to your `.env.local` file:

```bash
# Google Books API (optional but recommended)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key

# Supabase (from root .env)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary (from root .env)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Getting a Google Books API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Books API**
4. Create credentials (API Key)
5. Add the key to your `.env.local`

**Note**: The API works without a key but has stricter rate limits.

## Database Schema

The book management system uses the following tables:

- **books**: Main book data storage
- **book_imports**: Import history and tracking
- **book_reviews**: Internal editorial reviews

See [database.sql](src/lib/books/database.sql) for the complete schema.

### Running Migrations

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `src/lib/books/database.sql`
4. Execute the query

## API Routes

### Search Books

```
POST /api/books/search
Body: {
  query: string,
  maxResults?: number,
  subject?: string,
  orderBy?: 'relevance' | 'newest'
}
```

### Get Book by ISBN

```
GET /api/books/isbn/:isbn
```

### Get Book by Volume ID

```
GET /api/books/volume/:volumeId
```

### Import Book

```
POST /api/books/import
Body: { book: BookData }
```

### Batch Import

```
POST /api/books/import/batch
Body: { books: BookData[] }
```

### Upload Cover Image

```
POST /api/books/upload-cover
Body: {
  bookId: string,
  imageUrl?: string,
  base64Data?: string
}
```

## Architecture

```
apps/editorial/src/
├── app/
│   ├── api/books/          # API routes
│   └── dashboard/books/    # Admin UI
├── lib/books/
│   ├── types.ts            # TypeScript types & Zod schemas
│   ├── google-books-client.ts  # Google Books API client
│   ├── transformers.ts     # Data transformation utilities
│   ├── supabase-client.ts  # Database operations
│   ├── cloudinary.ts       # Image upload/optimization
│   ├── client.ts           # Frontend API client
│   ├── hooks/              # React hooks
│   └── database.sql        # Database schema
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# The app runs on http://localhost:3001

# Access the book import dashboard
# http://localhost:3001/dashboard/books
```

## Features in Detail

### Translation Workflow

Each book has translation status tracking:

- `not_started`: Book is in the catalog but translation hasn't begun
- `in_progress`: Translation is underway
- `under_review`: Translation is being reviewed
- `completed`: Translation is finished
- `published`: Book is published and available

### Editorial Status

Books also track editorial status:

- `candidate`: Book is being considered for translation
- `approved`: Book approved for translation
- `in_production`: Book is being actively worked on
- `published`: Book is published
- `archived`: Book is no longer active

### Performing Arts Categorization

Books can be tagged as performing arts related with specific subcategories like:

- Theater
- Dance
- Opera
- Musical Theater
- Performance Art
- Stage Design

## Contributing

When adding new features to the book management system:

1. Update types in `types.ts`
2. Add database migrations if needed
3. Create API routes in `app/api/books/`
4. Add React hooks if applicable
5. Update this README

## License

Copyright © 2025 CENIE
