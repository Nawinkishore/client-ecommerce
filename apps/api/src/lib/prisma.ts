import { PrismaClient } from "@prisma/client";
import { supabase } from "./supabase";

const rawPrisma = new PrismaClient();

function camelToSnake(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

const tableMap: Record<string, string> = {
  category: "categories",
  subcategory: "subcategories",
  product: "products",
  productVariant: "product_variants",
  productImage: "product_images",
  profile: "profiles",
  address: "addresses",
  cart: "carts",
  cartItem: "cart_items",
  order: "orders",
  orderItem: "order_items",
  paymentTransaction: "payment_transactions",
  review: "reviews",
};

function createModelProxy(modelName: string) {
  const tableName = tableMap[modelName] || camelToSnake(modelName) + "s";

  return {
    async findMany(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].findMany(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          const { data, error } = await supabase.from(tableName).select("*");
          if (error) throw error;
          let results = data || [];
          if (args.where?.slug) {
            results = results.filter((r: any) => r.slug === args.where.slug);
          }
          if (args.where?.categoryId) {
            results = results.filter((r: any) => r.categoryId === args.where.categoryId);
          }
          if (args.skip || args.take) {
            const skip = args.skip || 0;
            const take = args.take || results.length;
            results = results.slice(skip, skip + take);
          }
          return results;
        }
        throw err;
      }
    },

    async count(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].count(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          const res = await supabase.from(tableName).select("*", { count: "exact" });
          if (res.error) throw res.error;
          return res.count !== null && res.count !== undefined ? res.count : (res.data ? res.data.length : 0);
        }
        throw err;
      }
    },

    async findUnique(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].findUnique(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          const key = Object.keys(args.where || {})[0];
          const val = args.where[key];
          const { data, error } = await supabase.from(tableName).select("*").eq(key, val).maybeSingle();
          if (error && error.code !== "PGRST116") throw error;
          return data || null;
        }
        throw err;
      }
    },

    async findFirst(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].findFirst(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          const { data, error } = await supabase.from(tableName).select("*").limit(1).maybeSingle();
          if (error) throw error;
          return data || null;
        }
        throw err;
      }
    },

    async create(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].create(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          const { data, error } = await supabase.from(tableName).insert(args.data).select().single();
          if (error) throw error;
          return data;
        }
        throw err;
      }
    },

    async update(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].update(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          const key = Object.keys(args.where || {})[0];
          const val = args.where[key];
          const { data, error } = await supabase.from(tableName).update(args.data).eq(key, val).select().single();
          if (error) throw error;
          return data;
        }
        throw err;
      }
    },

    async delete(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].delete(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          const key = Object.keys(args.where || {})[0];
          const val = args.where[key];
          const { data, error } = await supabase.from(tableName).delete().eq(key, val).select().maybeSingle();
          if (error) throw error;
          return data || { id: val };
        }
        throw err;
      }
    },

    async deleteMany(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].deleteMany(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          return { count: 0 };
        }
        throw err;
      }
    },

    async aggregate(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].aggregate(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          return { _sum: { totalAmount: 0 }, _count: { id: 0 } };
        }
        throw err;
      }
    },

    async upsert(args: any = {}) {
      try {
        return await (rawPrisma as any)[modelName].upsert(args);
      } catch (err: any) {
        if (err.message && err.message.includes("Can't reach database server")) {
          const { data, error } = await supabase.from(tableName).upsert(args.create || args.update).select().single();
          if (error) throw error;
          return data;
        }
        throw err;
      }
    }
  };
}

export const prisma = new Proxy(rawPrisma as any, {
  get(target, prop: string) {
    if (prop === "$disconnect") {
      return () => rawPrisma.$disconnect();
    }
    if (prop === "$connect") {
      return () => rawPrisma.$connect();
    }
    if (prop in target) {
      return createModelProxy(prop);
    }
    return createModelProxy(prop);
  },
});
