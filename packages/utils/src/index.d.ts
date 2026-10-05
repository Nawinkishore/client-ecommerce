import type { PaginationMeta } from "@client-ecommerce/types";
/**
 * Format a numeric amount into a localized currency string.
 */
export declare function formatCurrency(amount: number, currency?: string): string;
/**
 * Convert a string into a URL-friendly slug.
 */
export declare function slugify(text: string): string;
/**
 * Generate a unique order number formatted as PREFIX-YYYYMMDD-XXXX (e.g. ORD-20261005-A1B2).
 */
export declare function generateOrderNumber(prefix?: string): string;
/**
 * Calculate pagination metadata for paginated database query responses.
 */
export declare function calculatePaginationMeta(total: number, page: number, limit: number): PaginationMeta;
