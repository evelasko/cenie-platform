const path = require('path')
const dotenv = require('dotenv')

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@cenie/ui', '@cenie/design-system', '@cenie/firebase', '@cenie/supabase'],
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
  },
}

module.exports = nextConfig
