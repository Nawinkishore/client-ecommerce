import { z } from "zod";
export declare const SignupSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    fullName?: string | undefined;
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    fullName?: string | undefined;
    phone?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const ResetPasswordSchema: z.ZodObject<{
    password: z.ZodString;
    accessToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    accessToken: string;
}, {
    password: string;
    accessToken: string;
}>;
export declare const ChangePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodOptional<z.ZodString>;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword: string;
    currentPassword?: string | undefined;
}, {
    newPassword: string;
    currentPassword?: string | undefined;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export declare const ProductQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    subcategoryId: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<["newest", "price_asc", "price_desc", "rating"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sortBy: "newest" | "price_asc" | "price_desc" | "rating";
    page: number;
    limit: number;
    search?: string | undefined;
    categoryId?: string | undefined;
    subcategoryId?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}, {
    search?: string | undefined;
    categoryId?: string | undefined;
    subcategoryId?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    sortBy?: "newest" | "price_asc" | "price_desc" | "rating" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const ProductVariantSchema: z.ZodObject<{
    sku: z.ZodString;
    name: z.ZodString;
    price: z.ZodNumber;
    stockCount: z.ZodDefault<z.ZodNumber>;
    attributes: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    sku: string;
    name: string;
    price: number;
    stockCount: number;
    attributes: Record<string, unknown>;
}, {
    sku: string;
    name: string;
    price: number;
    stockCount?: number | undefined;
    attributes?: Record<string, unknown> | undefined;
}>;
export declare const ProductImageSchema: z.ZodObject<{
    url: z.ZodString;
    altText: z.ZodOptional<z.ZodString>;
    isPrimary: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    url: string;
    isPrimary: boolean;
    sortOrder: number;
    altText?: string | undefined;
}, {
    url: string;
    altText?: string | undefined;
    isPrimary?: boolean | undefined;
    sortOrder?: number | undefined;
}>;
export declare const CreateProductSchema: z.ZodObject<{
    subcategoryId: z.ZodString;
    title: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    basePrice: z.ZodNumber;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        sku: z.ZodString;
        name: z.ZodString;
        price: z.ZodNumber;
        stockCount: z.ZodDefault<z.ZodNumber>;
        attributes: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        sku: string;
        name: string;
        price: number;
        stockCount: number;
        attributes: Record<string, unknown>;
    }, {
        sku: string;
        name: string;
        price: number;
        stockCount?: number | undefined;
        attributes?: Record<string, unknown> | undefined;
    }>, "many">>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        altText: z.ZodOptional<z.ZodString>;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        isPrimary: boolean;
        sortOrder: number;
        altText?: string | undefined;
    }, {
        url: string;
        altText?: string | undefined;
        isPrimary?: boolean | undefined;
        sortOrder?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    subcategoryId: string;
    title: string;
    description: string;
    basePrice: number;
    isFeatured: boolean;
    isActive: boolean;
    slug?: string | undefined;
    variants?: {
        sku: string;
        name: string;
        price: number;
        stockCount: number;
        attributes: Record<string, unknown>;
    }[] | undefined;
    images?: {
        url: string;
        isPrimary: boolean;
        sortOrder: number;
        altText?: string | undefined;
    }[] | undefined;
}, {
    subcategoryId: string;
    title: string;
    description: string;
    basePrice: number;
    slug?: string | undefined;
    isFeatured?: boolean | undefined;
    isActive?: boolean | undefined;
    variants?: {
        sku: string;
        name: string;
        price: number;
        stockCount?: number | undefined;
        attributes?: Record<string, unknown> | undefined;
    }[] | undefined;
    images?: {
        url: string;
        altText?: string | undefined;
        isPrimary?: boolean | undefined;
        sortOrder?: number | undefined;
    }[] | undefined;
}>;
export declare const UpdateProductSchema: z.ZodObject<{
    subcategoryId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    basePrice: z.ZodOptional<z.ZodNumber>;
    isFeatured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    variants: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        sku: z.ZodString;
        name: z.ZodString;
        price: z.ZodNumber;
        stockCount: z.ZodDefault<z.ZodNumber>;
        attributes: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        sku: string;
        name: string;
        price: number;
        stockCount: number;
        attributes: Record<string, unknown>;
    }, {
        sku: string;
        name: string;
        price: number;
        stockCount?: number | undefined;
        attributes?: Record<string, unknown> | undefined;
    }>, "many">>>;
    images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        altText: z.ZodOptional<z.ZodString>;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        isPrimary: boolean;
        sortOrder: number;
        altText?: string | undefined;
    }, {
        url: string;
        altText?: string | undefined;
        isPrimary?: boolean | undefined;
        sortOrder?: number | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    subcategoryId?: string | undefined;
    title?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    basePrice?: number | undefined;
    isFeatured?: boolean | undefined;
    isActive?: boolean | undefined;
    variants?: {
        sku: string;
        name: string;
        price: number;
        stockCount: number;
        attributes: Record<string, unknown>;
    }[] | undefined;
    images?: {
        url: string;
        isPrimary: boolean;
        sortOrder: number;
        altText?: string | undefined;
    }[] | undefined;
}, {
    subcategoryId?: string | undefined;
    title?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    basePrice?: number | undefined;
    isFeatured?: boolean | undefined;
    isActive?: boolean | undefined;
    variants?: {
        sku: string;
        name: string;
        price: number;
        stockCount?: number | undefined;
        attributes?: Record<string, unknown> | undefined;
    }[] | undefined;
    images?: {
        url: string;
        altText?: string | undefined;
        isPrimary?: boolean | undefined;
        sortOrder?: number | undefined;
    }[] | undefined;
}>;
export declare const ReviewSchema: z.ZodObject<{
    productId: z.ZodOptional<z.ZodString>;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rating: number;
    productId?: string | undefined;
    comment?: string | undefined;
}, {
    rating: number;
    productId?: string | undefined;
    comment?: string | undefined;
}>;
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ReviewInput = z.infer<typeof ReviewSchema>;
export declare const AddToCartSchema: z.ZodObject<{
    productVariantId: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    productVariantId: string;
    quantity: number;
}, {
    productVariantId: string;
    quantity: number;
}>;
export declare const UpdateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
}, {
    quantity: number;
}>;
export declare const SyncCartSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        productVariantId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productVariantId: string;
        quantity: number;
    }, {
        productVariantId: string;
        quantity: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        productVariantId: string;
        quantity: number;
    }[];
}, {
    items: {
        productVariantId: string;
        quantity: number;
    }[];
}>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
export type SyncCartInput = z.infer<typeof SyncCartSchema>;
export declare const CreateAddressSchema: z.ZodObject<{
    recipient: z.ZodString;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodString;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    recipient: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}, {
    recipient: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean | undefined;
}>;
export declare const UpdateAddressSchema: z.ZodObject<{
    recipient: z.ZodOptional<z.ZodString>;
    street: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    recipient?: string | undefined;
    street?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
    country?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    recipient?: string | undefined;
    street?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
    country?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;
export declare const CheckoutIntentSchema: z.ZodObject<{
    addressId: z.ZodString;
    provider: z.ZodEnum<["STRIPE", "RAZORPAY", "CASH_ON_DELIVERY"]>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        productVariantId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productVariantId: string;
        quantity: number;
    }, {
        productVariantId: string;
        quantity: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    addressId: string;
    provider: "STRIPE" | "RAZORPAY" | "CASH_ON_DELIVERY";
    items?: {
        productVariantId: string;
        quantity: number;
    }[] | undefined;
}, {
    addressId: string;
    provider: "STRIPE" | "RAZORPAY" | "CASH_ON_DELIVERY";
    items?: {
        productVariantId: string;
        quantity: number;
    }[] | undefined;
}>;
export declare const UpdateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]>;
    trackingNumber: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
    trackingNumber?: string | undefined;
}, {
    status: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
    trackingNumber?: string | undefined;
}>;
export type CheckoutIntentInput = z.infer<typeof CheckoutIntentSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
