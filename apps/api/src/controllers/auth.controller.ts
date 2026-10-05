import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { BadRequestError, UnauthorizedError } from "../errors/app-error";
import { SignupInput, LoginInput, ResetPasswordInput, RefreshTokenInput } from "@client-ecommerce/validation";

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

export async function forgotPassword(
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Email address is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.headers.origin || "http://localhost:3000"}/reset-password`,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    sendSuccess(
      res,
      null,
      "If an account with this email exists, a password reset link has been dispatched."
    );
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { password, accessToken } = req.body;

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: "",
    });

    if (sessionError) {
      throw new BadRequestError("Invalid or expired password reset token");
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw new BadRequestError(error.message);
    }

    sendSuccess(res, null, "Password has been reset successfully");
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(
  req: Request<{}, {}, RefreshTokenInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken: token } = req.body;

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: token });

    if (error || !data.session) {
      throw new UnauthorizedError("Session expired, please log in again");
    }

    sendSuccess(
      res,
      {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
      },
      "Token refreshed successfully"
    );
  } catch (err) {
    next(err);
  }
}

