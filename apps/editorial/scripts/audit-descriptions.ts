#!/usr/bin/env npx tsx
/**
 * Audit Description Markdown Formatting
 *
 * Queries catalog_volumes and books for existing descriptions/excerpts,
 * identifies entries that could benefit from markdown formatting (paragraph breaks,
 * emphasis, lists), and outputs a review file for manual enhancement.
 *
 * Usage (from project root):
 *   pnpm exec tsx apps/editorial/scripts/audit-descriptions.ts
 *   pnpm exec tsx apps/editorial/scripts/audit-descriptions.ts --output ./audit-report.json
 *
 * Output:
 *   - audit-report.json: Full audit data for manual review/editing
 *   - Console summary of items needing attention
 */

import dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env from project root (works when run from apps/editorial or repo root)
dotenv.config({ path: resolve(process.cwd(), '.env') })
dotenv.config({ path: resolve(process.cwd(), '../../.env') })
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/** Minimum length (chars) to consider for formatting - short descriptions are fine as-is */
const MIN_LENGTH_FOR_FORMATTING = 150

/** Basic markdown patterns - if present, may already have some formatting */
const MARKDOWN_PATTERNS = /\n\n|\*\*[^*]+\*\*|\*[^*]+\*|^#{1,6}\s|^- |^\d+\./m

interface AuditEntry {
  source: 'catalog_volumes' | 'books'
  id: string
  slug?: string
  title: string
  field: 'description' | 'excerpt'
  currentValue: string
  length: number
  needsFormatting: boolean
  reason: string
  publicUrl?: string
  editUrl?: string
}

function couldBenefitFromFormatting(text: string): { needs: boolean; reason: string } {
  if (!text || text.trim().length === 0) {
    return { needs: false, reason: 'empty' }
  }
  const len = text.length
  if (len < MIN_LENGTH_FOR_FORMATTING) {
    return { needs: false, reason: `short (${len} chars)` }
  }
  const hasMarkdown = MARKDOWN_PATTERNS.test(text)
  if (hasMarkdown) {
    return { needs: false, reason: 'already has markdown-like structure' }
  }
  const hasParagraphBreaks = text.includes('\n\n')
  const isSingleBlock = !text.includes('\n') || text.split('\n').every((l) => l.trim().length > 0)
  if (isSingleBlock && len >= MIN_LENGTH_FOR_FORMATTING) {
    return { needs: true, reason: 'long single block - add paragraph breaks' }
  }
  if (!hasParagraphBreaks && len >= MIN_LENGTH_FOR_FORMATTING) {
    return { needs: true, reason: 'long text without paragraph breaks' }
  }
  return { needs: false, reason: 'ok' }
}

async function auditCatalogVolumes(): Promise<AuditEntry[]> {
  const { data, error } = await supabase
    .from('catalog_volumes')
    .select('id, slug, title, description, excerpt')
    .not('description', 'is', null)

  if (error) {
    throw new Error(`Catalog volumes query failed: ${error.message}`)
  }

  const entries: AuditEntry[] = []
  for (const row of data || []) {
    const desc = row.description as string
    if (desc) {
      const { needs, reason } = couldBenefitFromFormatting(desc)
      entries.push({
        source: 'catalog_volumes',
        id: row.id,
        slug: row.slug ?? undefined,
        title: row.title ?? '(no title)',
        field: 'description',
        currentValue: desc,
        length: desc.length,
        needsFormatting: needs,
        reason,
        publicUrl: row.slug ? `https://cenie.org/catalogo/${row.slug}` : undefined,
        editUrl: `/dashboard/catalog/${row.id}`,
      })
    }
    const excerpt = row.excerpt as string | null
    if (excerpt && excerpt.trim()) {
      const { needs, reason } = couldBenefitFromFormatting(excerpt)
      entries.push({
        source: 'catalog_volumes',
        id: row.id,
        slug: row.slug ?? undefined,
        title: row.title ?? '(no title)',
        field: 'excerpt',
        currentValue: excerpt,
        length: excerpt.length,
        needsFormatting: needs,
        reason,
        publicUrl: row.slug ? `https://cenie.org/catalogo/${row.slug}` : undefined,
        editUrl: `/dashboard/catalog/${row.id}`,
      })
    }
  }
  return entries
}

async function auditBooks(): Promise<AuditEntry[]> {
  const { data, error } = await supabase
    .from('books')
    .select('id, title, publication_description_es, publication_excerpt_es')

  if (error) {
    throw new Error(`Books query failed: ${error.message}`)
  }

  const entries: AuditEntry[] = []
  for (const row of data || []) {
    const desc = row.publication_description_es as string | null
    if (desc && desc.trim()) {
      const { needs, reason } = couldBenefitFromFormatting(desc)
      entries.push({
        source: 'books',
        id: row.id,
        title: row.title ?? '(no title)',
        field: 'description',
        currentValue: desc,
        length: desc.length,
        needsFormatting: needs,
        reason,
        editUrl: `/dashboard/books/${row.id}/prepare`,
      })
    }
    const excerpt = row.publication_excerpt_es as string | null
    if (excerpt && excerpt.trim()) {
      const { needs, reason } = couldBenefitFromFormatting(excerpt)
      entries.push({
        source: 'books',
        id: row.id,
        title: row.title ?? '(no title)',
        field: 'excerpt',
        currentValue: excerpt,
        length: excerpt.length,
        needsFormatting: needs,
        reason,
        editUrl: `/dashboard/books/${row.id}/prepare`,
      })
    }
  }
  return entries
}

async function main() {
  const outputArg = process.argv.indexOf('--output')
  const outputPath =
    outputArg >= 0 && process.argv[outputArg + 1]
      ? resolve(process.cwd(), process.argv[outputArg + 1])
      : resolve(process.cwd(), 'audit-descriptions-report.json')

  console.log('Auditing descriptions and excerpts...\n')

  const [catalogEntries, bookEntries] = await Promise.all([
    auditCatalogVolumes(),
    auditBooks(),
  ])

  const all = [...catalogEntries, ...bookEntries]
  const needsFormatting = all.filter((e) => e.needsFormatting)

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: all.length,
      needsFormatting: needsFormatting.length,
      catalogVolumes: catalogEntries.length,
      books: bookEntries.length,
    },
    entries: all,
    needsFormatting,
  }

  writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8')

  console.log('Summary')
  console.log('-------')
  console.log(`Total entries: ${all.length}`)
  console.log(`Catalog volumes: ${catalogEntries.length}`)
  console.log(`Books: ${bookEntries.length}`)
  console.log(`Needs formatting: ${needsFormatting.length}`)
  console.log(`\nReport written to: ${outputPath}`)

  if (needsFormatting.length > 0) {
    console.log('\nItems to review (edit in dashboard, add paragraph breaks / emphasis):')
    for (const e of needsFormatting.slice(0, 15)) {
      console.log(`  - [${e.source}] ${e.title} (${e.field}, ${e.length} chars)`)
      console.log(`    Reason: ${e.reason}`)
      if (e.editUrl) console.log(`    Edit: ${e.editUrl}`)
    }
    if (needsFormatting.length > 15) {
      console.log(`  ... and ${needsFormatting.length - 15} more (see report)`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
