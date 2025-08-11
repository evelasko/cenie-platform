# CENIE Editorial Sitemap

**Product Type:** Editorial Platform (Academic Publishing House)
**Primary Personas:** Professors/Researchers, Graduate Students/Practitioner-Scholars, Academic Librarians
**Core Value Proposition:** AI-enhanced academic publishing for the performing arts with bilingual (ES/EN) access

---

## Site Structure (Revised, user-centered)

```text
Home
├─ Featured Publications
├─ Quick Search (Semantic)
├─ Why CENIE Editorial (AI discovery + bilingual access)
└─ Start Here cards (Researchers / Authors / Institutions)

Catalog
├─ Search & Filters (semantic; facets: Topic, Method, Region, Period, Language, OA)
├─ Collections by Topic
├─ Spanish Translations (collection landing; persistent ES/EN toggle)
├─ New & Noteworthy
├─ Open Access
└─ Multimedia-Ready

For Authors
├─ Submit Your Manuscript
├─ Context Model Protocol (CMP) Guide
├─ Author & Translator Services
├─ Peer Review, Ethics & Conflicts
└─ Rights & Permissions

For Institutions
├─ Institutional Licensing & Pricing
├─ Discovery & Integrations (OAI-PMH, MARC, COUNTER/SUSHI, SAML/Shibboleth)
├─ Implementation Guide
├─ Usage Analytics & Reports
└─ RAG Toolkits & APIs (institution-focused)

Research Tools & Access
├─ AI-Enhanced Discovery (how-to for semantic search, concept graphs)
├─ Context Model Protocol (benefits for researchers & authors)
├─ RAG Toolkits & APIs (researcher overview; security + citations)
├─ Domain LLM Access (request/access flow)
├─ Spanish Translations Program (overview + Request a Translation)
└─ Citation & Export Tools (Zotero, BibTeX/CSL JSON/RIS; stable links/DOIs)

About
├─ Editorial Mission & Vision
├─ Editorial Board
└─ Contact & Support

Footer (global)
├─ Accessibility
├─ Privacy & Terms
├─ Language Switch (ES/EN)
├─ ORCID / Crossref
└─ Sitemap
```

Primary Navigation (5 items): `Catalog`, `For Authors`, `For Institutions`, `Research Tools & Access`, `About`.

---

## Rationale for the IA Change

- **Reduce cognitive load:** Top-level choices drop from 7 to 5, improving scan efficiency and wayfinding for all personas.
- **Merge overlapping concepts into user outcomes:** Combines "Spanish Translations" and "AI & Technology" into a single, benefits-first destination—"Research Tools & Access"—making it easier to understand how to do better research faster.
- **Make Spanish truly first-class in discovery:** Spanish Translations becomes a prominent Catalog collection and a persistent language filter/toggle, reflecting how users actually browse and search.
- **Clarify ownership of technical content:** Institutional integrations live under `For Institutions`; research-facing explanations live under `Research Tools & Access`; authoring specs live under `For Authors`. This removes duplication and keeps context clear.
- **Support growth:** Structure scales with new collections, tools, and integrations without adding top-level items.

---

## URL Schema

- `/` (Home)
- `/catalog`
- `/authors`
- `/institutions`
- `/tools-and-access` (alias: `/research-tools`)
- `/about`
- Footer: `/accessibility`, `/privacy`, `/terms`, `/sitemap`

---

## Page-level Purposes, Content, and UX

### 1 - Home

- **Purpose:** Provide an at-a-glance value proposition, showcase latest/high-impact publications, and route users quickly to their primary tasks.
- **Primary audiences:** Researchers/Students (discovery), Authors (submission), Librarians (licensing).
- **Key content:**
  - Featured Publications (editorially curated)
  - Quick Semantic Search (input field with example queries)
  - Why CENIE Editorial (AI discovery, CMP, bilingual access, credible metadata/DOIs)
  - Start Here cards: Researchers / Authors / Institutions
- **Key UX elements:** Prominent search, ES/EN language switch, short scannable copy, clear CTAs.
- **CTAs:** Browse Catalog; Submit Manuscript; Institutional Licensing; Explore Tools & Access.
- **Success metrics:** Search engagement rate; CTR to Catalog/Authors/Institutions; Featured title click-through.

### 2 - Catalog

- **Purpose:** Provide the core discovery and browsing experience with semantic search and rich filters.
- **Primary audiences:** Researchers, Students; secondary: Librarians (to evaluate coverage/fit).
- **Key content & subpages:**
  - Search & Filters: semantic search; facets for Topic, Method, Region, Period, Language (ES/EN), OA.
  - Collections by Topic: curated thematic groupings (e.g., Immersive Theatre, Devising, Applied Theatre).
  - Spanish Translations: dedicated collection landing showing translated titles and ES-first browse; persistent ES/EN toggle.
  - New & Noteworthy: latest and featured additions.
  - Open Access: OA titles/chapters with clear licensing.
  - Multimedia-Ready: titles with media exemplars.
- **Key UX elements:** Sticky filters, saved searches, citation exports from results and item pages, stable links/DOIs.
- **CTAs:** Export citations; Save to Zotero; View related works; Request a translation (if not available).
- **Success metrics:** Search-to-result engagement; filter usage; citation exports; ES/EN toggle usage; OA views.

### 3 - For Authors

- **Purpose:** Recruit and support authors/translators with clear submission and production guidance.
- **Primary audiences:** Authors, Translators, Editors.
- **Key content & subpages:**
  - Submit Your Manuscript: scope, timelines, templates, portal link.
  - Context Model Protocol (CMP - Guide: authoring guidance; tagging chapters/sections, concepts, entities, citations; quality checks.
  - Author & Translator Services: language editing, permissions, indexing, media hosting.
  - Peer Review, Ethics & Conflicts: policies and workflows.
  - Rights & Permissions: rights management, licensing options (including OA/CC).
- **Key UX elements:** Checklists, templates, sample CMP-tagged chapters, FAQs.
- **CTAs:** Start submission; Contact editorial; Download templates.
- **Success metrics:** Submission starts/completions; CMP guide engagement; inquiries.

### 4 - For Institutions

- **Purpose:** Equip librarians/scholarly comms with licensing, integration, and reporting resources.
- **Primary audiences:** Academic Librarians, IT/Identity teams.
- **Key content & subpages:**
  - Institutional Licensing & Pricing: tiers, features, add-ons (RAG content packs/APIs, domain LLM), procurement guidance.
  - Discovery & Integrations: OAI-PMH feeds, MARC-ready records, COUNTER/SUSHI, SAML/Shibboleth/IP access, Google Scholar indexing.
  - Implementation Guide: rollout steps, timelines, roles, support.
  - Usage Analytics & Reports: COUNTER reports, dashboards, how to interpret data.
  - RAG Toolkits & APIs (institution-focused): security posture, data scopes, terms, example deployments.
- **Key UX elements:** Integration checklists, downloadable records/samples, contacts for trials/pilots.
- **CTAs:** Request quote; Start pilot; Access integration resources.
- **Success metrics:** Quote requests; pilot sign-ups; integration resource downloads.

### 5 - Research Tools & Access (merged section)

- **Purpose:** Explain, in user terms, how to use CENIE’s AI-native capabilities, bilingual access, and secure programmatic options to accelerate research.
- **Primary audiences:** Researchers/Students; secondary: Authors (CMP context), Institutions (RAG awareness).
- **Key content & subpages:**
  - AI-Enhanced Discovery: how semantic search and concept graphs work; examples of effective queries; privacy/citations.
  - Context Model Protocol (CMP): what it is; benefits for discovery and synthesis; link to the authoring spec under `For Authors`.
  - RAG Toolkits & APIs (researcher overview): how to request access; example notebooks; citation guarantees; link to institutional details.
  - Domain LLM Access: overview of domain-specific assistance; request/access flow; guardrails and explainability.
  - Spanish Translations Program: program overview; selection criteria; “Browse Translations” CTA; “Request a translation” form.
  - Citation & Export Tools: Zotero/Mendeley, BibTeX/CSL JSON/RIS; DOIs; stable links; best practices for citing.
- **Key UX elements:** Short how-to modules, visual query examples, links back to Catalog with pre-applied filters (e.g., Language=ES).
- **CTAs:** Try semantic search; Browse translations; Request access (RAG/LLM); Export citation.
- **Success metrics:** Clicks to Catalog; tool engagement; access requests.

### 6 - About

- **Purpose:** Establish credibility and provide human contact pathways.
- **Primary audiences:** All personas.
- **Key content & subpages:**
  - Editorial Mission & Vision: positioning, commitments (e.g., accessibility, Spanish-language access, academic rigor).
  - Editorial Board: profiles and affiliations.
  - Contact & Support: contact form, email, help resources; link to Knowledge Base if available.
- **Key UX elements:** Trust signals (ORCID/Crossref), clear contact routes, response-time expectations.
- **Success metrics:** Contact submissions; time on Mission page; board profile engagement.

### 7 - Footer (global)

- **Purpose:** Provide required policies, persistent utilities, and trust signals.
- **Key content:** Accessibility; Privacy & Terms; Language Switch (ES/EN); ORCID/Crossref; Sitemap; social links if applicable.

---

## Navigation & Cross-linking Behaviors

- **Language behavior:** Persistent ES/EN toggle in header; Catalog includes Language facet and ES-first collection landing for translations.
- **Breadcrumbs:** Reflect content hierarchy (e.g., Catalog → Collections → Spanish Translations), not personas (avoid "For X" in breadcrumbs except on those landing pages).
- **Cross-links:**
  - From Catalog → Research Tools & Access (AI discovery, CMP, citation guidance).
  - From Research Tools & Access → Catalog (pre-filtered searches; Spanish Translations collection).
  - From For Authors (CMP guide) → Research Tools & Access (CMP overview); vice versa.
  - From For Institutions (RAG/APIs) → Research Tools & Access (researcher overview of RAG) and vice versa.

---

## SEO & Schema Notes (concise)

- Use `ScholarlyArticle`/`Book` schema where applicable; include DOIs, authors (ORCID), publication dates, language.
- Provide `BreadcrumbList` schema across Catalog and collections.
- Ensure `FAQPage` schema for submission, licensing, and tools FAQs.
- Localize meta titles/descriptions for ES/EN; ensure canonical links between language variants.

---

## Success Criteria for the New IA

This sitemap reflects the Editorial Platform template with customizations for CENIE Editorial's unique AI-native approach and bilingual focus, ensuring all three primary personas have clear pathways to their key objectives.

- Decrease in top-nav misclicks and time-to-first-action (TTFA) from Home.
- Increased engagement with Catalog filters and ES language toggle.
- Higher completion rates for manuscript submissions and institutional inquiries.
- Growth in RAG/LLM access requests and citation export events.
