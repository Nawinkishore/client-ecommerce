import test from "node:test";
import assert from "node:assert/strict";
import {
  formatCurrency,
  slugify,
  generateOrderNumber,
  calculatePaginationMeta,
} from "../index";

test("Utility Functions Test Suite", async (t) => {
  await t.test("formatCurrency formats USD correctly", () => {
    const result = formatCurrency(2499.99);
    assert.ok(result.includes("2,499.99") || result.includes("2499.99"));
    assert.ok(result.includes("$"));
  });

  await t.test("slugify sanitizes and formats string into URL slug", () => {
    assert.equal(slugify('Pro Studio Laptop 16"'), "pro-studio-laptop-16");
    assert.equal(slugify("   Electronics & Gadgets -- New! "), "electronics-gadgets-new");
  });

  await t.test("generateOrderNumber generates valid prefix and date format", () => {
    const orderNum = generateOrderNumber("ORD");
    assert.ok(orderNum.startsWith("ORD-"));
    const parts = orderNum.split("-");
    assert.equal(parts.length, 3);
    assert.equal(parts[1].length, 8); // YYYYMMDD
    assert.equal(parts[2].length, 4); // Random 4-char suffix
  });

  await t.test("calculatePaginationMeta calculates page counts and flags correctly", () => {
    const metaPage1 = calculatePaginationMeta(45, 1, 10);
    assert.deepEqual(metaPage1, {
      total: 45,
      page: 1,
      limit: 10,
      totalPages: 5,
      hasNextPage: true,
      hasPrevPage: false,
    });

    const metaLastPage = calculatePaginationMeta(45, 5, 10);
    assert.deepEqual(metaLastPage, {
      total: 45,
      page: 5,
      limit: 10,
      totalPages: 5,
      hasNextPage: false,
      hasPrevPage: true,
    });
  });
});
