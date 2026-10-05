import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/app-error";
import { sendError } from "../utils/response";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (err instanceof AppError) {
    return sendError(
      res,
      err.statusCode,
      err.code,
      err.message,
      err.details
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(", ")
        : "field";
      return sendError(
        res,
        409,
        "CONFLICT",
        `A record with this ${target} already exists`
      );
    }
    if (err.code === "P2025") {
      return sendError(
        res,
        404,
        "NOT_FOUND",
        "Requested database record was not found"
      );
    }
    return sendError(
      res,
      400,
      "DATABASE_ERROR",
      "Database operation failed"
    );
  }

  const isProduction = process.env.NODE_ENV === "production";
  const errorMessage = isProduction
    ? "An unexpected server error occurred"
    : err.message || "An unexpected server error occurred";

  console.error("[Unhandled Error]:", err);

  return sendError(
    res,
    500,
    "INTERNAL_SERVER_ERROR",
    errorMessage
  );
}
