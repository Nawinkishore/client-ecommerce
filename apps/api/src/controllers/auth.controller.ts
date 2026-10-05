import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { BadRequestError, UnauthorizedError } from "../errors/app-error";
import { SignupInput, LoginInput } from "@client-ecommerce/validation";

export async function signup(
  req: Request<{}, {}, SignupInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, fullName, phone } = req.body;

    const existingProfile = await prisma.profile.findFirst({
      where: { email },
    });

    if (existingProfile) {
      throw new BadRequestError("User with this email already exists");
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: password || "TemporaryPass123!",
    });

    if (authError || !authData.user) {
      throw new BadRequestError(authError?.message || "Failed to create authentication user");
    }

    const profile = await prisma.profile.create({
      data: {
        userId: authData.user.id,
        email,
        fullName: fullName || null,
        phone: phone || null,
        role: "CUSTOMER",
      },
    });

    sendSuccess(
      res,
      {
        user: {
          id: profile.id,
          userId: profile.userId,
          email: profile.email,
          fullName: profile.fullName,
          phone: profile.phone,
          role: profile.role,
        },
        session: authData.session
          ? {
              accessToken: authData.session.access_token,
              refreshToken: authData.session.refresh_token,
              expiresIn: authData.session.expires_in,
            }
          : null,
      },
      "Account registered successfully",
      undefined,
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user || !authData.session) {
      throw new UnauthorizedError(authError?.message || "Invalid email or password");
    }

    let profile = await prisma.profile.findUnique({
      where: { userId: authData.user.id },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: authData.user.id,
          email,
          role: "CUSTOMER",
        },
      });
    }

    sendSuccess(
      res,
      {
        user: {
          id: profile.id,
          userId: profile.userId,
          email: profile.email,
          fullName: profile.fullName,
          phone: profile.phone,
          role: profile.role,
        },
        session: {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
          expiresIn: authData.session.expires_in,
        },
      },
      "Logged in successfully"
    );
  } catch (err) {
    next(err);
  }
}

export async function logout(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await supabase.auth.signOut();
    sendSuccess(res, null, "Logged out successfully");
  } catch (err) {
    next(err);
  }
}
