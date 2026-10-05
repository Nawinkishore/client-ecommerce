import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { ValidationError } from "../errors/app-error";

export interface RequestValidationSchema {
  body?: ZodType<unknown>;
  query?: ZodType<unknown>;
  params?: ZodType<unknown>;
}

export function validateRequest(schemas: RequestValidationSchema) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as Record<string, string>;
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as Record<string, string>;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join(".") || "root",
          message: err.message,
        }));
        return next(new ValidationError("Invalid input payload", details));
      }
      next(error);
    }
  };
}
