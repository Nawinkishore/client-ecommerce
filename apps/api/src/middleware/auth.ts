import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { prisma } from "../lib/prisma";
import { UnauthorizedError } from "../errors/app-error";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new UnauthorizedError("Authentication token is missing"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new UnauthorizedError("Authentication token is missing"));
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new UnauthorizedError("Invalid or expired authentication token"));
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return next(new UnauthorizedError("User profile record not found"));
    }

    req.user = {
      id: profile.id,
      userId: profile.userId,
      email: profile.email,
      role: profile.role,
    };

    next();
  } catch (err) {
    next(err);
  }
}
