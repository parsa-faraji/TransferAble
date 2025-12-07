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
    const { 
      communityCollege, 
      communityCollegeCode,
      communityCollegeId,
      major, 
      targetUniversities,
      targetUniversityIds,
      completedCourses 
    } = body;

    const targetUniversityInput: string[] = Array.isArray(targetUniversityIds)
      ? targetUniversityIds
      : Array.isArray(targetUniversities)
      ? targetUniversities
      : [];

    // Normalize community college value to a code we can look up
    const communityCollegeValue: string | undefined = (communityCollegeCode || communityCollegeId || communityCollege || "")
      ? (communityCollegeCode || communityCollegeId || communityCollege)
      : undefined;

    let ccRecord = null;
    if (communityCollegeValue) {
      ccRecord = await prisma.communityCollege.findFirst({
        where: {
          OR: [
            { id: communityCollegeValue },
            { code: communityCollegeValue.toUpperCase() },
            { code: communityCollegeValue },
            { name: { equals: communityCollegeValue, mode: "insensitive" } },
          ],
        },
      });
    }

    // Create a placeholder record if the code isn't in the DB yet
    if (!ccRecord && communityCollegeValue) {
      ccRecord = await prisma.communityCollege.create({
        data: {
          name: typeof communityCollege === "string" && communityCollege.length > 0 
            ? communityCollege 
            : communityCollegeValue.toUpperCase(),
          code: communityCollegeValue.toUpperCase(),
          state: "CA",
        },
      });
    }

    // Resolve university IDs from mixed codes/IDs
    const resolvedUniversityIds: string[] = [];
    for (const uni of targetUniversityInput) {
      if (!uni) continue;

      const universityRecord = await prisma.university.findFirst({
        where: {
          OR: [
            { id: uni },
            { code: uni.toUpperCase() },
            { name: { equals: uni, mode: "insensitive" } },
            { name: { contains: uni.replace(/[-_]/g, " "), mode: "insensitive" } },
          ],
        },
      });

      if (universityRecord) {
        resolvedUniversityIds.push(universityRecord.id);
        continue;
      }

      // As a last resort, create a placeholder university so the user can proceed
      const placeholder = await prisma.university.create({
        data: {
          name: uni,
          code: uni.toUpperCase(),
          type: "UC",
        },
      });
      resolvedUniversityIds.push(placeholder.id);
    }

    const uniqueUniversityIds = Array.from(new Set(resolvedUniversityIds));

    // Find or create user in database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        communityCollege: ccRecord?.code || communityCollegeValue?.toUpperCase(),
        currentMajor: major,
        targetUniversities: uniqueUniversityIds,
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        profileImage: user.imageUrl || null,
        communityCollege: ccRecord?.code || communityCollegeValue?.toUpperCase(),
        currentMajor: major,
        targetUniversities: uniqueUniversityIds,
      },
    });

    // Create course completions if provided
    if (completedCourses && Array.isArray(completedCourses) && completedCourses.length > 0 && ccRecord) {
      for (const courseStr of completedCourses) {
        try {
          // Parse course string (format: "CODE: Name")
          const [code, ...nameParts] = courseStr.split(":");
          const courseCode = code?.trim() || "";
          const courseName = nameParts.join(":").trim() || "";

          if (!courseCode) continue;

          // Find or create the course
          const course: any = await prisma.course.upsert({
            where: {
              communityCollegeId_code: {
                communityCollegeId: ccRecord.id,
                code: courseCode,
              },
            },
            update: {
              name: courseName || undefined,
            },
            create: {
              code: courseCode,
              name: courseName || courseCode,
              units: 3, // Default units
              communityCollegeId: ccRecord.id,
              prerequisites: [],
            },
          });

          // Create course completion
          await prisma.courseCompletion.upsert({
            where: {
              userId_courseId: {
                userId: dbUser.id,
                courseId: course.id,
              },
            },
            update: {},
            create: {
              userId: dbUser.id,
              courseId: course.id,
            },
          });
        } catch (error) {
          console.error("Error creating course completion:", error);
          // Continue with other courses even if one fails
        }
      }
    }

    // Create timeline based on target universities
    if (uniqueUniversityIds.length > 0) {
      // Calculate target transfer term (default: 2 years from now, Fall semester)
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-11
      
      // If we're past August, target next year's Fall, otherwise this year's Fall
      let targetYear = currentYear + 2;
      if (currentMonth < 8) {
        targetYear = currentYear + 1;
      }
      
      const targetTransferTerm = `Fall ${targetYear}`;

      // Check if timeline already exists
      const existingTimeline = await prisma.timeline.findUnique({
        where: { userId: dbUser.id },
      });

      if (!existingTimeline) {
        // Create timeline with default milestones
        const timeline = await prisma.timeline.create({
          data: {
            userId: dbUser.id,
            targetTransferTerm,
            milestones: {
              create: [
                {
                  title: "Complete IGETC/GE Requirements",
                  description: "Finish all general education requirements",
                  dueDate: new Date(targetYear - 1, 5, 1), // June 1st of year before transfer
                  category: "COURSE_ENROLLMENT",
                },
                {
                  title: "Complete Major Prerequisites",
                  description: "Finish all required major preparation courses",
                  dueDate: new Date(targetYear - 1, 5, 1), // June 1st
                  category: "COURSE_ENROLLMENT",
                },
                {
                  title: "UC Application Opens",
                  description: "UC application period begins",
                  dueDate: new Date(targetYear - 1, 7, 1), // August 1st
                  category: "APPLICATION_DEADLINE",
                },
                {
                  title: "UC Application Deadline",
                  description: "Submit UC application by this date",
                  dueDate: new Date(targetYear - 1, 10, 30), // November 30th
                  category: "APPLICATION_DEADLINE",
                },
                {
                  title: "Submit Transcripts",
                  description: "Request official transcripts from community college",
                  dueDate: new Date(targetYear - 1, 11, 31), // December 31st
                  category: "TRANSCRIPT_REQUEST",
                },
                {
                  title: "FAFSA Deadline",
                  description: "Submit Free Application for Federal Student Aid",
                  dueDate: new Date(targetYear, 2, 2), // March 2nd
                  category: "FINANCIAL_AID",
                },
                {
                  title: "SAT/ACT Registration",
                  description: "Register for standardized tests if required",
                  dueDate: new Date(targetYear - 1, 8, 15), // September 15th
                  category: "EXAM_REGISTRATION",
                },
                {
                  title: "Personal Statement Draft",
                  description: "Complete first draft of personal statement",
                  dueDate: new Date(targetYear - 1, 9, 1), // October 1st
                  category: "ESSAY_SUBMISSION",
                },
                {
                  title: "Priority Registration",
                  description: "Register for next semester courses",
                  dueDate: new Date(targetYear - 1, 10, 1), // November 1st
                  category: "COURSE_ENROLLMENT",
                },
              ],
            },
          },
        });
      }
    }

    return NextResponse.json({ success: true, user: dbUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}

