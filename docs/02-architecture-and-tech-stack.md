# 2. System Architecture & Tech Stack Design

## 2.1 Technology Stack Overview

```
                      +-----------------------------------+
                      |       Next.js 14 Web Frontend     |
                      |        (apps/web - App Router)    |
                      +-----------------+-----------------+
                                        |
                 HTTP REST / RPC        |   TanStack Query (React Query v5)
                 Zod DTO Validation     |   Zustand / Local State
                                        v
                      +-----------------+-----------------+
                      |       Node.js / Express API       |
                      |           (apps/api)              |
                      +-----------------+-----------------+
                                        |
                                        |  Prisma ORM Client
                                        v
                      +-----------------+-----------------+
                      |      Supabase Cloud Services      |
                      |  - PostgreSQL Database (RLS)      |
                      |  - Supabase Auth (JWT & OAuth)    |
                      |  - Supabase Object Storage        |
                      +-----------------------------------+
```

### Core Tech Stack Matrix

| Component | Selected Technology | Purpose & Rationale |
| :--- | :--- | :--- |
| **Monorepo Management** | `pnpm` workspaces | Fast, deterministic dependency resolution and multi-package scripts. |
| **Frontend Framework** | Next.js 14+ (App Router) | SSR, SSG, ISR for SEO-optimized product pages, fast route transitions. |
| **UI Components & Styling** | Tailwind CSS + Radix UI primitives | Modular, accessible design system with customizable aesthetic micro-interactions. |
| **Client Data Fetching** | TanStack Query (v5) | Async state caching, automatic re-fetching, optimistic updates, and loading states. |
| **Backend API** | Node.js + Express | Lightweight, high-throughput RESTful HTTP routes and controller logic (`apps/api`). |
| **ORM & DB Client** | Prisma ORM | Type-safe database queries, auto-generated migrations, and database seeding. |
| **Database & Auth** | Supabase (PostgreSQL) | Managed PostgreSQL, Row-Level Security (RLS), Supabase Auth JWT integration, Object Storage for images. |
| **Data Validation** | Zod (`packages/validation`) | Single source of truth for runtime validation of request payloads and environment configs. |
| **Shared Types** | `@client-ecommerce/types` | Unified TypeScript interfaces shared between frontend, API, and validation layers. |

---

## 2.2 Monorepo Package Architecture

```
client-ecommerce/
├── apps/
│   ├── web/                     # Next.js App Router (Client & Server Components)
│   └── api/                     # Node.js Express Server (Controllers, Routes, Middleware)
├── packages/
│   ├── types/                   # Shared TypeScript models (User, Product, Cart, Order, DTOs)
│   ├── validation/              # Shared Zod schemas (Auth, Product, Cart, Order schemas)
│   ├── config/                  # Shared environment variables validation & app constants
│   └── utils/                   # Reusable pure helper functions (currency formatters, string utils)
└── docs/                        # Architecture and project documentation
```

---

## 2.3 Data Flow & Integration Patterns

### 1. Request Validation Lifecycle
1. User submits form/action on **`apps/web`**.
2. Form input is validated on client using **Zod schema** from `@client-ecommerce/validation`.
3. Request sent to **`apps/api`** endpoint with bearer JWT in header.
4. **`apps/api`** middleware executes Zod validation against request body/params.
5. Auth middleware verifies Supabase JWT token.
6. Prisma ORM executes typed query against Supabase PostgreSQL database.
7. Response envelope returned; **TanStack Query** updates client cache automatically.

### 2. Supabase Auth & DB Integration
- Users sign up/log in via Supabase Auth on the client.
- A PostgreSQL database trigger in Supabase automatically inserts a record into the `profiles` table when a new user registers in `auth.users`.
- Prisma manages database migrations and relations on the public schema.
