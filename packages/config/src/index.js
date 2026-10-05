"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z
        .string()
        .default("postgresql://postgres:postgres@localhost:5432/client_ecommerce?schema=public"),
    DIRECT_URL: zod_1.z
        .string()
        .default("postgresql://postgres:postgres@localhost:5432/client_ecommerce?schema=public"),
    SUPABASE_URL: zod_1.z.string().optional(),
    SUPABASE_ANON_KEY: zod_1.z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string().default("super-secret-jwt-key-change-in-production"),
    STRIPE_SECRET_KEY: zod_1.z.string().optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().optional(),
});
function validateEnv() {
    const result = exports.envSchema.safeParse(process.env);
    if (!result.success) {
        console.error("Invalid environment variables:", result.error.format());
        throw new Error("Invalid environment configuration");
    }
    return result.data;
}
