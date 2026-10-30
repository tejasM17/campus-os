# Phase 01 — Foundation: project, API client, auth

## Behaviour

Scaffold the Next.js project (App Router, TS strict, Tailwind v4, shadcn/ui)
and build the two things every later phase stands on: the typed API client
and session management.

**API client** (`src/lib/api/client.ts`): one `apiCall<T>(method, path,
opts)` function. Injects `Authorization: Bearer <token>` from the session
store (except login). Chooses JSON vs form-data by caller. Parses success
JSON; on non-2xx throws `ApiError {code, message, details, request_id}` from
the body. On network failure throws a synthetic `ApiError {code:'NETWORK'}`.

**Types** (`src/lib/api/types.ts`): transcribe the cookbook types exactly as
in docs/architecture.md. No extra fields, no guesses.

**Session** (`src/store…/session.ts` via Zustand persist): token, profile,
expiry timestamp. `login(email, otp)` calls the endpoint and stores the
result. `logout()` clears. A route-guard component wraps `(app)` and
redirects to `/login` when no valid token exists.

**Login page**: email + OTP form, submits to `POST /api/v1/auth/login`,
stores session, routes by `profile.role`. Shows the API's error message on
401 INVALID_CREDENTIALS / 400 UNKNOWN_INSTITUTION / 429 RATE_LIMITED.

**401 handling everywhere**: the client, on TOKEN_EXPIRED/UNAUTHORIZED,
clears the session and redirects to /login.

## Acceptance check (manual)

1. `pnpm types`, `pnpm lint`, `pnpm test`, `pnpm build` all pass.
2. Login at /login with a real user against the live backend succeeds and
   lands on the app shell showing that user's name and role.
3. Reloading the page keeps the session (no re-login).
4. With a corrupted token in storage, the next API call redirects to /login.
