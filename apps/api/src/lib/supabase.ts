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

export const supabase = createClient(
  env.SUPABASE_URL || "https://dvlibhdsiocapbfuihsk.supabase.co",
  env.SUPABASE_ANON_KEY || ""
);
