import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Generate Education Plan
 * Creates a personalized course plan based on:
 * - Target universities and majors
 * - Completed courses
 * - Major requirements
 * - Prerequisites and sequencing
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      communityCollegeId, 
      universityIds = [],
      majorIds = [],
      majorQuery = "",
      manualCourses = [],
      completedCourseCodes = [],
      targetTransferTerm = "Fall 2026",
      startDate,
      maxUnitsPerTerm = 15
    } = body;

    const normalizedMaxUnits = Number(maxUnitsPerTerm) > 0 ? Number(maxUnitsPerTerm) : 15;

    if (!communityCollegeId || universityIds.length === 0) {
      return NextResponse.json(
        { error: "Community college and at least one university are required" },
        { status: 400 }
      );
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        completedCourses: {
          include: { 
            course: {
              include: {
                communityCollege: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userCompletedCourseCodes = user.completedCourses.map(cc => cc.course.code);
    const completedCourseCodesFromBody = Array.isArray(completedCourseCodes)
      ? completedCourseCodes.filter((code: any) => typeof code === "string")
      : [];
    const allCompletedCourseCodes = Array.from(
      new Set([...userCompletedCourseCodes, ...completedCourseCodesFromBody])
    );

    let resolvedMajorIds = majorIds;
    if (resolvedMajorIds.length === 0 && majorQuery && universityIds.length > 0) {
      const matchedMajors = await prisma.major.findMany({
        where: {
          universityId: { in: universityIds },
          name: { contains: majorQuery, mode: "insensitive" }
        },
        select: { id: true }
      });
      resolvedMajorIds = matchedMajors.map((m) => m.id);
    }

    // Get major requirements for all target universities
    const allRequirements = [];
    for (const majorId of resolvedMajorIds) {
      const requirements = await prisma.majorRequirement.findMany({
        where: { majorId },
        orderBy: { sequence: "asc" }
      });
      allRequirements.push(...requirements);
    }

    const [communityCollegeRecord, universities] = await Promise.all([
      prisma.communityCollege.findUnique({ where: { id: communityCollegeId } }),
      prisma.university.findMany({ where: { id: { in: universityIds } } }),
    ]);

    // Get course equivalencies
    let equivalencies: any[] = await prisma.courseEquivalency.findMany({
      where: {
        communityCollegeId,
        universityId: { in: universityIds }
      },
      include: {
        course: true
      }
    });

    const userAddedEquivalencies = Array.isArray(manualCourses)
      ? manualCourses
          .filter((course: any) => course?.ccCourseCode)
          .map((course: any, idx: number) => {
            const ucCode = course.ucCourseCode || course.ccCourseCode;
            return {
              id: `manual-${idx}-${ucCode}`,
              course: {
                id: `manual-course-${idx}`,
                code: course.ccCourseCode,
                name: course.ccCourseName || course.ccCourseCode,
                units: Number(course.units) || 3,
              },
              equivalentCourseCode: ucCode,
              equivalentCourseName: course.ucCourseName || course.ccCourseName || ucCode,
              communityCollegeId,
              universityId: universityIds[0],
              isVerified: false,
              source: "USER_ADDED",
              isPrerequisite: !!course.isPrerequisite,
            };
          })
      : [];

    equivalencies = [...equivalencies, ...userAddedEquivalencies];

    if (equivalencies.length === 0 && OPENAI_API_KEY && communityCollegeRecord && universities.length > 0) {
      const aiEquivalencies = await generateSuggestedEquivalenciesWithAI({
        apiKey: OPENAI_API_KEY,
        communityCollegeName: communityCollegeRecord.name,
        universityName: universities[0]?.name || "Target University",
        majorName: user.currentMajor || "Transfer Major",
        completedCourseCodes: allCompletedCourseCodes,
        communityCollegeId,
        universityId: universities[0]?.id,
      });

      if (aiEquivalencies.length > 0) {
        equivalencies = [...equivalencies, ...aiEquivalencies];
      }
    }

    // Always do basic filtering first (even without AI)
    let validEquivalencies = equivalencies.filter(eq => {
      if (eq.source === "USER_ADDED") return true;
      const ccName = eq.course.name || "";
      const ucName = eq.equivalentCourseName || "";
      
      // Reject if names are too short
      if (ccName.length < 3 || ucName.length < 3) return false;
      
      // Reject if no letters
      if (!/[a-zA-Z]/.test(ccName) || !/[a-zA-Z]/.test(ucName)) return false;
      
      // Reject if mostly punctuation
      const ccPunct = (ccName.match(/[^\w\s]/g) || []).length;
      const ucPunct = (ucName.match(/[^\w\s]/g) || []).length;
      if (ccPunct > ccName.length * 0.5 || ucPunct > ucName.length * 0.5) return false;
      
      // Must have meaningful words
      const ccWords = ccName.split(/\s+/).filter((w: string) => /[a-zA-Z]{3,}/.test(w));
      const ucWords = ucName.split(/\s+/).filter((w: string) => /[a-zA-Z]{3,}/.test(w));
      if (ccWords.length === 0 || ucWords.length === 0) return false;
    
      return true;
    });

    // Additional AI filtering if available
    if (OPENAI_API_KEY) {
      const manualOnly = validEquivalencies.filter(eq => eq.source === "USER_ADDED");
      const aiCandidates = validEquivalencies.filter(eq => eq.source !== "USER_ADDED");
      const filtered = await filterEquivalenciesWithAI(
        aiCandidates,
        OPENAI_API_KEY
      );
      validEquivalencies = [...manualOnly, ...filtered];
    }

    const requirementsForPlanBase = allRequirements.length > 0
      ? allRequirements
      : buildRequirementsFromEquivalencies(validEquivalencies);

    const manualRequirements = userAddedEquivalencies.map((eq, idx) => ({
      id: eq.id || `manual-req-${idx}`,
      courseCode: eq.equivalentCourseCode,
      courseName: eq.equivalentCourseName,
      isRequired: true,
      isPrerequisite: eq.isPrerequisite,
      sequence: (requirementsForPlanBase?.length || 0) + idx + 1,
      notes: "User-added course"
    }));

    const requirementsMap = new Map(
      requirementsForPlanBase.map((req: any) => [req.courseCode, req])
    );
    manualRequirements.forEach(req => {
      if (!requirementsMap.has(req.courseCode)) {
        requirementsMap.set(req.courseCode, req);
      }
    });

    const requirementsForPlan = Array.from(requirementsMap.values());

    // Generate plan
    const plan = generateEducationPlan(
      requirementsForPlan,
      validEquivalencies,
      allCompletedCourseCodes,
      targetTransferTerm,
      startDate,
      normalizedMaxUnits
    );

    return NextResponse.json({
      plan,
      summary: {
        totalRequired: plan.required.length,
        completed: plan.completed.length,
        remaining: plan.remaining.length,
        recommended: plan.recommended.length,
        progressPercent: Math.round(
          (plan.completed.length / plan.required.length) * 100
        ) || 0
      }
    });
  } catch (error) {
    console.error("Error generating education plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildRequirementsFromEquivalencies(equivalencies: any[]) {
  const requirements: any[] = [];
  const seen = new Set<string>();

  equivalencies.forEach((eq: any, idx: number) => {
    const ucCode = eq.equivalentCourseCode || `REQ-${idx + 1}`;
    if (seen.has(ucCode)) return;
    seen.add(ucCode);

    requirements.push({
      id: `fallback-${idx}`,
      courseCode: ucCode,
      courseName: eq.equivalentCourseName || ucCode,
      isRequired: true,
      isPrerequisite: idx < 3,
      sequence: idx + 1,
      notes: eq.source === "AI_SUGGESTED" ? "AI-suggested until verified" : undefined
    });
  });

  return requirements;
}

function generateEducationPlan(
  requirements: any[],
  equivalencies: any[],
  completedCourseCodes: string[],
  targetTerm: string,
  startDate?: string,
  maxUnitsPerTerm = 15
) {
  const required: any[] = [];
  const completed: any[] = [];
  const remaining: any[] = [];
  const recommended: any[] = [];

  // Map requirements to CC courses via equivalencies
  const requirementMap = new Map();
  
  requirements.forEach(req => {
    const equivalent = equivalencies.find(
      eq => eq.equivalentCourseCode === req.courseCode
    );
    
    if (equivalent) {
      requirementMap.set(req.courseCode, {
        requirement: req,
        equivalent: equivalent,
        ccCourse: equivalent.course
      });
    }
  });

  // Categorize courses
  requirementMap.forEach((data, ucCode) => {
    const ccCode = data.ccCourse.code;
    const isCompleted = completedCourseCodes.includes(ccCode);
    
    const courseInfo = {
      ucCourseCode: ucCode,
      ucCourseName: data.requirement.courseName,
      ccCourseCode: ccCode,
      ccCourseName: data.ccCourse.name,
      units: data.ccCourse.units,
      isRequired: data.requirement.isRequired,
      isPrerequisite: data.requirement.isPrerequisite,
      sequence: data.requirement.sequence,
      notes: data.requirement.notes
    };

    required.push(courseInfo);
    
    if (isCompleted) {
      completed.push(courseInfo);
    } else {
      remaining.push(courseInfo);
    }
  });

  // Sort remaining by sequence and prerequisites
  remaining.sort((a, b) => {
    if (a.sequence && b.sequence) return a.sequence - b.sequence;
    if (a.isPrerequisite && !b.isPrerequisite) return -1;
    if (!a.isPrerequisite && b.isPrerequisite) return 1;
    return 0;
  });

  // Recommend next courses (top 3-5)
  recommended.push(...remaining.slice(0, 5));

  const semesterPlan = buildSemesterPlan(remaining, startDate, maxUnitsPerTerm);

  return {
    required,
    completed,
    remaining,
    recommended,
    semesterPlan,
    targetTerm,
    startDate: startDate || new Date().toISOString()
  };
}

async function generateSuggestedEquivalenciesWithAI({
  apiKey,
  communityCollegeName,
  universityName,
  majorName,
  completedCourseCodes,
  communityCollegeId,
  universityId
}: {
  apiKey: string;
  communityCollegeName: string;
  universityName: string;
  majorName: string;
  completedCourseCodes: string[];
  communityCollegeId: string;
  universityId: string;
}) {
  const prompt = `Generate a realistic lower-division transfer roadmap for a ${majorName} student.

Community College: ${communityCollegeName}
Target University: ${universityName}
Return 6-10 course articulation pairs (community college → university) including common GE and major prep.

Respond with ONLY JSON:
[
  {"ccCourseCode":"MATH 1A","ccCourseName":"Calculus I","ucCourseCode":"MATH 1A","ucCourseName":"Calculus I","units":4,"isPrerequisite":true},
  ...
]`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: any, idx: number) => ({
      id: `ai-${idx}`,
      course: {
        id: `ai-course-${idx}`,
        code: item.ccCourseCode,
        name: item.ccCourseName,
        units: Number(item.units) || 3,
      },
      equivalentCourseCode: item.ucCourseCode,
      equivalentCourseName: item.ucCourseName,
      communityCollegeId,
      universityId,
      isVerified: false,
      source: "AI_SUGGESTED",
      isPrerequisite: !!item.isPrerequisite,
      completed: completedCourseCodes.includes(item.ccCourseCode),
    }));
  } catch (error) {
    console.error("AI articulation generation error:", error);
    return [];
  }
}

async function filterEquivalenciesWithAI(
  equivalencies: any[],
  apiKey: string
) {
  const valid = [];
  
  // Process in smaller batches
  for (let i = 0; i < equivalencies.length; i += 5) {
    const batch = equivalencies.slice(i, i + 5);
    
    const promises = batch.map(async (eq) => {
      const ccName = eq.course.name || "";
      const ucName = eq.equivalentCourseName || "";
      
      // Quick validation
      if (ccName.length < 3 || ucName.length < 3) return null;
      if (!/[a-zA-Z]/.test(ccName) || !/[a-zA-Z]/.test(ucName)) return null;
      
      const prompt = `Validate this course articulation for accuracy:

CC: "${eq.course.code}" - "${ccName}"
UC: "${eq.equivalentCourseCode}" - "${ucName}"

Is this valid? Respond with JSON: {"valid": true/false, "reason": "brief"}`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            max_tokens: 150
          })
        });

        if (response.ok) {
          const data = await response.json();
          const resultText = data.choices[0].message.content.trim();
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return result.valid ? eq : null;
          }
        }
      } catch (error) {
        console.error("AI validation error:", error);
      }
      
      // On error, keep the entry
      return eq;
    });

    const results = await Promise.all(promises);
    valid.push(...results.filter(r => r !== null));
    
    // Rate limiting
    if (i + 5 < equivalencies.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  return valid;
}

function buildSemesterPlan(
  courses: any[],
  startDate?: string,
  maxUnitsPerTerm = 15
) {
  if (!courses || courses.length === 0) return [];

  const termOrder = ["Spring", "Summer", "Fall"] as const;
  const parsedStart = startDate ? new Date(startDate) : new Date();
  const start = isNaN(parsedStart.getTime()) ? new Date() : parsedStart;
  const startTermIndex = start.getMonth() >= 7 ? 2 : start.getMonth() >= 4 ? 1 : 0;

  let currentTerm = {
    name: termOrder[startTermIndex],
    year: start.getFullYear(),
  };

  const plan = [];
  let idx = 0;

  while (idx < courses.length) {
    let termUnits = 0;
    const termCourses: any[] = [];

    while (idx < courses.length) {
      const course = courses[idx];
      const units = Number(course.units) || 3;
      if (termUnits + units > maxUnitsPerTerm && termCourses.length > 0) break;

      termCourses.push({
        ...course,
        term: `${currentTerm.name} ${currentTerm.year}`
      });
      termUnits += units;
      idx++;
    }

    plan.push({
      term: `${currentTerm.name} ${currentTerm.year}`,
      totalUnits: termUnits,
      courses: termCourses
    });

    const nextIndex = (termOrder.indexOf(currentTerm.name as typeof termOrder[number]) + 1) % termOrder.length;
    const nextYear = nextIndex === 0 ? currentTerm.year + 1 : currentTerm.year;
    currentTerm = { name: termOrder[nextIndex], year: nextYear };
  }

  return plan;
}
