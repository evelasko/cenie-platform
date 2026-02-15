# Editorial Context

Load the key architectural context about the CENIE Editorial app before doing any work. This ensures consistent adherence to project conventions.

## Instructions

1. **Read key configuration files:**
   - `apps/editorial/next.config.mjs` — Build config, remote patterns, env vars
   - `apps/editorial/src/proxy.ts` — Middleware/proxy setup
   - `apps/editorial/src/app/providers.tsx` — Context providers
   - `apps/editorial/src/app/layout.tsx` — Root layout
   - `apps/editorial/package.json` — Dependencies
   - `apps/editorial/tsconfig.json` — TypeScript config

2. **Read convention files:**
   - `apps/editorial/src/lib/logger.ts` — Server-side logger setup
   - `apps/editorial/src/lib/logger-client.ts` — Client-side logger setup
   - `apps/editorial/src/lib/typography.ts` — Typography constants
   - `apps/editorial/src/lib/auth.ts` — Auth wrappers

3. **Check recent changes:**
   - Run `git log --oneline -10 -- apps/editorial/` to see recent commits

4. **Output a concise briefing** covering:
   - Current project state (what's been worked on recently)
   - Key conventions to follow:
     - **Logging**: Use `@/lib/logger` (server) or `@/lib/logger-client` (client), NEVER `console.log`
     - **Errors**: Use `@cenie/errors` for error handling, `@cenie/errors/react` for boundaries
     - **Auth**: Use `requireViewer`/`requireEditor`/`requireEditorialAdmin` from `@/lib/auth.ts`
     - **Styling**: Tailwind CSS v4, use `TYPOGRAPHY` constants from `@/lib/typography.ts`, use `cn()` from `@cenie/ui/lib`
     - **Images**: Use `next/image`, never raw `<img>` tags. TwicPics CDN for book covers.
     - **SEO**: Use `generateMetadata` / `metadata` exports, NEVER `next/head`
     - **Components**: Use `@cenie/ui` components (Button, Card, Badge, etc.)
     - **Dynamic imports**: Use `next/dynamic` for heavy components, always with loading fallback
   - Any warnings or gotchas for the current state of the codebase

## Important

- This skill is meant to be run at the START of a session, before any coding work
- Keep the output concise — it's a briefing, not a documentation dump
- Flag any uncommitted changes that might conflict with new work
