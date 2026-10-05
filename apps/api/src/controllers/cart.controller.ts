import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from "../errors/app-error";
import { AddToCartInput, UpdateCartItemInput, SyncCartInput } from "@client-ecommerce/validation";

async function getOrCreateCart(profileId: string) {
  let cart = await prisma.cart.findFirst({
    where: { profileId },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { profileId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

export async function getCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const cart = await getOrCreateCart(req.user.id);
    sendSuccess(res, cart, "Cart fetched successfully");
  } catch (err) {
    next(err);
  }
}

export async function addToCart(
  req: Request<{}, {}, AddToCartInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { productVariantId, quantity } = req.body;

    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    if (!variant) {
      throw new NotFoundError("Product variant not found");
    }

    if (variant.stockCount < quantity) {
      throw new BadRequestError(`Insufficient stock. Only ${variant.stockCount} available`);
    }

    const cart = await getOrCreateCart(req.user.id);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (variant.stockCount < newQuantity) {
        throw new BadRequestError(`Cannot add. Exceeds available stock (${variant.stockCount})`);
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId,
          quantity,
        },
      });
    }

    const updatedCart = await getOrCreateCart(req.user.id);
    sendSuccess(res, updatedCart, "Item added to cart successfully");
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(
  req: Request<{ id: string }, {}, UpdateCartItemInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { id: itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        productVariant: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundError("Cart item not found");
    }

    if (cartItem.cart.profileId !== req.user.id) {
      throw new ForbiddenError("Not authorized to modify this cart item");
    }

    if (cartItem.productVariant.stockCount < quantity) {
      throw new BadRequestError(`Only ${cartItem.productVariant.stockCount} items available in stock`);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    const updatedCart = await getOrCreateCart(req.user.id);
    sendSuccess(res, updatedCart, "Cart item updated successfully");
  } catch (err) {
    next(err);
  }
}

export async function removeCartItem(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { id: itemId } = req.params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundError("Cart item not found");
    }

    if (cartItem.cart.profileId !== req.user.id) {
      throw new ForbiddenError("Not authorized to remove this cart item");
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    const updatedCart = await getOrCreateCart(req.user.id);
    sendSuccess(res, updatedCart, "Item removed from cart successfully");
  } catch (err) {
    next(err);
  }
}

export async function syncCart(
  req: Request<{}, {}, SyncCartInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { items } = req.body;
    const cart = await getOrCreateCart(req.user.id);

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
      });

      if (!variant) continue;

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productVariantId: item.productVariantId,
        },
      });

      if (existingItem) {
        const mergedQty = Math.min(existingItem.quantity + item.quantity, variant.stockCount);
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: mergedQty },
        });
      } else {
        const addQty = Math.min(item.quantity, variant.stockCount);
        if (addQty > 0) {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productVariantId: item.productVariantId,
              quantity: addQty,
            },
          });
        }
      }
    }

    const updatedCart = await getOrCreateCart(req.user.id);
    sendSuccess(res, updatedCart, "Cart synchronized successfully");
  } catch (err) {
    next(err);
  }
}
