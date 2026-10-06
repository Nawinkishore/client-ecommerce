import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { UnauthorizedError } from "../errors/app-error";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return next(new UnauthorizedError("Authentication token or session is missing or invalid"));
    }

    const { user } = session;

    let profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          email: user.email,
          fullName: user.name || null,
          avatarUrl: user.image || null,
          role: (user as { role?: string }).role === "ADMIN" ? "ADMIN" : "CUSTOMER",
        },
      });
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

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session && session.user) {
      const { user } = session;
      let profile = await prisma.profile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        profile = await prisma.profile.create({
          data: {
            userId: user.id,
            email: user.email,
            fullName: user.name || null,
            avatarUrl: user.image || null,
            role: (user as { role?: string }).role === "ADMIN" ? "ADMIN" : "CUSTOMER",
          },
        });
      }

      req.user = {
        id: profile.id,
        userId: profile.userId,
        email: profile.email,
        role: profile.role,
      };
    }
    next();
  } catch (_err) {
    next();
  }
}
