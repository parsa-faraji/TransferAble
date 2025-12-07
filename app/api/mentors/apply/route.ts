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
      university,
      universityEmail,
      major,
      graduationYear,
      currentYear,
      gpa,
      bio,
      specialties,
      whyMentor,
      availability,
    } = body;

    // Validate required fields
    if (!university || !universityEmail || !major || !bio || !specialties || specialties.length < 2 || !whyMentor) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate university email format
    if (!universityEmail.includes("@") || !universityEmail.includes(".")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a mentor profile
    const existingMentor = await prisma.mentorProfile.findUnique({
      where: { userId: dbUser.id },
    });

    if (existingMentor) {
      return NextResponse.json(
        { error: "You already have a mentor profile" },
        { status: 400 }
      );
    }

    // Find or create university
    let universityRecord = await prisma.university.findFirst({
      where: {
        OR: [
          { name: { equals: university, mode: "insensitive" } },
          { code: { equals: university.toUpperCase(), mode: "insensitive" } },
        ],
      },
    });

    if (!universityRecord) {
      // Create placeholder university
      universityRecord = await prisma.university.create({
        data: {
          name: university,
          code: university.slice(0, 10).toUpperCase().replace(/\s+/g, ""),
          type: "UC", // Default, can be updated later
        },
      });
    }

    // Create mentor profile (pending approval)
    const mentorProfile = await prisma.mentorProfile.create({
      data: {
        userId: dbUser.id,
        universityId: universityRecord.id,
        major,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        bio,
        specialties: specialties || [],
        isAvailable: false, // Will be set to true after approval
        isVerified: false, // Needs email verification
        verificationEmail: universityEmail,
        rating: 0,
        totalSessions: 0,
      },
    });

    // Send email notification (will be implemented)
    // TODO: Send email to admin and applicant

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. We'll review it and get back to you soon!",
      mentorProfile,
    });
  } catch (error) {
    console.error("Error submitting mentor application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}


