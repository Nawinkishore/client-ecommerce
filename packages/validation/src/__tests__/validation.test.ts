import test from "node:test";
import assert from "node:assert/strict";
import {
  SignupSchema,
  LoginSchema,
  ProductQuerySchema,
  CreateProductSchema,
  AddToCartSchema,
  CreateAddressSchema,
  CheckoutIntentSchema,
  UpdateOrderStatusSchema,
} from "../index";

test("Zod Validation Schemas Test Suite", async (t) => {
  await t.test("SignupSchema validates email and password length", () => {
    const valid = SignupSchema.safeParse({
      email: "test@example.com",
      password: "securepassword123",
      fullName: "Test User",
    });
    assert.ok(valid.success);

    const invalidPass = SignupSchema.safeParse({
      email: "test@example.com",
      password: "short",
    });
    assert.equal(invalidPass.success, false);
  });

  await t.test("LoginSchema validates required fields", () => {
    const valid = LoginSchema.safeParse({
      email: "admin@client-ecommerce.com",
      password: "secretpassword",
    });
    assert.ok(valid.success);

    const invalidEmail = LoginSchema.safeParse({
      email: "not-an-email",
      password: "secretpassword",
    });
    assert.equal(invalidEmail.success, false);
  });

  await t.test("ProductQuerySchema applies default page and limit values", () => {
    const result = ProductQuerySchema.parse({});
    assert.equal(result.page, 1);
    assert.equal(result.limit, 20);
    assert.equal(result.sortBy, "newest");
  });

  await t.test("AddToCartSchema enforces valid UUID and min quantity of 1", () => {
    const valid = AddToCartSchema.safeParse({
      productVariantId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: 2,
    });
    assert.ok(valid.success);

    const invalidQty = AddToCartSchema.safeParse({
      productVariantId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: 0,
    });
    assert.equal(invalidQty.success, false);
  });

  await t.test("CreateAddressSchema validates required recipient and street", () => {
    const valid = CreateAddressSchema.safeParse({
      recipient: "John Doe",
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "IL",
      postalCode: "62704",
      country: "USA",
      isDefault: true,
    });
    assert.ok(valid.success);
  });

  await t.test("CheckoutIntentSchema validates provider enum and address ID", () => {
    const valid = CheckoutIntentSchema.safeParse({
      addressId: "123e4567-e89b-12d3-a456-426614174000",
      provider: "STRIPE",
    });
    assert.ok(valid.success);

    const invalidProvider = CheckoutIntentSchema.safeParse({
      addressId: "123e4567-e89b-12d3-a456-426614174000",
      provider: "INVALID_GATEWAY",
    });
    assert.equal(invalidProvider.success, false);
  });

  await t.test("UpdateOrderStatusSchema validates status enum values", () => {
    const valid = UpdateOrderStatusSchema.safeParse({
      status: "SHIPPED",
      trackingNumber: "TRK-123456",
    });
    assert.ok(valid.success);
  });
});
