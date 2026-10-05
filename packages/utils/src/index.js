"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.slugify = slugify;
exports.generateOrderNumber = generateOrderNumber;
exports.calculatePaginationMeta = calculatePaginationMeta;
/**
 * Format a numeric amount into a localized currency string.
 */
function formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
}
/**
 * Convert a string into a URL-friendly slug.
 */
function slugify(text) {
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
function generateOrderNumber(prefix = "ORD") {
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
function calculatePaginationMeta(total, page, limit) {
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
