# Phase 5: Frontend Foundation & Product Catalog (`apps/web`)

> **Focus**: Next.js 14 App Router, Glassmorphism Design System, UI Primitives, and Product Catalog Pages.

---

## taskList

- [ ] **Task 5.1: Next.js Layout & Providers Setup**
  - **Location**: `apps/web/src/app/layout.tsx`, `apps/web/src/app/globals.css`, `apps/web/src/lib/react-query.ts`, `apps/web/src/lib/api-client.ts`
  - **Details**:
    - Configure Tailwind CSS glassmorphism classes, dark mode tokens, and Google Fonts (Inter / Outfit).
    - Setup Axios / Fetch API client with authorization header interceptors.
    - Set up TanStack Query Client provider with automatic re-fetching & caching policies.
  - **Verification**: `pnpm --filter web dev` builds without errors.

- [ ] **Task 5.2: Reusable UI Component Primitives**
  - **Location**: `apps/web/src/components/ui/`
  - **Details**:
    - Build `Button` (primary, outline, ghost, loading spinner state).
    - Build `Input` & `Select` with error messages & focus rings.
    - Build `Card` & `Badge` with dark glassmorphism styling.
    - Build `Modal` & `Dialog` primitives using Radix UI / accessible overlay.
    - Build `Skeleton` shimmer loader components for catalog items.
  - **Verification**: Render UI primitives in test page.

- [ ] **Task 5.3: Navigation & Store Layout**
  - **Location**: `apps/web/src/components/shop/Navbar.tsx`, `apps/web/src/components/shop/Footer.tsx`, `apps/web/src/components/shop/CartDrawer.tsx`
  - **Details**:
    - Build responsive Navbar with Category dropdown menu, Search bar, Cart icon with live item badge, and User Account menu.
    - Build slide-over Cart Drawer component.
    - Build responsive Footer.
  - **Verification**: Test navigation links, responsive burger menu, and cart drawer toggle.

- [ ] **Task 5.4: Homepage (`/`) Implementation**
  - **Location**: `apps/web/src/app/(shop)/page.tsx`
  - **Details**:
    - Build Hero Banner with CTA buttons.
    - Build Featured Categories grid.
    - Build Trending Products carousel / grid with Add to Cart buttons.
  - **Verification**: Check visual aesthetics, dark glassmorphism styling, and page speed.

- [ ] **Task 5.5: Catalog Page (`/products`) Implementation**
  - **Location**: `apps/web/src/app/(shop)/products/page.tsx`, `apps/web/src/components/shop/ProductFilterSidebar.tsx`, `apps/web/src/components/shop/ProductCard.tsx`
  - **Details**:
    - Build Sidebar Filters (Category hierarchy, price slider, stock toggle, sorting select).
    - Implement TanStack Query integration with URL query parameters for deep-linking filter states.
    - Build Product Grid with Skeleton loading states and pagination controls.
  - **Verification**: Filter products by category & price; test page parameter changes.

- [ ] **Task 5.6: Product Detail Page (`/products/[slug]`) Implementation**
  - **Location**: `apps/web/src/app/(shop)/products/[slug]/page.tsx`, `apps/web/src/components/shop/ImageGallery.tsx`, `apps/web/src/components/shop/VariantSelector.tsx`
  - **Details**:
    - Build Multi-image Gallery with thumbnail selector.
    - Build Variant Selector (Color, Size) with dynamic price calculation and stock status.
    - Build Quantity selector and "Add to Cart" button.
    - Build Customer Reviews & Rating section.
  - **Verification**: Test variant switching, price changes, and stock warnings.
