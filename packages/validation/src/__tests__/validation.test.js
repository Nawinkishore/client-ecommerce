"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const index_1 = require("../index");
(0, node_test_1.default)("Zod Validation Schemas Test Suite", async (t) => {
    await t.test("SignupSchema validates email and password length", () => {
        const valid = index_1.SignupSchema.safeParse({
            email: "test@example.com",
            password: "securepassword123",
            fullName: "Test User",
        });
        strict_1.default.ok(valid.success);
        const invalidPass = index_1.SignupSchema.safeParse({
            email: "test@example.com",
            password: "short",
        });
        strict_1.default.equal(invalidPass.success, false);
    });
    await t.test("LoginSchema validates required fields", () => {
        const valid = index_1.LoginSchema.safeParse({
            email: "admin@client-ecommerce.com",
            password: "secretpassword",
        });
        strict_1.default.ok(valid.success);
        const invalidEmail = index_1.LoginSchema.safeParse({
            email: "not-an-email",
            password: "secretpassword",
        });
        strict_1.default.equal(invalidEmail.success, false);
    });
    await t.test("ProductQuerySchema applies default page and limit values", () => {
        const result = index_1.ProductQuerySchema.parse({});
        strict_1.default.equal(result.page, 1);
        strict_1.default.equal(result.limit, 20);
        strict_1.default.equal(result.sortBy, "newest");
    });
    await t.test("AddToCartSchema enforces valid UUID and min quantity of 1", () => {
        const valid = index_1.AddToCartSchema.safeParse({
            productVariantId: "123e4567-e89b-12d3-a456-426614174000",
            quantity: 2,
        });
        strict_1.default.ok(valid.success);
        const invalidQty = index_1.AddToCartSchema.safeParse({
            productVariantId: "123e4567-e89b-12d3-a456-426614174000",
            quantity: 0,
        });
        strict_1.default.equal(invalidQty.success, false);
    });
    await t.test("CreateAddressSchema validates required recipient and street", () => {
        const valid = index_1.CreateAddressSchema.safeParse({
            recipient: "John Doe",
            street: "742 Evergreen Terrace",
            city: "Springfield",
            state: "IL",
            postalCode: "62704",
            country: "USA",
            isDefault: true,
        });
        strict_1.default.ok(valid.success);
    });
    await t.test("CheckoutIntentSchema validates provider enum and address ID", () => {
        const valid = index_1.CheckoutIntentSchema.safeParse({
            addressId: "123e4567-e89b-12d3-a456-426614174000",
            provider: "STRIPE",
        });
        strict_1.default.ok(valid.success);
        const invalidProvider = index_1.CheckoutIntentSchema.safeParse({
            addressId: "123e4567-e89b-12d3-a456-426614174000",
            provider: "INVALID_GATEWAY",
        });
        strict_1.default.equal(invalidProvider.success, false);
    });
    await t.test("UpdateOrderStatusSchema validates status enum values", () => {
        const valid = index_1.UpdateOrderStatusSchema.safeParse({
            status: "SHIPPED",
            trackingNumber: "TRK-123456",
        });
        strict_1.default.ok(valid.success);
    });
});
