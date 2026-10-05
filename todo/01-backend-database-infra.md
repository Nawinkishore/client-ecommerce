# Phase 1: Backend Database & Infrastructure Setup

> **Focus**: PostgreSQL, Prisma ORM, Environment Validation, and Database Seeding.

---

## taskList

- [x] **Task 1.1: Prisma Schema Configuration**
  - **Location**: `apps/api/prisma/schema.prisma`
  - **Details**:
    - Implement PostgreSQL datasource with `DATABASE_URL` and `DIRECT_URL`.
    - Define Enums: `Role` (`CUSTOMER`, `ADMIN`), `OrderStatus` (`PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`), `PaymentStatus` (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`), `PaymentProvider` (`STRIPE`, `RAZORPAY`, `CASH_ON_DELIVERY`).
    - Define Models: `Profile`, `Address`, `Category`, `Subcategory`, `Product`, `ProductVariant`, `ProductImage`, `Cart`, `CartItem`, `Order`, `OrderItem`, `PaymentTransaction`, `Review`.
    - Add database indexes on `subcategoryId`, `title/description`, `productId`, `profileId`, and `orderNumber`.
  - **Verification**: `npx prisma validate` executed cleanly in `apps/api`.

- [x] **Task 1.2: Environment Variables Validation & Template**
  - **Location**: `packages/config/src/index.ts` & `.env.example`
  - **Details**:
    - Extend Zod schema for database credentials: `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
    - Create root `.env.example`, `apps/api/.env.example`, and `apps/api/.env`.
  - **Verification**: Built `@client-ecommerce/config` workspace without errors.

- [x] **Task 1.3: Prisma Database Migration Setup**
  - **Location**: `apps/api/package.json`
  - **Details**:
    - Configure migration scripts: `"db:generate": "prisma generate"`, `"db:migrate": "prisma migrate dev"`, `"db:studio": "prisma studio"`, `"db:seed": "tsx prisma/seed.ts"`.
  - **Verification**: `npx prisma generate` executed successfully and generated `@prisma/client`.

- [x] **Task 1.4: Database Seeding Script**
  - **Location**: `apps/api/prisma/seed.ts`
  - **Details**:
    - Seed categories (Electronics, Fashion) and subcategories (Laptops, Audio, Apparel).
    - Seed sample products with variants (Size/Color), images, and initial stock counts.
    - Seed admin user profile and test customer user profile with address and sample order.
  - **Verification**: Seed script written and verified via TypeScript check & runner.
