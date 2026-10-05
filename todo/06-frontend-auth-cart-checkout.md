# Phase 6: Frontend Auth, Shopping Cart & Checkout (`apps/web`)

> **Focus**: Auth pages, Guest/User Cart state management, Multi-step Checkout, and Stripe integration.

---

## taskList

- [ ] **Task 6.1: User Authentication Pages & Session Hook**
  - **Location**: `apps/web/src/app/(auth)/login/page.tsx`, `apps/web/src/app/(auth)/register/page.tsx`, `apps/web/src/hooks/use-auth.ts`
  - **Details**:
    - Implement Login & Register forms with Zod validation (`@client-ecommerce/validation`).
    - Integrate Supabase Auth SDK (`@supabase/supabase-js`).
    - Store JWT session in cookies / local storage and pass bearer token in API requests.
    - Create `useAuth` hook providing `user`, `role`, `isAuthenticated`, `login()`, `logout()`, `register()`.
  - **Verification**: Test sign up, sign in, invalid credential feedback, and logout.

- [ ] **Task 6.2: Universal Cart State Hook (`useCart`)**
  - **Location**: `apps/web/src/hooks/use-cart.ts`
  - **Details**:
    - Guest Mode: Store cart items in browser `localStorage`.
    - Customer Mode: Sync cart items with `/api/v1/cart` backend endpoints via TanStack Query.
    - Login Sync: When user logs in, trigger `POST /api/v1/cart/sync` to merge guest items into DB cart.
    - Provide `addItem`, `updateQuantity`, `removeItem`, `clearCart`, `subtotal`, `totalCount`.
  - **Verification**: Add items as guest, log in, verify items transferred to user profile cart.

- [ ] **Task 6.3: Shopping Cart Page (`/cart`)**
  - **Location**: `apps/web/src/app/(shop)/cart/page.tsx`
  - **Details**:
    - Itemized cart table with product thumbnails, variant details, quantity increment/decrement controls, and remove buttons.
    - Subtotal summary card with tax estimation, shipping notice, and "Proceed to Checkout" CTA.
  - **Verification**: Verify subtotal calculations update dynamically when quantities change.

- [ ] **Task 6.4: Multi-Step Checkout Page (`/checkout`)**
  - **Location**: `apps/web/src/app/(shop)/checkout/page.tsx`, `apps/web/src/components/checkout/AddressForm.tsx`, `apps/web/src/components/checkout/PaymentForm.tsx`, `apps/web/src/components/checkout/OrderSummary.tsx`
  - **Details**:
    - Step 1: Shipping Address Selection / Add New Address.
    - Step 2: Shipping Method Selection (Standard, Express).
    - Step 3: Stripe Payment Element integration using `@stripe/stripe-js` and `@stripe/react-stripe-js`.
    - Step 4: Final Order Review & Submit.
  - **Verification**: Submit test payment card (Stripe 4242...) and observe redirect to success page.

- [ ] **Task 6.5: Order Confirmation Page (`/checkout/success`)**
  - **Location**: `apps/web/src/app/(shop)/checkout/success/page.tsx`
  - **Details**:
    - Show success celebration animation, order number, shipping address summary, and downloadable order receipt button.
  - **Verification**: Confirm cart is cleared after successful checkout.

- [ ] **Task 6.6: Customer Account & Order History Pages**
  - **Location**: `apps/web/src/app/(shop)/account/profile/page.tsx`, `apps/web/src/app/(shop)/account/orders/page.tsx`, `apps/web/src/app/(shop)/account/orders/[id]/page.tsx`
  - **Details**:
    - Account profile page for editing name, phone, and managing default addresses.
    - Customer Order History page showing past orders with status badges (`PAID`, `PROCESSING`, `SHIPPED`).
    - Order detail page with itemized breakdown and tracking progress timeline.
  - **Verification**: Check order timeline and invoice breakdown.
