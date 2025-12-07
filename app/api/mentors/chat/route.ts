import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get mentorship request and messages
    const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        mentor: {
          include: {
            university: true,
            user: true,
          },
        },
        student: true,
      },
    });

    if (!mentorshipRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Verify user is part of this mentorship
    const mentorUser = await prisma.user.findUnique({
      where: { id: mentorshipRequest.mentor.userId },
    });
    if (mentorshipRequest.studentId !== dbUser.id && mentorUser?.id !== dbUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      request: mentorshipRequest,
      messages: mentorshipRequest.messages,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
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
    const { requestId, content } = body;

    if (!requestId || !content) {
      return NextResponse.json(
        { error: "Request ID and content required" },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify user is part of this mentorship
    const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
      include: {
        mentor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!mentorshipRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (mentorshipRequest.studentId !== dbUser.id && mentorshipRequest.mentor.userId !== dbUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        requestId,
        senderId: dbUser.id,
        content,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
