# 4. API Design & Zod DTO Contracts Specification

## 4.1 REST API Architecture & Envelope Format

All REST API endpoints in `apps/api` (and Next.js API route handlers) return a standardized JSON response format.

### Success Response Envelope
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input payload",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address format"
      }
    ]
  }
}
```

---

## 4.2 Endpoint Specifications Matrix

### 1. Authentication & User Profile (`/api/v1/auth` & `/api/v1/users`)
- `POST /api/v1/auth/signup` - Register a new customer account
- `POST /api/v1/auth/login` - Authenticate customer & issue session token
- `POST /api/v1/auth/logout` - Invalidate current session
- `GET /api/v1/users/me` - Fetch authenticated user profile & addresses
- `PUT /api/v1/users/me` - Update user profile information
- `POST /api/v1/users/me/addresses` - Add a new shipping/billing address

### 2. Product Catalog (`/api/v1/categories` & `/api/v1/products`)
- `GET /api/v1/categories` - Fetch hierarchical list of categories & subcategories
- `GET /api/v1/products` - Search, filter, sort, and paginate product catalog
- `GET /api/v1/products/:slug` - Fetch detailed product specs, variants, and reviews
- `POST /api/v1/products/:id/reviews` - Submit product rating and review (authenticated)

### 3. Shopping Cart (`/api/v1/cart`)
- `GET /api/v1/cart` - Retrieve current active shopping cart items
- `POST /api/v1/cart/items` - Add product variant to cart
- `PATCH /api/v1/cart/items/:id` - Update quantity of cart item
- `DELETE /api/v1/cart/items/:id` - Remove item from cart
- `POST /api/v1/cart/sync` - Merge guest local storage cart with user cart upon login

### 4. Checkout & Payment (`/api/v1/checkout` & `/api/v1/webhooks`)
- `POST /api/v1/checkout/intent` - Initialize Stripe/Razorpay payment intent & validate stock
- `POST /api/v1/webhooks/stripe` - Webhook handler to receive payment completion events and finalize orders

### 5. Orders (`/api/v1/orders`)
- `GET /api/v1/orders` - List customer's past order history (paginated)
- `GET /api/v1/orders/:orderNumber` - View detailed invoice and tracking status for a specific order

### 6. Admin Engine (`/api/v1/admin`)
- `GET /api/v1/admin/analytics` - Executive dashboard statistics (Revenue, Orders, Low Stock Alerts)
- `POST /api/v1/admin/products` - Create new product with variants & image metadata
- `PUT /api/v1/admin/products/:id` - Update product information and stock counts
- `PATCH /api/v1/admin/orders/:id/status` - Update order fulfillment status (Processing, Shipped, Delivered)

---

## 4.3 Key Zod DTO Validation Schemas (`packages/validation`)

### Sample Code Snippet: Product Filter Schema
```typescript
import { z } from "zod";

export const ProductQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  subcategoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
```

### Sample Code Snippet: Cart Action Schema
```typescript
import { z } from "zod";

export const AddToCartSchema = z.object({
  productVariantId: z.string().uuid({ message: "Invalid product variant ID" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
```
