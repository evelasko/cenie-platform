# @cenie/firebase

Firebase integration package for the CENIE platform, providing authentication and analytics capabilities across all applications.

## Features

- 🔐 **Authentication**: Complete Firebase Auth integration with React context
- 📊 **Analytics**: Firebase Analytics with automatic app context and custom dimensions
- 🏗️ **SSR Safe**: Proper server-side rendering support
- 🎯 **App-Aware**: Automatic app name tagging for multi-app analytics
- 📝 **TypeScript**: Full type safety with custom interfaces
- 🪝 **React Hooks**: Easy-to-use React hooks for all functionality

## Installation

This package is already installed as part of the CENIE monorepo. Each app that uses it should include it in their dependencies:

```json
{
  "dependencies": {
    "@cenie/firebase": "workspace:*"
  }
}
```

## Environment Variables

Each app requires its own `.env.local` file with Firebase configuration:

```bash
# App identification
NEXT_PUBLIC_APP_NAME=hub  # or editorial, academy, agency

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Server-side Firebase Admin (for server components/API routes)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----"
```

## Usage

### 1. Setup Providers

Add the providers to your app's `layout.tsx`:

```tsx
// apps/{app-name}/src/app/providers.tsx
'use client'

import { AuthProvider } from '@cenie/firebase/auth'
import { AnalyticsProvider } from '@cenie/firebase/analytics'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnalyticsProvider enableDebug={process.env.NODE_ENV === 'development'}>
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  )
}
```

```tsx
// apps/{app-name}/src/app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 2. Authentication Usage

```tsx
'use client'

import { useAuthContext } from '@cenie/firebase/auth'

export function MyComponent() {
  const { user, loading, error } = useAuthContext()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>Please sign in</div>

  return <div>Welcome, {user.displayName}!</div>
}
```

### 3. Analytics Usage

#### Basic Analytics

```tsx
'use client'

import { useAnalytics } from '@cenie/firebase/analytics'

export function MyComponent() {
  const { logEvent, logUserAction, isReady, appName } = useAnalytics()

  const handleButtonClick = async () => {
    await logEvent('button_clicked', {
      button_type: 'primary',
      page_section: 'hero',
    })
  }

  const handleFormSubmit = async () => {
    await logUserAction('form_submit', 'engagement', 'newsletter_signup')
  }

  return (
    <div>
      <p>
        Analytics ready for {appName}: {isReady ? '✅' : '❌'}
      </p>
      <button onClick={handleButtonClick}>Track Click</button>
      <button onClick={handleFormSubmit}>Track Form Submit</button>
    </div>
  )
}
```

#### Automatic Page Tracking

```tsx
'use client'

import { usePageTracking } from '@cenie/firebase/analytics'

export function MyApp({ children }: { children: React.ReactNode }) {
  // Enable automatic page view tracking
  usePageTracking(true, (pathname) => `Custom Title - ${pathname}`)

  return <div>{children}</div>
}
```

#### Advanced User Tracking

```tsx
'use client'

import { useUserTracking, useErrorTracking } from '@cenie/firebase/analytics'

export function MyComponent() {
  const { trackClick, trackFormSubmission, trackSearch } = useUserTracking()
  const { trackError } = useErrorTracking()

  const handleClick = () => {
    trackClick('cta-button', 'button', {
      campaign: 'summer-2024',
      position: 'header',
    })
  }

  const handleSearch = (query: string) => {
    trackSearch(query, 'products', 42)
  }

  const handleError = (error: Error) => {
    trackError(error, 'checkout-process', 'high')
  }

  return (
    <div>
      <button onClick={handleClick}>Call to Action</button>
      {/* Other components */}
    </div>
  )
}
```

#### Server-Side Usage

```tsx
// app/api/some-endpoint/route.ts
import { logEvent } from '@cenie/firebase/analytics'

export async function POST(request: Request) {
  try {
    // Your API logic here

    // Log server-side event (will fallback to console.log)
    await logEvent('api_call', {
      endpoint: '/api/some-endpoint',
      method: 'POST',
      success: true,
    })

    return Response.json({ success: true })
  } catch (error) {
    await logEvent('api_error', {
      endpoint: '/api/some-endpoint',
      error_message: error.message,
    })

    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Analytics Events

All analytics events automatically include:

- `app_name`: The current app name (hub, editorial, academy, agency)
- Timestamp and session information
- User ID (if authenticated)

### Custom Dimensions in Google Analytics

Set up these custom dimensions in your Google Analytics 4 property:

- `app_name` - To filter and segment data by application
- `user_type` - To differentiate between authenticated/anonymous users
- `error_context` - To categorize error events
- `form_name` - To track form interactions
- `search_category` - To categorize search events

### Recommended Events

The package provides helper functions for common events:

- **Page Views**: Automatic with `usePageTracking`
- **User Actions**: `logUserAction(action, category, label, value)`
- **Errors**: `logError(error, context)` and `trackError(error, context, severity)`
- **Form Interactions**: `trackFormSubmission(formName, success, params)`
- **Search Events**: `trackSearch(term, category, resultCount)`
- **File Downloads**: `trackDownload(fileName, fileType, fileSize)`
- **API Calls**: Custom events for API interactions
- **Performance**: `trackTiming(name, value, category)`

## TypeScript Support

The package provides full TypeScript support with interfaces for:

```tsx
interface AnalyticsEventParams {
  [key: string]: string | number | boolean
}

interface CustomEventParams extends AnalyticsEventParams {
  app_name: string
}

type AnalyticsSeverity = 'low' | 'medium' | 'high'
```

## Development and Debugging

- Set `enableDebug: true` in `AnalyticsProvider` for verbose logging
- Events are automatically logged to console in development mode
- Server-side events fallback to console logging when Firebase is not available
- Analytics gracefully handles SSR and hydration

## Architecture

```tree
packages/firebase/
├── src/
│   ├── analytics.ts          # Core analytics functions
│   ├── analytics/
│   │   ├── context.tsx       # React context and provider
│   │   ├── hooks.tsx         # React hooks for easy usage
│   │   └── index.ts          # Analytics exports
│   ├── auth/                 # Authentication functionality
│   ├── client.ts             # Firebase client initialization
│   ├── server.ts             # Firebase Admin SDK
│   ├── types.ts              # TypeScript interfaces
│   └── index.ts              # Main exports
└── package.json
```

## Performance

- Analytics initializes lazily on the client side only
- Events are queued until Firebase Analytics is ready
- Minimal bundle impact with tree-shaking support
- Graceful fallbacks for server-side rendering
