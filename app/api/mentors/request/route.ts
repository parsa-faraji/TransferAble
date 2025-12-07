import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { mentorId, message, topic } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const mentorshipRequest = await prisma.mentorshipRequest.create({
      data: {
        studentId: dbUser.id,
        mentorId,
        message,
        topic,
      },
      include: {
        mentor: {
          include: {
            user: true,
            university: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, request: mentorshipRequest });
  } catch (error) {
    console.error("Error creating mentorship request:", error);
    return NextResponse.json(
      { error: "Failed to create mentorship request" },
      { status: 500 }
    );
  }
}

