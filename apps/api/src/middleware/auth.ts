import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../lib/supabase";
import { prisma } from "../lib/prisma";
import { UnauthorizedError } from "../errors/app-error";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check HttpOnly Cookie first
    if (req.cookies && req.cookies["sb-access-token"]) {
      token = req.cookies["sb-access-token"];
    } 
    // 2. Fallback to Authorization Header (Bearer <token>)
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new UnauthorizedError("Authentication token is missing"));
    }

    let userId: string | null = null;
    const jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;

    // Fast local verification if secret is available with strict algorithm enforcement
    if (jwtSecret) {
      try {
        const decoded = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] }) as { sub?: string };
        if (decoded && decoded.sub) {
          userId = decoded.sub;
        }
      } catch (err) {
        // Local verification failed; fallback to Supabase Auth API check
        userId = null;
      }
    }

    // Network fallback verification if local verification did not resolve
    if (!userId) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return next(new UnauthorizedError("Invalid or expired authentication token"));
      }
      userId = user.id;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
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

