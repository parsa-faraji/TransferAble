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
    const { gpa, essayQuality, extracurriculars, personalStatementQuality } = body;

    // Fetch user profile data
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        completedCourses: {
          include: {
            course: true,
          },
        },
        timeline: {
          include: {
            milestones: true,
          },
        },
      },
    });

    if (!dbUser || !dbUser.targetUniversities || dbUser.targetUniversities.length === 0) {
      return NextResponse.json({
        error: "Please complete your onboarding first"
      }, { status: 400 });
    }

    // Get target universities
    const targetUniversities = await prisma.university.findMany({
      where: {
        OR: [
          { id: { in: dbUser.targetUniversities } },
          { code: { in: dbUser.targetUniversities } },
        ],
      },
    });

    // Calculate course completion progress
    const coursesCompleted = dbUser.completedCourses.length;
    const estimatedRequiredCourses = 20; // Typical transfer requirement
    const courseCompletionRate = Math.min((coursesCompleted / estimatedRequiredCourses) * 100, 100);

    // Calculate milestone completion
    const completedMilestones = dbUser.timeline?.milestones.filter(m => m.isCompleted).length || 0;
    const totalMilestones = dbUser.timeline?.milestones.length || 0;
    const milestoneCompletionRate = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    // Prepare data for AI analysis
    const userProfile = {
      major: dbUser.currentMajor,
      coursesCompleted,
      courseCompletionRate: Math.round(courseCompletionRate),
      milestoneCompletionRate: Math.round(milestoneCompletionRate),
      targetUniversities: targetUniversities.map(u => ({
        name: u.name,
        type: u.type,
      })),
      gpa: gpa || "Not provided",
      essayQuality: essayQuality || "Not assessed",
      extracurriculars: extracurriculars || "Not provided",
      personalStatementQuality: personalStatementQuality || "Not assessed",
    };

    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({
        error: "AI service not configured"
      }, { status: 500 });
    }

    const prompt = `You are a college transfer admissions counselor. Analyze this student's profile and provide a realistic transfer prediction.

Student Profile:
- Major: ${userProfile.major}
- Courses Completed: ${userProfile.coursesCompleted} (${userProfile.courseCompletionRate}% of typical requirements)
- Milestone Progress: ${userProfile.milestoneCompletionRate}%
- GPA: ${userProfile.gpa}
- Essay Quality: ${userProfile.essayQuality}
- Extracurriculars: ${userProfile.extracurriculars}
- Personal Statement Quality: ${userProfile.personalStatementQuality}
- Target Universities: ${userProfile.targetUniversities.map(u => `${u.name} (${u.type})`).join(", ")}

Provide:
1. Overall transfer readiness score (0-100)
2. Specific predictions for each target university (likelihood: high/medium/low)
3. Top 3 strengths
4. Top 3 areas for improvement
5. Specific actionable recommendations

Format your response as JSON with this structure:
{
  "overallReadiness": number (0-100),
  "universityPredictions": [
    { "university": "name", "likelihood": "high|medium|low", "percentage": number, "reasoning": "brief explanation" }
  ],
  "strengths": ["strength1", "strength2", "strength3"],
  "areasForImprovement": ["area1", "area2", "area3"],
  "recommendations": ["rec1", "rec2", "rec3"]
}`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert college transfer admissions counselor with deep knowledge of UC, CSU, and private university transfer requirements and acceptance rates.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      console.error("OpenAI API error:", await aiResponse.text());
      return NextResponse.json({
        error: "Failed to generate prediction"
      }, { status: 500 });
    }

    const aiData = await aiResponse.json();
    const prediction = JSON.parse(aiData.choices[0].message.content);

    return NextResponse.json({
      success: true,
      prediction,
      profileData: userProfile,
    });

  } catch (error) {
    console.error("Transfer prediction error:", error);
    return NextResponse.json(
      { error: "Failed to generate transfer prediction" },
      { status: 500 }
    );
  }
}
