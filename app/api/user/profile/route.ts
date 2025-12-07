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
      return NextResponse.json({ 
        profile: null,
        message: "User profile not found. Please complete onboarding." 
      });
    }

    // Find community college by code
    let communityCollege = null;
    if (dbUser.communityCollege) {
      communityCollege = await prisma.communityCollege.findFirst({
        where: {
          OR: [
            { code: dbUser.communityCollege },
            { id: dbUser.communityCollege },
            { name: { equals: dbUser.communityCollege, mode: "insensitive" } },
          ],
        },
      });
    }

    // Find target universities by IDs
    const targetUniversities = new Map<string, any>();
    if (dbUser.targetUniversities && dbUser.targetUniversities.length > 0) {
      const universities = await prisma.university.findMany({
        where: {
          OR: [
            { id: { in: dbUser.targetUniversities } },
            { code: { in: dbUser.targetUniversities.map((code) => code.toUpperCase()) } },
          ],
        },
      });

      universities.forEach((uni) => targetUniversities.set(uni.id, uni));

      // Fallback: resolve by name if codes/ids failed
      if (targetUniversities.size === 0) {
        const nameMatches = await prisma.university.findMany({
          where: { name: { in: dbUser.targetUniversities } },
        });
        nameMatches.forEach((uni) => targetUniversities.set(uni.id, uni));
      }
    }

    // Find major if currentMajor is set
    let major = null;
    if (dbUser.currentMajor && targetUniversities.size > 0) {
      // Try to find major in any of the target universities
      for (const uni of targetUniversities.values()) {
        const foundMajor = await prisma.major.findFirst({
          where: {
            universityId: uni.id,
            name: { contains: dbUser.currentMajor, mode: "insensitive" },
          },
        });
        if (foundMajor) {
          major = foundMajor;
          break;
        }
      }
    }

    return NextResponse.json({
      profile: {
        id: dbUser.id,
        communityCollege: communityCollege
          ? {
              id: communityCollege.id,
              name: communityCollege.name,
              code: communityCollege.code,
            }
          : null,
        currentMajor: dbUser.currentMajor,
        major: major
          ? {
              id: major.id,
              name: major.name,
              code: major.code,
              universityId: major.universityId,
            }
          : null,
        targetUniversities: Array.from(targetUniversities.values()).map((uni) => ({
          id: uni.id,
          name: uni.name,
          code: uni.code,
          type: uni.type,
        })),
        completedCourseCodes: dbUser.completedCourses.map(
          (cc) => cc.course.code
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}



