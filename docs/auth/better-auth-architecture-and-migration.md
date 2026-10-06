# Better Auth Architecture & Migration Documentation

> **Repository Scope**: `apps/api`, `apps/web`, `apps/api/prisma/schema.prisma`  
> **Auth Engine**: Better Auth (`better-auth`)  
> **Database ORM**: Prisma (`@prisma/client` v5.22.0) with PostgreSQL  
> **Frameworks**: Express REST API (`apps/api`), Next.js 14 App Router (`apps/web`)

---

## 1. Executive Summary

All legacy custom JWT and Supabase Auth files have been removed from the codebase. The application now uses **Better Auth**, an open-source, TypeScript-first authentication engine natively integrated with Prisma ORM.

Session authentication is handled via secure HttpOnly cookies (`better-auth.session_token`) shared seamlessly between the Next.js storefront/admin app and the Express REST API server.

---

## 2. Database Schema (`apps/api/prisma/schema.prisma`)

Better Auth relies on four core database tables managed directly via Prisma:

```prisma
enum Role {
  CUSTOMER
  ADMIN
}

model User {
  id            String    @id @default(uuid()) @db.Uuid
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  role          Role      @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  accounts      Account[]
  profile       Profile?

  @@map("users")
}

model Session {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Account {
  id                    String    @id @default(uuid()) @db.Uuid
  userId                String    @db.Uuid
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("accounts")
}

model Verification {
  id         String   @id @default(uuid()) @db.Uuid
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("verifications")
}

model Profile {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @unique @db.Uuid
  email     String   @unique
  fullName  String?
  avatarUrl String?
  phone     String?
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  addresses Address[]
  cart      Cart?
  orders    Order[]
  reviews   Review[]

  @@map("profiles")
}
```

---

## 3. Backend Express API Integration (`apps/api`)

### Better Auth Server Config (`apps/api/src/lib/auth.ts`)
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
      },
    },
  },
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
});
```

### Express Mount (`apps/api/src/index.ts`)
```typescript
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

app.all("/api/auth/*", toNodeHandler(auth));
app.all("/api/v1/auth/*", toNodeHandler(auth));
```

### Session Verification Middleware (`apps/api/src/middleware/auth.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { UnauthorizedError } from "../errors/app-error";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return next(new UnauthorizedError("Authentication token or session is missing or invalid"));
    }

    const { user } = session;

    let profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          email: user.email,
          fullName: user.name || null,
          avatarUrl: user.image || null,
          role: (user as { role?: string }).role === "ADMIN" ? "ADMIN" : "CUSTOMER",
        },
      });
    }

    req.user = {
      id: profile.id,
      userId: profile.userId,
      email: profile.email,
      role: profile.role,
    };

    next();
  } catch (err) {
    next(err);
  }
}
```

---

## 4. Frontend Next.js Web Integration (`apps/web`)

### Better Auth React Client (`apps/web/src/lib/auth-client.ts`)
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

### Auth Context (`apps/web/src/context/auth-context.tsx`)
Exposes `user`, `role`, `isAuthenticated`, `isLoading`, `login`, `register`, `logout`, and `updateProfile` for component-level consumer parity.

### Edge Middleware (`apps/web/src/middleware.ts`)
Inspects `better-auth.session_token` cookie to guard `/admin`, `/account`, `/orders`, `/checkout` at the Edge boundary.

---

## 5. Verification Commands

```bash
# Type check backend
pnpm --filter @client-ecommerce/api type-check

# Type check frontend
pnpm --filter @client-ecommerce/web type-check

# Run backend test suite
pnpm --filter @client-ecommerce/api test
```
