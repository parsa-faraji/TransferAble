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
    });

    if (!dbUser) {
      return NextResponse.json({ requests: [] });
    }

    const requests = await prisma.mentorshipRequest.findMany({
      where: {
        OR: [
          { studentId: dbUser.id },
          { mentor: { userId: dbUser.id } },
        ],
        status: { in: ["PENDING", "ACCEPTED"] },
      },
      include: {
        mentor: {
          include: {
            user: true,
            university: true,
          },
        },
        student: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching mentorship requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

