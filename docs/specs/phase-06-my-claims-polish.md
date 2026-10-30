# Phase 06 — My claims + polish

## Behaviour

**/claims page** — `GET /claims/me`: cards for each of the user's claims
across posts: post title (link to detail), their message, decision pill
(pending/approved/rejected), created date. Withdraw action while pending
(same rules as phase 03). Empty state: "You haven't claimed anything yet."

**Polish pass over the whole app:**

- Toasts for every mutation success/failure; every API error message shown.
- Loading: skeletons on every list/detail. Nothing shows a bare spinner.
- Empty states on all four lists.
- Responsive pass: mobile single column + bottom sheets for dialogs; ≥md
  grids; ≥lg right-side detail panel on item page.
- Accessibility pass: status never color-only (badge has text), all dialogs
  trap focus and close on Escape, forms have labels, contrast AA.
- Meta: page titles per route.
- Cross-check against the cookbook field limits one final time.

**Tests must be green**: unit tests for the client error mapping, Zod
schemas, and viewmodel hooks (MSW at the fetch layer); one Playwright smoke:
login → gallery → open post → claim → visible in My claims.

## Acceptance check (manual)

1. /claims lists only the logged-in user's claims with correct pills.
2. Full journey on the live backend: student claims an item posted by staff;
   staff resolves it; student's pill flips to approved.
3. App usable at 360px width with no horizontal scroll.
4. `pnpm types && pnpm lint && pnpm test && pnpm build` green; Playwright
   smoke passes.
