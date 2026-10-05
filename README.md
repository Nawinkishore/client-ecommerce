# Client E-Commerce Monorepo Foundation

Production-grade monorepo foundation for the Client E-Commerce Project.

## Tech Stack Overview

- **Monorepo Manager**: `pnpm` workspaces
- **Frontend (`apps/web`)**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Axios, Zod
- **Backend (`apps/api`)**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Infrastructure**: Docker & GitHub Actions CI/CD
- **Shared Packages (`packages/*`)**: `@client-ecommerce/types`, `@client-ecommerce/validation`, `@client-ecommerce/config`, `@client-ecommerce/utils`

## Monorepo Layout

```
client-ecommerce/
├── apps/
│   ├── web/               # Next.js Frontend Application
│   └── api/               # Express API Application
├── packages/
│   ├── types/             # Shared TypeScript models & DTO definitions
│   ├── validation/        # Shared Zod validation schemas
│   ├── config/            # Shared configuration & env validation
│   └── utils/             # Shared utility functions
├── docs/                  # System architecture & setup documentation
├── infrastructure/
│   └── docker/            # Docker Compose setup for database & services
├── tests/                 # Monorepo test suites & configuration
├── .github/
│   └── workflows/         # GitHub Actions CI pipelines
└── .agents/               # Agent rules and skills
```

## Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- `pnpm` (v9+)
- Docker & Docker Compose (for local database running)

### Setup & Commands

```bash
# Install workspace dependencies
pnpm install

# Run type checking across all workspaces
pnpm run type-check

# Lint all workspaces
pnpm run lint

# Build all packages and applications
pnpm run build
```

## Governance & Rules

All AI subagents and human contributors must follow the project rules in [`AGENTS.md`](./AGENTS.md).
