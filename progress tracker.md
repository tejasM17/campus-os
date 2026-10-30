# Progress Tracker

Keep this file short. Read the phase specs + code for detail.

## Phase

- **Phase 01 — Foundation, API client, auth** — In progress
- Next: finish Phase 01 acceptance checks, then Phase 02 (Found items gallery)

## Stack (quick)

| Layer | Tech |
| --- | --- |
| App | Next.js 16 + React 19 + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Auth | Zustand persisted session, email + OTP |
| API | Live CampusOS backend via `src/lib/api/client.ts` |
| Types | `src/lib/api/types.ts` |

## Done / in progress

| Phase | Feature | Status / key locations |
| --- | --- | --- |
| 01 | Foundation, API client, auth | In progress — `src/lib/api/*`, `src/store/session.ts`, `app/login/page.tsx`, `src/components/auth/*` |
| 02 | Found items gallery | Not started — `app/(app)/findit/page.tsx` is currently a signed-in placeholder |
| 03 | Item detail + claims | Not started |
| 04 | Staff posting + resolution | Not started |
| 05 | Lost requests | Not started |
| 06 | My claims + polish | Not started |
| 07 | Production verification | Not started |

## Architecture invariants

- Follow `docs/project-doc.md`, `docs/architecture.md`, and the active `docs/specs/phase-NN-*.md` before implementation.
- The live backend is the source of truth. Call only documented `/api/v1/auth/*`, `/api/v1/users/me`, and `/api/v1/findit/*` endpoints through `src/lib/api/client.ts`.
- Keep API types faithful to `docs/architecture.md`; do not invent fields or mock app data.
- Keep server data out of local state; mutations invalidate query data when query support is added.
- Hide actions unavailable to the current role; the API remains the authorization boundary.
- Render user-provided text as text, never HTML. Display API dates in IST; `found_on` stays `YYYY-MM-DD`.

## Open

- Complete and verify Phase 01 against its manual acceptance check.
- Add the test scripts and dependencies required by the phase specs when those phases call for them; `package.json` currently has no test script.

## Context files (read order for new work)

1. `CLAUDE.md`
2. `docs/project-doc.md`
3. `docs/architecture.md`
4. Active `docs/specs/phase-NN-*.md`
5. This tracker
