import { Response } from "express";
import { PaginationMeta, ApiResponse } from "@client-ecommerce/types";

export interface StandardSuccessResponse<T> extends ApiResponse<T> {
  meta?: PaginationMeta;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  meta?: PaginationMeta,
  statusCode: number = 200
): Response {
  const responsePayload: StandardSuccessResponse<T> = {
    success: true,
  };

  if (message !== undefined) {
    responsePayload.message = message;
  }

  if (data !== undefined) {
    responsePayload.data = data;
  }

  if (meta !== undefined) {
    responsePayload.meta = meta;
  }

  return res.status(statusCode).json(responsePayload);
}

export function sendError(
  res: Response,
  statusCode: number = 500,
  code: string = "INTERNAL_SERVER_ERROR",
  message: string = "An unexpected error occurred",
  details?: Array<{ field: string; message: string }>
): Response {
  const responsePayload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {}),
    },
  };

  return res.status(statusCode).json(responsePayload);
}
