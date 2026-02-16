# Editorial App — Analytics Tracking Plan

> **Status**: Draft
> **Issue**: CSS-57
> **Last updated**: 2026-02-16
> **Related**: CSS-43 (Firebase Analytics setup), CSS-56 (Consent banner)

---

## 1. Business Metrics

Core KPIs tracked across the editorial platform. Most are provided automatically by existing tools.

| KPI                                        | Definition                            | Provider              | Custom work needed?                               |
| ------------------------------------------ | ------------------------------------- | --------------------- | ------------------------------------------------- |
| Page views                                 | Total page loads across all routes    | Vercel Analytics      | No — automatic                                    |
| Unique visitors                            | Distinct visitors per day/week/month  | Vercel Analytics      | No — automatic                                    |
| Session duration                           | Average time spent per visit          | Firebase Analytics    | No — automatic with `session_start`               |
| Bounce rate                                | Single-page sessions / total sessions | Vercel Analytics      | No — automatic                                    |
| Return visitor rate                        | Returning vs. new visitors            | Firebase Analytics    | No — automatic via `first_open` / `session_start` |
| Core Web Vitals (LCP, FID, CLS, INP, TTFB) | Performance scores                    | Vercel Speed Insights | No — automatic                                    |
| Error rate                                 | Unhandled exceptions per session      | Sentry                | No — automatic                                    |

**Baseline expectations** (first 90 days post-launch):

- Target bounce rate: < 60% on content pages, < 40% on catalog detail pages
- Target session duration: > 2 minutes for article readers
- Target return visitor rate: > 20% within first quarter

**No custom implementation required for this section.** All business metrics are covered by existing automatic tracking from Vercel Analytics, Speed Insights, and Firebase's built-in session events.

---

## 2. Content Engagement Metrics

These require custom Firebase events to measure how users interact with editorial content.

### Book detail views (`/catalogo/[slug]`)

Track when a user views a book's detail page, including which book and how they arrived.

| Event                         | Properties                                                                              | Trigger                                |
| ----------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------- |
| `view_item` (GA4 recommended) | `item_id: string`, `item_name: string`, `item_category: string`, `content_type: "book"` | Page load on `/catalogo/[slug]`        |
| `editorial_book_share`        | `book_slug: string`, `share_method: string`                                             | Click on share button (if implemented) |

### Catalog browsing (`/catalogo`)

Track how users navigate and filter the catalog.

| Event                        | Properties                                        | Trigger                                     |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------- |
| `search` (GA4 recommended)   | `search_term: string`                             | Search input submission on catalog          |
| `editorial_catalog_filter`   | `filter_type: string`, `filter_value: string`     | Filter selection (category, language, etc.) |
| `editorial_catalog_sort`     | `sort_field: string`, `sort_direction: string`    | Sort option change                          |
| `editorial_catalog_paginate` | `page_number: number`, `results_per_page: number` | Pagination click                            |

### Article engagement (`/articulos/[slug]`)

Track reading depth and completion to understand content quality.

| Event                              | Properties                                     | Trigger                                     |
| ---------------------------------- | ---------------------------------------------- | ------------------------------------------- |
| `select_content` (GA4 recommended) | `content_type: "article"`, `item_id: string`   | Page load on `/articulos/[slug]`            |
| `editorial_article_scroll`         | `article_slug: string`, `scroll_depth: number` | Scroll milestones: 25%, 50%, 75%, 100%      |
| `editorial_article_complete`       | `article_slug: string`, `time_on_page: number` | 100% scroll depth reached AND > 30s on page |

**Implementation note**: Use an `IntersectionObserver` on sentinel elements placed at 25/50/75/100% of article body. Pair with a timer to distinguish skimmers from readers.

### News engagement (`/noticias/[slug]`)

Same pattern as articles — news items are shorter, so thresholds differ.

| Event                              | Properties                                  | Trigger                         |
| ---------------------------------- | ------------------------------------------- | ------------------------------- |
| `select_content` (GA4 recommended) | `content_type: "news"`, `item_id: string`   | Page load on `/noticias/[slug]` |
| `editorial_news_scroll`            | `news_slug: string`, `scroll_depth: number` | Scroll milestones: 50%, 100%    |

### Upcoming books (`/proximamente/[slug]`)

Measure interest in pre-publication titles.

| Event                         | Properties                                                              | Trigger                                            |
| ----------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| `view_item` (GA4 recommended) | `item_id: string`, `item_name: string`, `content_type: "upcoming_book"` | Page load on `/proximamente/[slug]`                |
| `editorial_upcoming_interest` | `book_slug: string`, `action: string`                                   | CTA interaction (e.g., "notify me", external link) |

### Content discovery paths

Tracked via Firebase's automatic session/screen flow plus the `select_content` and `view_item` events above. No additional custom events needed — funnel analysis in Firebase console uses the existing event stream.

---

## 3. Conversion Metrics

### Sign-up funnel

```
Visitor → /sign-up page → Completed registration → Dashboard visit
```

| Event                       | Properties                             | Trigger                                        |
| --------------------------- | -------------------------------------- | ---------------------------------------------- |
| `editorial_signup_start`    | `referrer_path: string`                | Page load on `/sign-up`                        |
| `sign_up` (GA4 recommended) | `method: string`                       | Successful registration (email, Google, Apple) |
| `login` (GA4 recommended)   | `method: string`                       | Successful sign-in on `/sign-in`               |
| `editorial_signup_error`    | `error_type: string`, `method: string` | Failed registration attempt                    |

### Dashboard adoption

Track whether registered users engage with editorial tools.

| Event                        | Properties                                                   | Trigger                                                        |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| `editorial_dashboard_visit`  | `section: string`                                            | Page load on any `/dashboard/*` route                          |
| `editorial_dashboard_action` | `action: string`, `entity_type: string`, `entity_id: string` | CRUD operations (create/edit book, catalog entry, contributor) |

### Book discovery-to-detail

Measure catalog list → detail click-through rate.

| Event                           | Properties                                                           | Trigger                                  |
| ------------------------------- | -------------------------------------------------------------------- | ---------------------------------------- |
| `select_item` (GA4 recommended) | `item_id: string`, `item_name: string`, `item_list_name: "catalog"`  | Click on book card from `/catalogo` list |
| `select_item` (GA4 recommended) | `item_id: string`, `item_name: string`, `item_list_name: "featured"` | Click on book card from `/destacados`    |
| `select_item` (GA4 recommended) | `item_id: string`, `item_name: string`, `item_list_name: "homepage"` | Click on book card from homepage         |

CTR is calculated as: `select_item` count / `view_item_list` impressions (if list impression tracking is added).

### Contact and resource engagement

| Event                      | Properties                                 | Trigger                                         |
| -------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `editorial_contact_submit` | `form_type: string`, `successful: boolean` | Contact form submission on `/nosotros/contacto` |
| `editorial_resource_view`  | `resource_type: string`                    | Page load on `/recursos/*` pages                |

### CTA performance

| Event                 | Properties                                                                        | Trigger                              |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------------------ |
| `editorial_cta_click` | `cta_id: string`, `cta_text: string`, `page_path: string`, `cta_position: string` | Click on any tracked CTA button/link |

**Implementation note**: The existing `useUserTracking().trackClick()` hook can be reused for CTA tracking — it already logs `element_id`, `element_type`, and accepts `additionalParams`.

---

## 4. Acquisition Metrics

### Traffic sources

Vercel Analytics automatically categorizes traffic by source (direct, referral, search, social). No custom work needed.

### UTM parameter conventions

All marketing links should use these UTM parameters consistently:

| Parameter      | Convention                  | Examples                                            |
| -------------- | --------------------------- | --------------------------------------------------- |
| `utm_source`   | Platform or publisher name  | `twitter`, `newsletter`, `partner_university_x`     |
| `utm_medium`   | Marketing channel type      | `social`, `email`, `referral`, `cpc`                |
| `utm_campaign` | Campaign identifier         | `launch_2026`, `spring_catalog`, `author_spotlight` |
| `utm_content`  | (Optional) Creative variant | `banner_a`, `text_link`, `footer_cta`               |
| `utm_term`     | (Optional) Paid keyword     | `academic_publishing`, `spanish_books`              |

**Implementation**: Capture UTM params on first page load, store in sessionStorage, and attach to `sign_up` and `editorial_signup_start` events as additional properties. Firebase automatically captures `campaign`, `source`, and `medium` from URL parameters.

### Google Search Console

External integration — no code needed. Requires DNS verification and property setup in Google Search Console. Provides:

- Search impressions and clicks
- Average position per query
- Index coverage
- Core Web Vitals (field data)

### Referral source tracking

Firebase Analytics automatically captures `traffic_source` with `source`, `medium`, and `campaign` dimensions from the first session. Vercel Analytics provides a referrer breakdown. No custom events needed.

---

## 5. Event Schema & Naming Convention

### Rules

1. **GA4 recommended events first**: Use standard names (`view_item`, `search`, `login`, `sign_up`, `select_content`, `select_item`) where they semantically fit. These unlock built-in GA4 reports.
2. **Custom event prefix**: `editorial_` for all non-standard events. Avoids Firebase reserved prefixes (`firebase_`, `google_`, `ga_`).
3. **Format**: `editorial_{category}_{action}` — lowercase, underscores only.
4. **Constraints**: Max 40 characters, letters/numbers/underscores, must start with a letter.
5. **Property naming**: `snake_case`, consistent types across events.

### Full Event Catalog

| Event name                    | Properties                                                                                                 | Trigger component / page                    | Provider | Consent required | Priority |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------- | ---------------- | -------- |
| `view_item`                   | `item_id: string`, `item_name: string`, `item_category: string`, `content_type: "book" \| "upcoming_book"` | `/catalogo/[slug]`, `/proximamente/[slug]`  | Firebase | Yes              | P0       |
| `select_content`              | `content_type: "article" \| "news"`, `item_id: string`                                                     | `/articulos/[slug]`, `/noticias/[slug]`     | Firebase | Yes              | P0       |
| `select_item`                 | `item_id: string`, `item_name: string`, `item_list_name: string`                                           | Catalog list, featured, homepage book cards | Firebase | Yes              | P0       |
| `search`                      | `search_term: string`                                                                                      | Catalog search input                        | Firebase | Yes              | P0       |
| `sign_up`                     | `method: string`                                                                                           | `/sign-up` on success                       | Firebase | Yes              | P0       |
| `login`                       | `method: string`                                                                                           | `/sign-in` on success                       | Firebase | Yes              | P0       |
| `editorial_signup_start`      | `referrer_path: string`                                                                                    | `/sign-up` page load                        | Firebase | Yes              | P0       |
| `editorial_signup_error`      | `error_type: string`, `method: string`                                                                     | `/sign-up` on failure                       | Firebase | Yes              | P0       |
| `editorial_article_scroll`    | `article_slug: string`, `scroll_depth: number`                                                             | `/articulos/[slug]` scroll observer         | Firebase | Yes              | P0       |
| `editorial_article_complete`  | `article_slug: string`, `time_on_page: number`                                                             | `/articulos/[slug]` 100% scroll + timer     | Firebase | Yes              | P0       |
| `editorial_catalog_filter`    | `filter_type: string`, `filter_value: string`                                                              | `/catalogo` filter controls                 | Firebase | Yes              | P1       |
| `editorial_catalog_sort`      | `sort_field: string`, `sort_direction: string`                                                             | `/catalogo` sort control                    | Firebase | Yes              | P1       |
| `editorial_catalog_paginate`  | `page_number: number`, `results_per_page: number`                                                          | `/catalogo` pagination                      | Firebase | Yes              | P1       |
| `editorial_news_scroll`       | `news_slug: string`, `scroll_depth: number`                                                                | `/noticias/[slug]` scroll observer          | Firebase | Yes              | P1       |
| `editorial_cta_click`         | `cta_id: string`, `cta_text: string`, `page_path: string`, `cta_position: string`                          | Any tracked CTA                             | Firebase | Yes              | P1       |
| `editorial_upcoming_interest` | `book_slug: string`, `action: string`                                                                      | `/proximamente/[slug]` CTA                  | Firebase | Yes              | P1       |
| `editorial_contact_submit`    | `form_type: string`, `successful: boolean`                                                                 | `/nosotros/contacto` form                   | Firebase | Yes              | P1       |
| `editorial_resource_view`     | `resource_type: string`                                                                                    | `/recursos/*` pages                         | Firebase | Yes              | P1       |
| `editorial_dashboard_visit`   | `section: string`                                                                                          | `/dashboard/*` pages                        | Firebase | Yes              | P1       |
| `editorial_dashboard_action`  | `action: string`, `entity_type: string`, `entity_id: string`                                               | Dashboard CRUD operations                   | Firebase | Yes              | P2       |
| `editorial_book_share`        | `book_slug: string`, `share_method: string`                                                                | Share button on book detail                 | Firebase | Yes              | P2       |

### Existing hooks mapping

The hooks in `packages/firebase/src/analytics/hooks.tsx` provide generic tracking methods. Here's how they map to the plan:

| Existing hook method                      | Can be reused for                                    | Notes                                                                                        |
| ----------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `useUserTracking().trackClick()`          | `editorial_cta_click`                                | Already logs `element_id`, `element_type`; pass event-specific params via `additionalParams` |
| `useUserTracking().trackSearch()`         | `search` event                                       | Currently fires a generic event — should be updated to fire GA4 `search` instead             |
| `useUserTracking().trackFormSubmission()` | `editorial_contact_submit`, `editorial_signup_error` | Reusable with `additionalParams`                                                             |
| `usePageTracking()`                       | Automatic `page_view`                                | Already implemented but not activated in any layout                                          |
| `useErrorTracking().trackApiError()`      | Sentry overlap — evaluate if needed                  | May duplicate Sentry; consider removing                                                      |
| `usePerformanceTracking().trackTiming()`  | Vercel Speed Insights overlap                        | Likely unnecessary; Speed Insights covers this                                               |

**New code needed for**: `view_item`, `select_content`, `select_item`, `editorial_article_scroll`, `editorial_article_complete`, `editorial_news_scroll`, scroll/time observers.

---

## 6. Provider Responsibility Matrix

| Metric category          | Vercel Analytics         | Firebase Analytics           | Google Search Console | Sentry                   |
| ------------------------ | ------------------------ | ---------------------------- | --------------------- | ------------------------ |
| Page views & traffic     | Primary                  | Secondary (automatic)        | Impressions only      | —                        |
| Unique visitors          | Primary                  | Secondary                    | —                     | —                        |
| Session duration         | —                        | Primary (automatic)          | —                     | —                        |
| Bounce rate              | Primary                  | —                            | —                     | —                        |
| Core Web Vitals          | Primary (Speed Insights) | —                            | Field data            | —                        |
| Content engagement       | —                        | **Primary** (custom events)  | —                     | —                        |
| Search queries (on-site) | —                        | **Primary** (`search` event) | —                     | —                        |
| Search queries (Google)  | —                        | —                            | Primary               | —                        |
| Conversions (sign-up)    | —                        | **Primary** (custom events)  | —                     | —                        |
| Traffic sources          | Primary                  | Secondary (automatic)        | Organic search only   | —                        |
| UTM tracking             | —                        | Primary (automatic capture)  | —                     | —                        |
| Error tracking           | —                        | —                            | —                     | Primary                  |
| Performance monitoring   | Primary (Speed Insights) | —                            | —                     | Secondary (transactions) |

### Consent requirements

| Provider              | Consent required? | Reason                                                                              |
| --------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| Vercel Analytics      | **No**            | Privacy-focused, no cookies, no PII, GDPR-compliant by design                       |
| Vercel Speed Insights | **No**            | Same as Vercel Analytics                                                            |
| Firebase Analytics    | **Yes**           | Uses cookies, collects device/session data; requires explicit consent per CSS-56    |
| Google Search Console | **No**            | Server-side, no user-facing data collection                                         |
| Sentry                | **No**            | Error monitoring is a legitimate interest; PII is sanitized in `instrumentation.ts` |

**Implementation**: Firebase Analytics must only initialize after the user grants consent (CSS-56 consent banner). Vercel Analytics and Sentry can run without consent. The `AnalyticsProvider` in `src/app/providers.tsx` should be gated on consent state.

---

## 7. Implementation Priority

### P0 — Immediate business value

Ship these first. They answer: "What content do users care about?" and "Is our sign-up funnel working?"

| Event                                                     | Why                                                |
| --------------------------------------------------------- | -------------------------------------------------- |
| `view_item` (book/upcoming)                               | Core metric: which books attract attention         |
| `select_content` (article/news)                           | Core metric: which written content is read         |
| `select_item` (list → detail)                             | Measures catalog discovery effectiveness           |
| `search`                                                  | Reveals what users are looking for                 |
| `sign_up`, `login`                                        | Funnel tracking for user acquisition               |
| `editorial_signup_start` / `editorial_signup_error`       | Identifies sign-up friction                        |
| `editorial_article_scroll` / `editorial_article_complete` | Content quality signal; guides editorial decisions |

**Depends on**: CSS-56 (consent banner) must ship first or in parallel.

### P1 — Content strategy insights

Ship after P0. They answer: "How do users browse?" and "Which CTAs and pages drive engagement?"

| Event                                                                                | Why                                                |
| ------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `editorial_catalog_filter` / `editorial_catalog_sort` / `editorial_catalog_paginate` | Understand browsing patterns to improve catalog UX |
| `editorial_news_scroll`                                                              | Content quality signal for news                    |
| `editorial_cta_click`                                                                | Measure CTA effectiveness across the site          |
| `editorial_upcoming_interest`                                                        | Gauge demand for upcoming titles                   |
| `editorial_contact_submit`                                                           | Track contact form conversion                      |
| `editorial_resource_view`                                                            | Understand which resource pages are valuable       |
| `editorial_dashboard_visit`                                                          | Track dashboard adoption among registered users    |

### P2 — Nice to have

Low urgency. Implement when the above are stable and producing data.

| Event                          | Why                                                                        |
| ------------------------------ | -------------------------------------------------------------------------- |
| `editorial_dashboard_action`   | Detailed dashboard usage patterns                                          |
| `editorial_book_share`         | Social sharing metrics (depends on share feature existing)                 |
| `usePerformanceTracking` hooks | Likely redundant with Vercel Speed Insights — evaluate before implementing |
| `useErrorTracking` hooks       | Likely redundant with Sentry — evaluate before implementing                |

---

## Appendix: Firebase Event Name Validation

All custom event names in this plan have been verified against Firebase constraints:

- Starts with a letter: Yes (all start with `editorial_`)
- Contains only letters, numbers, underscores: Yes
- Max 40 characters: Yes (longest is `editorial_catalog_paginate` at 27 chars)
- Does not use reserved prefixes (`firebase_`, `google_`, `ga_`): Yes
- GA4 recommended events use exact standard names: Yes (`view_item`, `search`, `login`, `sign_up`, `select_content`, `select_item`)
