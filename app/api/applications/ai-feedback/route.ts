import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { requirePremium } from "@/lib/premium-check";


export const dynamic = 'force-dynamic';

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
      return NextResponse.json({
        feedback: "AI feedback is not available. Please add OPENAI_API_KEY to enable this feature.",
      });
    }

    const body = await request.json();
    const { prompt, content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({
        feedback: "Please write some content before requesting feedback.",
      });
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
            content: "You are a helpful college admissions counselor reviewing UC Personal Insight Question essays. Provide constructive, specific feedback on clarity, impact, and authenticity.",
          },
          {
            role: "user",
            content: `Prompt: ${prompt}\n\nEssay:\n${content}\n\nPlease provide constructive feedback on this essay, focusing on:\n1. Does it answer the prompt?\n2. Is it clear and engaging?\n3. What could be improved?\n4. Specific suggestions for revision.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        feedback: "Error getting AI feedback. Please try again.",
      });
    }

    const data = await response.json();
    const feedback = data.choices[0]?.message?.content || "No feedback available.";

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    return NextResponse.json(
      { feedback: "Error getting AI feedback. Please try again." },
      { status: 500 }
    );
  }
}


