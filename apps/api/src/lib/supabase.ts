import dotenv from "dotenv";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { validateEnv } from "@client-ecommerce/config";

const currentEnv = process.env.NODE_ENV;
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
if (currentEnv === "test") {
  process.env.NODE_ENV = "test";
}

const env = validateEnv();
const supabaseUrl = env.SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey = env.SUPABASE_ANON_KEY || "dummy-anon-key-for-local-dev";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createUserClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

