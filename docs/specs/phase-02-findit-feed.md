# Phase 02 — Found items gallery

## Behaviour

`GET /api/v1/findit/posts` rendered as a paged card grid, mobile-first.

- Query key `['posts', status, cursor]`; cursor pagination via
  `next_cursor`, surfaced as a "Load more" button while it is non-null.
- Card shows: first image (or placeholder), title, location_found badge,
  found_on date, StatusBadge (active=green, resolved=blue, archived=gray —
  `resolved` renders as "Resolved" even though `status` may read archived).
- Search filters client-side over the loaded page? No — the API has no search
  param. Filter chips are status only: Active / Archived (GET
  `?status=archived`). Do not fake search.
- Skeleton cards while loading; EmptyState when zero items; error toast on
  failure with retry.
- Office staff see a "+ Post found item" button (top-right) — wired in a
  later phase, button hidden for other roles now.
- Card click → `/findit/[postId]`.

## Acceptance check (manual)

1. Gallery lists real posts from the live backend, newest first.
2. "Load more" appends pages; button disappears at the end of the list.
3. Active/Archived chips switch the list via the status param.
4. Loading shows skeletons; empty archived list shows the empty state.
5. The post button appears for a staff login and not for a student login.
