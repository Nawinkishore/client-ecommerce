import dotenv from "dotenv";
import path from "path";

// Pre-load env and explicitly set NODE_ENV to test before module imports
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
process.env.NODE_ENV = "test";

import test from "node:test";
import assert from "node:assert/strict";
import { validateEnv } from "@client-ecommerce/config";
import { supabase } from "../lib/supabase";
import app from "../index";

test("Backend Infrastructure Verification Suite", async (t) => {
  await t.test("1. Environment Variables Validation", () => {
    const env = validateEnv();
    assert.equal(env.PORT, 4000);
    assert.ok(env.SUPABASE_URL, "SUPABASE_URL must be defined");
    assert.ok(env.SUPABASE_ANON_KEY, "SUPABASE_ANON_KEY must be defined");
  });

  await t.test("2. Express Server Health Endpoint Test", async () => {
    const mockReq: any = {};
    let statusCode = 200;
    let jsonResponse: any = null;

    const mockRes: any = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
    };

    const healthRoute = app._router.stack.find(
      (layer: any) => layer.route && layer.route.path === "/health"
    );

    assert.ok(healthRoute, "Health route handler must exist on Express app");

    const handler = healthRoute.route.stack[0].handle;
    await handler(mockReq, mockRes);

    assert.equal(statusCode, 200);
    assert.equal(jsonResponse.status, "ok");
    assert.equal(jsonResponse.service, "client-ecommerce-api");
    assert.ok(jsonResponse.timestamp);
  });

  await t.test("3. Supabase Cloud DB Query Test via Supabase Client", async () => {
    const { data: categories, error: catError } = await supabase.from("categories").select("*");
    assert.ifError(catError);
    assert.ok(Array.isArray(categories));
    assert.ok(categories.length >= 2, "Expected at least 2 seeded categories");

    const { data: products, error: prodError } = await supabase.from("products").select("*");
    assert.ifError(prodError);
    assert.ok(Array.isArray(products));
    assert.ok(products.length >= 3, "Expected at least 3 seeded products");

    const { data: profiles, error: profError } = await supabase.from("profiles").select("*");
    assert.ifError(profError);
    assert.ok(Array.isArray(profiles));
    assert.ok(profiles.length >= 2, "Expected at least 2 seeded profiles");
  });
});
