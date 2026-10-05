# Phase 7: Store Administration Dashboard & Monorepo Verification

> **Focus**: Admin Dashboard UI, Product & Order Management, Security Audit, and Full-Stack End-to-End Verification.

---

## taskList

- [x] **Task 7.1: Admin Guard & Sidebar Layout**
  - **Location**: `apps/web/src/app/(admin)/admin/layout.tsx`
  - **Details**:
    - Protect admin route segment: verify authenticated user has `role === 'ADMIN'`.
    - Redirect non-admin users to `/login` or `/` with unauthorized toast warning.
    - Admin Sidebar with links to Dashboard, Products, Orders, Categories, and Analytics.
  - **Verification**: Attempt accessing `/admin` as guest, customer, and admin user.

- [x] **Task 7.2: Admin Dashboard Page (`/admin/dashboard`)**
  - **Location**: `apps/web/src/app/(admin)/admin/dashboard/page.tsx`
  - **Details**:
    - Executive metric cards: Total Revenue, Total Orders, Active Customers, Low Stock Alerts.
    - Sales revenue chart / visual metric breakdown.
    - Recent Orders table preview.
  - **Verification**: Verify metrics accurately display backend statistics API data.

- [x] **Task 7.3: Admin Product Management (`/admin/products`)**
  - **Location**: `apps/web/src/app/(admin)/admin/products/page.tsx`, `apps/web/src/components/admin/ProductFormModal.tsx`
  - **Details**:
    - Filterable table of all store products with SKU, base price, total stock, and status toggle (`isActive`).
    - Create/Edit Product Modal supporting title, description, subcategory, base price, image URLs, and variant builder (Size/Color/Stock).
  - **Verification**: Create a new product, edit price & stock, verify creation in frontend catalog and PostgreSQL DB.

- [x] **Task 7.4: Admin Order Management (`/admin/orders`)**
  - **Location**: `apps/web/src/app/(admin)/admin/orders/page.tsx`
  - **Details**:
    - Order list table with customer name, total amount, payment status, and fulfillment status.
    - Order Status Update dropdown (`PENDING_PAYMENT` -> `PAID` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED` -> `CANCELLED`).
    - Tracking number input field.
  - **Verification**: Update order status from `PROCESSING` to `SHIPPED`; verify status updates in customer order history.

- [x] **Task 7.5: Full-Stack Verification & Build Audit**
  - **Location**: Monorepo Root
  - **Details**:
    - Execute `pnpm run type-check` across all apps and packages.
    - Execute `pnpm run build` across all workspace packages (`apps/api`, `apps/web`, `packages/*`).
    - Execute API unit tests (`pnpm --filter api test`).
  - **Verification**: All commands exit with status code 0.
