import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { NotFoundError, UnauthorizedError, ForbiddenError } from "../errors/app-error";
import { calculatePaginationMeta } from "@client-ecommerce/utils";

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await prisma.order.count({
      where: { profileId: req.user.id },
    });

    const orders = await prisma.order.findMany({
      where: { profileId: req.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        shippingAddress: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
        transactions: true,
      },
    });

    const meta = calculatePaginationMeta(total, page, limit);

    sendSuccess(res, orders, "Orders fetched successfully", meta);
  } catch (err) {
    next(err);
  }
}

export async function getOrderByNumber(
  req: Request<{ orderNumber: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        shippingAddress: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
        transactions: true,
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.profileId !== req.user.id && req.user.role !== "ADMIN") {
      throw new ForbiddenError("Not authorized to view this order");
    }

    sendSuccess(res, order, "Order details fetched successfully");
  } catch (err) {
    next(err);
  }
}
