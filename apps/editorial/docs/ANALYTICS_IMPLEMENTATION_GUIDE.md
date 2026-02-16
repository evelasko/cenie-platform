# Analytics Implementation Guide

A walkthrough for completing the Analytics Strategy milestone, issue by issue.

---

## Prerequisites

These are already done:

- **CSS-43** — Firebase Analytics enabled in `providers.tsx`
- **CSS-56** — GDPR consent banner with Firebase Consent Mode
- **CSS-57** — Analytics tracking plan at `docs/analytics-plan.md`

The tracking plan is the **source of truth** for event names, properties, and priorities. Keep it open as you work through the rest.

---

## Phase 1: Foundation

### CSS-42 — Abstraction Layer

**Goal**: Replace the current re-exports in `src/lib/analytics.ts` with typed tracking functions that match the analytics plan exactly.

**What to do**:

1. Read `docs/analytics-plan.md` Section 5 (Event Schema) — this defines all 21 events
2. Open `src/lib/analytics.ts` (currently just re-exports Firebase hooks)
3. Build typed wrapper functions for each event (e.g., `trackBookView()`, `trackArticleScroll()`, `trackSearch()`)
4. Each wrapper calls `logEvent()` from `@cenie/firebase/analytics` with the correct event name and typed properties
5. Gate all Firebase dispatches on consent state — read from the `useConsent` hook (CSS-56). If consent is denied, skip silently
6. Export a `useEditorialAnalytics()` hook that provides all tracking functions

**Key decisions**:

- GA4 recommended events (`view_item`, `search`, `login`, `sign_up`, `select_content`, `select_item`) use their exact standard names — don't rename them
- Custom events use the `editorial_` prefix
- The existing Firebase hooks (`useUserTracking`, `usePageTracking`, etc.) can stay for backward compat but the new typed API is what CSS-44 will use

**Verify**: `pnpm build --filter=@cenie/editorial && pnpm type-check`

### CSS-45 — Google Search Console (parallel, no code dependency)

**Goal**: Verify the editorial domain in Google Search Console.

**What to do**:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property for `editorial.cenie.org`
3. Verify via DNS TXT record (or HTML meta tag in `layout.tsx`)
4. Confirm the sitemap is submitted and indexed

This is independent — do it whenever convenient.

### CSS-46 — Dashboard Stats (parallel, no code dependency)

**Goal**: Replace placeholder dashes in `/dashboard` with real DB counts.

**What to do**:

1. Fetch counts from Supabase (books, catalog volumes, contributors) server-side
2. Wire them into the stats page and sidebar layout
3. Add loading states

This is about database data, not analytics events. Independent of everything else.

---

## Phase 2: Event Implementation

Start this after CSS-42 is merged.

### CSS-44 — Custom Events (P0 first, then P1)

**Goal**: Wire all P0 and P1 events into pages and components.

**Work through P0 events first** (these deliver immediate business value):

1. **Book/upcoming views** — Add `view_item` to `/catalogo/[slug]` and `/proximamente/[slug]` page components (fire on mount)
2. **Article/news opens** — Add `select_content` to `/articulos/[slug]` and `/noticias/[slug]` (fire on mount)
3. **Catalog search** — Add `search` to the catalog search input (fire on submit)
4. **Book card clicks** — Add `select_item` to book card components in catalog list, featured, and homepage
5. **Sign-up funnel** — Add `editorial_signup_start` (page load), `sign_up` (success), `editorial_signup_error` (failure) to `/sign-up`; add `login` to `/sign-in`
6. **Article scroll depth** — Build an IntersectionObserver with sentinel divs at 25/50/75/100% of article body. Fire `editorial_article_scroll` at each milestone. Fire `editorial_article_complete` when 100% is reached AND the user has been on the page > 30 seconds

**Then P1 events**:

7. **Catalog browsing** — `editorial_catalog_filter`, `editorial_catalog_sort`, `editorial_catalog_paginate` on the catalog page controls
8. **News scroll** — Same observer pattern as articles but with 50%/100% thresholds only
9. **CTA clicks** — `editorial_cta_click` on key buttons across the site (reuse `useUserTracking().trackClick()` or the new typed function)
10. **Remaining** — `editorial_upcoming_interest`, `editorial_contact_submit`, `editorial_resource_view`, `editorial_dashboard_visit` on their respective pages

**Tips**:

- Use `useEffect` for page-load events, `onClick` for click events
- All consent gating is handled by the abstraction layer — don't add consent checks in components
- Check `docs/analytics-plan.md` Section 5 for exact property names and types for each event

**Verify**: `pnpm build --filter=@cenie/editorial && pnpm type-check`, then spot-check a few events in Firebase DebugView (`?debug_mode=true`)

### CSS-47 — UTM Tracking (parallel with CSS-44, after CSS-42)

**Goal**: Capture UTM parameters and attach them to conversion events.

**What to do**:

1. Build `captureUtmParams()` — reads UTMs from the URL, writes to sessionStorage
2. Build `getStoredUtmParams()` — reads from sessionStorage
3. Call capture once on app mount
4. In the abstraction layer, `trackSignUp()` and `trackSignUpStart()` automatically merge stored UTMs

**Important**: Firebase already auto-captures UTMs for general attribution. This is only for preserving attribution on sign-up events when the user navigates away from the landing page before registering.

---

## Phase 3: Validation

Start this after CSS-44 and CSS-47 are merged.

### CSS-59 — End-to-End Validation

**Goal**: Systematically verify every event fires correctly.

**What to do**:

1. Enable Firebase debug mode (add `?debug_mode=true` to URL or use the [Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension)
2. Open Firebase Console → DebugView
3. Walk through each journey and check events appear with correct names and properties:
   - Homepage → catalog list → book detail
   - Catalog search, filter, sort, paginate
   - Article read with full scroll (wait 30+ seconds for completion event)
   - News read with scroll
   - Upcoming book page + CTA
   - Sign-up (success and failure)
   - Sign-in
   - CTA clicks, contact form, resource pages, dashboard
4. Repeat the key journeys with consent **denied** — verify zero Firebase events fire
5. Check UTMs: visit with `?utm_source=test&utm_medium=test` → sign up → verify UTM params on the event

**Document results** as a checklist comment on the issue. File bugs as separate issues if anything fails.

---

## Phase 4: Make Data Actionable

### CSS-60 — Firebase Console Configuration

**Goal**: Set up funnels, audiences, and explorations so the data tells a story.

**What to do** (all in Firebase Console, no code):

1. **Funnels**: Create three — sign-up funnel, content discovery funnel, article engagement funnel (exact event sequences are in the issue)
2. **Audiences**: Create four — engaged readers, active browsers, registered users, bounced visitors
3. **Custom dimensions**: Register `content_type`, `item_category`, `scroll_depth`
4. **Explorations** (optional): Content performance table, search terms frequency

### CSS-61 — Privacy Policy Content

**Goal**: Replace the `/privacidad` stub with real policy content.

**What to do**:

1. Use `/terminos` page as a styling template
2. Write the policy in Spanish covering: data controller, what's collected (per provider), legal basis, retention, user rights, cookie details, how to withdraw consent
3. Reference `docs/analytics-plan.md` Section 6 for what each provider collects

This can be done at any point — it's independent but important since the consent banner links to it.

---

## Phase 5: Polish (Low Priority)

### CSS-58 — P2 Events

**Goal**: Add remaining low-priority events after everything else is stable.

- `editorial_dashboard_action` on CRUD operations
- `editorial_book_share` on share button (if it exists)
- Evaluate whether `usePerformanceTracking` and `useErrorTracking` hooks are redundant with Vercel Speed Insights and Sentry

---

## Recommended Order

```
Phase 1 (parallel):  CSS-42  +  CSS-45  +  CSS-46
Phase 2 (parallel):  CSS-44  +  CSS-47
Phase 3:             CSS-59
Phase 4 (parallel):  CSS-60  +  CSS-61
Phase 5:             CSS-58
```

CSS-42 is the critical path — everything in Phase 2+ depends on it. CSS-45, CSS-46, and CSS-61 are independent and can be done whenever there's a break between phases.
