import type { PaginationMeta } from "@client-ecommerce/types";

/**
 * Format a numeric amount or numeric string into a localized currency string.
 */
export function formatCurrency(amount: number | string | null | undefined, currency = "USD"): string {
  const numericAmount = typeof amount === "number" ? amount : (amount ? Number(amount) : 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(isNaN(numericAmount) ? 0 : numericAmount);
}

/**
 * Safely call toFixed on numbers, strings, or decimal objects without throwing errors.
 */
export function safeToFixed(value: number | string | null | undefined, decimals = 2): string {
  const num = typeof value === "number" ? value : (value ? Number(value) : 0);
  return (isNaN(num) ? 0 : num).toFixed(decimals);
}


/**
 * Convert a string into a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Generate a unique order number formatted as PREFIX-YYYYMMDD-XXXX (e.g. ORD-20261005-A1B2).
 */
export function generateOrderNumber(prefix = "ORD"): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}${mm}${dd}`;

  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${prefix}-${dateStr}-${randomSuffix}`;
}

/**
 * Calculate pagination metadata for paginated database query responses.
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const safeTotal = Math.max(0, total);
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);

  const totalPages = Math.ceil(safeTotal / safeLimit) || 1;
  const hasNextPage = safePage < totalPages;
  const hasPrevPage = safePage > 1;

  return {
    total: safeTotal,
    page: safePage,
    limit: safeLimit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
}
