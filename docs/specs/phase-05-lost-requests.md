# Phase 05 — Lost requests

## Behaviour

`/findit/lost-requests` + create/edit flows. Non-admin only (API rejects
admin).

- List `GET /lost-requests?status=&mine=`: staff default = everyone's;
  a "Mine" toggle sends `mine=true`; students/faculty always see their own
  (API enforces). Status chips Active / Archived.
- Row/card: requester name + role, title, description, location_lost,
  lost_on, StatusBadge.
- "Report lost item" dialog: title (3–100, required), description,
  location_lost, lost_on (not future). JSON POST.
- Owner actions (only on own): Edit (PATCH any of title/description/
  location_lost/lost_on), "Mark as found" → PATCH `{status:'archived'}`,
  "Reactivate" on archived → `{status:'active'}`, Delete (confirm).
- Staff see all rows with requester phone visible (API provides it); the
  point of the staff view is to match lost reports against found posts.

## Acceptance check (manual)

1. Student reports a lost item; it appears in their list as active.
2. Student cannot see another user's lost request; staff login sees both.
3. Owner marks found → status archived with the gray badge; reactivate works.
4. Edit and delete work for the owner only (hidden otherwise).
5. Admin login gets a clear "not available for admin" state (API 403s).
