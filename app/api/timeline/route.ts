import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        timeline: {
          include: {
            milestones: {
              orderBy: { dueDate: "asc" },
            },
          },
        },
      },
    });

    if (!dbUser || !dbUser.timeline) {
      return NextResponse.json({ timeline: null, milestones: [] });
    }

    return NextResponse.json({
      timeline: dbUser.timeline,
      milestones: dbUser.timeline.milestones,
    });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetTransferTerm, milestones } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const timeline = await prisma.timeline.upsert({
      where: { userId: dbUser.id },
      update: {
        targetTransferTerm,
      },
      create: {
        userId: dbUser.id,
        targetTransferTerm,
      },
    });

    return NextResponse.json({ success: true, timeline });
  } catch (error) {
    console.error("Error saving timeline:", error);
    return NextResponse.json(
      { error: "Failed to save timeline" },
      { status: 500 }
    );
  }
}

