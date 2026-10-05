"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderStatusSchema = exports.CheckoutIntentSchema = exports.UpdateAddressSchema = exports.CreateAddressSchema = exports.SyncCartSchema = exports.UpdateCartItemSchema = exports.AddToCartSchema = exports.ReviewSchema = exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductImageSchema = exports.ProductVariantSchema = exports.ProductQuerySchema = exports.RefreshTokenSchema = exports.ChangePasswordSchema = exports.ResetPasswordSchema = exports.LoginSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
// ---------------------------------------------------------------------------
// 1. Auth Validation Schemas
// ---------------------------------------------------------------------------
exports.SignupSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email({ message: "Invalid email address format" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" }),
    fullName: zod_1.z.string().trim().min(1).max(100).optional(),
    phone: zod_1.z.string().trim().min(5).max(20).optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email({ message: "Invalid email address format" }),
    password: zod_1.z.string().min(1, { message: "Password is required" }),
});
exports.ResetPasswordSchema = zod_1.z.object({
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" }),
    accessToken: zod_1.z.string().min(1, { message: "Access token is required" }),
});
exports.ChangePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, { message: "Current password is required" }).optional(),
    newPassword: zod_1.z
        .string()
        .min(8, { message: "New password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" }),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, { message: "Refresh token is required" }),
});
// ---------------------------------------------------------------------------
// 2. Product & Review Validation Schemas
// ---------------------------------------------------------------------------
exports.ProductQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid({ message: "Invalid category ID" }).optional(),
    subcategoryId: zod_1.z.string().uuid({ message: "Invalid subcategory ID" }).optional(),
    minPrice: zod_1.z.coerce.number().min(0, { message: "Minimum price cannot be negative" }).optional(),
    maxPrice: zod_1.z.coerce.number().min(0, { message: "Maximum price cannot be negative" }).optional(),
    sortBy: zod_1.z
        .enum(["newest", "price_asc", "price_desc", "rating"])
        .default("newest"),
    page: zod_1.z.coerce.number().int().min(1, { message: "Page must be at least 1" }).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100, { message: "Limit cannot exceed 100" }).default(20),
});
exports.ProductVariantSchema = zod_1.z.object({
    sku: zod_1.z.string().trim().min(1, { message: "SKU is required" }),
    name: zod_1.z.string().trim().min(1, { message: "Variant name is required" }),
    price: zod_1.z.number().min(0, { message: "Price must be non-negative" }),
    stockCount: zod_1.z.number().int().min(0).default(0),
    attributes: zod_1.z.record(zod_1.z.unknown()).default({}),
});
exports.ProductImageSchema = zod_1.z.object({
    url: zod_1.z.string().url({ message: "Invalid image URL" }),
    altText: zod_1.z.string().optional(),
    isPrimary: zod_1.z.boolean().default(false),
    sortOrder: zod_1.z.number().int().min(0).default(0),
});
exports.CreateProductSchema = zod_1.z.object({
    subcategoryId: zod_1.z.string().uuid({ message: "Invalid subcategory ID" }),
    title: zod_1.z.string().trim().min(1, { message: "Product title is required" }).max(255),
    slug: zod_1.z.string().trim().min(1).optional(),
    description: zod_1.z.string().trim().min(1, { message: "Product description is required" }),
    basePrice: zod_1.z.number().min(0, { message: "Base price must be non-negative" }),
    isFeatured: zod_1.z.boolean().default(false),
    isActive: zod_1.z.boolean().default(true),
    variants: zod_1.z.array(exports.ProductVariantSchema).optional(),
    images: zod_1.z.array(exports.ProductImageSchema).optional(),
});
exports.UpdateProductSchema = exports.CreateProductSchema.partial();
exports.ReviewSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid({ message: "Invalid product ID" }).optional(),
    rating: zod_1.z
        .number()
        .int()
        .min(1, { message: "Rating must be between 1 and 5" })
        .max(5, { message: "Rating must be between 1 and 5" }),
    comment: zod_1.z.string().trim().max(1000, { message: "Comment cannot exceed 1000 characters" }).optional(),
});
// ---------------------------------------------------------------------------
// 3. Cart Validation Schemas
// ---------------------------------------------------------------------------
exports.AddToCartSchema = zod_1.z.object({
    productVariantId: zod_1.z.string().uuid({ message: "Invalid product variant ID" }),
    quantity: zod_1.z.number().int().min(1, { message: "Quantity must be at least 1" }),
});
exports.UpdateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(1, { message: "Quantity must be at least 1" }),
});
exports.SyncCartSchema = zod_1.z.object({
    items: zod_1.z.array(exports.AddToCartSchema),
});
// ---------------------------------------------------------------------------
// 4. Address Validation Schemas
// ---------------------------------------------------------------------------
exports.CreateAddressSchema = zod_1.z.object({
    recipient: zod_1.z.string().trim().min(1, { message: "Recipient name is required" }),
    street: zod_1.z.string().trim().min(1, { message: "Street address is required" }),
    city: zod_1.z.string().trim().min(1, { message: "City is required" }),
    state: zod_1.z.string().trim().min(1, { message: "State/Province is required" }),
    postalCode: zod_1.z.string().trim().min(1, { message: "Postal code is required" }),
    country: zod_1.z.string().trim().min(1, { message: "Country is required" }),
    isDefault: zod_1.z.boolean().default(false),
});
exports.UpdateAddressSchema = exports.CreateAddressSchema.partial();
// ---------------------------------------------------------------------------
// 5. Checkout & Order Validation Schemas
// ---------------------------------------------------------------------------
exports.CheckoutIntentSchema = zod_1.z.object({
    addressId: zod_1.z.string().uuid({ message: "Invalid address ID" }),
    provider: zod_1.z.enum(["STRIPE", "RAZORPAY", "CASH_ON_DELIVERY"], {
        errorMap: () => ({ message: "Invalid payment provider" }),
    }),
    items: zod_1.z
        .array(zod_1.z.object({
        productVariantId: zod_1.z.string().uuid({ message: "Invalid variant ID" }),
        quantity: zod_1.z.number().int().min(1),
    }))
        .optional(),
});
exports.UpdateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "PENDING_PAYMENT",
        "PAID",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
    ], {
        errorMap: () => ({ message: "Invalid order status" }),
    }),
    trackingNumber: zod_1.z.string().trim().optional(),
});
