import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
process.env.NODE_ENV = "test";

import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
} from "../errors/app-error";
import { sendSuccess, sendError } from "../utils/response";
import { validateRequest } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { errorHandler } from "../middleware/error-handler";

function createMockRes() {
  let statusCode = 200;
  let jsonBody: any = null;

  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      jsonBody = data;
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    get jsonBody() {
      return jsonBody;
    },
  };

  return res;
}

test("Phase 3: Core API Architecture & Middleware Suite", async (t) => {
  await t.test("1. Response Helper Envelopes", async (st) => {
    await st.test("sendSuccess formats standard success JSON envelope", () => {
      const res = createMockRes();
      sendSuccess(res, { id: "123" }, "Fetched successfully", {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });

      assert.equal(res.statusCode, 200);
      assert.equal(res.jsonBody.success, true);
      assert.equal(res.jsonBody.message, "Fetched successfully");
      assert.deepEqual(res.jsonBody.data, { id: "123" });
      assert.equal(res.jsonBody.meta.total, 1);
    });

    await st.test("sendError formats standard error JSON envelope", () => {
      const res = createMockRes();
      sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid input",
        [{ field: "email", message: "Required" }]
      );

      assert.equal(res.statusCode, 400);
      assert.equal(res.jsonBody.success, false);
      assert.equal(res.jsonBody.error.code, "VALIDATION_ERROR");
      assert.equal(res.jsonBody.error.message, "Invalid input");
      assert.deepEqual(res.jsonBody.error.details, [
        { field: "email", message: "Required" },
      ]);
    });
  });

  await t.test("2. Custom Error Classes Hierarchy", () => {
    const notFound = new NotFoundError("Product missing");
    assert.equal(notFound.statusCode, 404);
    assert.equal(notFound.code, "NOT_FOUND");
    assert.equal(notFound.message, "Product missing");

    const unauth = new UnauthorizedError();
    assert.equal(unauth.statusCode, 401);
    assert.equal(unauth.code, "UNAUTHORIZED");

    const forbidden = new ForbiddenError();
    assert.equal(forbidden.statusCode, 403);
    assert.equal(forbidden.code, "FORBIDDEN");

    const valErr = new ValidationError("Bad payload", [{ field: "name", message: "Too short" }]);
    assert.equal(valErr.statusCode, 400);
    assert.equal(valErr.code, "VALIDATION_ERROR");
    assert.deepEqual(valErr.details, [{ field: "name", message: "Too short" }]);
  });

  await t.test("3. Payload Validation Middleware", async (st) => {
    const schema = {
      body: z.object({
        email: z.string().email(),
        quantity: z.number().int().min(1),
      }),
    };
    const middleware = validateRequest(schema);

    await st.test("Passes valid body payload to next()", async () => {
      const req: any = { body: { email: "test@example.com", quantity: 2 } };
      const res = createMockRes();
      let nextCalled = false;
      let nextError: any = null;

      await middleware(req, res, (err) => {
        nextCalled = true;
        nextError = err;
      });

      assert.equal(nextCalled, true);
      assert.equal(nextError, undefined);
      assert.equal(req.body.email, "test@example.com");
      assert.equal(req.body.quantity, 2);
    });

    await st.test("Catches invalid body payload and returns ValidationError in next(err)", async () => {
      const req: any = { body: { email: "not-an-email", quantity: -5 } };
      const res = createMockRes();
      let nextError: any = null;

      await middleware(req, res, (err) => {
        nextError = err;
      });

      assert.ok(nextError instanceof ValidationError);
      assert.equal(nextError.statusCode, 400);
      assert.equal(nextError.code, "VALIDATION_ERROR");
      assert.ok(nextError.details);
      assert.equal(nextError.details?.length, 2);
      assert.equal(nextError.details?.[0]?.field, "email");
      assert.equal(nextError.details?.[1]?.field, "quantity");
    });
  });

  await t.test("4. Supabase Auth & JWT Verification Middleware", async (st) => {
    await st.test("Rejects missing Authorization header", async () => {
      const req: any = { headers: {} };
      const res = createMockRes();
      let nextErr: any = null;

      await requireAuth(req, res, (err) => {
        nextErr = err;
      });

      assert.ok(nextErr instanceof UnauthorizedError);
      assert.ok(nextErr.message.includes("missing or invalid"));
    });

    await st.test("Rejects invalid token format or invalid JWT", async () => {
      const req: any = { headers: { authorization: "Bearer invalid-jwt-token" } };
      const res = createMockRes();
      let nextErr: any = null;

      await requireAuth(req, res, (err) => {
        nextErr = err;
      });

      assert.ok(nextErr instanceof UnauthorizedError);
    });
  });

  await t.test("5. Admin Authorization Guard Middleware", async (st) => {
    await st.test("Rejects unauthenticated request", () => {
      const req: any = {};
      const res = createMockRes();
      let nextErr: any = null;

      requireAdmin(req, res, (err) => {
        nextErr = err;
      });

      assert.ok(nextErr instanceof UnauthorizedError);
    });

    await st.test("Rejects non-admin customer user", () => {
      const req: any = {
        user: {
          id: "p123",
          userId: "u123",
          email: "customer@example.com",
          role: "CUSTOMER",
        },
      };
      const res = createMockRes();
      let nextErr: any = null;

      requireAdmin(req, res, (err) => {
        nextErr = err;
      });

      assert.ok(nextErr instanceof ForbiddenError);
      assert.equal(nextErr.statusCode, 403);
    });

    await st.test("Allows admin user to proceed", () => {
      const req: any = {
        user: {
          id: "p999",
          userId: "u999",
          email: "admin@example.com",
          role: "ADMIN",
        },
      };
      const res = createMockRes();
      let nextCalled = false;

      requireAdmin(req, res, () => {
        nextCalled = true;
      });

      assert.equal(nextCalled, true);
    });
  });

  await t.test("6. Global Express Error Handling Middleware", async (st) => {
    await st.test("Formats AppError into standard JSON error response", () => {
      const req: any = {};
      const res = createMockRes();
      const appErr = new NotFoundError("Category slug 'non-existent' not found");

      errorHandler(appErr, req, res, (() => {}) as any);

      assert.equal(res.statusCode, 404);
      assert.equal(res.jsonBody.success, false);
      assert.equal(res.jsonBody.error.code, "NOT_FOUND");
      assert.equal(res.jsonBody.error.message, "Category slug 'non-existent' not found");
    });
  });
});
