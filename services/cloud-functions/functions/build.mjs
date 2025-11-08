#!/usr/bin/env node

/**
 * Build script for Firebase Cloud Functions
 * Bundles TypeScript source code and workspace dependencies using esbuild
 */

import * as esbuild from 'esbuild'
import { readdir } from 'fs/promises'
import { join } from 'path'

const isWatch = process.argv.includes('--watch')

/**
 * Get all TypeScript files from src directory (non-recursive for top-level functions)
 */
async function getEntryPoints() {
  const srcDir = 'src'
  const files = await readdir(srcDir)
  const tsFiles = files.filter((file) => file.endsWith('.ts'))

  if (tsFiles.length === 0) {
    // If no files at root, return index.ts as default
    return ['src/index.ts']
  }

  return tsFiles.map((file) => join(srcDir, file))
}

/**
 * esbuild configuration
 */
const buildConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  outdir: 'lib',
  sourcemap: true,
  minify: false, // Keep readable for debugging
  logLevel: 'info',

  // External packages that should not be bundled
  // Firebase packages are provided by the Cloud Functions runtime
  external: ['firebase-admin', 'firebase-functions', 'firebase-functions/*'],

  // Bundle everything else including workspace packages
  packages: 'bundle',

  // Preserve console output format
  logOverride: {
    'unsupported-require-call': 'silent',
  },
}

async function build() {
  try {
    console.log('🔨 Building Cloud Functions...')

    if (isWatch) {
      console.log('👀 Watch mode enabled')
      const context = await esbuild.context(buildConfig)
      await context.watch()
      console.log('✅ Watching for changes...')
    } else {
      await esbuild.build(buildConfig)
      console.log('✅ Build complete!')
    }
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

build()
