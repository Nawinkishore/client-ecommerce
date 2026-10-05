Created At: 2026-10-05T08:50:44Z
Completed At: 2026-10-05T13:06:00Z
File Path: `file:///e:/New_Projects%282026%29/client-ecommerce/todo/02-backend-shared-packages.md`

# Phase 2: Backend Shared Packages (Types, Validation & Utils)

> **Focus**: Domain TypeScript interfaces, Zod request payload schemas, and pure utility functions.

---

## taskList

- [x] **Task 2.1: Domain Type Definitions Expansion**
  - **Location**: `packages/types/src/index.ts`
  - **Details**:
    - Add complete entity types: `Category`, `Subcategory`, `Product`, `ProductVariant`, `ProductImage`, `Cart`, `CartItem`, `Address`, `Order`, `OrderItem`, `PaymentTransaction`, `Review`.
    - Add API DTO types: `SignupDTO`, `LoginDTO`, `CreateProductDTO`, `UpdateProductDTO`, `AddToCartDTO`, `UpdateCartItemDTO`, `CreateAddressDTO`, `CheckoutIntentDTO`, `UpdateOrderStatusDTO`.
    - Add Paginated query response envelope: `PaginatedResponse<T>`.
  - **Verification**: `pnpm --filter @client-ecommerce/types build` executed cleanly.

- [x] **Task 2.2: Zod Validation Schemas Expansion**
  - **Location**: `packages/validation/src/index.ts`
  - **Details**:
    - Auth schemas: `SignupSchema`, `LoginSchema`.
    - Product schemas: `ProductQuerySchema`, `CreateProductSchema`, `UpdateProductSchema`, `ReviewSchema`.
    - Cart schemas: `AddToCartSchema`, `UpdateCartItemSchema`, `SyncCartSchema`.
    - Address schemas: `CreateAddressSchema`, `UpdateAddressSchema`.
    - Checkout & Order schemas: `CheckoutIntentSchema`, `UpdateOrderStatusSchema`.
  - **Verification**: `pnpm --filter @client-ecommerce/validation build` & unit test suite passed 100%.

- [x] **Task 2.3: Reusable Utility Helpers Expansion**
  - **Location**: `packages/utils/src/index.ts`
  - **Details**:
    - Add `formatCurrency(amount, currency)` helper.
    - Add `slugify(text)` helper.
    - Add `generateOrderNumber()` helper (e.g. `ORD-YYYYMMDD-XXXX`).
    - Add `calculatePaginationMeta(total, page, limit)` helper.
  - **Verification**: `pnpm --filter @client-ecommerce/utils build` & unit test suite passed 100%.
