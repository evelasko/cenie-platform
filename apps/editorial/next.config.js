const path = require('path')
const dotenv = require('dotenv')

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@cenie/ui', '@cenie/design-system'],
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
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  },
}

module.exports = nextConfig
