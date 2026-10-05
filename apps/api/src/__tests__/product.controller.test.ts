import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
process.env.NODE_ENV = "test";

import test from "node:test";
import assert from "node:assert/strict";
import { getProducts, getProductBySlug, createReview } from "../controllers/product.controller";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../errors/app-error";

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

test("Product Controller Suite", async (t) => {
  await t.test("getProductBySlug requires a slug", async () => {
    const req: any = { params: {} };
    const res = createMockRes();
    let nextErr: any = null;

    await getProductBySlug(req, res, (err) => {
      nextErr = err;
    });

    assert.ok(nextErr);
    assert.equal(nextErr.statusCode, 404);
    assert.equal(nextErr.message, "Product not found");
  });

  await t.test("createReview requires authenticated user", async () => {
    const req: any = { params: { id: "123e4567-e89b-12d3-a456-426614174000" }, body: { rating: 5 } };
    const res = createMockRes();
    let nextErr: any = null;

    await createReview(req, res, (err) => {
      nextErr = err;
    });

    assert.ok(nextErr);
    assert.equal(nextErr.statusCode, 401);
    assert.equal(nextErr.message, "Authentication required");
  });

  await t.test("createReview requires product ID", async () => {
    const req: any = { user: { id: "profile-123" }, params: {}, body: { rating: 5 } };
    const res = createMockRes();
    let nextErr: any = null;

    await createReview(req, res, (err) => {
      nextErr = err;
    });

    assert.ok(nextErr);
    assert.equal(nextErr.statusCode, 400);
    assert.equal(nextErr.message, "Product ID is required");
  });
});
