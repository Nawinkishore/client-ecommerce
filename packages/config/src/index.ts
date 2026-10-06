import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  DATABASE_URL: z
    .string()
    .default("postgresql://postgres:postgres@localhost:5432/client_ecommerce?schema=public"),
  DIRECT_URL: z
    .string()
    .default("postgresql://postgres:postgres@localhost:5432/client_ecommerce?schema=public"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  JWT_SECRET: z.string().default("super-secret-jwt-key-change-in-production"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment configuration");
  }

  if (
    result.data.NODE_ENV === "production" &&
    result.data.JWT_SECRET === "super-secret-jwt-key-change-in-production"
  ) {
    throw new Error("Security Violation: Default JWT_SECRET cannot be used in production.");
  }

  return result.data;
}
