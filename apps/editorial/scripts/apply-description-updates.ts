#!/usr/bin/env npx tsx
/**
 * Apply Description Updates (Manual Review Workflow)
 *
 * After running audit-descriptions.ts and manually editing the report JSON
 * to add markdown formatting (paragraph breaks, emphasis, lists), use this
 * script to apply the updates to the database.
 *
 * IMPORTANT: Only updates entries where you have edited the value.
 * Create an "updates" array in the report with { source, id, field, newValue }.
 * Or use --dry-run to preview without applying.
 *
 * Usage (from project root):
 *   pnpm exec tsx apps/editorial/scripts/apply-description-updates.ts audit-descriptions-report.json
 *   pnpm exec tsx apps/editorial/scripts/apply-description-updates.ts report.json --dry-run
 *
 * Report format for updates:
 *   Add an "updates" array to the JSON:
 *   "updates": [
 *     { "source": "catalog_volumes", "id": "uuid", "field": "description", "newValue": "..." },
 *     ...
 *   ]
 */

import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })
dotenv.config({ path: resolve(process.cwd(), '../../.env') })
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface UpdateItem {
  source: 'catalog_volumes' | 'books'
  id: string
  field: 'description' | 'excerpt'
  newValue: string
}

interface ReportWithUpdates {
  updates?: UpdateItem[]
  entries?: Array<{
    source: 'catalog_volumes' | 'books'
    id: string
    field: 'description' | 'excerpt'
    currentValue: string
    needsFormatting?: boolean
  }>
}

async function applyUpdate(item: UpdateItem, dryRun: boolean): Promise<{ ok: boolean; error?: string }> {
  if (dryRun) {
    console.log(`  [DRY-RUN] Would update ${item.source} ${item.id} ${item.field}`)
    return { ok: true }
  }

  if (item.source === 'catalog_volumes') {
    const col = item.field === 'description' ? 'description' : 'excerpt'
    const { error } = await supabase
      .from('catalog_volumes')
      .update({ [col]: item.newValue, updated_at: new Date().toISOString() })
      .eq('id', item.id)

    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  if (item.source === 'books') {
    const col = item.field === 'description' ? 'publication_description_es' : 'publication_excerpt_es'
    const { error } = await supabase.from('books').update({ [col]: item.newValue }).eq('id', item.id)

    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  return { ok: false, error: `Unknown source: ${item.source}` }
}

/**
 * Build updates from report: use explicit "updates" array if present,
 * otherwise allow "editedValue" on entries (user adds this when editing).
 */
function extractUpdates(report: ReportWithUpdates): UpdateItem[] {
  if (report.updates && report.updates.length > 0) {
    return report.updates
  }
  // Fallback: entries where user added "editedValue" (different from currentValue)
  const items: UpdateItem[] = []
  for (const e of report.entries || []) {
    const edited = (e as { editedValue?: string }).editedValue
    if (edited !== undefined && edited !== e.currentValue) {
      items.push({
        source: e.source,
        id: e.id,
        field: e.field,
        newValue: edited,
      })
    }
  }
  return items
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const fileArg = args.find((a) => !a.startsWith('--'))
  if (!fileArg) {
    console.error('Usage: tsx apply-description-updates.ts <report.json> [--dry-run]')
    process.exit(1)
  }

  const reportPath = resolve(process.cwd(), fileArg)
  let report: ReportWithUpdates
  try {
    report = JSON.parse(readFileSync(reportPath, 'utf-8'))
  } catch (err) {
    console.error(`Failed to read report: ${reportPath}`, err)
    process.exit(1)
  }

  const updates = extractUpdates(report)
  if (updates.length === 0) {
    console.log('No updates to apply.')
    console.log(
      'Add an "updates" array to the report, or add "editedValue" to entries you edited.'
    )
    process.exit(0)
  }

  console.log(`${dryRun ? '[DRY-RUN] ' : ''}Applying ${updates.length} update(s)...\n`)

  let ok = 0
  let fail = 0
  for (const item of updates) {
    const result = await applyUpdate(item, dryRun)
    if (result.ok) {
      ok++
      if (!dryRun) console.log(`  ✓ ${item.source} ${item.id} ${item.field}`)
    } else {
      fail++
      console.error(`  ✗ ${item.source} ${item.id} ${item.field}: ${result.error}`)
    }
  }

  console.log(`\nDone: ${ok} applied, ${fail} failed`)
  if (fail > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
