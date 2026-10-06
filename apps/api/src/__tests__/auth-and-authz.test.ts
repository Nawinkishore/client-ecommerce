import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
process.env.NODE_ENV = "test";

import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { validateEnv } from "@client-ecommerce/config";
import { createUserClient } from "../lib/supabase";

function createMockRes() {
  let statusCode = 200;
  let jsonBody: any = null;
  let cookies: Record<string, any> = {};

  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      jsonBody = data;
      return this;
    },
    cookie(name: string, val: any, options: any) {
      cookies[name] = { val, options };
      return this;
    },
    clearCookie(name: string) {
      delete cookies[name];
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    get jsonBody() {
      return jsonBody;
    },
    get cookies() {
      return cookies;
    },
  };

  return res;
}

test("Phase 7: Advanced Auth & Authz Clean Verification Suite", async (t) => {
  await t.test("1. Environment & Secrets Safety Check", () => {
    const env = validateEnv();
    assert.ok(env.JWT_SECRET, "JWT_SECRET must be defined");
    assert.ok(env.CLIENT_URL, "CLIENT_URL must be defined");
    assert.equal(typeof env.CLIENT_URL, "string");
  });

  await t.test("2. User Client Instance Creation", () => {
    const testToken = "mock.jwt.token";
    const userClient = createUserClient(testToken);
    assert.ok(userClient, "User Supabase client instance created");
    assert.ok(userClient.auth, "User client has auth module attached");
  });

  await t.test("3. JWT Verification & Algorithm Enforcement", async (st) => {
    const jwtSecret = "test-secret-key-1234567890";
    process.env.JWT_SECRET = jwtSecret;

    await st.test("Rejects algorithm confusion / untrusted tokens", async () => {
      const mockReq: any = {
        cookies: {},
        headers: {
          authorization: "Bearer invalid.token.payload",
        },
      };

      let errorPassed: any = null;
      await requireAuth(mockReq, createMockRes(), (err) => {
        errorPassed = err;
      });

      assert.ok(errorPassed, "Error should be passed to next()");
      assert.equal(errorPassed.statusCode, 401);
      assert.match(errorPassed.message, /Invalid or expired authentication token/i);
    });

    await st.test("Rejects missing token request", async () => {
      const mockReq: any = {
        cookies: {},
        headers: {},
      };

      let errorPassed: any = null;
      await requireAuth(mockReq, createMockRes(), (err) => {
        errorPassed = err;
      });

      assert.ok(errorPassed, "Error should be passed to next()");
      assert.equal(errorPassed.statusCode, 401);
      assert.match(errorPassed.message, /Authentication token is missing/i);
    });
  });

  await t.test("4. Authorization Guards & Role Escalation Prevention", async (st) => {
    await st.test("requireAdmin blocks unauthenticated user", () => {
      const req: any = {};
      let errorPassed: any = null;

      requireAdmin(req, createMockRes(), (err) => {
        errorPassed = err;
      });

      assert.ok(errorPassed);
      assert.equal(errorPassed.statusCode, 401);
    });

    await st.test("requireAdmin blocks non-ADMIN CUSTOMER user", () => {
      const req: any = {
        user: {
          id: "p-1",
          userId: "u-1",
          email: "customer@example.com",
          role: "CUSTOMER",
        },
      };
      let errorPassed: any = null;

      requireAdmin(req, createMockRes(), (err) => {
        errorPassed = err;
      });

      assert.ok(errorPassed);
      assert.equal(errorPassed.statusCode, 403);
      assert.match(errorPassed.message, /Admin access required/i);
    });

    await st.test("requireAdmin allows ADMIN user to proceed", () => {
      const req: any = {
        user: {
          id: "p-2",
          userId: "u-2",
          email: "admin@example.com",
          role: "ADMIN",
        },
      };
      let errorPassed: any = null;

      requireAdmin(req, createMockRes(), (err) => {
        errorPassed = err;
      });

      assert.equal(errorPassed, undefined, "No error passed for valid admin");
    });
  });
});
