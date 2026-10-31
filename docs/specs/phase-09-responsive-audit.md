# Phase 09 — Responsive role surfaces

## Behaviour

Audit and correct the existing student, faculty, office-staff, and admin
surfaces for narrow mobile viewports without changing the API contract or
role permissions.

- FindIt routes: `/findit`, `/findit/[postId]`, `/findit/lost-requests`, and
  `/claims`. Student and faculty views remain owner-scoped; staff retain their
  documented review and report-management actions.
- Admin routes: `/admin-login`, `/admin`, and `/admin/users`; keep the separate
  admin session and expose the user list as touch-friendly cards on narrow
  screens and a table where it fits.
- At 360px viewport width, no page or interactive element may force horizontal
  scrolling. Keep controls reachable above mobile navigation and safe areas;
  retain visible labels, focus indicators, and touch targets of at least 44px.
- Keep wider layouts readable at tablet and desktop widths. Do not add mock
  content, new endpoints, or actions outside the documented role contract.

## Acceptance check

1. Inspect every listed route at 360px, 768px, and 1280px in Chrome DevTools;
   check document overflow, page screenshots, and console errors.
2. Check mobile navigation, profile menus, filters, list cards, detail content,
   forms/dialogs, and admin account actions where the current session permits.
3. Verify the student, faculty, staff, and admin route variants using their
   existing authorized sessions; do not create or mutate live records for the
   audit.
4. Record routes that could not be exercised because a valid role session or
   live backend access was unavailable.
