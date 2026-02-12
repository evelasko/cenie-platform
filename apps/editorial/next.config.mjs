import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import withMDX from '@next/mdx'
import { withSentryConfig } from '@sentry/nextjs'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from root .env file
config({ path: resolve(__dirname, '../../.env') })

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['require-in-the-middle'],
  reactStrictMode: true,
  transpilePackages: [
    '@cenie/ui',
    '@cenie/firebase',
    '@cenie/supabase',
    '@cenie/logger',
    '@cenie/errors',
    '@cenie/email',
    '@cenie/sentry',
    '@cenie/auth-server',
    '@cenie/auth-client',
    '@cenie/oauth-handlers',
    '@cenie/auth-utils',
  ],
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  webpack: (config, { isServer }) => {
    // Ensure proper resolution of conditional exports
    config.resolve.conditionNames = isServer
      ? ['node', 'import', 'require', 'default']
      : ['browser', 'module', 'import', 'require', 'default']

    return config
  },
  // Mark server-only packages as external (not to be bundled)
  serverExternalPackages: ['firebase-admin'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
      },
      {
        protocol: 'https',
        hostname: 'cenie.twic.pics',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  // MDX support
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false, // Use the JS-based MDX compiler for better compatibility
  },
  // Explicitly pass server-side environment variables
  // This ensures they're available in both Webpack and Turbopack modes
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_CLOUD_TRANSLATION_API_KEY: process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    TWICPICS_API_KEY: process.env.TWICPICS_API_KEY,
  },
}

const withMDXPlugin = withMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const sentryNextConfig = withSentryConfig(withMDXPlugin(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT || 'cenie-editorial',

  // Auth token for source maps upload
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppress Sentry config logs
  silent: true,

  // Upload source maps on build
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})

export default sentryNextConfig
