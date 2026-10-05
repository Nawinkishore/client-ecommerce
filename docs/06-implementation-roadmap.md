# 6. Master Implementation Roadmap & Milestones

## 6.1 Phase Breakdown Overview

```
Phase 1: Workspace & Infra (Supabase, Prisma, Config)
   ↓
Phase 2: Shared Packages & Backend API Core
   ↓
Phase 3: Catalog & Search (Next.js & TanStack Query)
   ↓
Phase 4: Cart System & User Auth Flow
   ↓
Phase 5: Checkout, Webhooks & Order Engine
   ↓
Phase 6: Admin Dashboard, Analytics & Final Verification
```

---

## 6.2 Milestone Schedule & Activities

### Phase 1: Infrastructure & Monorepo Foundation
- [ ] Initialize Supabase project & obtain PostgreSQL database connection credentials.
- [ ] Configure `packages/config` environment validation schema using Zod.
- [ ] Set up Prisma ORM in `apps/api` (or shared package) with PostgreSQL datasource.
- [ ] Execute initial database migration for `schema.prisma`.
- [ ] **Verification**: Run `pnpm run build` and `pnpm run type-check` across monorepo.

### Phase 2: Shared Packages & API Core
- [ ] Build `@client-ecommerce/types` with core domain interfaces.
- [ ] Build `@client-ecommerce/validation` with Zod schemas for Auth, Products, Cart, and Orders.
- [ ] Implement Express API core controllers in `apps/api` with standardized response middleware.
- [ ] Build Supabase Auth verification middleware in API.
- [ ] **Verification**: Execute API endpoint unit tests and Zod parsing tests.

### Phase 3: Frontend Foundation & Product Catalog
- [ ] Setup Next.js App Router root layout, Tailwind CSS configuration, and TanStack Query provider in `apps/web`.
- [ ] Create UI primitives (Button, Input, Card, Badge, Skeleton, Dialog).
- [ ] Implement Homepage with Hero banner and category grid.
- [ ] Implement Catalog page (`/products`) with sidebar filtering, pagination, and TanStack Query data fetching.
- [ ] Implement Product Detail page (`/products/[slug]`) with image gallery and variant selector.
- [ ] **Verification**: Verify visual rendering, responsive layout, and filter queries.

### Phase 4: User Auth & Shopping Cart System
- [ ] Implement Auth pages (`/login`, `/register`) connected to Supabase Auth SDK.
- [ ] Create `useCart` hook supporting unauthenticated guest cart (local storage) and authenticated cart sync.
- [ ] Implement Cart Drawer / Page with live subtotal calculation and item count updates.
- [ ] **Verification**: Test cart updates, quantity changes, item removal, and guest-to-user cart synchronization.

### Phase 5: Checkout Flow & Order Processing
- [ ] Build multi-step Checkout page (`/checkout`) with address selector and order review.
- [ ] Integrate Stripe/Razorpay client-side SDK and backend PaymentIntent endpoint.
- [ ] Implement Stripe webhook endpoint (`POST /api/v1/webhooks/stripe`) to verify signatures and update order status to `PAID`.
- [ ] Implement Customer Order History page (`/account/orders`) and Order Detail page (`/account/orders/[id]`).
- [ ] **Verification**: Test end-to-end checkout with payment test cards and verify order record creation in Prisma DB.

### Phase 6: Admin Dashboard & System Verification
- [ ] Implement Admin Layout and Dashboard page (`/admin/dashboard`) with sales metric cards.
- [ ] Implement Admin Product Management table with modal for product creation/editing.
- [ ] Implement Admin Order Status update actions.
- [ ] Perform security audit (CORS, RLS policies, input sanitization).
- [ ] **Verification**: Execute full end-to-end user flow from product discovery to admin fulfillment.
