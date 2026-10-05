import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../errors/app-error";
import { CheckoutIntentInput } from "@client-ecommerce/validation";
import { generateOrderNumber } from "@client-ecommerce/utils";
import Stripe from "stripe";
import { validateEnv } from "@client-ecommerce/config";

const env = validateEnv();
const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as Stripe.LatestApiVersion })
  : null;

export async function createCheckoutIntent(
  req: Request<{}, {}, CheckoutIntentInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const { addressId, provider, items: directItems } = req.body;

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.profileId !== req.user.id) {
      throw new NotFoundError("Selected shipping address not found");
    }

    let itemsToProcess: Array<{ productVariantId: string; quantity: number }> = [];

    if (directItems && directItems.length > 0) {
      itemsToProcess = directItems;
    } else {
      const userCart = await prisma.cart.findFirst({
        where: { profileId: req.user.id },
        include: { items: true },
      });

      if (!userCart || !userCart.items || userCart.items.length === 0) {
        throw new BadRequestError("Your cart is empty");
      }

      itemsToProcess = userCart.items.map((i: any) => ({
        productVariantId: i.productVariantId,
        quantity: i.quantity,
      }));
    }

    let subtotal = 0;
    const orderItemsData: Array<{
      productVariantId: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    for (const item of itemsToProcess) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
        include: { product: true },
      });

      if (!variant || !variant.product.isActive) {
        throw new BadRequestError(`Product variant ${item.productVariantId} unavailable`);
      }

      if (variant.stockCount < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for ${variant.name}. Available: ${variant.stockCount}`
        );
      }

      const unitPrice = Number(variant.price);
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productVariantId: variant.id,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    const shippingCost = subtotal > 100 ? 0 : 15;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const totalAmount = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        profileId: req.user.id,
        addressId,
        status: provider === "CASH_ON_DELIVERY" ? "PROCESSING" : "PENDING_PAYMENT",
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        items: {
          createMany: {
            data: orderItemsData,
          },
        },
      },
      include: {
        items: true,
      },
    });

    let clientSecret: string | null = null;
    let paymentTransactionId: string = `txn_${order.id}`;

    if (provider === "STRIPE") {
      if (stripe) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100),
          currency: "usd",
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            profileId: req.user.id,
          },
        });
        clientSecret = paymentIntent.client_secret;
        paymentTransactionId = paymentIntent.id;
      } else {
        clientSecret = `mock_pi_secret_${order.id}`;
        paymentTransactionId = `mock_pi_${order.id}`;
      }

      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider: "STRIPE",
          transactionId: paymentTransactionId,
          status: "PENDING",
          amount: totalAmount,
        },
      });
    } else if (provider === "CASH_ON_DELIVERY") {
      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider: "CASH_ON_DELIVERY",
          transactionId: `COD-${order.orderNumber}`,
          status: "PENDING",
          amount: totalAmount,
        },
      });

      const userCart = await prisma.cart.findFirst({
        where: { profileId: req.user.id },
      });
      if (userCart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: userCart.id },
        });
      }
    }

    sendSuccess(
      res,
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shippingCost: Number(order.shippingCost),
        totalAmount: Number(order.totalAmount),
        status: order.status,
        clientSecret,
        provider,
      },
      "Checkout intent created successfully",
      undefined,
      201
    );
  } catch (err) {
    next(err);
  }
}
