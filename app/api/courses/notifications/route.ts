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
        completedCourses: {
          include: { course: true }
        }
      }
    });

    if (!dbUser || !dbUser.targetUniversities || dbUser.targetUniversities.length === 0) {
      return NextResponse.json({ notifications: [] });
    }

    const notifications: any[] = [];
    const completedCourseCodes = new Set(
      dbUser.completedCourses.map(cc => cc.course.code)
    );

    // Resolve university IDs first
    const universities = await prisma.university.findMany({
      where: {
        OR: [
          { id: { in: dbUser.targetUniversities } },
          { code: { in: dbUser.targetUniversities.map((c: string) => c.toUpperCase()) } },
        ],
      },
    });
    const universityIds = universities.map(u => u.id);

    // Get course equivalencies
    const equivalencies = universityIds.length > 0 ? await prisma.courseEquivalency.findMany({
      where: {
        universityId: { in: universityIds },
        communityCollege: dbUser.communityCollege ? {
          code: dbUser.communityCollege,
        } : undefined,
      },
      include: {
        course: true,
      },
    }) : [];

    // Check for prerequisites
    for (const eq of equivalencies) {
      if (eq.course.prerequisites && eq.course.prerequisites.length > 0) {
        const missingPrereqs = eq.course.prerequisites.filter(
          (prereq: string) => !completedCourseCodes.has(prereq)
        );
        if (missingPrereqs.length > 0) {
          notifications.push({
            type: "prerequisite",
            course: eq.course.code,
            message: `Missing prerequisites: ${missingPrereqs.join(", ")}`,
            priority: "high",
          });
        }
      }
    }

    // Check for sequencing conflicts (courses that should be taken in order)
    const courseSequence = new Map();
    for (const eq of equivalencies) {
      if (eq.course.prerequisites && eq.course.prerequisites.length > 0) {
        for (const prereq of eq.course.prerequisites) {
          if (!courseSequence.has(prereq)) {
            courseSequence.set(prereq, []);
          }
          courseSequence.get(prereq).push(eq.course.code);
        }
      }
    }

    // Check competitiveness impact
    const requiredCourses = equivalencies.filter(eq => eq.isVerified);
    const completedRequired = requiredCourses.filter(eq => 
      completedCourseCodes.has(eq.course.code)
    ).length;
    const completionRate = requiredCourses.length > 0 
      ? (completedRequired / requiredCourses.length) * 100 
      : 0;

    if (completionRate < 50) {
      notifications.push({
        type: "competitiveness",
        course: "Overall Progress",
        message: `Only ${Math.round(completionRate)}% of required courses completed. Consider accelerating your course plan.`,
        priority: "medium",
      });
    }

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
