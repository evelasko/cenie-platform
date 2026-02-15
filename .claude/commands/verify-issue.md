# Verify Issue

Run the verification checklist before marking work as complete. This is the quality gate that ensures code meets project standards.

## Instructions

### 1. Run automated checks (run in parallel where possible):

```bash
pnpm type-check
pnpm lint
pnpm build --filter=@cenie/editorial
```

### 2. Run convention checks on changed files:

Search for violations in files modified during this session:

- **No `console.log`**: Search changed files for `console.log` — must use `@cenie/logger` instead
- **No raw `<img>` tags**: Search changed files for `<img` — must use `next/image` instead
- **No `next/head`**: Search changed files for `next/head` — must use Metadata API instead
- **Uses logger correctly**: If server file, uses `@/lib/logger`. If client file, uses `@/lib/logger-client`
- **Uses error handling**: API routes use `@cenie/errors` for error classification
- **Has proper types**: No `any` types unless absolutely necessary

### 3. Check for common issues:

- **No hardcoded strings** that should be environment variables
- **No exposed secrets** in code
- **No unused imports** left behind
- **Proper file naming** following existing conventions

### 4. Report results:

For each check, report PASS or FAIL with details:

```
Type Check:     PASS/FAIL
Lint:           PASS/FAIL
Build:          PASS/FAIL
No console.log: PASS/FAIL (list files if found)
No raw <img>:   PASS/FAIL (list files if found)
No next/head:   PASS/FAIL (list files if found)
Logger usage:   PASS/FAIL
Error handling: PASS/FAIL
```

### 5. If the current issue has specific verification steps in its description (under "## Verification"), list those as manual checks for the user:

```
Manual checks required:
- [ ] Step from issue description
- [ ] Another step from issue description
```

## Important

- ALL automated checks must PASS before marking an issue as complete
- If any check fails, fix the issue before proceeding
- Do not skip manual verification steps — remind the user to check them
