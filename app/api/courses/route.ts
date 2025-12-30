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
          include: {
            course: {
              include: {
                communityCollege: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ courses: [], completedCourses: [] });
    }

    // Resolve target university IDs (handle legacy codes)
    let resolvedUniversityIds = dbUser.targetUniversities || [];
    if (resolvedUniversityIds.length > 0) {
      const universities = await prisma.university.findMany({
        where: {
          OR: [
            { id: { in: resolvedUniversityIds } },
            { code: { in: resolvedUniversityIds.map((code) => code.toUpperCase()) } },
          ],
        },
      });

      if (universities.length > 0) {
        resolvedUniversityIds = universities.map((u) => u.id);
      }
    }

    // Course equivalencies feature temporarily disabled
    // Users should refer to ASSIST.org for course equivalencies
    const courses: any[] = [];

    return NextResponse.json({
      courses,
      completedCourses: dbUser.completedCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
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
    const { courseId, grade, term } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completion = await prisma.courseCompletion.upsert({
      where: {
        userId_courseId: {
          userId: dbUser.id,
          courseId,
        },
      },
      update: {
        grade,
        term,
      },
      create: {
        userId: dbUser.id,
        courseId,
        grade,
        term,
      },
    });

    return NextResponse.json({ success: true, completion });
  } catch (error) {
    console.error("Error saving course completion:", error);
    return NextResponse.json(
      { error: "Failed to save course completion" },
      { status: 500 }
    );
  }
}
