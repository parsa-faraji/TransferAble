import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { prompt, content, wordCount, isComplete } = body;

    const essay = await prisma.applicationEssay.create({
      data: {
        applicationId: id,
        prompt,
        content: content || "",
        wordCount: wordCount || (content ? content.split(/\s+/).filter(Boolean).length : 0),
        isComplete: isComplete || false,
      },
    });

    return NextResponse.json({ success: true, essay });
  } catch (error) {
    console.error("Error creating essay:", error);
    return NextResponse.json(
      { error: "Failed to create essay" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { essayId, prompt, content, wordCount, isComplete, feedback } = body;

    const calculatedWordCount = wordCount || (content ? content.split(/\s+/).filter(Boolean).length : 0);

    const essay = await prisma.applicationEssay.upsert({
      where: { id: essayId || "new" },
      update: {
        content,
        wordCount: calculatedWordCount,
        isComplete: isComplete !== undefined ? isComplete : calculatedWordCount > 0,
        feedback,
      },
      create: {
        applicationId: id,
        prompt: prompt || "",
        content: content || "",
        wordCount: calculatedWordCount,
        isComplete: isComplete || false,
        feedback,
      },
    });

    return NextResponse.json({ success: true, essay });
  } catch (error) {
    console.error("Error updating essay:", error);
    return NextResponse.json(
      { error: "Failed to update essay" },
      { status: 500 }
    );
  }
}

