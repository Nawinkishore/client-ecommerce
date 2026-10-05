import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError } from "../errors/app-error";
import { CreateProductInput, UpdateProductInput, UpdateOrderStatusInput } from "@client-ecommerce/validation";
import { slugify } from "@client-ecommerce/utils";

export async function getAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      throw new ForbiddenError("Admin access required");
    }

    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.profile.count({ where: { role: "CUSTOMER" } });

    const paidOrders = await prisma.order.findMany({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      select: { totalAmount: true },
    });

    const totalRevenue = paidOrders.reduce((sum: number, order: any) => sum + Number(order.totalAmount), 0);

    const lowStockVariants = await prisma.productVariant.findMany({
      where: { stockCount: { lte: 5 } },
      include: {
        product: {
          select: { title: true, slug: true },
        },
      },
      take: 20,
    });

    sendSuccess(
      res,
      {
        totalOrders,
        totalCustomers,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        lowStockWarnings: lowStockVariants.map((v: any) => ({
          id: v.id,
          sku: v.sku,
          variantName: v.name,
          productTitle: v.product.title,
          stockCount: v.stockCount,
        })),
      },
      "Admin analytics retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: Request<{}, {}, CreateProductInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      throw new ForbiddenError("Admin access required");
    }

    const {
      subcategoryId,
      title,
      slug: customSlug,
      description,
      basePrice,
      isFeatured,
      isActive,
      variants,
      images,
    } = req.body;

    const subcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
    });

    if (!subcategory) {
      throw new NotFoundError("Subcategory not found");
    }

    const productSlug = customSlug ? slugify(customSlug) : slugify(title);

    const existingProduct = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    if (existingProduct) {
      throw new BadRequestError(`Product with slug "${productSlug}" already exists`);
    }

    const product = await prisma.$transaction(async (tx: any) => {
      const createdProduct = await tx.product.create({
        data: {
          subcategoryId,
          title,
          slug: productSlug,
          description,
          basePrice,
          isFeatured: isFeatured ?? false,
          isActive: isActive ?? true,
          variants: variants && variants.length > 0
            ? {
                createMany: {
                  data: variants.map((v) => ({
                    sku: v.sku,
                    name: v.name,
                    price: v.price,
                    stockCount: v.stockCount,
                    attributes: JSON.parse(JSON.stringify(v.attributes || {})),
                  })),
                },
              }
            : undefined,
          images: images && images.length > 0
            ? {
                createMany: {
                  data: images.map((img) => ({
                    url: img.url,
                    altText: img.altText || null,
                    isPrimary: img.isPrimary ?? false,
                    sortOrder: img.sortOrder ?? 0,
                  })),
                },
              }
            : undefined,
        },
        include: {
          subcategory: true,
          variants: true,
          images: true,
        },
      });

      return createdProduct;
    });

    sendSuccess(res, product, "Product created successfully", undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request<{ id: string }, {}, UpdateProductInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      throw new ForbiddenError("Admin access required");
    }

    const { id } = req.params;
    const { subcategoryId, title, slug, description, basePrice, isFeatured, isActive } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(subcategoryId !== undefined && { subcategoryId }),
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug: slugify(slug) }),
        ...(description !== undefined && { description }),
        ...(basePrice !== undefined && { basePrice }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        subcategory: true,
        variants: true,
        images: true,
      },
    });

    sendSuccess(res, updatedProduct, "Product updated successfully");
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(
  req: Request<{ id: string }, {}, UpdateOrderStatusInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      throw new ForbiddenError("Admin access required");
    }

    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundError("Order not found");
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingNumber !== undefined && { trackingNumber }),
      },
      include: {
        shippingAddress: true,
        items: true,
        transactions: true,
      },
    });

    sendSuccess(res, updatedOrder, "Order status updated successfully");
  } catch (err) {
    next(err);
  }
}
