# Waitlist API - Debugging Guide for evelas.co

## Enhanced Error Handling (Active)

The waitlist API now includes **comprehensive error logging and detailed error responses** to help debug issues from external websites.

---

## How to Debug

### 1. Check Browser Console

Open browser DevTools (F12) and look at:

**Console Tab:**
- Any JavaScript errors
- CORS errors (will show as red)
- Network request failures

**Network Tab:**
- Find the request to `cenie.org/api/waitlist`
- Check the **Status Code**
- Click on the request and view:
  - **Headers** → Check `Access-Control-Allow-Origin`
  - **Payload** → Verify JSON is correct
  - **Response** → See detailed error message

---

### 2. Error Response Format

All errors now return **detailed information**:

```json
{
  "error": "Error category",
  "message": "Human-readable message",
  "details": "Technical details about what went wrong",
  "code": "PGRST116",
  "timestamp": "2025-02-01T10:30:00.000Z",
  "hint": "Additional debugging hint (if available)"
}
```

---

### 3. Server Logs

Check Vercel logs for detailed server-side logging:

**Every request logs:**
```
[Waitlist 2025-02-01T10:30:00.000Z] POST request from: https://evelas.co
[Waitlist 2025-02-01T10:30:00.000Z] Rate limit check: { identifier: 'waitlist:123.456.789.0', remaining: 49, success: true }
[Waitlist 2025-02-01T10:30:00.000Z] Request body: { full_name: 'John Doe', email: 'joh***', source: 'evelas' }
[Waitlist 2025-02-01T10:30:00.000Z] Validation passed
[Waitlist 2025-02-01T10:30:00.000Z] Connecting to Supabase...
[Waitlist 2025-02-01T10:30:00.000Z] Supabase client created
[Waitlist 2025-02-01T10:30:00.000Z] Checking if email exists...
[Waitlist 2025-02-01T10:30:00.000Z] Email check complete: { exists: false }
[Waitlist 2025-02-01T10:30:00.000Z] Inserting new subscriber...
[Waitlist 2025-02-01T10:30:00.000Z] Insert successful
[Waitlist] New subscriber added: john@example.com from: https://evelas.co
```

**CORS logs:**
```
[CORS] Request: { method: 'POST', origin: 'https://evelas.co', allowed: true }
[CORS] Response: { status: 201, hasCorsHeaders: true }
```

---

## Common Issues & Solutions

### Issue 1: CORS Error

**Error in browser:**
```
Access to fetch at 'https://cenie.org/api/waitlist' from origin 'https://evelas.co' 
has been blocked by CORS policy
```

**Cause:** Origin not allowed

**Solution:** Check that:
- You're using `https://evelas.co` (not `http://`)
- The domain exactly matches (check for `www.` prefix)

**Current allowed origins:**
- `https://evelas.co`
- `https://www.evelas.co`
- Any `*.evelas.co` subdomain
- All `localhost` ports in development

---

### Issue 2: 500 Internal Server Error

**Check the response body for details:**

```javascript
const response = await fetch('https://cenie.org/api/waitlist', {...})
const data = await response.json()
console.log('Error details:', data)
```

**Common 500 errors:**

#### Database Configuration
```json
{
  "error": "Configuration error",
  "message": "Database connection not configured",
  "details": "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
}
```
**Fix:** Supabase env vars not set on Vercel

#### Database Query Error
```json
{
  "error": "Database error",
  "message": "Failed to check subscription status",
  "details": "relation \"waitlist_subscribers\" does not exist",
  "code": "42P01"
}
```
**Fix:** Migration not applied to Supabase

#### RLS Policy Error
```json
{
  "error": "Database error",
  "message": "Failed to subscribe to waitlist",
  "details": "new row violates row-level security policy",
  "code": "42501"
}
```
**Fix:** RLS policy blocking inserts

---

### Issue 3: 400 Validation Error

**Example response:**
```json
{
  "error": "Validation error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Fix:** Check that your JSON matches:
```json
{
  "full_name": "John Doe",  // Required, min 2 chars
  "email": "john@example.com",  // Required, valid email
  "source": "evelas"  // Optional, one of: hub|editorial|academy|agency|evelas|other
}
```

---

### Issue 4: 429 Rate Limit

```json
{
  "error": "Too many subscription attempts",
  "message": "Please try again later",
  "resetInSeconds": 2847
}
```

**Current limit:** 50 requests per hour per IP

**Fix:** Wait or test from different IP/network

---

## Test Commands

### 1. Test from Command Line

```bash
curl -X POST https://cenie.org/api/waitlist \
  -H "Content-Type: application/json" \
  -H "Origin: https://evelas.co" \
  -d '{
    "full_name": "Test User",
    "email": "test@evelas.co",
    "source": "evelas"
  }' \
  -v
```

The `-v` flag shows full request/response including headers.

---

### 2. Test CORS Preflight

```bash
curl -X OPTIONS https://cenie.org/api/waitlist \
  -H "Origin: https://evelas.co" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

Should return:
```
Access-Control-Allow-Origin: https://evelas.co
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

### 3. Test from JavaScript Console

Open evelas.co, then in browser console:

```javascript
fetch('https://cenie.org/api/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'Console Test',
    email: 'console@test.com',
    source: 'evelas'
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

---

## Viewing Logs

### Vercel Production Logs

1. Go to https://vercel.com
2. Select your `hub` project
3. Go to **Logs** tab
4. Filter by `/api/waitlist`
5. Look for entries with `[Waitlist]` or `[CORS]` prefix

### Local Development Logs

```bash
cd apps/hub
pnpm dev
```

All logs will appear in your terminal with timestamps and detailed info.

---

## Quick Checklist

When debugging from evelas.co:

- [ ] Migration applied in Supabase?
- [ ] Supabase env vars set in Vercel?
- [ ] Using `https://` (not `http://`)?
- [ ] Request body is valid JSON?
- [ ] Email format is valid?
- [ ] Name is at least 2 characters?
- [ ] Not hitting rate limit (50/hour)?
- [ ] Check browser console for errors
- [ ] Check Network tab for response details
- [ ] Check Vercel logs for server errors

---

## Still Having Issues?

**Capture this information:**

1. **Error response** (from Network tab → Response)
2. **Request headers** (from Network tab → Headers)
3. **Console errors** (screenshot)
4. **Server logs** (from Vercel)
5. **Exact curl command** that reproduces the issue

Example debug output:
```json
{
  "timestamp": "2025-02-01T10:30:00.000Z",
  "origin": "https://evelas.co",
  "error": {
    "error": "Database error",
    "message": "Failed to subscribe to waitlist",
    "details": "...",
    "code": "..."
  }
}
```

---

**Last Updated:** February 2025  
**Status:** ✅ Enhanced Error Handling Active

