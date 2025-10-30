# 🔐 Grant Editorial App Access

## The Issue

You're successfully signing in with Google, but the app checks if you have access to the Editorial app in Firestore. Currently, you don't have an access record.

## 🎯 Quick Fix: Get Your User ID and Grant Access

### Step 1: Sign In Again to See Your User ID

1. **Open Browser Console** (F12 or Cmd+Option+I)
2. **Clear the console**
3. **Sign in with Google again**

You'll now see:

```text
🔐 [Google Sign-In] User ID: abc123xyz456...
🔐 [Google Sign-In] User Email: your.email@gmail.com
🔐 [Google Sign-In] App access check: false
```

**Copy the User ID** (the long string after "User ID:")

### Step 2: Grant Access

You have **3 options**:

---

## Option 1: Use the Helper Script (Easiest) ⭐

```bash
cd /Users/henry/Workbench/CENIE/platform

# Replace YOUR_USER_ID with the ID from Step 1
node scripts/grant-editorial-access.js YOUR_USER_ID admin
```

**Example:**

```bash
node scripts/grant-editorial-access.js abc123xyz456 admin
```

The script will:

- ✅ Verify the user exists in Firebase Auth
- ✅ Create an access record in Firestore
- ✅ Grant admin access to Editorial app

---

## Option 2: Manually Add in Firestore Console

1. **Open Firebase Console**:
   - Go to `https://console.firebase.google.com`
   - Select project: `cenie-platform`

2. **Navigate to Firestore**:
   - Click "Firestore Database" in the sidebar
   - Find or create collection: `user_app_access`

3. **Add a document** with these fields:

   | Field       | Type      | Value                         |
   | ----------- | --------- | ----------------------------- |
   | `userId`    | string    | YOUR_USER_ID (from Step 1)    |
   | `appName`   | string    | `editorial`                   |
   | `role`      | string    | `admin` or `editor`           |
   | `isActive`  | boolean   | `true`                        |
   | `grantedAt` | timestamp | (click "Set to current time") |
   | `grantedBy` | string    | `manual`                      |

4. **Click "Save"**

---

## Option 3: Temporary Bypass for Development (Not Recommended)

If you just want to test and bypass the access check temporarily:

**Edit:** `apps/editorial/src/app/sign-in/page.tsx`

Find this line (around line 122):

```typescript
const hasAccess = await hubAuth.checkAppAccess(idToken, 'editorial')
```

**Temporarily change to:**

```typescript
const hasAccess = true // TEMPORARY BYPASS - Remove this!
// const hasAccess = await hubAuth.checkAppAccess(idToken, 'editorial')
```

⚠️ **Remember to remove this before production!**

---

## Step 3: Test Sign-In

After granting access (using any option above):

1. **Sign out** from the Editorial app (if signed in)
2. **Go to** `http://localhost:3001/sign-in`
3. **Sign in with Google** again

You should now see:

```text
🔐 [Google Sign-In] App access check: true ✅
🔐 [Google Sign-In] Creating session cookie...
```

And the session creation will proceed!

---

## Understanding the Access System

The Editorial app uses a two-tier authentication system:

### Tier 1: Firebase Authentication

- ✅ Verifies you are who you say you are
- ✅ Managed by Firebase Auth
- ✅ **This is working!**

### Tier 2: App-Level Authorization

- ✅ Checks if you have permission to use the Editorial app
- ✅ Stored in Firestore `user_app_access` collection
- ❌ **This is what's missing!**

### Access Roles

- **`admin`**: Full access to all features
- **`editor`**: Can manage books and translations
- **`viewer`**: Read-only access (if implemented)

---

## Verifying Access in Firestore

After granting access, you should see a document in:

**Collection**: `user_app_access`

**Document fields**:

```javascript
{
  userId: "abc123xyz456...",
  appName: "editorial",
  role: "admin",
  isActive: true,
  grantedAt: Timestamp,
  grantedBy: "script" // or "manual"
}
```

---

## Troubleshooting

### Script error: "User not found in Firebase Auth"

**Problem**: You haven't created the Firebase Auth user yet.

**Solution**:

1. Sign in with Google at least once (it will fail at access check, but will create the Auth user)
2. Then run the script

### Script error: "Cannot find module 'firebase-admin'"

**Problem**: Script needs to run from the right location.

**Solution**:

```bash
# Make sure you're in the project root
cd /Users/henry/Workbench/CENIE/platform

# Install dependencies if needed
pnpm install

# Run the script
node scripts/grant-editorial-access.js YOUR_USER_ID
```

### Access granted but still getting "No access" error

**Problem**: Cached access check or wrong userId.

**Solution**:

1. Verify the userId in Firestore matches exactly what you see in console
2. Sign out completely and sign in again
3. Clear browser cookies and try again

---

## Next Steps After Granting Access

Once access is granted:

1. ✅ Sign in with Google
2. ✅ Access check will pass (returns `true`)
3. ✅ Session cookie will be created
4. ✅ You'll be redirected to dashboard
5. ✅ API calls will work with the session cookie

Then you can test the book translation investigation feature!

---

## For Production

In production, you'll want to:

1. **Create an admin panel** to manage user access
2. **Set up proper RBAC** (Role-Based Access Control)
3. **Add audit logging** for access grants/revocations
4. **Email notifications** when access is granted

For now, the script or manual Firestore entry works perfectly for development! 🚀
