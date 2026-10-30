# Phase 04 — Staff posting + resolution

## Behaviour

Everything office-staff-only, hidden for other roles.

**Post found item** (from the gallery button): dialog with title (3–100),
description, location_found (2–120), found_on date picker (not future),
image upload (multi, ≤5, ≤5MB each, JPEG/PNG/WebP, preview + remove each).
Form-data POST. Per-image and form errors from error.code:
TOO_MANY_IMAGES / IMAGE_TOO_LARGE / UNSUPPORTED_IMAGE_TYPE. Success →
invalidate `['posts']`, new card at top (API returns newest first), toast.

**Edit / archive / delete** on own posts (detail page dropdown, staff only):
- Edit reopens the same form PATCHed (fields only; `images` replaces all).
- Archive / Reopen: PATCH with `status`. Archived shows archived banner +
  "Reopen" action. Resolved posts must NOT offer reopen — 409 POST_RESOLVED;
  offer "Undo resolution" instead (see below).
- Delete with confirmation. On 409 POST_HAS_PENDING_CLAIMS show "Resolve or
  wait for claims before deleting".

**Resolution**: on the claims list, staff pick a pending claim →
`POST /posts/{id}/resolution {claim_id, note?}` (optional note field in the
dialog). Result: post resolved, chosen claim approved, others rejected.
Then: banner "Resolved", "Undo resolution" button (DELETE resolution → post
active, all claims pending), and PATCH resolution to change the chosen
claim/note. Resolved posts show staff the resolution details (claimant,
note, resolved_by) from GET /posts/{id}/resolution; other users only ever
see `resolved: true` — never claimant details.

## Acceptance check (manual)

1. Staff posts an item with 3 photos; it appears at the top of the gallery.
2. Uploading a 6th image or a >5MB file is blocked with the right message.
3. Staff resolves a post with 2 claims: chosen = approved, other = rejected,
   post banner = resolved.
4. Undo resolution restores the post to active with both claims pending.
5. Archive blocks claiming (409 POST_NOT_ACTIVE surfaced as a toast if
   attempted) and reopen restores it.
6. Delete on a post with pending claims shows the blocked message; after
   resolution, delete succeeds.
7. A student viewing a resolved post sees "Item returned to owner" and no
   claimant details anywhere.
