# Release checklist — Phase 07

Run date: 2026-10-31

## Production build and server

- [x] Production build completes successfully via `npm.cmd run build` (`pnpm` is not installed in this environment).
- [x] Production server starts via `npm.cmd run start` and every route responds without a server error. See the route results below.
- [x] API base URL is read from `NEXT_PUBLIC_API_URL`, with the production backend as its default.
- [x] No token is passed in a URL; the session persists in browser storage.
- [x] No backend credentials or secrets are configured in the client bundle; authentication uses the OTP login flow.

Route smoke results (production server):

| Route | Result |
| --- | --- |
| `/` | HTTP 200 |
| `/login` | HTTP 200 |
| `/findit` | HTTP 200; client route guard redirects unauthenticated users after hydration |
| `/claims` | HTTP 200; client route guard redirects unauthenticated users after hydration |
| `/findit/lost-requests` | HTTP 200; client route guard redirects unauthenticated users after hydration |
| `/findit/phase-07-smoke` | HTTP 200; dynamic route renders its client route guard |

## Live backend acceptance

- [ ] Login, gallery, claim, and resolution verified against the live backend from the production build.
- [ ] Lost request create/list/update verified against the live backend from the production build.
- [ ] Staff and student role-scoped views verified against the live backend.

Live acceptance is pending an authorized staff and student login session and completion of the Phase 02–06 manual browser checks. No live write actions or claims are recorded as verified here.

## Code checks

- [x] TypeScript: `tsc --noEmit` passes.
- [x] Production build: passes.
- [ ] Lint: `npm.cmd run lint` reports existing `react-hooks/set-state-in-effect` errors in `hooks/use-mobile.ts` and `src/components/providers/theme-provider.tsx`, plus a navigation warning in `src/lib/api/client.ts`.
