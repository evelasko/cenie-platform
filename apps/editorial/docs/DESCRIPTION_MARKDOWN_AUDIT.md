# Description Markdown Audit — Manual Review Process

After the markdown editor and renderer are in place, existing plain-text descriptions should be reviewed and optionally enhanced with markdown formatting where it adds value.

## Scope

- **Catalog volumes**: `description`, `excerpt` fields
- **Books** (workspace): `publication_description_es`, `publication_excerpt_es` fields

## Requirements

- Audit existing descriptions that could benefit from markdown formatting
- Add paragraph breaks, emphasis, and structure to long descriptions
- Ensure no data is lost in the process
- Manual review only — do not auto-generate markdown

---

## Process Overview

```
1. Run audit script     → 2. Review report      → 3. Edit in dashboard or JSON
                              ↓
4. Spot-check on public pages  →  5. Apply bulk updates (optional)
```

---

## Step 1: Run the Audit Script

From the **project root**:

```bash
pnpm exec tsx apps/editorial/scripts/audit-descriptions.ts
```

Optional: specify output path:

```bash
pnpm exec tsx apps/editorial/scripts/audit-descriptions.ts --output ./my-audit.json
```

**Output:**

- `audit-descriptions-report.json` (or your path) with:
  - `summary`: total counts, items needing formatting
  - `entries`: all descriptions/excerpts
  - `needsFormatting`: subset that could benefit from formatting

**Criteria for "needs formatting":**

- Length ≥ 150 characters
- No existing markdown-like structure (paragraph breaks, `**bold**`, `# headings`, lists)
- Long single block of text

---

## Step 2: Review the Report

Open the JSON report and review:

1. **`needsFormatting`** — prioritize these
2. **`entries`** — full list for reference
3. Note `editUrl` and `publicUrl` for each item

---

## Step 3: Add Markdown Formatting

Two options:

### Option A: Edit in Dashboard (Recommended)

1. Use the `editUrl` from the report (e.g. `/dashboard/catalog/{id}`)
2. Open the catalog volume or book in the editorial dashboard
3. Edit the description/excerpt in the MarkdownEditor
4. Add:
   - **Paragraph breaks** — blank lines between paragraphs
   - **Emphasis** — `*italic*` or `**bold**` for key terms
   - **Lists** — `- item` or `1. item` for enumerations
5. Save

### Option B: Bulk Edit via JSON

1. Copy the report JSON
2. For each entry you want to update, add an `editedValue` field with the markdown-enhanced text
3. Or create an `updates` array:

```json
{
  "updates": [
    {
      "source": "catalog_volumes",
      "id": "uuid-here",
      "field": "description",
      "newValue": "First paragraph.\n\nSecond paragraph with **emphasis**."
    }
  ]
}
```

4. Run the apply script (Step 5)

---

## Step 4: Spot-Check on Public Pages

After editing:

1. For **catalog volumes**: visit `https://cenie.org/catalogo/{slug}` (or your editorial domain)
2. Verify the description/excerpt renders correctly with:
   - Paragraph breaks
   - Emphasis (bold/italic)
   - Lists (if added)
3. Spot-check at least 5 updated descriptions

---

## Step 5: Apply Bulk Updates (Optional)

If you used Option B (JSON edits), apply the updates:

```bash
# Preview changes (no DB writes)
pnpm exec tsx apps/editorial/scripts/apply-description-updates.ts audit-descriptions-report.json --dry-run

# Apply updates
pnpm exec tsx apps/editorial/scripts/apply-description-updates.ts audit-descriptions-report.json
```

**Report format for updates:**

- **Explicit updates**: Add an `updates` array (see Option B above)
- **Edited entries**: Add `editedValue` to entries you edited (must differ from `currentValue`)

---

## Markdown Guidelines

| Use case            | Syntax      | Example                    |
| ------------------- | ----------- | -------------------------- |
| Paragraph break     | Blank line  | `Para 1.\n\nPara 2.`       |
| Bold                | `**text**`  | `**término clave**`        |
| Italic              | `*text*`    | `*énfasis*`                |
| Unordered list      | `- item`    | `- Punto uno\n- Punto dos` |
| Ordered list        | `1. item`   | `1. Primero\n2. Segundo`   |
| Heading (if needed) | `## Título` | `## Sección`               |

**Do not:**

- Rewrite content — only add formatting
- Auto-generate markdown — manual review only
- Remove or alter existing text — preserve all data

---

## Verification Checklist

- [ ] Audit script runs successfully
- [ ] Report identifies items needing formatting
- [ ] At least 5 descriptions updated with markdown
- [ ] Spot-check: 5+ updated descriptions render correctly on public pages
- [ ] No data lost (original content preserved, only formatting added)
