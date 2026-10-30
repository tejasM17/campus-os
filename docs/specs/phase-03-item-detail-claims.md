# Phase 03 — Item detail + claiming

## Behaviour

`/findit/[postId]` — `GET /posts/{id}` plus claims.

- Header: image gallery (swipe/carousel over `images[]`; if empty, a
  placeholder block), title, description, location_found, found_on,
  posted-by, StatusBadge.
- Active + not resolved: "This is mine" button opens the claim form
  (`POST /posts/{id}/claims`, JSON `{message}` 10–1000 chars, Zod-validated,
  counter shown). Success → the claim appears in the list, form replaced by
  "Claim submitted" state. 409 ALREADY_EXISTS (second claim) → toast.
- Claims section, `GET /posts/{id}/claims` (role-scoped by the API):
  - Staff: every claim — avatar, name, role, phone, message, decision pill
    (pending=amber / approved=green / rejected=red). Resolve controls are a
    later phase; render the list now.
  - Student/faculty: only their own claim with a "Withdraw" button
    (DELETE /claims/{id}); on 409 CLAIM_LOCKED show a note instead.
- Archived or resolved post: banner at top — resolved → "Item returned to
  owner", archived → "This post is archived". No claim form.

## Acceptance check (manual)

1. Detail page shows every field the API returns for the post.
2. Student submits a claim; it appears immediately in the claims list.
3. Student sees only their own claim; staff login on the same post sees all.
4. Withdraw works while pending; after resolution the withdraw is gone and
   the decision pill shows the outcome.
5. Claim message under 10 chars is blocked client-side with the field
   highlighted.
