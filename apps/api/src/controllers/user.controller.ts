import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { sendSuccess } from "../utils/response";
import { NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError } from "../errors/app-error";
import { CreateAddressInput, ChangePasswordInput } from "@client-ecommerce/validation";

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
      include: {
        addresses: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profile) {
      throw new NotFoundError("Profile record not found");
    }

    sendSuccess(res, profile, "Profile fetched successfully");
  } catch (err) {
    next(err);
  }
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { fullName, phone, avatarUrl } = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { id: req.user.id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      include: {
        addresses: true,
      },
    });

    sendSuccess(res, updatedProfile, "Profile updated successfully");
  } catch (err) {
    next(err);
  }
}

export async function addAddress(
  req: Request<{}, {}, CreateAddressInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { recipient, street, city, state, postalCode, country, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { profileId: req.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        profileId: req.user.id,
        recipient,
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault ?? false,
      },
    });

    sendSuccess(res, address, "Address added successfully", undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteAddress(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { id } = req.params;

    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      throw new NotFoundError("Address not found");
    }

    if (existingAddress.profileId !== req.user.id) {
      throw new ForbiddenError("You are not authorized to delete this address");
    }

    await prisma.address.delete({
      where: { id },
    });

    sendSuccess(res, null, "Address deleted successfully");
  } catch (err) {
    next(err);
  }
}

export async function changePassword(
  req: Request<{}, {}, ChangePasswordInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { currentPassword, newPassword } = req.body as ChangePasswordInput & { currentPassword?: string };

    const result = await auth.api.changePassword({
      headers: fromNodeHeaders(req.headers),
      body: {
        newPassword,
        currentPassword: currentPassword || "",
      },
    });

    if (!result) {
      throw new BadRequestError("Failed to update password");
    }

    sendSuccess(res, null, "Password updated successfully");
  } catch (err) {
    next(err);
  }
}
