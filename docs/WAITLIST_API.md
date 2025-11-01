# CENIE Platform - Waitlist API Documentation

## Overview

The Waitlist API provides a simple CRM solution for collecting email subscriptions from interested individuals who want to be notified about the CENIE platform's launch and updates. This is an initial implementation to gather leads before the main platform launch.

**API Base URL (Production):** `https://cenie.org/api/waitlist`  
**API Base URL (Development):** `http://localhost:3000/api/waitlist`

---

## Features

✅ **Public Subscription Endpoint** - No authentication required  
✅ **Cross-Origin Support (CORS)** - Works from any authorized domain  
✅ **Rate Limiting** - 5 requests per hour per IP address  
✅ **Email Validation** - Format validation with case-insensitive uniqueness  
✅ **Source Tracking** - Track where subscribers came from  
✅ **Admin Dashboard Access** - List and search subscribers  
✅ **TypeScript Support** - Full type definitions included  
✅ **Metadata Support** - Extensible for future features

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [API Endpoints](#api-endpoints)
3. [Integration Examples](#integration-examples)
4. [Rate Limiting](#rate-limiting)
5. [Error Handling](#error-handling)
6. [Database Schema](#database-schema)
7. [Admin Access](#admin-access)
8. [Deployment](#deployment)

---

## Quick Start

### 1. Apply Database Migration

First, apply the Supabase migration to create the `waitlist_subscribers` table:

```bash
# In Supabase SQL Editor, run:
/packages/supabase/migrations/20250201_waitlist_table.sql
```

### 2. Install Dependencies (Hub App)

The Supabase package is already added to the hub app's dependencies. If starting fresh:

```bash
cd apps/hub
pnpm install
```

### 3. Configure Environment Variables

Ensure your hub app has the required Supabase environment variables in `apps/hub/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the Development Server

```bash
cd apps/hub
pnpm dev
```

The API will be available at `http://localhost:3000/api/waitlist`

---

## API Endpoints

### POST /api/waitlist

Subscribe a new user to the waitlist.

**Authentication:** None required (public endpoint)  
**Rate Limit:** 5 requests per hour per IP

**Request:**

```http
POST /api/waitlist HTTP/1.1
Host: cenie.org
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "source": "hub"
}
```

**Request Body Schema:**

| Field       | Type   | Required | Description                                                       |
|-------------|--------|----------|-------------------------------------------------------------------|
| `full_name` | string | Yes      | Subscriber's full name (2-100 characters)                         |
| `email`     | string | Yes      | Valid email address (case-insensitive, unique)                    |
| `source`    | string | No       | Source: `hub`, `editorial`, `academy`, `agency`, `evelas`, `other` (default: `hub`) |
| `metadata`  | object | No       | Optional metadata for future use                                  |

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Successfully subscribed to waitlist",
  "subscriber": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "email": "john@example.com",
    "source": "hub",
    "subscribed_at": "2025-02-01T10:30:00.000Z"
  }
}
```

**Response Headers:**

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1738411200000
Retry-After: 3600
```

**Error Responses:**

| Status | Error                    | Description                                   |
|--------|--------------------------|-----------------------------------------------|
| 400    | Validation error         | Invalid input (email format, name length)     |
| 409    | Already subscribed       | Email already exists in waitlist              |
| 429    | Too many requests        | Rate limit exceeded (5/hour)                  |
| 500    | Internal server error    | Database or server error                      |

---

### GET /api/waitlist

List all waitlist subscribers (admin only).

**Authentication:** Required (Firebase ID token)  
**Authorization:** Admin role required  
**Rate Limit:** None

**Request:**

```http
GET /api/waitlist?page=1&per_page=50&search=john&source=hub HTTP/1.1
Host: cenie.org
Authorization: Bearer <firebase_id_token>
```

**Query Parameters:**

| Parameter  | Type    | Default | Description                              |
|------------|---------|---------|------------------------------------------|
| `page`     | integer | 1       | Page number                              |
| `per_page` | integer | 50      | Items per page (max: 100)                |
| `search`   | string  | -       | Search by name or email                  |
| `source`   | string  | -       | Filter by source                         |
| `active`   | boolean | true    | Filter by active status                  |

**Success Response (200 OK):**

```json
{
  "subscribers": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "full_name": "John Doe",
      "email": "john@example.com",
      "source": "hub",
      "subscribed_at": "2025-02-01T10:30:00.000Z",
      "is_active": true,
      "metadata": {}
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 127,
    "total_pages": 3
  }
}
```

**Error Responses:**

| Status | Error            | Description                        |
|--------|------------------|------------------------------------|
| 401    | Unauthorized     | Missing or invalid authentication  |
| 403    | Forbidden        | Admin role required                |
| 500    | Server error     | Database or server error           |

---

### OPTIONS /api/waitlist

CORS preflight request handler.

**Response:** 204 No Content with CORS headers

---

## Integration Examples

### Example 1: React/Next.js Component (Hub Site)

```typescript
'use client'

import { useState } from 'react'

export function WaitlistForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'hub',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setFormData({ full_name: '', email: '' })
      } else {
        setStatus('error')
        setMessage(data.message || data.error)
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Join Waitlist'}
      </button>
      {message && <p className={status === 'error' ? 'error' : 'success'}>{message}</p>}
    </form>
  )
}
```

---

### Example 2: External Site (evelas.co)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Subscribe to CENIE</title>
</head>
<body>
  <form id="waitlist-form">
    <input type="text" id="name" placeholder="Full Name" required />
    <input type="email" id="email" placeholder="Email" required />
    <button type="submit">Join Waitlist</button>
    <p id="message"></p>
  </form>

  <script>
    document.getElementById('waitlist-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const name = document.getElementById('name').value
      const email = document.getElementById('email').value
      const message = document.getElementById('message')
      
      try {
        const response = await fetch('https://cenie.org/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: name,
            email: email,
            source: 'evelas'
          })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          message.textContent = data.message
          message.style.color = 'green'
          e.target.reset()
        } else {
          message.textContent = data.message || data.error
          message.style.color = 'red'
        }
      } catch (error) {
        message.textContent = 'Failed to subscribe. Please try again.'
        message.style.color = 'red'
      }
    })
  </script>
</body>
</html>
```

---

### Example 3: TypeScript with Error Handling

```typescript
interface WaitlistResponse {
  success: boolean
  message: string
  subscriber?: {
    id: string
    full_name: string
    email: string
    source: string
    subscribed_at: string
  }
  error?: string
  details?: Array<{ field: string; message: string }>
  resetInSeconds?: number
}

async function subscribeToWaitlist(
  fullName: string,
  email: string,
  source: string = 'hub'
): Promise<WaitlistResponse> {
  try {
    const response = await fetch('https://cenie.org/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        source: source,
      }),
    })

    const data: WaitlistResponse = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Subscription failed')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}

// Usage
try {
  const result = await subscribeToWaitlist('John Doe', 'john@example.com', 'hub')
  console.log('Subscribed:', result.subscriber)
} catch (error) {
  console.error('Error:', error.message)
}
```

---

## Rate Limiting

The POST endpoint is rate-limited to prevent abuse:

- **Limit:** 5 requests per hour per IP address
- **Window:** 1 hour (3600 seconds)
- **Scope:** Per IP address
- **Implementation:** In-memory store (resets on server restart)

**Rate Limit Headers:**

All responses include rate limit information:

```
X-RateLimit-Limit: 5           # Maximum requests allowed
X-RateLimit-Remaining: 3        # Requests remaining in window
X-RateLimit-Reset: 1738411200   # Unix timestamp when limit resets
Retry-After: 2847               # Seconds until reset
```

**Rate Limit Response (429):**

```json
{
  "error": "Too many subscription attempts",
  "message": "Please try again later",
  "resetInSeconds": 2847
}
```

---

## Error Handling

### Validation Errors (400)

```json
{
  "error": "Validation error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "full_name",
      "message": "Full name must be at least 2 characters"
    }
  ]
}
```

### Duplicate Email (409)

```json
{
  "error": "Already subscribed",
  "message": "This email is already on the waitlist",
  "subscribed_at": "2025-02-01T10:30:00.000Z"
}
```

### Rate Limit Exceeded (429)

```json
{
  "error": "Too many subscription attempts",
  "message": "Please try again later",
  "resetInSeconds": 2847
}
```

---

## Database Schema

### Table: `waitlist_subscribers`

| Column          | Type         | Nullable | Default       | Description                              |
|-----------------|--------------|----------|---------------|------------------------------------------|
| `id`            | UUID         | No       | gen_random_uuid() | Primary key                       |
| `full_name`     | TEXT         | No       | -             | Subscriber's full name                   |
| `email`         | TEXT         | No       | -             | Email (unique, case-insensitive)         |
| `source`        | TEXT         | Yes      | NULL          | Source: hub, editorial, academy, etc.    |
| `subscribed_at` | TIMESTAMPTZ  | No       | now()         | Subscription timestamp                   |
| `is_active`     | BOOLEAN      | No       | true          | Active status (for opt-out)              |
| `metadata`      | JSONB        | No       | '{}'          | Additional metadata                      |

**Indexes:**

- Unique index on `LOWER(email)`
- Index on `source` (partial, WHERE source IS NOT NULL)
- Index on `subscribed_at` (DESC)
- Index on `is_active` (partial, WHERE is_active = true)
- Composite index on `(is_active, subscribed_at DESC)`

**Constraints:**

- Email format validation (regex)
- Full name minimum length (2 characters)
- Source enum validation

---

## Admin Access

### Fetching Subscribers (TypeScript)

```typescript
import { getIdToken } from 'firebase/auth'

async function fetchWaitlistSubscribers(page = 1, perPage = 50) {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')

  const token = await getIdToken(user)

  const response = await fetch(
    `https://cenie.org/api/waitlist?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch subscribers')
  }

  return await response.json()
}
```

### Search and Filter

```typescript
async function searchSubscribers(query: string, source?: string) {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')

  const token = await getIdToken(user)
  
  const params = new URLSearchParams({
    search: query,
    ...(source && { source }),
  })

  const response = await fetch(
    `https://cenie.org/api/waitlist?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return await response.json()
}
```

---

## Deployment

### Prerequisites

1. ✅ Supabase project configured
2. ✅ Migration applied to database
3. ✅ Environment variables set in Vercel
4. ✅ Firebase Admin SDK configured

### Environment Variables (Vercel)

Add these to your Vercel project settings for the hub app:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Firebase Admin (for authentication)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### Deployment Steps

1. **Apply Migration:**
   - Go to Supabase SQL Editor
   - Run the migration file: `20250201_waitlist_table.sql`
   - Verify tables and functions created

2. **Deploy to Vercel:**
   ```bash
   # From project root
   git add .
   git commit -m "Add waitlist API"
   git push origin main
   ```

3. **Verify Deployment:**
   - Test POST endpoint: `https://cenie.org/api/waitlist`
   - Check CORS headers are present
   - Verify rate limiting works
   - Test admin GET endpoint with authentication

---

## Security Considerations

✅ **Rate Limiting** - Prevents abuse (5 requests/hour/IP)  
✅ **Input Validation** - Zod schema validation  
✅ **Email Sanitization** - Lowercase and trimmed  
✅ **SQL Injection Protection** - Supabase client handles escaping  
✅ **CORS Whitelist** - Only authorized origins allowed  
✅ **RLS Policies** - Database-level security (public INSERT only)  
✅ **Admin-Only Access** - Firebase authentication required for GET  
✅ **SECURITY DEFINER Functions** - Bypasses RLS for authorized API operations  
✅ **No Sensitive Data** - Minimal PII stored

### Architecture Note: Firebase + Supabase Integration

This implementation uses a hybrid approach:
- **User Authentication & Permissions:** Firebase (Firestore)
- **Data Storage:** Supabase (PostgreSQL)

**Why this matters:**
- User permissions (`user_app_access`) are stored in **Firestore**, not Supabase
- RLS policies in Supabase cannot reference Firestore data
- Solution: API-level authorization + `SECURITY DEFINER` database functions

**Security Flow:**
1. **POST /api/waitlist** (Public)
   - Rate limiting at API level
   - RLS allows public INSERT
   - No authentication required

2. **GET /api/waitlist** (Admin)
   - Firebase ID token validation at API level
   - Admin role check against Firestore
   - Uses `get_waitlist_subscribers()` function with `SECURITY DEFINER`
   - Function bypasses RLS (safe because API already authorized)

This pattern maintains defense-in-depth while keeping user management in Firebase.

---

## Future Enhancements

- 📧 Email verification before adding to list
- 📊 Analytics dashboard in hub admin panel
- 📤 CSV export functionality
- 📮 Email notifications to admins on new signups
- 🎯 Tagging and segmentation
- 📨 Bulk email sending capability
- 🔗 Integration with email service (Resend, SendGrid)
- 🔒 Double opt-in confirmation
- ⚖️ GDPR compliance features (consent tracking, data export)

---

## Support

For issues or questions:

- **Documentation:** `/docs/WAITLIST_API.md`
- **Migration File:** `/packages/supabase/migrations/20250201_waitlist_table.sql`
- **API Route:** `/apps/hub/src/app/api/waitlist/route.ts`
- **Database Types:** `/packages/supabase/src/types/database.ts`

---

**Version:** 1.0.0  
**Last Updated:** February 1, 2025  
**Status:** ✅ Production Ready

