import { z } from "zod";

// ---------------------------------------------------------------------------
// 1. Auth Validation Schemas
// ---------------------------------------------------------------------------

export const SignupSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
  fullName: z.string().trim().min(1).max(100).optional(),
  phone: z.string().trim().min(5).max(20).optional(),
});

export const LoginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
  accessToken: z.string().min(1, { message: "Access token is required" }),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }).optional(),
  newPassword: z
    .string()
    .min(8, { message: "New password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: "Refresh token is required" }),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

// ---------------------------------------------------------------------------
// 2. Product & Review Validation Schemas
// ---------------------------------------------------------------------------

export const ProductQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid({ message: "Invalid category ID" }).optional(),
  subcategoryId: z.string().uuid({ message: "Invalid subcategory ID" }).optional(),
  minPrice: z.coerce.number().min(0, { message: "Minimum price cannot be negative" }).optional(),
  maxPrice: z.coerce.number().min(0, { message: "Maximum price cannot be negative" }).optional(),
  sortBy: z
    .enum(["newest", "price_asc", "price_desc", "rating"])
    .default("newest"),
  page: z.coerce.number().int().min(1, { message: "Page must be at least 1" }).default(1),
  limit: z.coerce.number().int().min(1).max(100, { message: "Limit cannot exceed 100" }).default(20),
});

export const ProductVariantSchema = z.object({
  sku: z.string().trim().min(1, { message: "SKU is required" }),
  name: z.string().trim().min(1, { message: "Variant name is required" }),
  price: z.number().min(0, { message: "Price must be non-negative" }),
  stockCount: z.number().int().min(0).default(0),
  attributes: z.record(z.unknown()).default({}),
});

export const ProductImageSchema = z.object({
  url: z.string().url({ message: "Invalid image URL" }),
  altText: z.string().optional(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const CreateProductSchema = z.object({
  subcategoryId: z.string().uuid({ message: "Invalid subcategory ID" }),
  title: z.string().trim().min(1, { message: "Product title is required" }).max(255),
  slug: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1, { message: "Product description is required" }),
  basePrice: z.number().min(0, { message: "Base price must be non-negative" }),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variants: z.array(ProductVariantSchema).optional(),
  images: z.array(ProductImageSchema).optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ReviewSchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID" }).optional(),
  rating: z
    .number()
    .int()
    .min(1, { message: "Rating must be between 1 and 5" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  comment: z.string().trim().max(1000, { message: "Comment cannot exceed 1000 characters" }).optional(),
});

export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ReviewInput = z.infer<typeof ReviewSchema>;

// ---------------------------------------------------------------------------
// 3. Cart Validation Schemas
// ---------------------------------------------------------------------------

export const AddToCartSchema = z.object({
  productVariantId: z.string().uuid({ message: "Invalid product variant ID" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
});

export const SyncCartSchema = z.object({
  items: z.array(AddToCartSchema),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
export type SyncCartInput = z.infer<typeof SyncCartSchema>;

// ---------------------------------------------------------------------------
// 4. Address Validation Schemas
// ---------------------------------------------------------------------------

export const CreateAddressSchema = z.object({
  recipient: z.string().trim().min(1, { message: "Recipient name is required" }),
  street: z.string().trim().min(1, { message: "Street address is required" }),
  city: z.string().trim().min(1, { message: "City is required" }),
  state: z.string().trim().min(1, { message: "State/Province is required" }),
  postalCode: z.string().trim().min(1, { message: "Postal code is required" }),
  country: z.string().trim().min(1, { message: "Country is required" }),
  isDefault: z.boolean().default(false),
});

export const UpdateAddressSchema = CreateAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;

// ---------------------------------------------------------------------------
// 5. Checkout & Order Validation Schemas
// ---------------------------------------------------------------------------

export const CheckoutIntentSchema = z.object({
  addressId: z.string().uuid({ message: "Invalid address ID" }),
  provider: z.enum(["STRIPE", "RAZORPAY", "CASH_ON_DELIVERY"], {
    errorMap: () => ({ message: "Invalid payment provider" }),
  }),
  items: z
    .array(
      z.object({
        productVariantId: z.string().uuid({ message: "Invalid variant ID" }),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
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
  trackingNumber: z.string().trim().optional(),
});

export type CheckoutIntentInput = z.infer<typeof CheckoutIntentSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
