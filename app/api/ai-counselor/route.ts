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
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const systemMessage = {
      role: "system",
      content: `You are an expert transfer counselor helping community college students transfer to UC, CSU, and private universities in California. You provide personalized, accurate, and encouraging guidance on:
- Course planning and equivalencies
- Application strategies and deadlines
- PIQ essay writing
- Major selection and requirements
- Financial aid and scholarships
- Transfer timelines and milestones
- University-specific advice

Be friendly, supportive, and specific. Always encourage students and provide actionable advice.`,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...messages],
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
    const aiResponse = data.choices[0]?.message?.content || "No response available.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Error getting AI counselor response:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}




