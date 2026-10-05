import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "test", "production"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    DATABASE_URL: z.ZodDefault<z.ZodString>;
    DIRECT_URL: z.ZodDefault<z.ZodString>;
    SUPABASE_URL: z.ZodOptional<z.ZodString>;
    SUPABASE_ANON_KEY: z.ZodOptional<z.ZodString>;
    SUPABASE_SERVICE_ROLE_KEY: z.ZodOptional<z.ZodString>;
    JWT_SECRET: z.ZodDefault<z.ZodString>;
    STRIPE_SECRET_KEY: z.ZodOptional<z.ZodString>;
    STRIPE_WEBHOOK_SECRET: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    DATABASE_URL: string;
    DIRECT_URL: string;
    JWT_SECRET: string;
    SUPABASE_URL?: string | undefined;
    SUPABASE_ANON_KEY?: string | undefined;
    SUPABASE_SERVICE_ROLE_KEY?: string | undefined;
    STRIPE_SECRET_KEY?: string | undefined;
    STRIPE_WEBHOOK_SECRET?: string | undefined;
}, {
    NODE_ENV?: "development" | "test" | "production" | undefined;
    PORT?: number | undefined;
    DATABASE_URL?: string | undefined;
    DIRECT_URL?: string | undefined;
    SUPABASE_URL?: string | undefined;
    SUPABASE_ANON_KEY?: string | undefined;
    SUPABASE_SERVICE_ROLE_KEY?: string | undefined;
    JWT_SECRET?: string | undefined;
    STRIPE_SECRET_KEY?: string | undefined;
    STRIPE_WEBHOOK_SECRET?: string | undefined;
}>;
export type Env = z.infer<typeof envSchema>;
export declare function validateEnv(): Env;
