import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    sendSuccess(res, categories, "Categories fetched successfully");
  } catch (err) {
    next(err);
  }
}
