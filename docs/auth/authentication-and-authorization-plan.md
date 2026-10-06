# 07. Authentication & Authorization Architectural Blueprint & Plan

## Goal Description
Establish a production-grade, secure, and seamless Authentication and Authorization (AuthN/AuthZ) ecosystem across the monorepo for both **Next.js 14 Web Frontend** (`apps/web`), **Node.js Express API** (`apps/api`), and **Supabase PostgreSQL & Auth**.

This plan addresses all critical flaws in the current codebase (such as `localStorage` token storage, client-only route guards, missing Next.js middleware, hardcoded fallback passwords, lack of rate limiting, network bottlenecks on auth middleware, and desynchronization between Supabase Auth and Prisma profiles), while detailing the exact implementation for cookie-based session management, edge middleware route protection, JWT signature verification, database trigger profile synchronization, and strict Role-Based Access Control (RBAC).

---

## Existing Codebase Vulnerabilities & Architectural Flaws Audit

### 1. Frontend Flaws (`apps/web`)
* **Insecure Storage (XSS Vulnerability)**: `auth-context.tsx` and `api-client.ts` store access and refresh tokens directly in `localStorage`. Any XSS vector allows attackers to extract tokens and impersonate users/admins.
* **Client-Only Guard Flicker & SSR Vulnerability**: Route protection relies solely on client components (`AdminGuard`, `ProtectedRoute`). Pages render partially before client JS evaluates, causing layout flashes (FOUC), SEO leakage, and inability for Server Components / Server Actions to authenticate requests.
* **Lack of Next.js Edge Middleware**: Missing `middleware.ts` to inspect session tokens before page request completion, leaving protected routes (`/admin/*`, `/account/*`, `/checkout/*`) unprotected at the server layer.
* **No Cross-Tab Session Sync**: Logging out or refreshing tokens in one browser tab does not synchronize state across open browser tabs via `storage` / `BroadcastChannel` events.
* **Incomplete Auth Flows**: Missing OAuth (Google/GitHub) PKCE integration, and password reset handling does not handle URL hash fragments or PKCE authorization codes properly.

### 2. Backend Flaws (`apps/api`)
* **Hardcoded Fallback Password Security Risk**: In `auth.controller.ts`, `signUp` defaults to `password || "TemporaryPass123!"` if password is omitted, creating a major security vulnerability for passwordless/OAuth signups.
* **Auth Middleware Latency & Network SPOF**: `requireAuth` middleware calls `supabase.auth.getUser(token)` over HTTP on every incoming request, introducing ~100-300ms network overhead per request and creating a network single point of failure.
* **Orphaned User Profile State**: `signUp` creates a Supabase Auth user first, then attempts a separate Prisma `Profile.create()`. If DB creation fails, an orphaned Supabase user exists without a corresponding database profile.
* **Missing Security Controls**:
  * No rate limiting on `/auth/login`, `/auth/signup`, `/auth/refresh`, or `/auth/forgot-password` routes (vulnerable to brute-force attacks).
  * Permissive CORS (`app.use(cors())`) allows requests from any origin.
  * Absence of Security Headers (`helmet`).
  * Tokens transmitted solely via JSON body/headers rather than secure `HttpOnly`, `SameSite=Lax/Strict`, `Secure` cookies.

---

## Target System Architecture & Auth Flow

```
                                  +---------------------------------------+
                                  |         Browser / Next.js Client      |
                                  |  (Cookies: sb-access-token, refresh)  |
                                  +-------------------+-------------------+
                                                      |
                                          HTTP Request w/ Cookie
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |     Next.js 14 Middleware (Edge)      |
                                  |   - Validates JWT Cookie              |
                                  |   - Protects /admin/* & /account/*    |
                                  +-------------------+-------------------+
                                                      |
                                           Proxied / API Request
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |      Node.js Express API Server       |
                                  |  - Helmet / Rate Limiter              |
                                  |  - Fast Local JWT/JWKS Verification   |
                                  |  - RBAC Middleware (CUSTOMER/ADMIN)   |
                                  +---------+-------------------+---------+
                                            |                   |
                                Prisma ORM  |                   | Supabase JS SDK
                                            v                   v
                                  +---------+-------------------+---------+
                                  |            Supabase Cloud             |
                                  |  - PostgreSQL Database (RLS)          |
                                  |  - Auth DB Trigger (handle_new_user)   |
                                  +---------------------------------------+
```

---

## Implementation Details & Key Components

### Component 1: PostgreSQL Trigger for Atomic Profile Sync
```sql
-- Trigger Function in Supabase PostgreSQL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, "userId", email, "fullName", role, "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'CUSTOMER',
    NOW(),
    NOW()
  )
  ON CONFLICT ("userId") DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Component 2: Next.js Edge Middleware (`apps/web/src/middleware.ts`)
Inspects session tokens directly from cookies before page execution, preventing unauthorized access and FOUC flashes for `/admin/*` and `/account/*`.

### Component 3: Express Security & Fast JWT Verification (`apps/api`)
- Adds `helmet`, `express-rate-limit`, `cookie-parser`, and strict `cors`.
- Validates JWT signatures directly using JWKS/public keys for low latency, falling back to Supabase auth API when necessary.
- Removes hardcoded fallback passwords.

---

## Verification Plan

### Automated Verification
1. **Lint & Type Check**:
   ```bash
   pnpm run type-check
   ```
2. **Backend Auth Tests**:
   ```bash
   pnpm --filter api test
   ```

### Manual Verification
1. **User Signup & Login Flow**:
   - Register a new user via frontend form; verify `public.profiles` entry is created automatically via DB trigger.
   - Verify `HttpOnly` cookies (`sb-access-token`, `sb-refresh-token`) are set in browser inspect tab.
2. **Server-Side Route Guarding**:
   - Try navigating directly to `/admin/dashboard` as an unauthenticated user; verify immediate server-side redirect to `/login`.
3. **Role-Based Access Control**:
   - Log in as a `CUSTOMER`; try accessing `/admin/dashboard`; verify forbidden response/redirect.
   - Log in as an `ADMIN`; verify full access to `/admin/dashboard`.
4. **Token Refresh & Logout**:
   - Expire access token and make an API request; verify auto-refresh via HttpOnly refresh cookie.
   - Perform logout; verify cookies are purged and state clears in all browser tabs.
