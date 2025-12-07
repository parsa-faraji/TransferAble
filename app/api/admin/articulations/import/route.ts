import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({ 
      where: { clerkId: user.id } 
    });
    if (dbUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { articulations } = body; // Array of articulation objects

    let imported = 0;
    let errors = 0;

    for (const art of articulations) {
      try {
        const {
          communityCollegeCode,
          courseCode,
          courseName,
          units,
          universityCode,
          equivalentCourseCode,
          equivalentCourseName,
        } = art;

        // Find community college
        const cc = await prisma.communityCollege.findUnique({
          where: { code: communityCollegeCode },
        });

        if (!cc) {
          console.error(`Community college not found: ${communityCollegeCode}`);
          errors++;
          continue;
        }

        // Find university
        const university = await prisma.university.findUnique({
          where: { code: universityCode },
        });

        if (!university) {
          console.error(`University not found: ${universityCode}`);
          errors++;
          continue;
        }

        // Find or create course
        const course = await prisma.course.upsert({
          where: {
            communityCollegeId_code: {
              communityCollegeId: cc.id,
              code: courseCode,
            },
          },
          update: {
            name: courseName,
            units: units || 3,
          },
          create: {
            code: courseCode,
            name: courseName,
            units: units || 3,
            communityCollegeId: cc.id,
            prerequisites: [],
          },
        });

        // Only create equivalency if there's an equivalent course code
        // Some CC courses don't have articulations to the UC
        if (equivalentCourseCode && equivalentCourseCode.trim() !== "") {
          // Check if equivalency already exists
          const existing = await prisma.courseEquivalency.findFirst({
            where: {
              courseId: course.id,
              universityId: university.id,
            },
          });

          if (existing) {
            // Update existing
            await prisma.courseEquivalency.update({
              where: { id: existing.id },
              data: {
                equivalentCourseCode,
                equivalentCourseName,
                source: "ASSIST",
                isVerified: true,
                verifiedAt: new Date(),
              },
            });
          } else {
            // Create new
            await prisma.courseEquivalency.create({
              data: {
                courseId: course.id,
                universityId: university.id,
                communityCollegeId: cc.id,
                equivalentCourseCode,
                equivalentCourseName: equivalentCourseName || "",
                source: "ASSIST",
                isVerified: true,
                verifiedAt: new Date(),
              },
            });
          }
        }
        // If no equivalent course code, skip creating equivalency
        // The course still exists in the database, just without an articulation

        imported++;
      } catch (error) {
        console.error("Error importing articulation:", error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      errors,
      total: articulations.length,
    });
  } catch (error) {
    console.error("Error importing articulations:", error);
    return NextResponse.json(
      { error: "Failed to import articulations" },
      { status: 500 }
    );
  }
}

