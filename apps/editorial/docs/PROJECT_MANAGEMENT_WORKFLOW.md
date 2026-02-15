# CENIE Editorial Web — Project Management & AI Agent Workflow

> This document describes the complete project management workflow for the CENIE Editorial Web application, including how work is organized in Linear, how issues are structured for AI agent execution, and the full agent skill workflow.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Linear Workspace Structure](#2-linear-workspace-structure)
3. [Issue Template & Structure](#3-issue-template--structure)
4. [Label System](#4-label-system)
5. [Milestones & Roadmap](#5-milestones--roadmap)
6. [Cycle Planning](#6-cycle-planning)
7. [AI Agent Skills](#7-ai-agent-skills)
8. [Agent Workflow Loop](#8-agent-workflow-loop)
9. [Conventions & Quality Standards](#9-conventions--quality-standards)
10. [For Human Developers](#10-for-human-developers)
11. [Issue Reference Table](#11-issue-reference-table)
12. [FAQ](#12-faq)

---

## 1. Overview

### What This Is

The CENIE Editorial Web project uses **Linear** for project management and **AI agents** (Claude Code) for implementation. The workflow is designed so that:

- Work is broken into well-scoped, self-documenting issues
- Each issue contains enough context for an AI agent to implement it autonomously
- Quality is enforced through automated checks and structured verification
- Progress is visible to the entire team through Linear's project views

### Key Principles

1. **Issues are self-contained briefs** — Every issue includes the full context an implementer (human or AI) needs: which files to touch, which files to read for context, exact requirements, technical approach, and verification steps.
2. **Labels encode metadata for execution** — Domain labels categorize work; complexity labels signal how much context is needed; dependency labels indicate execution order.
3. **Skills standardize the workflow** — Five CLI skills (`/pick-issue`, `/editorial-context`, `/plan-issue`, `/verify-issue`, `/complete-issue`) create a repeatable loop from issue selection to completion.
4. **Quality gates prevent regressions** — Every piece of work must pass type-checking, linting, build verification, and convention checks before being marked complete.

### Team & Project

| Field                    | Value                                  |
| ------------------------ | -------------------------------------- |
| **Linear Team**          | CincoSeiSiete                          |
| **Linear Project**       | CENIE Editorial Web                    |
| **Issue Prefix**         | CSS-                                   |
| **Project Lead**         | Enrique Perez Velasco                  |
| **Cycle Cadence**        | Weekly (Sunday to Sunday)              |
| **Primary Implementers** | AI agents (Claude Code) + human review |

---

## 2. Linear Workspace Structure

### Hierarchy

```
Linear Workspace: Misfitcoders
└── Team: CincoSeiSiete
    └── Project: CENIE Editorial Web
        ├── Milestone: Foundation & Stability
        │   └── Issues: CSS-13 through CSS-19
        ├── Milestone: SEO Strategy
        │   └── Issues: CSS-20 through CSS-28
        ├── Milestone: Theme & Design Consolidation
        │   └── Issues: CSS-29 through CSS-35
        ├── Milestone: Book Data & Markdown Editor
        │   └── Issues: CSS-36 through CSS-40
        ├── Milestone: Analytics Strategy
        │   └── Issues: CSS-41 through CSS-47
        └── Milestone: Article Writing Pipeline
            └── Issues: CSS-48 through CSS-55
```

### Issue Lifecycle

```
Backlog → Todo → In Progress → Done
                      ↑
              (agent claims it via /pick-issue)
```

- **Backlog**: Future work, not yet scheduled for a cycle
- **Todo**: Scheduled for a cycle, ready to be picked up
- **In Progress**: Actively being worked on by an agent or developer
- **Done**: Implemented, verified, and committed

### Cycles

Cycles are weekly sprints. Issues are assigned to cycles based on their milestone and dependencies:

| Cycle    | Dates                | Focus Areas                                         |
| -------- | -------------------- | --------------------------------------------------- |
| Cycle 3  | Feb 16–22, 2026      | Foundation critical items + SEO critical items      |
| Cycle 4  | Feb 23 – Mar 1, 2026 | SEO completion + Design audit + Homepage polish     |
| Cycle 5  | Mar 2–8, 2026        | Theme polish + Markdown editor + Analytics planning |
| Cycle 6+ | Mar 9+, 2026         | Article pipeline + Analytics implementation         |

---

## 3. Issue Template & Structure

Every issue follows a structured format designed for efficient AI agent execution. Here is the template with explanations:

### Template

```markdown
## Context

[WHY this issue exists. Background, motivation, what problem it solves.
Link to related issues if relevant. Keep it to 2-4 sentences.]

## Scope

### Target files

[Files to CREATE or MODIFY. Each file includes its full path relative
to the monorepo root and a brief note about what changes.]

- `apps/editorial/src/app/sitemap.ts` (create) — Dynamic sitemap generator
- `apps/editorial/src/app/robots.ts` (create) — Crawler rules

### Reference files

[Files to READ for context, patterns, or conventions. The agent should
read these before implementing to understand existing patterns.]

- `apps/editorial/src/lib/mdx.ts` — How content is fetched
- `apps/editorial/src/app/api/public/catalog/route.ts` — Catalog query pattern

## Requirements

[WHAT must be true when the issue is done. Each requirement is a
checkbox that can be verified independently.]

- [ ] Requirement 1 — specific, testable
- [ ] Requirement 2 — specific, testable
- [ ] Requirement 3 — specific, testable

## Technical Approach

[HOW to implement. Step-by-step guidance that eliminates ambiguity
about which approach to take. Not pseudocode, but enough to prevent
the implementer from going down the wrong path.]

1. Step one with explanation
2. Step two with explanation
3. Step three with explanation

## Conventions

[RULES to follow during implementation. Project-specific patterns
that must be adhered to.]

- Use `@cenie/logger` (never `console.log`)
- Use `@cenie/errors` for error handling
- Use Metadata API (never `next/head`)

## Verification

[HOW to confirm the work is done correctly. Includes both automated
checks and manual verification steps.]

- [ ] `pnpm build --filter=@cenie/editorial` succeeds
- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] Manual: [description of what to check]

## Out of Scope

[WHAT NOT to do. Explicit boundaries to prevent over-engineering
or scope creep. Critical for AI agents that might otherwise "improve"
adjacent code.]

- Do not change X (that's a separate issue)
- Do not add Y (not needed for this task)
```

### Why Each Section Matters

| Section                | Purpose                                        | Who Benefits            |
| ---------------------- | ---------------------------------------------- | ----------------------- |
| **Context**            | Prevents "why are we doing this?" questions    | Everyone                |
| **Target files**       | Agent knows exactly where to make changes      | AI agents               |
| **Reference files**    | Agent reads existing patterns before coding    | AI agents               |
| **Requirements**       | Definition of done — clear acceptance criteria | Everyone                |
| **Technical approach** | Prevents wasted time on wrong approaches       | AI agents + junior devs |
| **Conventions**        | Prevents convention violations                 | AI agents               |
| **Verification**       | Quality gate — how to confirm it's done        | Everyone                |
| **Out of Scope**       | Prevents scope creep and over-engineering      | AI agents               |

---

## 4. Label System

Labels are organized in three dimensions to encode execution metadata:

### Domain Labels — What area of the app

| Label                | Color            | Description                                                      |
| -------------------- | ---------------- | ---------------------------------------------------------------- |
| **SEO**              | Green `#0B6623`  | Search engine optimization, sitemaps, metadata, structured data  |
| **Design**           | Purple `#8B5CF6` | Theme, styling, HUP alignment, visual design, accessibility      |
| **Analytics**        | Blue `#2563EB`   | Tracking, metrics, Firebase/Vercel Analytics, marketing insights |
| **Content Pipeline** | Orange `#EA580C` | Article writing workflow, LLM agents, MDX content, publishing    |
| **Book Data**        | Teal `#0D9488`   | Book management, markdown editor, catalog data, Google Books     |
| **Infrastructure**   | Gray `#6B7280`   | Auth, middleware, error handling, DevOps, deployment, security   |
| **DX**               | Yellow `#EAB308` | Developer experience, code quality, logging, conventions         |

### Complexity Labels — How much context is needed

| Label              | Color            | Description            | Agent Guidance                                                       |
| ------------------ | ---------------- | ---------------------- | -------------------------------------------------------------------- |
| **Self-Contained** | Green `#22C55E`  | Small scope, 1-3 files | Agent can start immediately after reading the issue                  |
| **Cross-Cutting**  | Orange `#F97316` | Multiple files/systems | Agent should read all reference files carefully and plan first       |
| **Research First** | Purple `#A855F7` | Exploration needed     | Agent should investigate before implementing; may need `/plan-issue` |

### Dependency Labels — Execution order

| Label             | Color          | Description         | Agent Guidance                                    |
| ----------------- | -------------- | ------------------- | ------------------------------------------------- |
| **Foundation**    | Red `#DC2626`  | Blocks other issues | Should be prioritized; other work depends on this |
| **Parallel Safe** | Cyan `#06B6D4` | No conflicts        | Can be worked on simultaneously with other issues |

### How Labels Combine

A typical issue has one domain label + one complexity label + optionally one dependency label:

```
CSS-20: Create dynamic sitemap.ts
Labels: [SEO] [Foundation] [Self-Contained]
→ Meaning: SEO work, blocks other SEO issues, agent can do this independently
```

```
CSS-24: Add JSON-LD structured data
Labels: [SEO] [Cross-Cutting]
→ Meaning: SEO work, touches multiple files, agent should plan carefully
```

```
CSS-29: Audit pages against HUP design
Labels: [Design] [Research First] [Foundation]
→ Meaning: Design work, needs exploration first, blocks subsequent design issues
```

---

## 5. Milestones & Roadmap

### Milestone Overview

| #   | Milestone                        | Target Date | Issues | Points | Focus                                                          |
| --- | -------------------------------- | ----------- | ------ | ------ | -------------------------------------------------------------- |
| 1   | **Foundation & Stability**       | Mar 1       | 7      | 12     | Middleware, error pages, logging, auth, images, code splitting |
| 2   | **SEO Strategy**                 | Mar 8       | 8      | 19     | Sitemap, robots, metadata, JSON-LD, OG images, AI search       |
| 3   | **Theme & Design Consolidation** | Mar 8       | 7      | 17     | HUP audit, page polish, accessibility                          |
| 4   | **Book Data & Markdown Editor**  | Mar 15      | 5      | 11     | @uiw/react-md-editor integration, rendering                    |
| 5   | **Analytics Strategy**           | Mar 15      | 7      | 15     | Tracking plan, abstraction layer, Firebase Analytics, events   |
| 6   | **Article Writing Pipeline**     | Apr 1       | 8      | 27     | Architecture, LLM functions, dashboard UI, scheduling          |

### Dependency Graph

```
Foundation & Stability ─────┐
                            ├──→ SEO Strategy
                            ├──→ Theme & Design Consolidation
                            │
                            ├──→ Book Data & Markdown Editor
                            │         │
                            │         ├──→ Analytics Strategy
                            │         │
                            └─────────┴──→ Article Writing Pipeline
```

Foundation must be solid before investing heavily in other milestones. SEO and Design can run in parallel. Book Data and Analytics are mostly independent. The Article Pipeline depends on the markdown editor (for the review UI) and analytics (for performance tracking).

### Milestone Details

#### 1. Foundation & Stability

**Why first**: These are infrastructure issues that affect every page. Fixing them first prevents bugs from compounding as we build features.

| Issue  | Title                                                 | Priority | Points |
| ------ | ----------------------------------------------------- | -------- | ------ |
| CSS-13 | Enhance proxy.ts with Firebase auth for dashboard     | Urgent   | 2      |
| CSS-14 | Add global error.tsx, global-error.tsx, not-found.tsx | High     | 2      |
| CSS-15 | Add loading.tsx for key route segments                | High     | 1      |
| CSS-16 | Replace all console.log with @cenie/logger            | High     | 1      |
| CSS-17 | Complete auth refactoring (9 remaining routes)        | High     | 3      |
| CSS-18 | Replace raw img tags with next/image                  | Medium   | 1      |
| CSS-19 | Add dynamic imports for heavy components              | Medium   | 2      |

#### 2. SEO Strategy

**Why**: The app is invisible to search engines. No sitemap, no robots.txt, broken metadata on key pages.

| Issue  | Title                                                       | Priority | Points |
| ------ | ----------------------------------------------------------- | -------- | ------ |
| CSS-20 | Create dynamic sitemap.ts                                   | Urgent   | 3      |
| CSS-21 | Create robots.ts with crawler rules                         | Urgent   | 1      |
| CSS-22 | Fix catalog detail page metadata (next/head → Metadata API) | Urgent   | 1      |
| CSS-23 | Add generateMetadata to all pages missing it                | High     | 3      |
| CSS-24 | Add JSON-LD structured data for books and articles          | High     | 3      |
| CSS-25 | Add dynamic OpenGraph images                                | High     | 3      |
| CSS-26 | Add canonical URLs and language links                       | Medium   | 1      |
| CSS-27 | Add favicon, app icons, and PWA manifest                    | Medium   | 1      |
| CSS-28 | Research AI search optimization (llms.txt)                  | Medium   | 3      |

#### 3. Theme & Design Consolidation

**Why**: The visual design needs to match the Harvard University Press inspiration site.

| Issue  | Title                                        | Priority | Points |
| ------ | -------------------------------------------- | -------- | ------ |
| CSS-29 | Audit all pages against HUP design           | High     | 3      |
| CSS-30 | Refine homepage layout and hero sections     | High     | 3      |
| CSS-31 | Polish catalog and book detail pages         | High     | 3      |
| CSS-32 | Polish article/news reading experience       | Medium   | 2      |
| CSS-33 | Refine navbar, footer, global layout         | Medium   | 2      |
| CSS-34 | Add consistent hover/focus/transition states | Medium   | 2      |
| CSS-35 | Accessibility audit and fix critical issues  | Medium   | 2      |

#### 4. Book Data & Markdown Editor

**Why**: Enable rich content editing in the dashboard with markdown.

| Issue  | Title                                             | Priority | Points |
| ------ | ------------------------------------------------- | -------- | ------ |
| CSS-36 | Integrate @uiw/react-md-editor in dashboard       | High     | 3      |
| CSS-37 | Implement markdown rendering in book detail pages | High     | 2      |
| CSS-38 | Add markdown editor for catalog descriptions      | High     | 2      |
| CSS-39 | Add markdown editor for contributor bios          | Medium   | 2      |
| CSS-40 | Migrate existing descriptions to markdown         | Medium   | 2      |

#### 5. Analytics Strategy

**Why**: No meaningful analytics exist. Can't make data-driven decisions without tracking.

| Issue  | Title                                     | Priority | Points |
| ------ | ----------------------------------------- | -------- | ------ |
| CSS-41 | Define key metrics and tracking plan      | High     | 2      |
| CSS-42 | Implement analytics abstraction layer     | High     | 3      |
| CSS-43 | Enable and configure Firebase Analytics   | High     | 2      |
| CSS-44 | Add custom events for engagement tracking | High     | 3      |
| CSS-45 | Set up Google Search Console              | Medium   | 1      |
| CSS-46 | Build dashboard stats with real data      | Medium   | 3      |
| CSS-47 | Implement UTM parameter tracking          | Low      | 1      |

#### 6. Article Writing Pipeline

**Why**: Automate content creation with AI agents for periodic publishing.

| Issue  | Title                                          | Priority | Points |
| ------ | ---------------------------------------------- | -------- | ------ |
| CSS-48 | Design pipeline architecture                   | High     | 3      |
| CSS-49 | Cloud Function: LLM article outline generation | High     | 5      |
| CSS-50 | Cloud Function: LLM article copy writing       | High     | 5      |
| CSS-51 | Build article review/approval UI               | High     | 3      |
| CSS-52 | Article scheduling and publishing system       | High     | 3      |
| CSS-53 | Article draft management (save, edit, preview) | Medium   | 3      |
| CSS-54 | Integrate translation Cloud Function with LLM  | Medium   | 3      |
| CSS-55 | Article performance tracking                   | Medium   | 2      |

---

## 6. Cycle Planning

### How Issues Are Assigned to Cycles

1. **Priority determines order**: Urgent → High → Medium → Low
2. **Dependencies determine sequence**: `Foundation` issues go first; `blockedBy` issues wait
3. **Velocity determines capacity**: Each cycle should have ~10-15 points of work
4. **Parallel Safe issues fill gaps**: When one issue is blocked, pick a `Parallel Safe` one

### Current Cycle Assignments

| Cycle                        | Issues                                                                     | Total Points                                        |
| ---------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------- |
| **Cycle 3** (Feb 16-22)      | CSS-13, 14, 15, 16, 17, 18, 20, 21, 22                                     | 15 pts                                              |
| **Cycle 4** (Feb 23 – Mar 1) | CSS-19, 23, 24, 25, 26, 27, 29, 30                                         | 20 pts                                              |
| **Cycle 5** (Mar 2-8)        | CSS-28, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 | Flex — pick based on progress                       |
| **Backlog**                  | CSS-48 through CSS-55 (Article Pipeline)                                   | 27 pts — schedule when earlier milestones stabilize |

### How to Adjust

- If a cycle is running behind, move lower-priority issues to the next cycle
- If a cycle finishes early, pull from the next cycle's issues
- `Parallel Safe` issues can always be pulled in to fill capacity

---

## 7. AI Agent Skills

Five CLI skills are available in `.claude/commands/` to standardize the AI agent workflow:

### `/editorial-context`

**Purpose**: Load project conventions before doing any work.

**When to use**: At the start of every new agent session.

**What it does**:

1. Reads key config files (next.config, proxy, providers, layout, package.json)
2. Reads convention files (logger, typography, auth)
3. Checks recent git changes
4. Outputs a concise briefing of conventions to follow

**Output example**:

```
Recent changes: Fixed build issues (cf6db1e), TwicPics integration (55d9bf8)

Conventions:
- Logging: @/lib/logger (server), @/lib/logger-client (client). NEVER console.log
- Errors: @cenie/errors package
- Auth: requireViewer/requireEditor/requireEditorialAdmin from @/lib/auth.ts
- SEO: generateMetadata exports only. NEVER next/head
- Images: next/image only, never <img>
- Styling: Tailwind v4, TYPOGRAPHY constants, Anziano + Barlow fonts
```

---

### `/pick-issue`

**Purpose**: Find and claim the next available issue from Linear.

**When to use**: After loading context, when ready to start working.

**What it does**:

1. Queries Linear for `Todo` issues in current/next cycle, sorted by priority
2. Presents available issues in a table
3. User selects an issue (or accepts the top suggestion)
4. Updates issue status to `In Progress`
5. Reads all target and reference files
6. Enters plan mode

**Selection criteria** (in priority order):

1. `Foundation` label first (unblocks other work)
2. Urgent > High > Medium > Low priority
3. Lower estimate first (quick wins)
4. `Self-Contained` over `Cross-Cutting` when starting out
5. Never pick a blocked issue

---

### `/plan-issue CSS-XX`

**Purpose**: Deep-dive into a specific issue and produce an implementation plan.

**When to use**: For complex issues (3+ points), or issues with `Cross-Cutting` or `Research First` labels.

**What it does**:

1. Fetches the issue from Linear by identifier
2. Parses the structured description (extracting all sections)
3. Reads all target files (understand current state)
4. Reads all reference files (understand patterns)
5. Identifies complications, missing info, or unmet dependencies
6. Produces a step-by-step implementation plan
7. Enters plan mode for user approval

**When to skip**: For `Self-Contained` 1-point issues, planning may be overkill — jump straight to implementation.

---

### `/verify-issue`

**Purpose**: Quality gate before marking work complete.

**When to use**: After finishing implementation, before committing.

**What it does**:

1. Runs automated checks in parallel:
   - `pnpm type-check` — TypeScript compilation
   - `pnpm lint` — ESLint rules
   - `pnpm build --filter=@cenie/editorial` — Full build
2. Checks changed files for convention violations:
   - No `console.log` (must use `@cenie/logger`)
   - No raw `<img>` (must use `next/image`)
   - No `next/head` (must use Metadata API)
   - Proper logger imports (server vs client)
   - Error handling with `@cenie/errors`
3. Reports PASS/FAIL for each check
4. Lists manual verification steps from the issue description

**Pass criteria**: ALL automated checks must pass. Manual checks are listed for the user.

---

### `/complete-issue`

**Purpose**: Commit, update Linear, and suggest next work.

**When to use**: After `/verify-issue` passes.

**What it does**:

1. Runs `/verify-issue` — aborts if any check fails
2. Shows `git diff` for review
3. Creates a commit with format: `CSS-XX: Brief description`
4. Updates the issue status to `Done` in Linear
5. Adds a comment on the issue summarizing what was done
6. Suggests the next available issue

**Safety**: Never force pushes, never skips hooks, always asks before pushing to remote.

---

## 8. Agent Workflow Loop

### The Standard Loop

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  1. /editorial-context                              │
│     Load conventions and project state              │
│                                                     │
│  2. /pick-issue                                     │
│     Find next available issue, set to In Progress   │
│                                                     │
│  3. /plan-issue CSS-XX  (for complex issues)        │
│     Read files, design approach, get approval       │
│                                                     │
│  4. [IMPLEMENT]                                     │
│     Write code following the issue description      │
│                                                     │
│  5. /verify-issue                                   │
│     Run all quality checks                          │
│                                                     │
│  6. /complete-issue                                 │
│     Commit, update Linear, suggest next             │
│                                                     │
│  7. Loop back to step 2                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Session Example

```
User: /editorial-context
Agent: [reads configs, outputs briefing]

User: /pick-issue
Agent: Available issues in Cycle 3:
       CSS-13 [Urgent] Enhance proxy.ts with Firebase auth (2 pts)
       CSS-20 [Urgent] Create dynamic sitemap.ts (3 pts)
       CSS-21 [Urgent] Create robots.ts (1 pt)
       ...
       Recommend: CSS-13 (Urgent, Foundation, Self-Contained)

User: Let's do CSS-13
Agent: [sets to In Progress, reads proxy.ts and reference files]
       [enters plan mode with implementation steps]

User: [approves plan]
Agent: [implements the changes]

User: /verify-issue
Agent: Type Check:     PASS
       Lint:           PASS
       Build:          PASS
       No console.log: PASS
       No raw <img>:   PASS
       ...
       Manual checks:
       - [ ] Access /dashboard without auth → redirected to /sign-in
       - [ ] Access /dashboard with auth → renders normally

User: [confirms manual checks pass]

User: /complete-issue
Agent: [commits as "CSS-13: Enhance proxy.ts with Firebase auth protection"]
       [updates Linear to Done]
       Next suggestion: CSS-14 (Add error pages) or CSS-20 (Create sitemap)
```

---

## 9. Conventions & Quality Standards

### Code Conventions

These are enforced by `/verify-issue` and embedded in every issue's "Conventions" section:

| Convention          | Rule                                                                             | Why                                                     |
| ------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Logging**         | Use `@/lib/logger` (server) or `@/lib/logger-client` (client)                    | Structured, filterable logs. Never `console.log`        |
| **Error handling**  | Use `@cenie/errors` package                                                      | Typed errors, auto-classification, user-safe messages   |
| **Auth**            | Use `requireViewer`/`requireEditor`/`requireEditorialAdmin` from `@/lib/auth.ts` | Consistent auth pattern across all API routes           |
| **SEO metadata**    | Use `generateMetadata` or `metadata` exports                                     | `next/head` doesn't work in App Router                  |
| **Images**          | Use `next/image` component                                                       | Automatic optimization, lazy loading, responsive sizing |
| **Styling**         | Tailwind CSS v4 + `TYPOGRAPHY` constants                                         | Consistent design system                                |
| **Dynamic imports** | Use `next/dynamic` with loading fallback                                         | Reduce initial bundle size                              |
| **Components**      | Use `@cenie/ui` (Button, Card, Badge, etc.)                                      | Consistent UI across the platform                       |

### Commit Convention

```
CSS-XX: Brief description of what was done

- Key change 1
- Key change 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Branch Naming

Linear auto-generates branch names from issue titles:

```
enriquevelasco/css-13-enhance-proxyts-with-firebase-auth-protection-for-dashboard
```

### Quality Checks (must all pass)

1. `pnpm type-check` — TypeScript strict mode compilation
2. `pnpm lint` — ESLint with TypeScript rules
3. `pnpm build --filter=@cenie/editorial` — Full Next.js build
4. No `console.log` in changed files
5. No raw `<img>` tags in changed files
6. No `next/head` in changed files

---

## 10. For Human Developers

### If You're Reviewing AI-Generated Code

1. **Check the issue description** — Confirm the implementation matches the requirements and stays within scope
2. **Check the "Out of Scope"** — Ensure the agent didn't add unrelated changes
3. **Run manual verification** — The issue description lists manual checks that can't be automated
4. **Check conventions** — The agent should follow all conventions, but double-check logging, error handling, and auth patterns

### If You're Writing a New Issue

Follow the [Issue Template](#3-issue-template--structure) exactly. The structured format is what enables AI agents to work efficiently. Key tips:

- **Be specific in Target files** — List exact file paths. "Various components" is not helpful.
- **Include Reference files** — These are the patterns the agent should follow.
- **Requirements as checkboxes** — Each should be independently verifiable.
- **Technical approach is guidance, not pseudocode** — Tell the agent _which_ approach, not every line of code.
- **Out of Scope is critical** — AI agents will "improve" adjacent code if you don't set boundaries.

### If You're Working Without the Agent Skills

You can still follow the same workflow manually:

1. Pick a `Todo` issue from the current cycle in Linear
2. Read its description and all referenced files
3. Implement following the requirements and technical approach
4. Run `pnpm type-check && pnpm lint && pnpm build --filter=@cenie/editorial`
5. Commit with `CSS-XX: description` format
6. Update the issue to `Done` in Linear

---

## 11. Issue Reference Table

### All Issues by Milestone

| ID                               | Title                                                  | Pts | Priority | Labels                                        | Cycle   |
| -------------------------------- | ------------------------------------------------------ | --- | -------- | --------------------------------------------- | ------- |
| **Foundation & Stability**       |                                                        |     |          |                                               |         |
| CSS-13                           | Enhance proxy.ts with Firebase auth for dashboard      | 2   | Urgent   | Infrastructure, Foundation, Self-Contained    | 3       |
| CSS-14                           | Add global error.tsx, global-error.tsx, not-found.tsx  | 2   | High     | Infrastructure, Self-Contained                | 3       |
| CSS-15                           | Add loading.tsx for key route segments                 | 1   | High     | Infrastructure, Self-Contained, Parallel Safe | 3       |
| CSS-16                           | Replace all console.log with @cenie/logger             | 1   | High     | DX, Self-Contained, Parallel Safe             | 3       |
| CSS-17                           | Complete auth refactoring (9 remaining routes)         | 3   | High     | Infrastructure, Cross-Cutting                 | 3       |
| CSS-18                           | Replace raw img tags with next/image                   | 1   | Medium   | DX, Self-Contained, Parallel Safe             | 3       |
| CSS-19                           | Add dynamic imports for heavy components               | 2   | Medium   | Infrastructure, Cross-Cutting, Parallel Safe  | 4       |
| **SEO Strategy**                 |                                                        |     |          |                                               |         |
| CSS-20                           | Create dynamic sitemap.ts                              | 3   | Urgent   | SEO, Foundation, Self-Contained               | 3       |
| CSS-21                           | Create robots.ts with crawler rules                    | 1   | Urgent   | SEO, Self-Contained, Parallel Safe            | 3       |
| CSS-22                           | Fix catalog detail metadata (next/head → Metadata API) | 1   | Urgent   | SEO, Self-Contained                           | 3       |
| CSS-23                           | Add generateMetadata to all pages                      | 3   | High     | SEO, Cross-Cutting                            | 4       |
| CSS-24                           | Add JSON-LD structured data                            | 3   | High     | SEO, Cross-Cutting                            | 4       |
| CSS-25                           | Add dynamic OpenGraph images                           | 3   | High     | SEO, Self-Contained                           | 4       |
| CSS-26                           | Add canonical URLs and language links                  | 1   | Medium   | SEO, Cross-Cutting, Parallel Safe             | 4       |
| CSS-27                           | Add favicon, app icons, PWA manifest                   | 1   | Medium   | SEO, Self-Contained, Parallel Safe            | 4       |
| CSS-28                           | Research AI search optimization (llms.txt)             | 3   | Medium   | SEO, Research First                           | 5       |
| **Theme & Design Consolidation** |                                                        |     |          |                                               |         |
| CSS-29                           | Audit all pages against HUP design                     | 3   | High     | Design, Research First, Foundation            | 4       |
| CSS-30                           | Refine homepage layout and hero sections               | 3   | High     | Design, Cross-Cutting                         | 4       |
| CSS-31                           | Polish catalog and book detail pages                   | 3   | High     | Design, Cross-Cutting                         | 5       |
| CSS-32                           | Polish article/news reading experience                 | 2   | Medium   | Design, Cross-Cutting, Parallel Safe          | 5       |
| CSS-33                           | Refine navbar, footer, global layout                   | 2   | Medium   | Design, Self-Contained                        | 5       |
| CSS-34                           | Add consistent hover/focus/transition states           | 2   | Medium   | Design, Cross-Cutting, Parallel Safe          | 5       |
| CSS-35                           | Accessibility audit and fix critical issues            | 2   | Medium   | Design, Cross-Cutting                         | 5       |
| **Book Data & Markdown Editor**  |                                                        |     |          |                                               |         |
| CSS-36                           | Integrate @uiw/react-md-editor in dashboard            | 3   | High     | Book Data, Foundation, Self-Contained         | 5       |
| CSS-37                           | Implement markdown rendering in book detail pages      | 2   | High     | Book Data, Self-Contained                     | 5       |
| CSS-38                           | Add markdown editor for catalog descriptions           | 2   | High     | Book Data, Self-Contained, Parallel Safe      | 5       |
| CSS-39                           | Add markdown editor for contributor bios               | 2   | Medium   | Book Data, Self-Contained, Parallel Safe      | 5       |
| CSS-40                           | Migrate existing descriptions to markdown              | 2   | Medium   | Book Data, Self-Contained                     | 5       |
| **Analytics Strategy**           |                                                        |     |          |                                               |         |
| CSS-41                           | Define key metrics and tracking plan                   | 2   | High     | Analytics, Research First, Foundation         | 5       |
| CSS-42                           | Implement analytics abstraction layer                  | 3   | High     | Analytics, Foundation, Self-Contained         | 5       |
| CSS-43                           | Enable and configure Firebase Analytics                | 2   | High     | Analytics, Self-Contained                     | 5       |
| CSS-44                           | Add custom events for engagement tracking              | 3   | High     | Analytics, Cross-Cutting                      | 5       |
| CSS-45                           | Set up Google Search Console                           | 1   | Medium   | Analytics, SEO, Self-Contained, Parallel Safe | 5       |
| CSS-46                           | Build dashboard stats with real data                   | 3   | Medium   | Analytics, Cross-Cutting                      | 5       |
| CSS-47                           | Implement UTM parameter tracking                       | 1   | Low      | Analytics, Self-Contained, Parallel Safe      | 5       |
| **Article Writing Pipeline**     |                                                        |     |          |                                               |         |
| CSS-48                           | Design pipeline architecture                           | 3   | High     | Content Pipeline, Research First, Foundation  | Backlog |
| CSS-49                           | Cloud Function: LLM article outline generation         | 5   | High     | Content Pipeline, Self-Contained              | Backlog |
| CSS-50                           | Cloud Function: LLM article copy writing               | 5   | High     | Content Pipeline, Self-Contained              | Backlog |
| CSS-51                           | Build article review/approval UI                       | 3   | High     | Content Pipeline, Cross-Cutting               | Backlog |
| CSS-52                           | Article scheduling and publishing system               | 3   | High     | Content Pipeline, Cross-Cutting               | Backlog |
| CSS-53                           | Article draft management (save, edit, preview)         | 3   | Medium   | Content Pipeline, Self-Contained              | Backlog |
| CSS-54                           | Integrate translation Cloud Function with LLM          | 3   | Medium   | Content Pipeline, Self-Contained              | Backlog |
| CSS-55                           | Article performance tracking                           | 2   | Medium   | Content Pipeline, Analytics, Self-Contained   | Backlog |

---

## 12. FAQ

### Q: Can a human developer use this workflow?

**Yes.** The issue template and quality checks work for anyone. The agent skills are optional convenience — the underlying workflow (pick issue → read description → implement → verify → commit) is universal.

### Q: What if an issue description is missing information?

Add a comment on the issue in Linear with the question. If you're an AI agent, flag the gap and ask the user before proceeding. Never guess when the issue description is ambiguous.

### Q: Can I create new issues?

Yes. Follow the [Issue Template](#3-issue-template--structure). Assign to the CENIE Editorial Web project, CincoSeiSiete team, and pick appropriate labels and milestone.

### Q: What if an issue turns out to be bigger than estimated?

Split it into sub-issues. Create new issues for the parts that don't fit and link them. Update the original issue description to reflect the reduced scope.

### Q: What if `/verify-issue` fails?

Fix the failing check before proceeding. Common issues:

- **Type errors**: Check that new imports have correct types
- **Lint errors**: Run `pnpm lint --fix` for auto-fixable issues
- **Build errors**: Check for missing dependencies or incorrect import paths
- **console.log found**: Replace with `@cenie/logger`

### Q: Where does this documentation live?

- **This file**: `apps/editorial/docs/PROJECT_MANAGEMENT_WORKFLOW.md` (in the repo)
- **Linear document**: Published to the CENIE Editorial Web project in Linear
- **Agent memory**: Key facts saved in `.claude/projects/` memory files for every session

### Q: How do I update this workflow?

1. Update this document in the repo
2. Update the corresponding Linear document
3. If changing agent skills, update files in `.claude/commands/`
4. If changing conventions, update `CLAUDE.md` and `.claude/projects/*/memory/MEMORY.md`
