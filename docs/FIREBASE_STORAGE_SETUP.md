# Firebase Storage Setup Guide

This guide covers the manual steps required to complete the Firebase Storage integration
for the Editorial app's image uploads (book covers and contributor photos).

## Prerequisites

- Access to the Firebase Console for the `cenie-platform` project
- Access to the TwicPics Dashboard for `cenie.twic.pics`
- Firebase CLI installed (`npm install -g firebase-tools`)
- Authenticated with Firebase CLI (`firebase login`)

---

## Step 1: Deploy Firebase Storage Rules

The storage rules have been updated to allow public reads on `editorial/**` paths.
This is required so TwicPics can fetch original images from Firebase Storage.

```bash
cd services/cloud-functions
firebase deploy --only storage
```

**Verify:** In the Firebase Console, go to **Storage > Rules** and confirm:
- `editorial/{allPaths=**}` allows `read: if true`
- All other paths remain `read, write: if false`

---

## Step 2: Verify Firebase Storage Bucket

1. Go to [Firebase Console](https://console.firebase.google.com/) > **cenie-platform** > **Storage**
2. Note your bucket name (e.g., `cenie-platform.firebasestorage.app` or `cenie-platform.appspot.com`)
3. Ensure the bucket is active (if this is the first time using Storage, Firebase will prompt you to initialize it)

**Important:** The bucket name must match your `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` environment variable.

---

## Step 3: Verify Service Account Permissions

The Firebase Admin SDK uses a service account to upload files. This service account
needs the **Storage Object Admin** permission.

1. Go to [Google Cloud Console](https://console.cloud.google.com/) > **IAM & Admin** > **IAM**
2. Select the `cenie-platform` project
3. Find your service account (the `FIREBASE_CLIENT_EMAIL` value, e.g., `firebase-adminsdk-xxxxx@cenie-platform.iam.gserviceaccount.com`)
4. Verify it has one of these roles:
   - **Firebase Admin SDK Administrator Service Agent** (usually already has this)
   - **Storage Object Admin** (if not present, add it)

**If using a custom service account**, add the role:
```bash
gcloud projects add-iam-policy-binding cenie-platform \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT_EMAIL" \
  --role="roles/storage.objectAdmin"
```

---

## Step 4: Configure TwicPics Source

TwicPics needs to know where to fetch original images. Configure it to point to
your Firebase Storage bucket.

1. Go to [TwicPics Dashboard](https://www.twicpics.com/dashboard)
2. Select your domain: `cenie.twic.pics`
3. Go to **Sources** (or **Paths** depending on UI version)
4. Create or update a source/path:

| Setting | Value |
|---------|-------|
| **Path** | `/` (or `editorial/` if you want to scope it) |
| **Source type** | URL |
| **Source URL** | `https://storage.googleapis.com/YOUR_BUCKET_NAME/` |

Replace `YOUR_BUCKET_NAME` with your actual Firebase Storage bucket name (e.g., `cenie-platform.firebasestorage.app`).

**How it works:** When TwicPics receives a request for:
```
https://cenie.twic.pics/editorial/covers/slug.jpg?twic=v1/cover=400x600
```
It will fetch the original from:
```
https://storage.googleapis.com/YOUR_BUCKET_NAME/editorial/covers/slug.jpg
```
Then apply the transformations and cache the result.

**Verify:** After configuration, test by uploading an image through the editorial dashboard and checking the TwicPics URL loads correctly.

---

## Step 5: Environment Variables

Ensure these variables are set across environments:

### Root `.env` (shared)

```bash
# Firebase Storage bucket
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cenie-platform.firebasestorage.app

# Firebase Admin SDK credentials (for server-side uploads)
FIREBASE_PROJECT_ID=cenie-platform
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@cenie-platform.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# TwicPics
TWICPICS_DOMAIN=cenie.twic.pics
NEXT_PUBLIC_TWICPICS_DOMAIN=cenie.twic.pics
```

### Vercel Environment Variables

In Vercel project settings, ensure the same variables are configured:
1. Go to Vercel Dashboard > Editorial project > Settings > Environment Variables
2. Verify `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set
3. Verify `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` are set

---

## Step 6: Migrate Existing Images (One-Time)

If there are existing images in `public/images/covers/` or `public/images/contributors/`
that need to be migrated to Firebase Storage:

### Option A: Manual Upload via Firebase Console

1. Go to Firebase Console > **Storage**
2. Create the folder structure: `editorial/covers/` and `editorial/contributors/`
3. Upload existing images from `apps/editorial/public/images/covers/` and
   `apps/editorial/public/images/contributors/`

### Option B: Upload via gsutil CLI

```bash
# Install Google Cloud SDK if not already installed
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login
gcloud config set project cenie-platform

# Upload covers
gsutil -m cp apps/editorial/public/images/covers/*.jpg gs://YOUR_BUCKET_NAME/editorial/covers/
gsutil -m cp apps/editorial/public/images/covers/*.png gs://YOUR_BUCKET_NAME/editorial/covers/
gsutil -m cp apps/editorial/public/images/covers/*.webp gs://YOUR_BUCKET_NAME/editorial/covers/

# Upload contributor photos (if any)
gsutil -m cp apps/editorial/public/images/contributors/*.jpg gs://YOUR_BUCKET_NAME/editorial/contributors/
gsutil -m cp apps/editorial/public/images/contributors/*.png gs://YOUR_BUCKET_NAME/editorial/contributors/

# Make all uploaded files publicly readable
gsutil -m acl ch -r -u AllUsers:R gs://YOUR_BUCKET_NAME/editorial/
```

### Option C: Upload via Firebase CLI

```bash
# From the project root
cd services/cloud-functions

# Use the Firebase emulator to test locally first
firebase emulators:start --only storage

# Then upload to production
firebase storage:upload apps/editorial/public/images/covers/ --destination editorial/covers/
```

---

## Step 7: Clean Git History

Remove the uploaded images from git tracking (they're now in Firebase Storage):

```bash
# Remove from git index (keeps local files)
git rm --cached apps/editorial/public/images/covers/1761843197689-9780674303485.jpg
git rm --cached apps/editorial/public/images/covers/1761843197689-9780674303486.jpg

# The .gitignore already excludes these directories for future commits
# Commit the removal
git add apps/editorial/.gitignore
git commit -m "chore: remove uploaded images from git, use Firebase Storage"
```

**Note:** The `public/demo/` directory contains static demo assets and should
remain in git -- it is NOT affected by this change.

---

## Step 8: Verify the Integration

### Local Development

1. Start the editorial app: `pnpm dev --filter=@cenie/editorial`
2. Log in as an editor
3. Go to Dashboard > Catalog > Create/Edit a volume
4. Upload a cover image
5. Verify:
   - The upload succeeds (no filesystem errors)
   - The image appears in the cover manager
   - The TwicPics URL loads the image
   - The Browse tab lists images from Firebase Storage

### Production (Vercel)

1. Deploy the updated code to Vercel
2. Verify environment variables are set
3. Upload an image through the production dashboard
4. Verify the image persists across deployments (it's in Firebase Storage, not the filesystem)

---

## Architecture Summary

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Dashboard   │────▶│  Next.js API     │────▶│  Firebase    │
│  (Editor)    │     │  Route           │     │  Storage     │
│              │     │  (Admin SDK)     │     │  (Origin)    │
└─────────────┘     └──────────────────┘     └──────┬───────┘
                                                     │
                           Storage path saved        │ Public URL
                           to Firestore              │
                                                     ▼
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Browser     │◀────│  TwicPics CDN    │◀────│  Fetch       │
│  (User)      │     │  (Transform &    │     │  Original    │
│              │     │   Cache)         │     │              │
└─────────────┘     └──────────────────┘     └──────────────┘
```

### File Storage Paths

| Content | Firebase Storage Path | Example |
|---------|----------------------|---------|
| Book covers | `editorial/covers/{slug}.{ext}` | `editorial/covers/stanislavski-acting.jpg` |
| Contributor photos | `editorial/contributors/{ts}-{name}.{ext}` | `editorial/contributors/1706645123-elena-torres.jpg` |

### Key Code Files

| File | Purpose |
|------|---------|
| `src/lib/firebase-storage.ts` | Firebase Storage operations (upload, list, delete) |
| `src/lib/twicpics.ts` | TwicPics URL generation |
| `src/app/api/upload/cover/route.ts` | Cover upload endpoint |
| `src/app/api/upload/photo/route.ts` | Contributor photo upload endpoint |
| `src/app/api/files/covers/route.ts` | Cover file browser endpoint |
| `packages/firebase/src/server.ts` | Firebase Admin SDK initialization (shared) |
| `services/cloud-functions/storage.rules` | Firebase Storage security rules |

---

**Created:** February 12, 2026
