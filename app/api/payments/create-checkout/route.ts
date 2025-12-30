import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUserRecord } from "@/lib/user";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { priceId, planType } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    const dbUser = await ensureUserRecord(user);

    // Create Stripe checkout session
    const stripe = require("stripe")(STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      customer_email: user.emailAddresses[0]?.emailAddress,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          userId: dbUser.id,
          clerkId: user.id,
          planType: planType || "PREMIUM",
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payments/cancel`,
      metadata: {
        userId: dbUser.id,
        clerkId: user.id,
        planType: planType || "PREMIUM",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}



