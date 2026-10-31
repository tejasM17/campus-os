# CampusOS FindIt UI

The product decisions behind this build, written before it starts, with the
reasoning attached. Read the part you need before you build something.

## What it is

A premium, mobile-first web UI for Track 01 of CampusOS — FindIt: Lost & Found —
talking to an already-live backend at
https://campus-os-backend-8sjf.onrender.com.

Office staff post found items with photos. Students and faculty browse the
gallery, open an item, and claim it with a proof message. Staff review all
claims on a post and resolve it by approving exactly one — the post archives
itself, the chosen claim is approved, the rest are rejected. Separately, anyone
can report a lost item; staff see everyone's lost reports, everyone else sees
their own.

## The bet

The backend and its data model are fixed. The entire product value of this
project is the UI: it must make a first-time user successful in under a minute
— find the gallery, recognise their item, claim it — and make staff fast —
post in seconds, review claims in one glance, resolve in one click. Every
decision below is measured against those two sentences.

## Who's who

Roles come from `profile.role` after login; office staff also carry `dept`.

| Role | In FindIt they can |
|---|---|
| office_staff | post/edit/archive/delete found posts, see ALL claims, resolve posts, see everyone's lost requests |
| student / faculty | browse, claim, withdraw own pending claim, see own lost requests, report lost items |
| admin | use the separate Phase 08 user-management panel; the admin session is not used by FindIt |

The API enforces all of this; the UI mirrors it by hiding actions the role
can't use. Hidden, not disabled — a disabled button for a forbidden action is
clutter.

## Scope

- Login (email + OTP) with token persistence and automatic redirect on 401.
- Found items gallery: paged grid, search, status filter, skeleton loading,
  empty state.
- Item detail: image gallery, all post fields, claim form, claims list
  (role-scoped), resolved/archived states.
- Staff workflows: post found item (up to 5 images), edit, archive/reopen,
  delete, claims review, resolve with optional note, undo resolution.
- My claims: list of own claims across posts with decision status.
- Lost requests: report, list (role-scoped), edit, mark as found (archived),
  reactivate, delete.
- Error handling driven by `error.code` with one shared handler.
- Phase 08 admin user management on its own `/admin-login` and `/admin/*` surface, with separate session storage and the documented admin account endpoints.

## Out of scope, and why

- **Other tracks (Notice Hub, DocDesk, FixIt).** This build includes Track 01
  plus the separate Phase 08 onboarding panel; the other tracks remain out of scope.
- **Using an admin session in FindIt.** The admin panel and FindIt have separate
  storage keys and guards. Admins do not enter FindIt with their admin token.
- **Mocking or a local backend.** The API is live and shared. Tests use MSW to
  intercept at the fetch layer, never a fake data module the UI imports.
- **Notifications, chat, real-time.** The API has no such endpoints.
- **Claim resolution by non-staff.** Only staff resolve. The UI must not imply
  otherwise.
- **Storing file URLs.** They expire in ~15 minutes; only `<img>` previews use
  them, transiently.

## How it works

**The API client is the only network boundary.** `src/lib/api/client.ts`
owns the base URL, the auth header, JSON/form-data selection, and error
normalisation (`{error:{code,message,details}}` → typed `ApiError`). Every
request in the app passes through it. If it can't be done through the client,
it isn't done.

**ViewModels own state; components own nothing.** Each screen has a hook in
`src/viewmodels/` that wraps TanStack Query for server state and Zustand for
session/auth. Components receive props and emit events. This keeps screens
testable without rendering and swapping implementations cheap.

**Server state is never copied into local state.** Lists come from the query
cache; mutations invalidate the affected keys. No manual "refresh" buttons.

**Pagination is cursor-based, invisible until needed.** Lists page with
`?cursor=` (`next_cursor: null` = end). The UI loads the first page and shows
a "Load more" button while `next_cursor` exists — no page numbers, the API
doesn't have them.

**Auth is a guard, not a wall.** The route group `(app)` checks the token
store and redirects to `/login`. The API is the real enforcement; the guard
just avoids flashing protected screens.

## The interface

A clean campus product, not a dashboard. Generous whitespace, one accent
color (indigo), zinc neutrals, Inter. Status is always color + label, never
color alone (accessibility). Mobile-first: single column, bottom sheet modals;
on desktop the same screens grow into grids and a right-side detail panel.

**Nothing moves on its own.** Loading is skeletons that match the layout;
success is a toast; errors are toasts with the API's message. No ambient
animation.

**Premium means fast and legible, not decorated.** Shadows subtle, radius
consistent (rounded-lg), one primary action per screen.

## Where this is likely to go wrong

**Role-scoped rendering.** The claims list looks identical for staff and
students but shows different data. The acceptance check must log in as both.

**Image handling.** Up to 5 images, 5MB each, JPEG/PNG/WebP; client validates
before upload and shows per-image errors from `error.code` (TOO_MANY_IMAGES,
IMAGE_TOO_LARGE, UNSUPPORTED_IMAGE_TYPE).

**Resolved vs archived.** A resolved post can't be reopened by PATCH (409
POST_RESOLVED) — the only path back is undoing the resolution. The UI must
route staff to the right action, not expose the wrong one.

**Token expiry mid-session.** 12 hours is long enough to forget. Every query
must handle 401 TOKEN_EXPIRED by clearing the session and redirecting to login.

## What has to be true before this ships

- A student can log in, find a post, and submit a claim; staff can log in,
  see that claim, and resolve the post — all against the live backend.
- The same post renders differently per role: staff see all claims + resolve
  controls; students see only their own claim.
- Archive/reopen works for active posts; a resolved post shows "Undo
  resolution", not "Reopen".
- Lost requests: staff see everyone's; a student sees only their own; owner
  can mark found and reactivate.
- `pnpm types && pnpm lint && pnpm test && pnpm build` all pass.
