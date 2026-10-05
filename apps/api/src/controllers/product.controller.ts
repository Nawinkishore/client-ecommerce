import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../errors/app-error";
import { calculatePaginationMeta } from "@client-ecommerce/utils";
import { ProductQueryInput, ReviewInput } from "@client-ecommerce/validation";
import { Prisma } from "@prisma/client";

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as ProductQueryInput;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const search = query.search ? String(query.search) : undefined;
    const categoryId = query.categoryId ? String(query.categoryId) : undefined;
    const subcategoryId = query.subcategoryId ? String(query.subcategoryId) : undefined;
    const minPrice = query.minPrice !== undefined ? Number(query.minPrice) : undefined;
    const maxPrice = query.maxPrice !== undefined ? Number(query.maxPrice) : undefined;
    const sortBy = query.sortBy;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (subcategoryId) {
      where.subcategoryId = subcategoryId;
    } else if (categoryId) {
      where.subcategory = { categoryId };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "price_asc") {
      orderBy = { basePrice: "asc" };
    } else if (sortBy === "price_desc") {
      orderBy = { basePrice: "desc" };
    }

    const total = await prisma.product.count({ where });
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        subcategory: {
          include: { category: true },
        },
        variants: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    const meta = calculatePaginationMeta(total, page, limit);

    let formattedProducts = products.map((product: any) => {
      const reviews: Array<{ rating: number }> = product.reviews || [];
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / reviews.length
          : 0;
      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      };
    });

    sendSuccess(res, formattedProducts, "Products fetched successfully", meta);
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw new NotFoundError("Product not found");
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        subcategory: {
          include: { category: true },
        },
        variants: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        reviews: {
          include: {
            profile: {
              select: { fullName: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundError("Product not found");
    }

    const reviews = product.reviews || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
        : 0;

    sendSuccess(
      res,
      {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
      "Product fetched successfully"
    );
  } catch (err) {
    next(err);
  }
}

export async function createReview(
  req: Request<{ id: string }, {}, ReviewInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const productId = req.params.id || (req.body as any)?.productId;

    if (!productId) {
      throw new BadRequestError("Product ID is required");
    }

    const { rating, comment } = req.body || {};

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const review = await prisma.review.upsert({
      where: {
        productId_profileId: {
          productId,
          profileId: req.user.id,
        },
      },
      update: {
        rating,
        comment: comment || null,
      },
      create: {
        productId,
        profileId: req.user.id,
        rating,
        comment: comment || null,
      },
    });

    sendSuccess(res, review, "Review submitted successfully", undefined, 201);
  } catch (err) {
    next(err);
  }
}
