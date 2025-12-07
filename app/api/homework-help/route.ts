import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { requirePremium } from "@/lib/premium-check";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check premium access
    const premiumCheck = await requirePremium(user.id);
    if (!premiumCheck.hasAccess) {
      return NextResponse.json(
        { error: premiumCheck.error },
        { status: 403 }
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { question, subject } = body;

    if (!question || !subject) {
      return NextResponse.json(
        { error: "Question and subject are required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful tutor specializing in ${subject}. Provide clear, step-by-step explanations that help students understand concepts and solve problems. Be encouraging and educational.`,
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || "No response available.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error getting homework help:", error);
    return NextResponse.json(
      { error: "Failed to get help" },
      { status: 500 }
    );
  }
}


