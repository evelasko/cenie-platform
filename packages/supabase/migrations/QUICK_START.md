# Quick Start - Books System Migration

## Step-by-Step Setup (5 minutes)

### Step 1: Run Migration in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy/paste **ALL** contents from `20250127_books_management_fixed.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)

✅ You should see: "Success. No rows returned"

### Step 2: Get Your User ID

Still in SQL Editor, run:

```sql
SELECT id, email FROM auth.users;
```

📋 Copy your UUID (looks like: `12345678-1234-1234-1234-123456789abc`)

### Step 3: Grant Yourself Access

Run this (replace `YOUR-UUID-HERE` with your actual UUID):

```sql
SELECT grant_editorial_access('YOUR-UUID-HERE', 'admin');
```

✅ You should see: "Success. No rows returned"

### Step 4: Verify Setup

```sql
-- Check your access was granted
SELECT user_id, app_name, role, is_active
FROM user_app_access
WHERE app_name = 'editorial';
```

✅ You should see your user listed with role='admin'

### Step 5: Start the App

In your terminal:

```bash
cd /Users/henry/Workbench/CENIE/platform
pnpm dev --filter=@cenie/editorial
```

### Step 6: Test It Out

1. Open browser: `http://localhost:3001/dashboard`
2. Sign in with Firebase
3. Click **"Search Books"**
4. Search for: "acting technique" or "theater"
5. Click **"Add Book"** on any result
6. Go to **"Books"** to see your added book

## Common Issues

### "relation 'user_app_access' does not exist"

**Solution**: Use the **fixed** migration file (`20250127_books_management_fixed.sql`), not the original one.

### "INSERT permission denied"

**Solution**: Make sure you:
1. Ran Step 3 (grant access)
2. Used YOUR actual user UUID
3. Are signed in to the app

### Can't find my UUID

**Solution**: Run this in Supabase SQL Editor:

```sql
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;
```

Your account is probably the most recent one.

### Books won't display

**Solution**: Check browser console for errors. Most likely:
- Firebase not configured (check `.env.local`)
- Not signed in
- API key missing (`GOOGLE_API_KEY` in root `.env`)

## Granting Access to Team Members

After they sign up, get their UUID and run:

```sql
-- For admins (can delete books)
SELECT grant_editorial_access('THEIR-UUID', 'admin');

-- For editors (can add/edit books)
SELECT grant_editorial_access('THEIR-UUID', 'editor');
```

## Environment Variables Check

Make sure you have in root `.env`:

```bash
GOOGLE_API_KEY=your_google_api_key_here
```

And in `apps/editorial/.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... other Firebase config
```

## That's It!

You now have a fully functional book management system 🎉

For detailed documentation, see:
- [BOOKS_SYSTEM.md](../../apps/editorial/BOOKS_SYSTEM.md) - Full system documentation
- [README.md](./README.md) - Migration details and troubleshooting
