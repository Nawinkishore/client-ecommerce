"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const index_1 = require("../index");
(0, node_test_1.default)("Utility Functions Test Suite", async (t) => {
    await t.test("formatCurrency formats USD correctly", () => {
        const result = (0, index_1.formatCurrency)(2499.99);
        strict_1.default.ok(result.includes("2,499.99") || result.includes("2499.99"));
        strict_1.default.ok(result.includes("$"));
    });
    await t.test("slugify sanitizes and formats string into URL slug", () => {
        strict_1.default.equal((0, index_1.slugify)('Pro Studio Laptop 16"'), "pro-studio-laptop-16");
        strict_1.default.equal((0, index_1.slugify)("   Electronics & Gadgets -- New! "), "electronics-gadgets-new");
    });
    await t.test("generateOrderNumber generates valid prefix and date format", () => {
        const orderNum = (0, index_1.generateOrderNumber)("ORD");
        strict_1.default.ok(orderNum.startsWith("ORD-"));
        const parts = orderNum.split("-");
        strict_1.default.equal(parts.length, 3);
        strict_1.default.equal(parts[1].length, 8); // YYYYMMDD
        strict_1.default.equal(parts[2].length, 4); // Random 4-char suffix
    });
    await t.test("calculatePaginationMeta calculates page counts and flags correctly", () => {
        const metaPage1 = (0, index_1.calculatePaginationMeta)(45, 1, 10);
        strict_1.default.deepEqual(metaPage1, {
            total: 45,
            page: 1,
            limit: 10,
            totalPages: 5,
            hasNextPage: true,
            hasPrevPage: false,
        });
        const metaLastPage = (0, index_1.calculatePaginationMeta)(45, 5, 10);
        strict_1.default.deepEqual(metaLastPage, {
            total: 45,
            page: 5,
            limit: 10,
            totalPages: 5,
            hasNextPage: false,
            hasPrevPage: true,
        });
    });
});
