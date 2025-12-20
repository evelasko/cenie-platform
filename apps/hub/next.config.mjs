import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import createNextIntlPlugin from 'next-intl/plugin'
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
const withNextIntl = createNextIntlPlugin()
const withMDXPlugin = withMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const configWithPlugins = withNextIntl(withMDXPlugin(nextConfig))

export default withSentryConfig(configWithPlugins, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT || 'cenie-hub',

  // Auth token for source maps upload
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppress Sentry config logs
  silent: true,

  // Upload source maps on build
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})
