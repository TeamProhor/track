# Prohor Track — Full Production Implementation Prompt

You are the principal software architect, senior full-stack engineer, security engineer, crawler engineer, and UI/UX engineer responsible for building **Prohor Track**, a production-grade website change-monitoring SaaS.

You are working in a **brand-new Next.js 16 project**.

There is **NO separate PRD**. This prompt is the complete product specification and engineering specification. Treat everything below as the source of truth.

The current project is intentionally minimal. **Do not throw it away. Extend and improve it.**

Current stack already installed includes:

* Next.js `16.3.0`
* React `19.2.8`
* TypeScript
* Tailwind CSS v4
* shadcn
* Base UI
* Biome
* Bun `1.3.14`
* Hugeicons are required
* Drizzle ORM + Turso need to be added
* Patchright needs to be added for browser automation

The current project already contains a large `src/components/ui/` shadcn component collection. **Reuse it instead of unnecessarily regenerating duplicate UI components.**

---

# 1. PRODUCT

Build **Prohor Track**.

Prohor Track is a website monitoring and change-detection platform.

Users should be able to monitor virtually any publicly accessible website and receive notifications when meaningful content changes.

The system must support:

* Static HTML
* Server-rendered websites
* React applications
* Vue applications
* Angular applications
* Svelte applications
* Next.js applications
* Client-side rendered SPAs
* JavaScript-heavy pages
* Dynamically generated content
* Pages where meaningful content appears only after browser rendering

The goal is not merely to compare raw HTML.

The goal is to detect **meaningful website changes** while minimizing false positives caused by:

* timestamps
* generated IDs
* random classes
* analytics
* advertisements
* tracking parameters
* dynamic scripts
* irrelevant DOM changes
* changing navigation metadata
* volatile content

The product should feel like a serious commercial SaaS, not a tutorial project.

---

# 2. NON-NEGOTIABLE TECHNOLOGY STACK

Use:

* Bun
* bunx
* Next.js 16
* React 19
* TypeScript
* App Router
* React Server Components
* React Compiler
* Tailwind CSS v4
* shadcn/ui
* Base UI
* Hugeicons
* Drizzle ORM
* Turso / libSQL / SQLite
* Zod
* Patchright
* BullMQ
* Redis
* Pino
* Vitest

Use Resend for email notifications.

Use Biome for formatting and linting.

Do not introduce unnecessary libraries.

Do not replace the stack with another framework.

Do not use:

* Prisma
* Supabase
* Firebase
* MongoDB
* Redux
* Zustand

unless a concrete architectural requirement makes one unavoidable.

---

# 3. BUN ONLY

Use Bun for package management and scripts.

Use:

```bash
bun install
bun add
bun add -d
bun remove
bun run
bun test
bunx
```

Do not use npm, yarn, or pnpm.

---

# 4. CURRENT PROJECT

The project currently resembles:

```text
.
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── biome.json
├── bun.lock
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   ├── hooks/
│   │   └── use-mobile.ts
│   └── lib/
│       └── utils.ts
└── tsconfig.json
```

Preserve useful existing infrastructure.

Do not blindly delete the existing shadcn/ui components.

Do not recreate components that already exist.

---

# 5. GIT SAFETY

This is an existing local Git repository.

NEVER execute destructive Git commands.

Absolutely forbidden:

```bash
git reset --hard
git clean -fd
git clean -fdx
git checkout -- .
git restore .
git branch -D
git push --force
git push --force-with-lease
```

Never wipe the project to start over.

Never destroy existing work.

Never initialize another Git repository inside the project.

Never modify Git history.

If something is wrong, fix the actual files.

---

# 6. NO MULTI-AGENT WORKTREE CONFLICTS

Do not use multiple autonomous agents that modify the same working tree simultaneously.

If you have any parallel-agent capability:

* use isolated worktrees
* or make agents read-only
* or work sequentially

Never allow two agents to overwrite the same source files.

---

# 7. ARCHITECTURE

Use a clean Next.js architecture.

Target structure:

```text
src/
├── app/
│   ├── (landing)/
│   │   ├── page.tsx
│   │   ├── features/
│   │   │   └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── docs/
│   │   │   └── page.tsx
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── monitors/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── changes/
│   │   │       │   └── page.tsx
│   │   │       ├── snapshots/
│   │   │       │   └── page.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── users/
│   │       │   └── page.tsx
│   │       ├── monitors/
│   │       │   └── page.tsx
│   │       ├── jobs/
│   │       │   └── page.tsx
│   │       └── system/
│   │           └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── sign-in/
│   │   │   │   └── route.ts
│   │   │   ├── sign-up/
│   │   │   │   └── route.ts
│   │   │   └── sign-out/
│   │   │       └── route.ts
│   │   ├── monitors/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── check/
│   │   │       │   └── route.ts
│   │   │       ├── pause/
│   │   │       │   └── route.ts
│   │   │       └── resume/
│   │   │           └── route.ts
│   │   ├── changes/
│   │   │   └── route.ts
│   │   └── snapshots/
│   │       └── route.ts
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── loading.tsx
│
├── components/
│   ├── landing/
│   ├── dashboard/
│   ├── admin/
│   ├── shared/
│   └── ui/
│
├── hooks/
│   ├── use-mobile.ts
│   └── ...
│
├── lib/
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── monitors.ts
│   │   ├── changes.ts
│   │   ├── snapshots.ts
│   │   └── notifications.ts
│   │
│   ├── auth/
│   │   ├── index.ts
│   │   └── session.ts
│   │
│   ├── crawler/
│   │   ├── core/
│   │   ├── fetchers/
│   │   ├── extraction/
│   │   ├── normalization/
│   │   ├── detection/
│   │   ├── security/
│   │   ├── proxies/
│   │   └── types/
│   │
│   ├── db/
│   │   ├── client.ts
│   │   ├── index.ts
│   │   ├── schema/
│   │   │   ├── index.ts
│   │   │   ├── users.ts
│   │   │   ├── monitors.ts
│   │   │   ├── snapshots.ts
│   │   │   ├── changes.ts
│   │   │   └── notifications.ts
│   │   └── queries/
│   │       ├── users.ts
│   │       ├── monitors.ts
│   │       ├── snapshots.ts
│   │       └── changes.ts
│   │
│   ├── diff/
│   │   ├── hash.ts
│   │   ├── normalize.ts
│   │   ├── text.ts
│   │   ├── dom.ts
│   │   ├── compare.ts
│   │   └── types.ts
│   │
│   ├── notifications/
│   │   ├── email.ts
│   │   ├── webhook.ts
│   │   └── index.ts
│   │
│   ├── observability/
│   │   ├── logger.ts
│   │   ├── metrics.ts
│   │   └── errors.ts
│   │
│   ├── queue/
│   │   ├── connection.ts
│   │   ├── queues.ts
│   │   ├── jobs.ts
│   │   └── scheduler.ts
│   │
│   ├── security/
│   │   └── ssrf.ts
│   │
│   ├── validation/
│   │   ├── api.ts
│   │   ├── monitor.ts
│   │   └── notification.ts
│   │
│   └── utils/
│
├── proxy.ts
└── types/
    └── index.ts

worker/
├── index.ts
├── crawler/
├── jobs/
│   ├── check-monitor.ts
│   └── notification.ts
└── queue/
```

Adapt this structure when necessary, but preserve the architectural separation.

---

# 8. ROUTE GROUPS

Use:

```text
(landing)
(dashboard)
(admin)
```

correctly.

Route groups must not appear in URLs.

Expected URLs:

```text
/
/features
/pricing
/docs
/sign-in
/sign-up

/dashboard
/monitors
/monitors/new
/monitors/:id
/monitors/:id/changes
/monitors/:id/snapshots
/monitors/:id/settings
/settings

/admin
/admin/users
/admin/monitors
/admin/jobs
/admin/system
```

Do not create unnecessary duplicate root routes.

The landing page should be:

```text
src/app/(landing)/page.tsx
```

Do not keep a competing `src/app/page.tsx` unless there is a specific architectural reason.

---

# 9. COMPONENT ORGANIZATION

Use:

```text
src/components/
├── landing/
├── dashboard/
├── admin/
├── shared/
└── ui/
```

## `ui`

Only reusable shadcn/ui primitives.

Do not put business-specific components here.

## `landing`

Landing-specific components.

Examples:

```text
navbar.tsx
hero.tsx
features.tsx
workflow.tsx
pricing.tsx
faq.tsx
cta.tsx
footer.tsx
```

## `dashboard`

Dashboard-specific components.

Examples:

```text
dashboard-sidebar.tsx
dashboard-header.tsx
dashboard-stats.tsx
monitor-card.tsx
monitor-table.tsx
monitor-form.tsx
monitor-status.tsx
change-viewer.tsx
diff-viewer.tsx
snapshot-list.tsx
activity-feed.tsx
```

## `admin`

Admin-specific components.

## `shared`

Reusable application components that are not shadcn primitives.

---

# 10. SHADCN/UI

Use shadcn/ui properly throughout the entire application.

Do not manually recreate components that already exist.

The existing project already contains many shadcn components.

Reuse them.

Only add missing components when necessary.

Use Base UI-backed shadcn components where appropriate.

Use proper:

* Button
* Card
* Dialog
* Drawer
* Sheet
* Table
* Tabs
* Badge
* Input
* Textarea
* Select
* Dropdown
* Tooltip
* Alert
* Skeleton
* Empty
* Field
* Sidebar
* Command
* Calendar
* Pagination
* Toast/Sonner

Do not mix random UI libraries.

---

# 11. ICONS

Use **Hugeicons** consistently.

Install the appropriate Hugeicons package.

Do not use Lucide icons for new application UI.

The current project contains `lucide-react` because of the initial generated/shadcn setup. Do not unnecessarily rewrite every existing shadcn component merely to remove Lucide internals.

For application-specific icons, use Hugeicons.

Do not mix several icon systems in your own components.

---

# 12. DESIGN

The entire application must look professionally designed.

Design direction:

* modern
* clean
* technical
* premium
* restrained
* information-dense
* highly usable
* accessible
* responsive

Do NOT make it look like generic AI-generated SaaS.

Avoid excessive:

* gradients
* glassmorphism
* giant rounded containers
* oversized text
* excessive shadows
* meaningless animations
* decorative blobs
* huge empty spaces

Prioritize:

* typography
* spacing
* alignment
* hierarchy
* contrast
* information architecture
* interaction states

The dashboard should feel like a real monitoring/observability product.

---

# 13. RESPONSIVE DESIGN

Mobile support is mandatory.

Design for:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px+
```

Everything must remain usable.

Mobile dashboard:

* desktop sidebar becomes a Sheet/Drawer
* tables become responsive
* actions remain accessible
* forms become single-column where appropriate
* dialogs fit small screens
* no accidental horizontal page overflow

Test responsive behavior throughout the implementation.

---

# 14. NEXT.JS BEST PRACTICES

Prefer React Server Components.

Do not add:

```tsx
"use client";
```

unless necessary.

Use Client Components only for:

* interactive state
* browser APIs
* forms requiring client interaction
* live interactions
* client-only functionality

Do not turn entire pages into Client Components unnecessarily.

Prefer:

```text
Server Component
    ↓
Server Action / Query
    ↓
Client Component where necessary
```

Use Next.js 16 conventions correctly.

Use `proxy.ts` where request interception/protection is needed according to the current Next.js 16 architecture.

Do not use obsolete middleware patterns if Next.js 16 provides a newer convention.

---

# 15. DATABASE

Use:

* Turso
* libSQL
* SQLite
* Drizzle ORM
* Drizzle Kit

Install the appropriate packages.

Create:

```text
src/lib/db/
├── client.ts
├── index.ts
├── schema/
└── queries/
```

Use migrations.

Create appropriate indexes and constraints.

Do not put SQL/database logic in components.

Do not expose database clients to the browser.

---

# 16. DATABASE MODELS

At minimum design proper models for:

### Users

Store:

* id
* email
* password hash if password authentication is used
* role
* createdAt
* updatedAt

### Sessions

Secure session management.

### Monitors

Include appropriate fields for:

* owner
* URL
* name
* status
* schedule
* fetch strategy
* selectors
* normalization settings
* notification settings
* timeout
* retry settings
* createdAt
* updatedAt
* lastCheckedAt
* nextCheckAt

### Snapshots

Store:

* monitor
* timestamp
* HTTP status
* content hashes
* extracted content
* metadata
* crawl strategy
* result status

### Changes

Store:

* monitor
* previous snapshot
* new snapshot
* detected timestamp
* change type
* summary
* diff data

### Notifications

Store notification configuration and delivery state.

Design the schema carefully rather than blindly following these fields.

---

# 17. VALIDATION

Use Zod everywhere external data enters the system.

Validate:

* URLs
* API input
* forms
* monitor configuration
* schedules
* selectors
* notification settings
* webhook settings
* query parameters

Never rely only on client validation.

Use typed inferred schemas.

---

# 18. SERVER ACTIONS

Use:

```text
src/lib/actions/
```

for application mutations.

Examples:

```text
createMonitor()
updateMonitor()
deleteMonitor()
pauseMonitor()
resumeMonitor()
requestMonitorCheck()
updateMonitorSettings()
updateNotificationSettings()
```

Every action must:

1. validate input
2. authenticate
3. authorize
4. execute business logic
5. update database
6. revalidate appropriate UI
7. return a typed result

Do not duplicate business logic between API routes and Server Actions.

---

# 19. API ROUTES

Use:

```text
src/app/api/[name]/route.ts
```

Route handlers must remain thin.

Correct:

```text
route
 ↓
validate
 ↓
authenticate
 ↓
authorize
 ↓
service/action
 ↓
response
```

Do not put crawler implementation directly inside API route handlers.

---

# 20. AUTHENTICATION

Implement secure authentication.

At minimum:

* sign up
* sign in
* sign out
* session management
* protected routes

Use secure password hashing if passwords are used.

Never store plaintext passwords.

Use secure, HTTP-only cookies for sessions.

Do not expose session secrets to the client.

Implement proper authorization.

---

# 21. AUTHORIZATION

Every monitor operation must verify ownership.

Never trust a client-provided monitor ID.

Correct flow:

```text
authenticated user
 ↓
load monitor
 ↓
verify owner
 ↓
perform operation
```

Admin pages must verify admin privileges on the server.

Client-side route hiding is NOT authorization.

---

# 22. CRAWLER

The crawler is the core technical subsystem.

Keep it isolated from Next.js UI code.

Architecture:

```text
Crawler
├── Core
├── Fetchers
├── Extraction
├── Normalization
├── Detection
├── Security
├── Proxies
└── Types
```

Use clear interfaces.

For example:

```text
Fetcher
├── HTTP fetcher
└── Browser fetcher
```

The rest of the application must not depend directly on Patchright APIs.

---

# 23. ADAPTIVE CRAWLING

Do not launch a browser for every URL.

Use an adaptive strategy:

```text
URL
 ↓
SSRF validation
 ↓
HTTP request
 ↓
Inspect response
 ↓
Useful content?
 ├── YES → extraction → normalization → diff
 └── NO → browser rendering → extraction → normalization → diff
```

Browser rendering should be a fallback when appropriate.

This is important for scalability.

---

# 24. PATCHRIGHT

Use:

```text
Patchright
```

for browser automation/rendering.

Keep it behind a browser-fetcher abstraction.

Do not scatter Patchright code across the codebase.

The crawler architecture should make it possible to replace Patchright later.

Support:

* Chromium/browser launch
* navigation
* waiting
* DOM extraction
* relevant browser interaction
* timeout handling
* cleanup

Always close browser contexts/pages correctly.

Prevent resource leaks.

---

# 25. WEBSITE SUPPORT

Support:

### Static HTML

Plain server HTML.

### SSR

Websites generated server-side.

### React

Both SSR and CSR.

### Vue

SSR and SPA.

### Angular

SPA.

### Svelte

SSR/CSR.

### Next.js

Including dynamic and client-rendered pages.

### Generic SPA

Pages whose meaningful content appears only after JavaScript execution.

Do not assume every website behaves the same.

---

# 26. EXTRACTION

Use an extraction layer.

Potentially use appropriate mature packages such as:

* Cheerio
* JSDOM
* Mozilla Readability

depending on the actual use case.

The extraction system should support:

* full page
* main content
* CSS selector
* XPath where justified
* element selection
* attribute selection where useful

The user should be able to choose what part of a page is monitored.

---

# 27. NORMALIZATION

Raw HTML comparison is insufficient.

Normalize irrelevant changes such as:

* tracking parameters
* scripts
* volatile attributes
* generated IDs
* timestamps where configured
* ads
* dynamic classes
* irrelevant whitespace
* irrelevant DOM noise

Make normalization configurable.

Do not accidentally remove meaningful content.

---

# 28. DIFF ENGINE

Create:

```text
src/lib/diff/
├── hash.ts
├── normalize.ts
├── text.ts
├── dom.ts
├── compare.ts
└── types.ts
```

Use multiple representations where useful:

```text
html hash
text hash
structure hash
```

Detect meaningful differences.

Generate human-readable diffs.

Support:

```text
added
removed
modified
structural
textual
```

Do not simply compare raw HTML strings.

---

# 29. SNAPSHOTS

Each successful monitor check should create a snapshot.

A snapshot should contain enough data to understand the state at that point.

Track:

* timestamp
* HTTP status
* content hash
* extracted content
* relevant metadata
* fetch strategy
* error/challenge information

Avoid storing unnecessary duplicate data indefinitely.

---

# 30. CHANGE HISTORY

Users need:

```text
Monitor
 ↓
Timeline
 ↓
Snapshot
 ↓
Change
 ↓
Diff
```

The UI should make historical changes easy to understand.

Provide:

* timestamp
* previous state
* new state
* summary
* detailed diff

---

# 31. QUEUE

Use:

* BullMQ
* Redis

Architecture:

```text
src/lib/queue/
├── connection.ts
├── queues.ts
├── jobs.ts
└── scheduler.ts
```

Expensive crawler work must NOT execute directly inside normal request handlers.

Requests should enqueue work.

---

# 32. WORKER

Create a separate worker:

```text
worker/
├── index.ts
├── crawler/
├── jobs/
│   ├── check-monitor.ts
│   └── notification.ts
└── queue/
```

The worker should:

1. receive monitor job
2. load monitor
3. validate configuration
4. validate URL
5. perform crawl
6. extract content
7. normalize content
8. compare with previous snapshot
9. store snapshot
10. create change if needed
11. trigger notifications
12. record logs/metrics
13. complete job

Handle every failure explicitly.

---

# 33. RETRIES

Use controlled retry logic.

Libraries such as:

* p-retry
* p-limit
* Bottleneck

may be used where they provide genuine value.

Do not blindly retry everything.

Classify failures:

* timeout
* network failure
* DNS failure
* 429
* 5xx
* browser failure
* extraction failure
* challenge
* SSRF rejection
* invalid URL

Different failures should have different retry behavior.

---

# 34. RATE LIMITING

Respect websites.

Implement:

* per-monitor concurrency
* per-host concurrency
* retry backoff
* request delays
* job concurrency limits

Do not create a crawler that can hammer a target website.

---

# 35. PROXY SYSTEM

Build a proxy abstraction.

Do NOT hard-code one proxy provider.

Architecture:

```text
ProxyProvider
├── DirectProvider
└── ConfiguredProxyProvider
```

The crawler should be able to select:

```text
direct
configured proxy
```

through monitor configuration.

Public free proxy lists must NOT be treated as trusted production infrastructure.

If a public proxy source is supported for development/testing, treat every proxy as untrusted.

Never send sensitive authenticated traffic through arbitrary public proxies.

Never hard-code a random proxy list into the application.

Make proxy selection replaceable.

---

# 36. USER-AGENT SYSTEM

Create a controlled User-Agent provider.

Do not implement reckless fingerprint spoofing.

Support reasonable browser profiles.

Keep User-Agent selection isolated:

```text
UserAgentProvider
```

The crawler should not contain hardcoded scattered User-Agent strings.

---

# 37. ANTI-BOT / CHALLENGE HANDLING

The objective is reliable monitoring, not aggressive security bypassing.

Support legitimate mechanisms such as:

* browser rendering
* retries
* rate limiting
* timeout adjustment
* configured proxies
* configured authentication
* challenge detection

If the target blocks automation or presents a CAPTCHA/challenge, classify it appropriately.

Do not implement CAPTCHA solving.

Do not implement credential attacks.

Do not implement increasingly aggressive anti-bot evasion.

---

# 38. SSRF SECURITY

This is one of the highest-priority security requirements.

Before making ANY request to a user-supplied URL, validate it.

Block:

```text
localhost
127.0.0.0/8
private IPv4
link-local IPv4
IPv6 loopback
IPv6 link-local
IPv6 private/local ranges
cloud metadata endpoints
internal DNS names
```

Protect against:

* DNS rebinding
* redirects to internal addresses
* redirect chains
* alternate IP representations
* hostname tricks

Validate every redirect.

Apply:

* request timeout
* browser timeout
* maximum redirects
* maximum response size
* maximum DOM size
* maximum execution time

The monitoring service must never become an unrestricted internal-network proxy.

---

# 39. RESOURCE LIMITS

The crawler must be resource-bounded.

Control:

* browser instances
* browser contexts
* page count
* request duration
* response size
* DOM size
* concurrent jobs
* retries
* redirects

Always clean up browser resources.

---

# 40. NOTIFICATIONS

Build a notification abstraction.

Support:

* Email
* Webhook

Design for future channels.

Use Resend for email.

Notification logic should be separate from crawling logic.

Crawler produces a result.

Notification system decides whether/how to notify.

Support delivery state and failures.

---

# 41. LOGGING

Use Pino for structured logs.

Example:

```ts
logger.info(
  {
    monitorId,
    hostname,
    strategy,
    durationMs,
  },
  "Monitor check completed",
);
```

Never log:

* passwords
* tokens
* API keys
* cookies
* Authorization headers
* session secrets
* sensitive monitored content

---

# 42. OBSERVABILITY

Use:

```text
src/lib/observability/
├── logger.ts
├── metrics.ts
└── errors.ts
```

Keep observability isolated.

Use Sentry only if it provides real value and configure it safely.

---

# 43. DASHBOARD

The dashboard should include:

* total monitors
* active monitors
* paused monitors
* recent changes
* recent checks
* failed checks
* monitor health
* recent activity

Do not use fake metrics.

Everything displayed as real operational data should come from the actual database/system.

---

# 44. MONITOR LIST

Provide:

* search
* filtering
* sorting
* status
* last checked
* next check
* recent change
* actions

Actions:

* open
* edit
* check now
* pause
* resume
* delete

Use proper confirmation for destructive actions.

---

# 45. CREATE MONITOR

Create a polished multi-section monitor form.

Possible sections:

### Basic

* name
* URL

### Monitoring

* schedule
* fetch mode
* timeout
* retry behavior

### Content

* selector
* extraction mode
* normalization

### Notifications

* notification channels
* email
* webhook

### Advanced

* User-Agent profile
* proxy mode
* wait strategy
* browser fallback

Do not overwhelm the user.

Use progressive disclosure for advanced configuration.

---

# 46. MONITOR DETAIL

Show:

* monitor status
* URL
* current state
* last check
* next check
* recent changes
* snapshot history
* health
* configuration
* actions

Make the change history the primary focus.

---

# 47. CHANGE VIEWER

Create a professional diff viewer.

Support:

* summary
* added content
* removed content
* modified content
* timestamps
* previous/new snapshot
* side-by-side view where appropriate
* unified view where appropriate

Make it readable on mobile.

---

# 48. SNAPSHOT VIEWER

Users should be able to inspect historical snapshots.

Provide:

* timestamp
* status
* hashes
* extracted content
* relevant metadata
* comparison with adjacent snapshots

---

# 49. ADMIN

Create:

```text
/admin
/admin/users
/admin/monitors
/admin/jobs
/admin/system
```

Admin dashboard should show real operational information.

Examples:

* user count
* active monitors
* queue depth
* running jobs
* failed jobs
* crawler health
* recent errors
* system health

Never expose secrets.

Never rely on client-side checks for admin security.

---

# 50. ERROR HANDLING

Create clear typed errors.

Examples:

```text
ValidationError
AuthenticationError
AuthorizationError
SSRFError
NetworkError
TimeoutError
ChallengeError
BrowserError
ExtractionError
DatabaseError
QueueError
```

Do not leak internal stack traces to users.

Return safe errors from API routes.

Log detailed errors server-side.

---

# 51. TYPESCRIPT

Use strict TypeScript.

Avoid `any`.

Prefer:

* unknown
* type guards
* discriminated unions
* Zod inference
* Drizzle inferred types

Crawler results should be typed.

Do not bypass type safety with excessive casts.

---

# 52. PERFORMANCE

Optimize intelligently.

Prioritize:

* Server Components
* minimal client JS
* efficient database queries
* database indexes
* queue-based crawling
* HTTP-first crawling
* browser fallback
* controlled concurrency
* caching where appropriate

Do not use browser automation when HTTP is sufficient.

---

# 53. ACCESSIBILITY

Target WCAG 2.2 AA.

Implement:

* keyboard navigation
* focus states
* semantic HTML
* accessible labels
* proper dialogs
* correct ARIA
* sufficient contrast
* touch-friendly controls
* reduced motion support

Do not use inaccessible custom widgets when shadcn provides a proper primitive.

---

# 54. LOADING / EMPTY / ERROR STATES

Every major page must handle:

* loading
* empty
* error
* success
* disabled
* retrying

Use:

```text
loading.tsx
error.tsx
not-found.tsx
```

where appropriate.

Use skeletons and empty-state components.

Never leave blank screens.

---

# 55. FILE NAMING

Use kebab-case:

```text
monitor-form.tsx
monitor-table.tsx
change-viewer.tsx
check-monitor.ts
ssrf.ts
```

Avoid giant files.

Split by responsibility.

---

# 56. NO DUPLICATION

Before creating a component/util:

1. Search the repository.
2. Check existing implementations.
3. Reuse where appropriate.
4. Refactor if necessary.

Do not create duplicate utilities.

Do not create multiple authentication implementations.

Do not duplicate database queries in API routes.

---

# 57. ENVIRONMENT VARIABLES

Create:

```text
.env.example
```

Expected variables may include:

```text
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
REDIS_URL=
RESEND_API_KEY=
SESSION_SECRET=
SENTRY_DSN=
```

Only include variables actually used.

Never hard-code secrets.

Never commit `.env`.

---

# 58. TESTING

Use Vitest.

Test:

### Unit

* URL validation
* SSRF
* normalization
* hashing
* diffing
* retry classification
* change detection
* extraction

### Integration

* database
* monitor CRUD
* snapshots
* changes
* queue jobs
* notifications

### Browser

Use Patchright where appropriate for application/browser tests.

Do not make tests dependent on random external websites.

Use controlled fixtures.

---

# 59. DEVELOPMENT SCRIPTS

Maintain clean scripts:

```text
dev
build
start
lint
format
test
```

Add additional scripts where useful.

Use Biome.

Do not introduce ESLint unnecessarily.

---

# 60. README

Create a proper README containing:

* what Prohor Track is
* architecture
* local setup
* Bun setup
* environment variables
* Turso setup
* Redis setup
* migrations
* development
* worker startup
* testing
* production deployment
* security considerations
* crawler architecture

Do not fill it with meaningless generic text.

---

# 61. IMPLEMENTATION ORDER

Do not attempt to randomly implement the entire project at once.

Follow this sequence.

## PHASE 1 — FOUNDATION

First:

1. Inspect the current project.
2. Inspect existing shadcn components.
3. Clean up the structure.
4. Install required dependencies.
5. Configure Tailwind v4.
6. Configure Hugeicons.
7. Configure Biome.
8. Configure environment validation.
9. Create route groups.
10. Create application layouts.
11. Create global design system.
12. Build the landing foundation.

Run:

```bash
bunx biome check .
bun run build
```

Fix all failures.

---

# 62. PHASE 2 — DATABASE

Implement:

* Turso
* Drizzle
* schema
* migrations
* indexes
* queries

Run database validation.

Then:

```bash
bunx biome check .
bun test
bun run build
```

Fix everything before proceeding.

---

# 63. PHASE 3 — AUTH

Implement:

* sign up
* sign in
* sign out
* session
* protected routes
* authorization
* admin authorization

Test authentication.

Then run:

```bash
bunx biome check .
bun test
bun run build
```

---

# 64. PHASE 4 — MONITORS

Implement:

* create
* read
* update
* delete
* pause
* resume
* manual check request

Build the dashboard UI.

Verify all operations.

---

# 65. PHASE 5 — CRAWLER

Implement:

1. SSRF
2. URL validation
3. HTTP fetcher
4. extraction
5. normalization
6. browser fallback
7. Patchright
8. timeout handling
9. retries
10. resource limits

Test using controlled fixtures.

---

# 66. PHASE 6 — DIFF

Implement:

* hashes
* normalization
* text diff
* DOM diff
* change classification
* diff rendering

Test extensively.

---

# 67. PHASE 7 — QUEUE + WORKER

Implement:

* Redis
* BullMQ
* queues
* scheduler
* worker
* monitor checking jobs
* retry logic

Verify the complete flow:

```text
Monitor
 ↓
Queue
 ↓
Worker
 ↓
Crawler
 ↓
Snapshot
 ↓
Diff
 ↓
Change
```

---

# 68. PHASE 8 — NOTIFICATIONS

Implement:

* email
* webhook
* delivery tracking
* failure handling

Verify:

```text
Change
 ↓
Notification decision
 ↓
Notification job
 ↓
Delivery
```

---

# 69. PHASE 9 — DASHBOARD

Complete:

* dashboard
* monitor list
* create monitor
* monitor detail
* changes
* snapshots
* settings
* responsive navigation

Polish UX heavily.

---

# 70. PHASE 10 — ADMIN

Complete:

* admin dashboard
* users
* monitors
* jobs
* system health

Ensure server-side authorization.

---

# 71. PHASE 11 — HARDENING

Review:

* SSRF
* authentication
* authorization
* secrets
* rate limiting
* resource limits
* crawler reliability
* browser cleanup
* retries
* error handling
* logging
* accessibility
* responsiveness
* performance

---

# 72. PHASE 12 — FINAL VERIFICATION

Run:

```bash
bunx biome check .
bun test
bun run build
```

Fix every issue.

Do not declare success if any of these fail.

---

# 73. IMPLEMENTATION STANDARD

A feature is NOT considered implemented merely because a file exists.

A feature is implemented only when:

```text
code exists
+
it is connected
+
the data flow works
+
the UI can use it
+
errors are handled
+
authorization is enforced
+
the relevant tests pass
+
the production build passes
```

Do not create fake implementations.

Do not create mock data pretending to be real.

Do not leave TODO placeholders for core functionality.

Do not create buttons that do nothing.

---

# 74. IMPORTANT CRAWLER PRINCIPLE

The crawler should be designed around reliability rather than aggressive evasion.

Use:

```text
HTTP-first
 ↓
adaptive browser fallback
 ↓
controlled User-Agent
 ↓
optional configured proxy
 ↓
rate limiting
 ↓
challenge detection
```

Do not build CAPTCHA solving.

Do not build credential attacks.

Do not build aggressive anti-bot bypass mechanisms.

The system should gracefully report when a target cannot be monitored.

---

# 75. FINAL ARCHITECTURAL PRINCIPLE

Keep the system modular:

```text
Next.js Web App
        │
        ├── Server Actions
        ├── API Routes
        ├── Auth
        └── Database
                 │
                 ▼
              Queue
                 │
                 ▼
               Worker
                 │
                 ▼
              Crawler
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
   HTTP Fetcher       Browser Fetcher
                           │
                       Patchright
       │                   │
       └─────────┬─────────┘
                 ▼
             Extraction
                 ▼
            Normalization
                 ▼
               Diff
                 ▼
             Snapshot
                 ▼
              Change
                 ▼
           Notification
```

The web application should remain responsive because expensive crawling happens asynchronously.

The crawler should be replaceable.

The browser engine should be replaceable.

The proxy provider should be replaceable.

The notification providers should be replaceable.

The database access layer should be isolated.

The UI should not know crawler implementation details.

---

# 76. START NOW

You are starting from the current minimal project.

Do NOT delete the project and recreate it.

Do NOT reset Git.

Do NOT clean the repository.

Do NOT destroy existing shadcn components.

First inspect the current repository and package configuration.

Then implement the architecture above systematically.

Work phase-by-phase.

After each major phase:

```bash
bunx biome check .
bun test
bun run build
```

Fix all failures before continuing.

Use Bun everywhere.

Use Next.js 16 and React 19 correctly.

Use Server Components by default.

Use Server Actions for mutations where appropriate.

Use thin API routes.

Use Drizzle + Turso for persistence.

Use Patchright behind a crawler abstraction.

Use BullMQ + Redis for asynchronous crawling.

Use Hugeicons for application icons.

Use shadcn/ui throughout the interface.

Make the entire product responsive and mobile-friendly.

Make the UI polished and professional.

Make security a first-class requirement.

Build the actual Prohor Track product, not a mockup or prototype.

Begin by inspecting the existing project and then proceed with Phase 1.
