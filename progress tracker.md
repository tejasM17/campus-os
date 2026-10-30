# Progress Tracker

Keep this file short. Read the phase specs + code for detail.

## Phase

- **Phase 03 — Item detail + claims** — Implemented; manual acceptance pending
- **Phase 04 — Staff posting + resolution** — Implemented; manual acceptance pending
- **Phase 05 — Lost requests** — Implemented; manual acceptance pending
- **Phase 06 — My claims + polish** — Implemented; manual acceptance pending
- **Phase 07 — Production verification** — Build and unauthenticated production route smoke checks complete; live backend manual acceptance pending
- Next: Complete live release checklist

## Stack (quick)

| Layer | Tech |
| --- | --- |
| App | Next.js 16 + React 19 + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Auth | Zustand persisted session, email + OTP |
| API | Live CampusOS backend via `src/lib/api/client.ts` |
| Types | `src/lib/api/types.ts` |

## Done / in progress

- UI polish: restored the dark theme's neutral black and dark-gray palette in `app/globals.css`.

| Phase | Feature | Status / key locations |
| --- | --- | --- |
| 01 | Foundation, API client, auth | In progress — `src/lib/api/*`, `src/store/session.ts`, `app/login/page.tsx`, `src/components/auth/*` |
| 02 | Found items gallery | Implemented; manual acceptance pending — `app/(app)/findit/page.tsx`, `src/viewmodels/use-found-posts.ts`, `src/components/findit/*` |
| 03 | Item detail + claims | Implemented; manual acceptance pending — `app/(app)/findit/[postId]/page.tsx`, `src/viewmodels/use-post.ts`, `src/viewmodels/use-claims.ts`, `src/components/findit/*` |
| 04 | Staff posting + resolution | Implemented; manual acceptance pending — `src/components/findit/post-form-dialog.tsx`, `src/viewmodels/use-staff-workflows.ts`, `src/lib/api/endpoints.ts`, gallery and item detail screens |
| 05 | Lost requests | Implemented; manual acceptance pending — `app/(app)/findit/lost-requests/page.tsx`, `src/components/lost/*`, `src/viewmodels/use-lost-requests.ts`, `src/lib/api/endpoints.ts` |
| 06 | My claims + polish | Implemented; manual acceptance pending — `app/(app)/claims/*`, `src/viewmodels/use-claims.ts`, shared dialogs and mutation feedback |
| 07 | Production verification | Build and production route smoke checks complete; live backend acceptance pending — `docs/release-checklist.md`, `src/lib/api/client.ts` |

## Architecture invariants

- Follow `docs/project-doc.md`, `docs/architecture.md`, and the active `docs/specs/phase-NN-*.md` before implementation.
- The live backend is the source of truth. Call only documented `/api/v1/auth/*`, `/api/v1/users/me`, and `/api/v1/findit/*` endpoints through `src/lib/api/client.ts`.
- Keep API types faithful to `docs/architecture.md`; do not invent fields or mock app data.
- Keep server data out of local state; mutations invalidate query data when query support is added.
- Hide actions unavailable to the current role; the API remains the authorization boundary.
- Render user-provided text as text, never HTML. Display API dates in IST; `found_on` stays `YYYY-MM-DD`.

## Open

- Complete Phase 01 and Phase 02 manual acceptance checks.
- Add test tooling and the Phase 06 unit/Playwright coverage; `package.json` currently has no test script or test dependencies, and installing packages requires approval.

## Context files (read order for new work)

1. `CLAUDE.md`
2. `docs/project-doc.md`
3. `docs/architecture.md`
4. Active `docs/specs/phase-NN-*.md`
5. This tracker
