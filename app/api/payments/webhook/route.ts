import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    const stripe = require("stripe")(STRIPE_SECRET_KEY);

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType || "PREMIUM";

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: planType === "PREMIUM" ? "PREMIUM" : "FREE",
            },
          });
        }
        break;

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find user by Stripe customer ID and update subscription
        // This would require storing Stripe customer ID in user model
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}




