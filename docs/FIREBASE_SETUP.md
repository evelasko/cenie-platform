# Firebase Setup Guide

## Environment Variables Configuration

The CENIE platform uses Firebase for authentication and database services. To properly configure Firebase, you need to set up both client-side and server-side environment variables.

## Required Environment Variables

### Client-Side Variables (Browser Access)
These variables are prefixed with `NEXT_PUBLIC_` and are exposed to the browser:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id (optional)
```

### Server-Side Variables (Admin SDK)
These variables are used for server-side operations and should never be exposed to the client:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-service-account-private-key
```

## Getting Your Firebase Configuration

### 1. Client-Side Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to **Your apps** section
5. Select your web app (or create one by clicking "Add app" → Web)
6. Copy the configuration values from the Firebase SDK snippet

### 2. Server-Side Configuration (Service Account)

1. In Firebase Console, go to **Project settings** → **Service accounts**
2. Click **Generate new private key**
3. Save the downloaded JSON file securely
4. Extract these values from the JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## Setting Up Environment Variables

### Option 1: Manual Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Firebase configuration values

3. For the Hub app, create a symbolic link:
   ```bash
   cd apps/hub
   ln -sf ../../.env .env.local
   ```

### Option 2: Using the Setup Script

Run the provided setup script:

```bash
./scripts/setup-firebase-env.sh
```

This script will guide you through entering all required values.

## Common Issues and Solutions

### Error: "Missing required Firebase config: apiKey"

**Cause:** The client-side Firebase configuration is missing or incorrectly set.

**Solution:**
1. Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set in your `.env` file
2. Restart your development server after setting environment variables
3. Verify that `.env.local` is properly linked in the Hub app directory

### Error: "Cloud Firestore API has not been used in project"

**Cause:** Firestore database is not enabled in your Firebase project.

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database**
4. Click **Create database**
5. Choose production or test mode
6. Select a region and create the database

### Error: "Missing required Firebase environment variables"

**Cause:** Server-side Admin SDK configuration is missing.

**Solution:**
1. Ensure `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` are set
2. Verify the private key includes `\n` characters (not escaped)
3. Check that the service account has necessary permissions

## Verification

After setting up environment variables:

1. Restart your development server:
   ```bash
   pnpm dev --filter=@cenie/hub
   ```

2. Test the authentication API:
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'
   ```

3. Visit the signup page: http://localhost:3000/auth/signup

## Security Notes

- **Never commit** `.env` files to version control
- **Never expose** server-side variables (without `NEXT_PUBLIC_` prefix) to the client
- Keep your service account private key secure
- Use different Firebase projects for development and production
- Enable appropriate security rules in Firestore

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)