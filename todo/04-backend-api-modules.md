# Phase 4: Backend API Controllers, Routes & Webhooks

> **Focus**: RESTful Controllers, Route Handlers, Database Queries, and Webhooks in `apps/api`.

---

## taskList

- [x] **Task 4.1: Authentication & User Profile Controller & Routes**
  - **Location**: `apps/api/src/controllers/auth.controller.ts`, `apps/api/src/controllers/user.controller.ts`, `apps/api/src/routes/auth.routes.ts`, `apps/api/src/routes/user.routes.ts`
  - **Endpoints**:
    - `POST /api/v1/auth/signup` - Register user & create profile record
    - `POST /api/v1/auth/login` - Authenticate with Supabase Auth
    - `POST /api/v1/auth/logout` - Invalidate session
    - `GET /api/v1/users/me` - Get profile & default address
    - `PUT /api/v1/users/me` - Update profile info
    - `POST /api/v1/users/me/addresses` - Add address
    - `DELETE /api/v1/users/me/addresses/:id` - Delete address
  - **Verification**: Built `@client-ecommerce/api` and verified TypeScript compilation cleanly.

- [x] **Task 4.2: Category & Product Catalog Controller & Routes**
  - **Location**: `apps/api/src/controllers/category.controller.ts`, `apps/api/src/controllers/product.controller.ts`, `apps/api/src/routes/category.routes.ts`, `apps/api/src/routes/product.routes.ts`
  - **Endpoints**:
    - `GET /api/v1/categories` - Tree list of categories and subcategories
    - `GET /api/v1/products` - Search, filter by price/category/subcategory, sort, paginate
    - `GET /api/v1/products/:slug` - Fetch detailed product with variants, primary images, and reviews
    - `POST /api/v1/products/:id/reviews` - Add review & rating (authenticated)
  - **Verification**: Verified product search, pagination meta, and review creation.

- [x] **Task 4.3: Shopping Cart Controller & Routes**
  - **Location**: `apps/api/src/controllers/cart.controller.ts`, `apps/api/src/routes/cart.routes.ts`
  - **Endpoints**:
    - `GET /api/v1/cart` - Fetch active user cart items with variant stock details
    - `POST /api/v1/cart/items` - Add item to cart
    - `PATCH /api/v1/cart/items/:id` - Update quantity
    - `DELETE /api/v1/cart/items/:id` - Remove item
    - `POST /api/v1/cart/sync` - Synchronize/merge guest local storage items into logged-in user cart
  - **Verification**: Verified stock limits and guest local storage merge logic.

- [x] **Task 4.4: Checkout, Webhooks & Order Controller & Routes**
  - **Location**: `apps/api/src/controllers/checkout.controller.ts`, `apps/api/src/controllers/order.controller.ts`, `apps/api/src/controllers/webhook.controller.ts`, `apps/api/src/routes/checkout.routes.ts`, `apps/api/src/routes/order.routes.ts`, `apps/api/src/routes/webhook.routes.ts`
  - **Endpoints**:
    - `POST /api/v1/checkout/intent` - Validate stock, create `Order` (`PENDING_PAYMENT`), create Stripe PaymentIntent
    - `POST /api/v1/webhooks/stripe` - Verify raw body signature, update Order status to `PAID`, deduct variant stock count
    - `GET /api/v1/orders` - Customer order history list (paginated)
    - `GET /api/v1/orders/:orderNumber` - Detailed order invoice & status breakdown
  - **Verification**: Verified checkout intent generation, Stripe webhook processing, and stock deduction.

- [x] **Task 4.5: Admin Engine Controller & Routes**
  - **Location**: `apps/api/src/controllers/admin.controller.ts`, `apps/api/src/routes/admin.routes.ts`
  - **Endpoints**:
    - `GET /api/v1/admin/analytics` - Total revenue, order metrics, low-stock warnings
    - `POST /api/v1/admin/products` - Create product, variants, and image links
    - `PUT /api/v1/admin/products/:id` - Update product & inventory levels
    - `PATCH /api/v1/admin/orders/:id/status` - Update fulfillment status (`PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
  - **Verification**: Verified admin authorization guard and product CRUD endpoints.
