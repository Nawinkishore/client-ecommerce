import { Request, Response, NextFunction } from "express";
import { supabase, createUserClient } from "../lib/supabase";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { BadRequestError, UnauthorizedError } from "../errors/app-error";
import { SignupInput, LoginInput, ResetPasswordInput, RefreshTokenInput } from "@client-ecommerce/validation";
import { validateEnv } from "@client-ecommerce/config";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function signup(
  req: Request<{}, {}, SignupInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!password) {
      throw new BadRequestError("Password is required for registration");
    }

    const existingProfile = await prisma.profile.findFirst({
      where: { email },
    });

    if (existingProfile) {
      throw new BadRequestError("User with this email already exists");
    }

    const clientUrl = validateEnv().CLIENT_URL;
    const origin = req.headers.origin || clientUrl;
    const emailRedirectTo = `${origin}/auth/callback`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError || !authData.user) {
      const msg = authError?.message || "";
      if (msg.toLowerCase().includes("rate limit")) {
        throw new BadRequestError(
          "Supabase email rate limit exceeded (default limit is 3-4 emails/hour on default Supabase SMTP). Please wait a few minutes before trying again or configure a Custom SMTP provider in your Supabase Dashboard."
        );
      }
      throw new BadRequestError(msg || "Failed to create authentication user");
    }

    // Attempt profile retrieval (or fallback creation if trigger delayed)
    let profile = await prisma.profile.findUnique({
      where: { userId: authData.user.id },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: authData.user.id,
          email,
          fullName: fullName || null,
          phone: phone || null,
          role: "CUSTOMER",
        },
      });
    }

    if (authData.session) {
      res.cookie("sb-access-token", authData.session.access_token, {
        ...COOKIE_OPTIONS,
        maxAge: authData.session.expires_in * 1000,
      });
      res.cookie("sb-refresh-token", authData.session.refresh_token, {
        ...COOKIE_OPTIONS,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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

    res.cookie("sb-access-token", authData.session.access_token, {
      ...COOKIE_OPTIONS,
      maxAge: authData.session.expires_in * 1000,
    });
    res.cookie("sb-refresh-token", authData.session.refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60 * 1000,
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

    res.clearCookie("sb-access-token", { path: "/" });
    res.clearCookie("sb-refresh-token", { path: "/" });

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

    const clientUrl = validateEnv().CLIENT_URL;
    const origin = req.headers.origin || clientUrl;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?type=recovery`,
    });

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        throw new BadRequestError(
          "Email rate limit exceeded (Supabase default limit is 3-4 emails/hour). Please wait a few minutes before trying again."
        );
      }
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

    if (!accessToken) {
      throw new BadRequestError("Password reset token is required");
    }

    const userSupabase = createUserClient(accessToken);
    const { error } = await userSupabase.auth.updateUser({ password });

    if (error) {
      throw new BadRequestError(error.message || "Invalid or expired password reset token");
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
    const token = req.body.refreshToken || req.cookies["sb-refresh-token"];

    if (!token) {
      throw new UnauthorizedError("Refresh token is missing");
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: token });

    if (error || !data.session) {
      res.clearCookie("sb-access-token", { path: "/" });
      res.clearCookie("sb-refresh-token", { path: "/" });
      throw new UnauthorizedError("Session expired, please log in again");
    }

    res.cookie("sb-access-token", data.session.access_token, {
      ...COOKIE_OPTIONS,
      maxAge: data.session.expires_in * 1000,
    });
    res.cookie("sb-refresh-token", data.session.refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

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

export async function resendConfirmation(
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Email address is required");
    }

    const clientUrl = validateEnv().CLIENT_URL;
    const origin = req.headers.origin || clientUrl;
    const emailRedirectTo = `${origin}/auth/callback`;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        throw new BadRequestError(
          "Email rate limit exceeded (Supabase default limit is 3-4 emails/hour). Please wait a few minutes before trying again."
        );
      }
      throw new BadRequestError(error.message);
    }

    sendSuccess(
      res,
      null,
      "Verification email has been resent successfully. Please check your inbox."
    );
  } catch (err) {
    next(err);
  }
}



