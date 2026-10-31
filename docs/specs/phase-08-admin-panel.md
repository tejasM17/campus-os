# Phase 08 — Admin panel: user management

## Why this phase exists

Phases 01–07 ship the FindIt product for students, faculty and office staff —
but none of them can log in until an account exists. The backend has **no
self-registration**: the organisers issue the admin email + OTP
(`POST /api/v1/auth/admin/login`), and every other account is created by that
admin via `POST /api/v1/admin/users`, whose response contains the user's
login OTP. The admin panel is therefore the onboarding backbone of the whole
product, and it is **out of scope for FindIt itself** (see project-doc).

## The boundary (read before writing code)

- The admin panel is a **separate surface**: its own login page, its own
  route group `/admin`, its own guard, its own shell. It is not linked from
  the FindIt nav and FindIt routes are not linked from it.
- Admin and user sessions are **stored separately** (different storage keys).
  Logging into one never satisfies the other's guard, and logout of one does
  not clear the other. Do not merge the admin token into the FindIt session
  store.
- Using the admin token inside the FindIt app (so an admin can browse/claim)
  is **out of scope** for this phase. The API remains the authorization
  boundary; the UI just doesn't mix the two sessions.
- Only the documented admin endpoints may be called. There is no admin
  self-signup, no password reset, no bulk import — do not invent them.

## Endpoint map (complete — anything not here is out of scope)

| Function | Call | Notes |
|---|---|---|
| adminLogin | POST /api/v1/auth/admin/login | `{email_id, otp}` from organisers → `{access_token, expires_in, profile}` |
| adminMe | GET /api/v1/admin/me | profile refresh for the shell header |
| listUsers | GET /api/v1/admin/users?role=&cursor= | admin only; lists users **with OTPs**; role filter: student / faculty / office_staff |
| createUser | POST /api/v1/admin/users | JSON; role decides required fields; response includes the new user's `otp` |
| getUser | GET /api/v1/admin/users/{email_id} | single user (with OTP) |
| updateUser | PATCH /api/v1/admin/users/{email_id} | edit profile fields only — never role or email_id |
| deleteUser | DELETE /api/v1/admin/users/{email_id} | confirm first; handle per error.code |
| regenerateOtp | POST /api/v1/admin/users/{email_id}/regenerate-otp | response carries the new `otp`; old OTP stops working |

Create-user bodies (role decides the fields; **all are required**):

    {"role":"student","name":"Asha Kumar","usn":"1CF24CS001","dept":"CSE","email_id":"asha@team1.com","phone_number":"9876543210"}
    {"role":"faculty","name":"Dr. Meera Rao","designation":"Professor","email_id":"meera@team1.com","phone_number":"9876543212"}
    {"role":"office_staff","name":"Ravi Shetty","dept":"Student Affairs","designation":"Clerk","email_id":"ravi@team1.com","phone_number":"9876543211"}

- `email_id` must use the team domain issued by the organisers. Keep the
  domain in one constant (`ADMIN_TEAM_EMAIL_DOMAIN`) and validate client-side.
- Office staff dept names matter: `Student Affairs` runs DocDesk, `Campus
  Maintenance` runs FixIt — suggest via datalist, don't hard-reject others.
- Sample depts for students: CSE, ISE, ECE, MBA.

## Behaviour

**Admin login (`/admin-login`)**: email + OTP form → `adminLogin`, store the
admin session separately, land on `/admin`. Show the API's error message on
401 / 429. `401 TOKEN_EXPIRED` anywhere clears the admin session and
redirects to `/admin-login` — reuse the client's 401 handler against the
admin store.

**Admin shell (`/admin`)**: guard (no admin token → `/admin-login`), header
with admin name from `adminMe`, nav: **Users**, logout. Nothing else.

**Users list (`/admin/users`)**: table (desktop) / cards (mobile) from
`listUsers`. Columns: name, email, role badge, role-specific field (usn /
designation / dept), phone, OTP (masked `••••••` with per-row reveal toggle),
actions menu. Role filter chips: All / Students / Faculty / Office staff
(sends `?role=`). If the response paginates with `next_cursor`, show "Load
more"; if not, render all rows.

**Create user**: promote the existing `CreateUserPage` form into the panel —
keep the current form, it already follows the cookbook. On success, show the
returned OTP in a success alert with a **Copy** button; it is the only time
it is guaranteed visible.

**Edit user**: dialog pre-filled from the row. Editable: `name`,
`phone_number`, `usn`, `dept`, `designation`. `email_id` and `role` are
identity — render read-only. 422 shows `details[].field` next to the field.

**Regenerate OTP**: row action with confirm ("The current OTP stops working
immediately"). On success show the new OTP once with Copy.

**Delete user**: row action, confirm by typing the user's email. Surface the
API's error message on failure. Never silently swallow non-2xx.

## Security rules

- An OTP is a credential: masked by default in lists, revealed only on
  intent, copied via clipboard API, never logged, never in a URL.
- The admin token lives only in its own storage key; nothing sensitive in
  URLs; no secrets in the client bundle (OTP login only).
- Admin panel actions are hidden from non-admin sessions by the guard, not
  just disabled.

## Docs to update when this phase ships

- `docs/project-doc.md`: move "admin user management" from out-of-scope to
  scope (own surface, phase 08).
- `docs/architecture.md`: add the nine endpoint rows above to the endpoint
  map; add `AdminUser` / admin session types (faithful to the API).
- Progress tracker: Phase 08 row; note `src/features/admin/` already contains
  the create-user slice to build on, not duplicate.

## Acceptance check (manual)

1. Log in at `/admin-login` with the organiser-provided admin credentials;
   shell shows the admin profile from `adminMe`.
2. Create a student; the OTP is shown; log out, log in as that student at
   `/login` with email + OTP — session works, FindIt shell shows their name.
3. Users list shows all created users; role chips filter; OTPs masked until
   revealed.
4. Edit a user's phone/dept; logging in as that user shows the updated
   profile (`GET /api/v1/users/me`).
5. Regenerate OTP: the old OTP is rejected at `/login`, the new one works.
6. Delete a user: that email can no longer log in; the API's message shows
   if deletion is refused.
7. A non-admin token visiting `/admin` is redirected to `/admin-login`; an
   admin token is not treated as a student/staff session in FindIt.
8. `pnpm types && pnpm lint && pnpm test && pnpm build` pass; unit tests
   cover the admin API functions, role-field validation, and OTP masking.