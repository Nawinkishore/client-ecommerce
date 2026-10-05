# Phase 3: Backend API Core Architecture & Middleware

> **Focus**: Express architecture, standardized JSON envelope, validation middleware, and Supabase JWT auth middleware in `apps/api`.

---

## taskList

- [x] **Task 3.1: Standardized API Response Helper & Error Classes**
  - **Location**: `apps/api/src/utils/response.ts` & `apps/api/src/errors/app-error.ts`
  - **Details**:
    - Implement `sendSuccess(res, data, message, meta)` envelope function.
    - Implement `sendError(res, statusCode, code, message, details)` envelope function.
    - Create `AppError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ValidationError` custom error classes.
  - **Verification**: Write unit test or manual assertion for response envelope format.

- [x] **Task 3.2: Request Payload Validation Middleware**
  - **Location**: `apps/api/src/middleware/validate.ts`
  - **Details**:
    - Build `validateRequest({ body, query, params })` higher-order middleware accepting Zod schemas.
    - Catch Zod validation errors and format them into structured `VALIDATION_ERROR` response payload.
  - **Verification**: Test endpoint with invalid payload and check structured 400 JSON response.

- [x] **Task 3.3: Supabase Auth & JWT Verification Middleware**
  - **Location**: `apps/api/src/middleware/auth.ts`
  - **Details**:
    - Extract `Authorization: Bearer <token>` from HTTP headers.
    - Verify JWT using Supabase Auth SDK or JWT secret.
    - Fetch corresponding `Profile` record from database using `userId`.
    - Attach `req.user = { id, userId, email, role }` to request context.
  - **Verification**: Test protected route with valid and invalid JWT tokens.

- [x] **Task 3.4: Admin Authorization Guard Middleware**
  - **Location**: `apps/api/src/middleware/admin.ts`
  - **Details**:
    - Verify `req.user` exists and `req.user.role === 'ADMIN'`.
    - Return `FORBIDDEN` (403) status if user is non-admin.
  - **Verification**: Test endpoint with customer token vs admin token.

- [x] **Task 3.5: Global Express Error Handling Middleware**
  - **Location**: `apps/api/src/middleware/error-handler.ts`
  - **Details**:
    - Intercept uncaught exceptions, Prisma database errors, and custom `AppError` instances.
    - Sanitize error messages in production mode to prevent information leaks.
  - **Verification**: Trigger simulated error and inspect response.
