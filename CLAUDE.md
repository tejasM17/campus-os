# CampusOS FindIt UI

A Next.js frontend for the already-deployed CampusOS API. The backend is live at
https://campus-os-backend-8sjf.onrender.com and is treated as read-only truth:
this project never mocks data, never invents fields, and never builds UI for
endpoints that don't exist in the API cookbook.

Why any rule exists is in `docs/project-doc.md`. This file is the rules. 
- for every meaning full implementaions, update the `progress tracker.md` 

## Stack

Next.js 15+ (App Router), React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui,
Zustand for client stores, TanStack Query for server state, React Hook Form + Zod
for forms, Vitest + React Testing Library for tests, Playwright for smoke tests.
pnpm. If you're not certain about an API, read the docs inside the installed
package rather than going from memory.

## Backend contract

- Base URL: `https://campus-os-backend-8sjf.onrender.com`
- All calls except login carry `Authorization: Bearer <token>`.
- The token lives 12 hours (`expires_in: 43200`). On 401 TOKEN_EXPIRED, send the
  user back to login automatically.
- Base paths used in this project: `/api/v1/auth/*`, `/api/v1/users/me`,
  `/api/v1/findit/*`. Nothing else gets called.
- Interactive API explorer lives at `{baseUrl}/docs` — verify any doubt there
  before coding around it.

## How we work

Spec driven. Nothing gets built without a spec.

- `docs/project-doc.md` — what this app is and every decision behind it.
- `docs/specs/phase-NN.md` — one per phase, written before it starts. Behaviour
  plus an acceptance check, never just filenames.
- This file — always true, read on every prompt.

**Starting a phase.** Read this file and that phase's spec. Build what the spec
asks, then stop.

**Dropped into a fresh context?** Look at `docs/specs/` and the git log. The
last passing phase is the last commit. Say what you've worked out before building.

**The acceptance check is mine to run, not yours.** It's a manual browser list.
Build so the listed things are true, then say it's ready. What you verify
yourself: `pnpm types`, `pnpm lint`, `pnpm test`, `pnpm build`.

**When a phase comes out wrong, reset rather than patch.** Prompting on top of
wrong code three times leaves code nobody understands. If a spec is ambiguous,
say so before you build.

## Architecture (MVVM, enforced by directory layout)

- `src/lib/api/` — the ONLY place that knows the base URL and fetch. Every call
  goes through one typed client: inject token, parse `{error:{code,message}}`,
  map HTTP codes. Nothing else in the app calls `fetch` directly.
- `src/lib/api/types.ts` — TypeScript types transcribed 1:1 from the cookbook
  JSON (FoundPost, Claim, LostRequest, Profile, Paged<T>, ApiError).
- `src/viewmodels/` — per-screen hooks (useFoundPosts, useClaims, ...). All
  TanStack Query + Zustand lives here. Components never import the api client.
- `src/components/` — presentational only. Props in, events out. No fetch, no
  stores, no router calls.
- `src/app/` — routes and layout only: login, (app)/findit, (app)/lost-requests.
- Route guards read the auth store; the API still enforces auth, guards are UX
  not security.

## Conventions

Strict TypeScript, no `any`. If a type is genuinely awkward, say so rather than
casting.

Comment the decisions, not the syntax.

One obvious way to do something beats a configurable one.

User text is rendered as text, never as HTML — React escapes by default, never
use `dangerouslySetInnerHTML`.

Dates from the API are UTC (`...Z`); display in IST. Dates like `found_on` are
`YYYY-MM-DD` and render as-is.

File `url` fields expire in ~15 minutes — use them only for `<img>` preview,
never store them. Downloads go through token-authenticated endpoints.

Status color system, identical everywhere: active = green, resolved = blue,
archived = gray, pending = amber, rejected = red.

## Things not to do

Breaking one of these is worse than not finishing.

- **Never call an endpoint that isn't in the cookbook.** If the UI wants data
  the API doesn't send, the UI changes, not the backend.
- **Never show fields the current role can't see.** Staff see all claims;
  students see only their own. Hide, don't disable.
- **Don't install a package without asking.** Name it, say what for, wait.
- **Don't build ahead of the current phase.** No scaffolding for what's coming.
- **Don't weaken a check to make it pass.** A check that can't run must fail loudly.
- **Don't leave the build broken.** Report the failure instead of working around it.
- **Don't hard-code data.** Sample values from the cookbook are for dropdowns
  and placeholders only; lists always come from the API.
