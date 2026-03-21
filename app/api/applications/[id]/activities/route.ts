import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ActivityInput } from "@/lib/types";

export const dynamic = 'force-dynamic';

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

    // Verify the user owns this application
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const application = await prisma.application.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const body = await request.json();
    const { activities } = body as { activities: ActivityInput[] };

    if (!Array.isArray(activities)) {
      return NextResponse.json(
        { error: "activities must be an array" },
        { status: 400 }
      );
    }

    // Delete existing activities
    await prisma.applicationActivity.deleteMany({
      where: { applicationId: id },
    });

    // Create new activities
    const createdActivities = await Promise.all(
      activities.map((activity: ActivityInput) =>
        prisma.applicationActivity.create({
          data: {
            applicationId: id,
            title: activity.title,
            description: activity.description,
            category: activity.category,
            startDate: activity.startDate ? new Date(activity.startDate) : null,
            endDate: activity.endDate ? new Date(activity.endDate) : null,
            hoursPerWeek: activity.hoursPerWeek || null,
          },
        })
      )
    );

    return NextResponse.json({ success: true, activities: createdActivities });
  } catch (error) {
    console.error("Error saving activities:", error);
    return NextResponse.json(
      { error: "Failed to save activities" },
      { status: 500 }
    );
  }
}





