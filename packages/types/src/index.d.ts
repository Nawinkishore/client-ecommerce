/**
 * Shared Monorepo Type Definitions
 */
export type Role = "CUSTOMER" | "ADMIN";
export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentProvider = "STRIPE" | "RAZORPAY" | "CASH_ON_DELIVERY";
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export interface PaginatedResponse<T> {
    items: T[];
    meta: PaginationMeta;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Array<{
            field: string;
            message: string;
        }>;
    };
}
export interface UserProfile extends BaseEntity {
    userId: string;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    role: Role;
    addresses?: Address[];
    cart?: Cart | null;
    orders?: Order[];
    reviews?: Review[];
}
export type Profile = UserProfile;
export interface Address extends BaseEntity {
    profileId: string;
    recipient: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}
export interface Category extends BaseEntity {
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    subcategories?: Subcategory[];
}
export interface Subcategory extends BaseEntity {
    categoryId: string;
    name: string;
    slug: string;
    description?: string | null;
    category?: Category;
    products?: Product[];
}
export interface ProductVariant extends BaseEntity {
    productId: string;
    sku: string;
    name: string;
    price: number;
    stockCount: number;
    attributes: Record<string, unknown>;
    product?: Product;
}
export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    altText?: string | null;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: Date;
}
export interface Product extends BaseEntity {
    subcategoryId: string;
    title: string;
    slug: string;
    description: string;
    basePrice: number;
    isFeatured: boolean;
    isActive: boolean;
    subcategory?: Subcategory;
    variants?: ProductVariant[];
    images?: ProductImage[];
    reviews?: Review[];
}
export interface CartItem extends BaseEntity {
    cartId: string;
    productVariantId: string;
    quantity: number;
    productVariant?: ProductVariant;
}
export interface Cart extends BaseEntity {
    profileId?: string | null;
    items?: CartItem[];
}
export interface OrderItem {
    id: string;
    orderId: string;
    productVariantId: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    productVariant?: ProductVariant;
}
export interface PaymentTransaction {
    id: string;
    orderId: string;
    provider: PaymentProvider;
    transactionId: string;
    status: PaymentStatus;
    amount: number;
    rawResponse?: Record<string, unknown> | null;
    createdAt: Date;
}
export interface Order extends BaseEntity {
    orderNumber: string;
    profileId: string;
    addressId: string;
    status: OrderStatus;
    subtotal: number;
    tax: number;
    shippingCost: number;
    totalAmount: number;
    trackingNumber?: string | null;
    profile?: UserProfile;
    shippingAddress?: Address;
    items?: OrderItem[];
    transactions?: PaymentTransaction[];
}
export interface Review extends BaseEntity {
    productId: string;
    profileId: string;
    rating: number;
    comment?: string | null;
    product?: Product;
    profile?: UserProfile;
}
export interface SignupDTO {
    email: string;
    password?: string;
    fullName?: string;
    phone?: string;
}
export interface LoginDTO {
    email: string;
    password?: string;
}
export interface CreateProductDTO {
    subcategoryId: string;
    title: string;
    slug?: string;
    description: string;
    basePrice: number;
    isFeatured?: boolean;
    isActive?: boolean;
    variants?: Array<{
        sku: string;
        name: string;
        price: number;
        stockCount: number;
        attributes: Record<string, unknown>;
    }>;
    images?: Array<{
        url: string;
        altText?: string;
        isPrimary?: boolean;
        sortOrder?: number;
    }>;
}
export interface UpdateProductDTO {
    subcategoryId?: string;
    title?: string;
    slug?: string;
    description?: string;
    basePrice?: number;
    isFeatured?: boolean;
    isActive?: boolean;
}
export interface AddToCartDTO {
    productVariantId: string;
    quantity: number;
}
export interface UpdateCartItemDTO {
    quantity: number;
}
export interface CreateAddressDTO {
    recipient: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}
export interface UpdateAddressDTO {
    recipient?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
}
export interface CheckoutIntentDTO {
    addressId: string;
    provider: PaymentProvider;
    items?: Array<{
        productVariantId: string;
        quantity: number;
    }>;
}
export interface UpdateOrderStatusDTO {
    status: OrderStatus;
    trackingNumber?: string;
}
