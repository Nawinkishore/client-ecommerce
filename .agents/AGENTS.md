# Project Rules & Learned Guardrails

## Monorepo Architecture & Imports
- Maintain strict boundary separation between packages and applications.
- Always use workspace package references (`@client-ecommerce/types`, `@client-ecommerce/validation`, `@client-ecommerce/utils`, etc.) for internal monorepo imports.
- Ensure all public exports are cleanly exposed through `src/index.ts` files in shared packages.

## Windows Tooling & Execution Environment
- On Windows environments where PowerShell script execution policy restricts `.ps1` wrappers, execute CLI tool commands (`pnpm`, `npx`, `tsc`) via `cmd /c` with explicit Node and npm PATH prepend (`cmd /c "set PATH=C:\Program Files\nodejs;C:\Users\Nawin Kishore\AppData\Roaming\npm;%PATH% && pnpm <command>"`).

## Database & Serialization (Prisma)
- Explicitly cast Prisma `Decimal` types to JavaScript numbers (e.g. `Number(variant.price)` or `variant.price.toNumber()`) before returning API response payloads or passing data to Zod schema validators.
