# Project Development Rules & Guidelines (`AGENTS.md`)

This repository serves as a production-grade monorepo foundation for a client e-commerce platform. All development agents and contributors must strictly adhere to the high-level project rules defined below.

---

## 1. High-Level Core Rules

### 1.1 Inspect Before Modifying
- Always inspect the target file, existing interfaces, and parent module dependencies before making code changes.
- Verify existing signatures, imports, and schemas to avoid broken contracts or redundant functionality.

### 1.2 Plan Before Significant Implementation
- Create a clear, step-by-step implementation plan before introducing new features, architectural changes, or refactoring existing modules.
- Seek explicit confirmation on architectural boundaries or major dependency additions.

### 1.3 Small Scoped Tasks
- Keep pull requests and work increments small, focused, and single-purpose.
- Avoid mixing structural changes, refactorings, and feature additions in a single step.

### 1.4 No Unrelated Changes
- Do not modify formatting, whitespace, or code in files unrelated to the task at hand.
- Maintain clean, minimal diffs.

### 1.5 No Invented Business Requirements
- Strict adherence to explicit client/user requirements only.
- Do not assume domain rules, product attributes, payment logic, or pricing models without explicit directives.

### 1.6 Strict Type Safety
- Use strict type checking across all workspaces (`apps/` and `packages/`).
- Avoid `any` types; prefer strict interfaces, generics, and domain types where applicable.
- Maintain explicit return types for public API functions and methods.

### 1.7 Separation of Concerns
- **`apps/web`**: UI components, state management, and page routing only.
- **`apps/api`**: HTTP routes, controllers, middleware, and database access logic.
- **`packages/types`**: Shared domain models and DTO interfaces.
- **`packages/validation`**: Centralized request payload and domain schemas.
- **`packages/config`**: Centralized environment variable parsing and global constants.
- **`packages/utils`**: Reusable pure helper functions.

### 1.8 Payload & Input Validation
- Validate all incoming API request payloads, query parameters, and form inputs using centralized validation schemas.
- Reject invalid input early at the API boundary with standard structured error responses.

### 1.9 Testing Expectations
- Write unit tests for utility methods, domain logic, and validation schemas.
- Write integration tests for API endpoints and database operations.
- Ensure all tests pass cleanly before completing a task.

### 1.10 Security Best Practices
- Never hardcode secrets, API keys, or database credentials.
- Sanitize inputs to prevent SQL injection, XSS, and CSRF vulnerabilities.
- Enforce strict CORS policies and HTTP security headers.

### 1.11 Environment Variables
- Manage configuration exclusively through environment variables validated at app startup.
- Provide `.env.example` templates for local setup without exposing real credentials.

### 1.12 Documentation Standards
- Keep `README.md` files updated across all packages and apps.
- Document key architectural decisions and complex workflows under `docs/`.

### 1.13 Git Safety & Cleanliness
- Commit atomic, well-described changes.
- Never commit build artifacts (`dist/`, build directories), `node_modules/`, or sensitive `.env` files.
