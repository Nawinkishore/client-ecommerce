# Granular Workspace Rules

- Maintain strict boundary separation between packages and applications.
- Always use workspace package references (`@client-ecommerce/types`, `@client-ecommerce/validation`, etc.) for internal monorepo imports.
- Ensure all public exports are cleanly exposed through `src/index.ts` files in shared packages.
