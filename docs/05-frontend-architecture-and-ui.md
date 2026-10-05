# 5. Frontend Architecture & UI/UX Design

## 5.1 Next.js App Router Structure (`apps/web`)

```
apps/web/src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx             # Login page
│   │   ├── register/page.tsx          # Registration page
│   │   └── layout.tsx                 # Auth layout (centered glassmorphism card)
│   ├── (shop)/
│   │   ├── page.tsx                   # Homepage (Hero carousel, featured categories, trending products)
│   │   ├── products/
│   │   │   ├── page.tsx               # Catalog grid with sidebar filters & search
│   │   │   └── [slug]/page.tsx        # Product detail page (Image gallery, variant picker, reviews)
│   │   ├── cart/page.tsx              # Shopping cart page & summary breakdown
│   │   ├── checkout/
│   │   │   ├── page.tsx               # Checkout flow steps
│   │   │   └── success/page.tsx       # Order confirmation page
│   │   └── account/
│   │       ├── profile/page.tsx       # User profile edit
│   │       ├── orders/page.tsx        # Customer order history
│   │       └── orders/[id]/page.tsx   # Order details & tracking
│   ├── (admin)/
│   │   └── admin/
│   │       ├── dashboard/page.tsx     # Admin overview & sales charts
│   │       ├── products/page.tsx      # Admin product table & editor modal
│   │       └── orders/page.tsx        # Admin order management & status updates
│   ├── layout.tsx                     # Root layout (Providers, Navbar, Footer, Toast notifications)
│   └── globals.css                    # Design tokens, variables, glassmorphism utilities
├── components/
│   ├── ui/                            # Base primitives (Button, Input, Card, Modal, Badge, Skeleton)
│   ├── shop/                          # Catalog, ProductCard, VariantSelector, CartDrawer
│   ├── checkout/                      # AddressForm, PaymentForm, OrderSummary
│   └── admin/                         # SalesChart, ProductForm, OrderStatusDropdown
├── lib/
│   ├── api-client.ts                  # Axios/Fetch wrapper with JWT header injection
│   └── react-query.ts                 # QueryClient setup & default options
└── hooks/
    ├── use-cart.ts                    # Cart state management (Local Storage + Query sync)
    ├── use-auth.ts                    # Supabase Auth user session hook
    └── use-products.ts                # TanStack Query hook for catalog search & pagination
```

---

## 5.2 Dynamic Client Architecture & TanStack Query Strategy

### Query Key Factory (`lib/query-keys.ts`)
```typescript
export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters: Record<string, unknown>) => ['products', 'list', filters] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
};
```

---

## 5.3 UX & Aesthetic Standards

- **Color Palette**: Dark-mode aesthetic option with subtle glassmorphism (`backdrop-blur-md`, semi-transparent slate cards, vivid accent gradients like Indigo to Violet).
- **Typography**: Inter / Outfit modern sans-serif fonts for crisp readability across mobile and desktop.
- **Micro-Animations**: Framer Motion / CSS transitions for hover scales, cart add feedback, slide-over drawer transitions, and Skeleton loading shimmers.
- **Accessibility**: Full keyboard navigation, ARIA attributes on modal dialogs and dropdown menus.
