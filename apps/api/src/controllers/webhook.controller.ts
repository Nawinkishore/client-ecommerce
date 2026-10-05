import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { sendSuccess } from "../utils/response";
import { BadRequestError } from "../errors/app-error";
import Stripe from "stripe";
import { validateEnv } from "@client-ecommerce/config";

const env = validateEnv();
const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as Stripe.LatestApiVersion })
  : null;

export async function handleStripeWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let event: Stripe.Event;

    const sig = req.headers["stripe-signature"];

    if (stripe && env.STRIPE_WEBHOOK_SECRET && sig) {
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        throw new BadRequestError(`Webhook Error: ${err.message}`);
      }
    } else {
      event = req.body as Stripe.Event;
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      let order = null;
      if (orderId) {
        order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
      }

      if (!order) {
        const transaction = await prisma.paymentTransaction.findFirst({
          where: { transactionId: paymentIntent.id },
          include: {
            order: {
              include: { items: true },
            },
          },
        });
        if (transaction) {
          order = transaction.order;
        }
      }

      if (order && order.status !== "PAID") {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: { status: "PAID" },
          });

          await tx.paymentTransaction.updateMany({
            where: { orderId: order.id },
            data: {
              status: "COMPLETED",
              rawResponse: JSON.parse(JSON.stringify(paymentIntent)),
            },
          });

          for (const item of order.items) {
            await tx.productVariant.update({
              where: { id: item.productVariantId },
              data: {
                stockCount: {
                  decrement: item.quantity,
                },
              },
            });
          }

          const cart = await tx.cart.findFirst({
            where: { profileId: order.profileId },
          });
          if (cart) {
            await tx.cartItem.deleteMany({
              where: { cartId: cart.id },
            });
          }
        });
      }
    }

    sendSuccess(res, { received: true }, "Webhook processed successfully");
  } catch (err) {
    next(err);
  }
}
