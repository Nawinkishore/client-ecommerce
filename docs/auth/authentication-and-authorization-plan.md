# 07. Comprehensive Authentication & Authorization Fix & Enhancement Plan

## Goal Description
Resolve all remaining errors and friction points in the Authentication & Authorization flow across **Next.js Frontend** (`apps/web`), **Express Backend API** (`apps/api`), and **Supabase Auth**.

Specifically, this plan addresses:
1. **Supabase Email Confirmation Delivery**: Adding explicit `emailRedirectTo` parameters to `supabase.auth.signUp()` and setting proper callback routes so confirmation emails are dispatched reliably with valid activation links.
2. **Same-Origin API Proxying (`next.config.js`)**: Adding Next.js API rewrites (`/api/:path*` -> `http://localhost:5000/api/:path*`) to eliminate cross-port cookie blockage and CORS preflight overhead, guaranteeing that HttpOnly session cookies (`sb-access-token`, `sb-refresh-token`) are readable by Next.js Edge Middleware.
3. **Auth Confirmation Callback Handler (`/auth/callback`)**: Creating a dedicated Next.js App Router route (`apps/web/src/app/auth/callback/route.ts` & client handler) to catch Supabase hash/query tokens (`#access_token=...`, `?code=...`) from email links and activate user sessions seamlessly.
4. **Resend Confirmation Email API**: Adding a backend endpoint (`POST /api/v1/auth/resend-confirmation`) for users who did not receive or lost their confirmation email.

---

## Detailed Step-by-Step TODO Tasks Matrix

### Task 1: Add Next.js Configuration with Same-Origin API Rewrites
- **Objective**: Eliminate cross-port cookie blockage between Next.js (`:3000`) and Express API (`:5000`).
- **Files**: `apps/web/next.config.js` [NEW]

---

### Task 2: Configure Explicit Supabase Email Confirmation Redirect & Resend Endpoint
- **Objective**: Fix missing email confirmation delivery in Supabase signup.
- **Files**:
  - `apps/api/src/controllers/auth.controller.ts` [MODIFY]
  - `apps/api/src/routes/auth.routes.ts` [MODIFY]

---

### Task 3: Create Auth Confirmation Callback Handler (`/auth/callback`)
- **Objective**: Process confirmation links clicked from email inboxes.
- **Files**: `apps/web/src/app/auth/callback/page.tsx` [NEW]

---

### Task 4: Enhance Registration UI with Resend Email Capability
- **Objective**: Provide user feedback and resend option when confirmation email is pending.
- **Files**: `apps/web/src/app/(auth)/register/page.tsx` [MODIFY]

---

### Task 5: End-to-End Verification & Automated Test Suite
- **Objective**: Confirm zero regression and 100% working authentication flow.
- **Commands**:
  - `pnpm run type-check`
  - `pnpm --filter api test`

---

## Resolved "Email Rate Limit Exceeded" Supabase Error

1. **Root Cause**: Supabase Cloud enforces a strict default rate limit of **3 to 4 emails per hour** when using Supabase's built-in default SMTP server. Triggering account creations, password resets, or resends repeatedly returns HTTP 429 (`email rate limit exceeded`).
2. **Backend Error Interception**: Express API controllers format rate limit responses with actionable diagnostic advice.
3. **Local Dev / Testing Resolution**: In Supabase Dashboard -> **Auth** -> **Providers** -> **Email**, toggle OFF **"Confirm email"** (or enable Auto-confirm users) to bypass default SMTP quotas during local development.
4. **Production Resolution**: Configure a Custom SMTP provider (SendGrid, Resend, AWS SES, Postmark) in Supabase Email Settings to permanently lift the 3-4 emails/hour restriction.

