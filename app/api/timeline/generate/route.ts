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
    const { targetTransferTerm } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        applications: {
          include: { university: true }
        }
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse target term (e.g., "Fall 2026")
    const [term, yearStr] = targetTransferTerm.split(" ");
    const targetYear = parseInt(yearStr);
    const isFall = term.toLowerCase() === "fall";
    
    // Calculate dates based on target term
    const applicationYear = isFall ? targetYear - 1 : targetYear;
    const applicationDeadline = new Date(applicationYear, 10, 30); // November 30
    const fafsaDeadline = new Date(targetYear, 2, 2); // March 2
    const transcriptDeadline = new Date(applicationYear, 11, 31); // December 31

    // Create or update timeline
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

    // Delete existing milestones and create new ones
    await prisma.timelineMilestone.deleteMany({
      where: { timelineId: timeline.id },
    });

    const milestones = [
      {
        title: "Complete IGETC/GE Requirements",
        description: "Finish all general education requirements",
        dueDate: new Date(applicationYear, 5, 1), // June 1
        category: "COURSE_ENROLLMENT" as const,
      },
      {
        title: "Complete Major Prerequisites",
        description: "Finish all required major preparation courses",
        dueDate: new Date(applicationYear, 5, 1), // June 1
        category: "COURSE_ENROLLMENT" as const,
      },
      {
        title: "UC Application Opens",
        description: "UC application period begins",
        dueDate: new Date(applicationYear, 7, 1), // August 1
        category: "APPLICATION_DEADLINE" as const,
      },
      {
        title: "Start PIQ Essays",
        description: "Begin writing Personal Insight Questions",
        dueDate: new Date(applicationYear, 8, 1), // September 1
        category: "ESSAY_SUBMISSION" as const,
      },
      {
        title: "UC Application Deadline",
        description: "Submit UC application by this date",
        dueDate: applicationDeadline,
        category: "APPLICATION_DEADLINE" as const,
      },
      {
        title: "Submit Transcripts",
        description: "Request official transcripts from community college",
        dueDate: transcriptDeadline,
        category: "TRANSCRIPT_REQUEST" as const,
      },
      {
        title: "FAFSA Deadline",
        description: "Submit Free Application for Federal Student Aid",
        dueDate: fafsaDeadline,
        category: "FINANCIAL_AID" as const,
      },
      {
        title: "Housing Application Opens",
        description: "Apply for on-campus housing",
        dueDate: new Date(targetYear, 2, 1), // March 1
        category: "HOUSING_APPLICATION" as const,
      },
    ];

    // Add application-specific milestones
    for (const app of dbUser.applications) {
      milestones.push({
        title: `${app.university.name} Application`,
        description: `Submit application for ${app.university.name}`,
        dueDate: app.deadline,
        category: "APPLICATION_DEADLINE" as const,
      });
    }

    // Create all milestones
    await prisma.timelineMilestone.createMany({
      data: milestones.map(m => ({
        ...m,
        timelineId: timeline.id,
      })),
    });

    return NextResponse.json({ 
      success: true, 
      timeline,
      milestonesCreated: milestones.length 
    });
  } catch (error) {
    console.error("Error generating timeline:", error);
    return NextResponse.json(
      { error: "Failed to generate timeline" },
      { status: 500 }
    );
  }
}





