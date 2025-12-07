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
        applications: {
          include: {
            university: true,
            essays: true,
            activities: true,
          },
          orderBy: { deadline: "asc" },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ applications: [] });
    }

    const applicationsWithLabels = dbUser.applications.map((app) => ({
      ...app,
      majorName: app.majorId || null,
    }));

    return NextResponse.json({ applications: applicationsWithLabels });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
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
    const { universityId, universityCode, universityName, majorId, major, deadline, status } = body;

    if (!deadline) {
      return NextResponse.json({ error: "Application deadline is required" }, { status: 400 });
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return NextResponse.json({ error: "Invalid deadline format" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Resolve university by ID/code/name, create placeholder if needed
    const searchValues = [universityId, universityCode, universityName].filter(Boolean) as string[];
    let resolvedUniversity = null;

    for (const value of searchValues) {
      resolvedUniversity = await prisma.university.findFirst({
        where: {
          OR: [
            { id: value },
            { code: value.toUpperCase() },
            { name: { equals: value, mode: "insensitive" } },
            { name: { contains: value.replace(/[-_]/g, " "), mode: "insensitive" } },
          ],
        },
      });
      if (resolvedUniversity) break;
    }

    if (!resolvedUniversity && universityName) {
      resolvedUniversity = await prisma.university.create({
        data: {
          name: universityName,
          code: (universityCode || universityName).toUpperCase().slice(0, 10),
          type: "UC",
        },
      });
    }

    if (!resolvedUniversity) {
      return NextResponse.json({ error: "University is required" }, { status: 400 });
    }

    // Resolve or create major if provided
    let resolvedMajorId: string | null = null;
    const majorName = typeof major === "string" && major.trim().length > 0 ? major.trim() : null;

    if (majorId) {
      const foundMajor = await prisma.major.findUnique({ where: { id: majorId } });
      if (foundMajor) {
        resolvedMajorId = foundMajor.id;
      }
    }

    if (!resolvedMajorId && majorName) {
      const existingMajor = await prisma.major.findFirst({
        where: {
          name: { equals: majorName, mode: "insensitive" },
          universityId: resolvedUniversity.id,
        },
      });

      if (existingMajor) {
        resolvedMajorId = existingMajor.id;
      } else {
        const createdMajor = await prisma.major.create({
          data: {
            name: majorName,
            universityId: resolvedUniversity.id,
            code: majorName.slice(0, 10).toUpperCase(),
          },
        });
        resolvedMajorId = createdMajor.id;
      }
    }

    const allowedStatuses = ["DRAFT", "IN_PROGRESS", "SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "REJECTED", "WAITLISTED"];
    const applicationStatus = allowedStatuses.includes(status) ? status : "DRAFT";

    const application = await prisma.application.create({
      data: {
        userId: dbUser.id,
        universityId: resolvedUniversity.id,
        majorId: resolvedMajorId,
        deadline: parsedDeadline,
        status: applicationStatus,
      },
      include: {
        university: true,
      },
    });

    return NextResponse.json({
      success: true,
      application: {
        ...application,
        university: resolvedUniversity,
        majorName: majorName || null,
      },
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
