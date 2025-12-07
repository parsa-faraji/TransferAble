import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * AI-Filtered Course Recommendations
 * Uses LLM to filter and validate course equivalencies for accuracy
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check premium access for AI filtering
    const { requirePremium } = await import("@/lib/premium-check");
    const premiumCheck = await requirePremium(userId);
    if (!premiumCheck.hasAccess) {
      return NextResponse.json(
        { error: premiumCheck.error },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      communityCollegeId, 
      universityId, 
      majorId,
      completedCourseCodes = [] 
    } = body;

    if (!communityCollegeId || !universityId) {
      return NextResponse.json(
        { error: "Community college and university IDs are required" },
        { status: 400 }
      );
    }

    // Get user's completed courses
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        completedCourses: {
          include: { course: true }
        }
      }
    });

    const [ccRecord, universityRecord, majorRecord] = await Promise.all([
      prisma.communityCollege.findUnique({ where: { id: communityCollegeId } }),
      prisma.university.findUnique({ where: { id: universityId } }),
      majorId ? prisma.major.findUnique({ where: { id: majorId } }) : Promise.resolve(null),
    ]);

    // Get all course equivalencies for this CC → University
    const equivalencies = await prisma.courseEquivalency.findMany({
      where: {
        communityCollegeId,
        universityId,
      },
      include: {
        course: {
          include: {
            communityCollege: true
          }
        },
        university: true
      }
    });

    if (equivalencies.length === 0) {
      if (OPENAI_API_KEY && ccRecord && universityRecord) {
        const aiSuggestions = await generateSuggestedEquivalenciesWithAI({
          apiKey: OPENAI_API_KEY,
          communityCollegeName: ccRecord.name,
          universityName: universityRecord.name,
          majorName: majorRecord?.name || user?.currentMajor || "Computer Science",
          completedCourseCodes,
        });

        if (aiSuggestions.length > 0) {
          return NextResponse.json({
            filtered: aiSuggestions,
            rejected: [],
            message: "No imported articulations yet. Generated AI-suggested course mappings to help you start planning.",
          });
        }
      }

      return NextResponse.json({
        filtered: [],
        rejected: [],
        message: "No course equivalencies found"
      });
    }

    // Get major requirements if majorId provided
    let majorRequirements: any[] = [];
    if (majorId) {
      majorRequirements = await prisma.majorRequirement.findMany({
        where: { majorId },
        orderBy: { sequence: "asc" }
      });
    }

    // Always do basic filtering first (even without AI)
    const basicFiltered = equivalencies.filter(eq => {
      const ccName = eq.course.name || "";
      const ucName = eq.equivalentCourseName || "";
      
      // Reject if names are too short
      if (ccName.length < 3 || ucName.length < 3) return false;
      
      // Reject if no letters (just numbers/punctuation)
      if (!/[a-zA-Z]/.test(ccName) || !/[a-zA-Z]/.test(ucName)) return false;
      
      // Reject if mostly punctuation (more than 50%)
      const ccPunct = (ccName.match(/[^\w\s]/g) || []).length;
      const ucPunct = (ucName.match(/[^\w\s]/g) || []).length;
      if (ccPunct > ccName.length * 0.5 || ucPunct > ucName.length * 0.5) return false;
      
      // Must have at least one meaningful word (3+ letters)
      const ccWords = ccName.split(/\s+/).filter(w => /[a-zA-Z]{3,}/.test(w));
      const ucWords = ucName.split(/\s+/).filter(w => /[a-zA-Z]{3,}/.test(w));
      if (ccWords.length === 0 || ucWords.length === 0) return false;
      
      return true;
    });

    // Filter with AI if API key available
    if (OPENAI_API_KEY) {
      const filtered = await filterWithAI(
        basicFiltered,
        majorRequirements,
        completedCourseCodes,
        OPENAI_API_KEY
      );
      return NextResponse.json(filtered);
    } else {
      // Return basic filtered results
      const filtered = basicFiltered.map(eq => ({
        id: eq.id,
        ccCourseCode: eq.course.code,
        ccCourseName: eq.course.name,
        ccUnits: eq.course.units,
        ucCourseCode: eq.equivalentCourseCode,
        ucCourseName: eq.equivalentCourseName,
        isVerified: eq.isVerified,
        relationshipType: null,
        confidence: "medium" // Basic filtering = medium confidence
      }));

      return NextResponse.json({
        filtered,
        rejected: [],
        message: `Filtered ${equivalencies.length} courses: ${filtered.length} passed basic validation (no AI - add OPENAI_API_KEY to .env for AI filtering)`
      });
    }
  } catch (error) {
    console.error("Error in AI course filter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function filterWithAI(
  equivalencies: any[],
  majorRequirements: any[],
  completedCourseCodes: string[],
  apiKey: string
) {
  const filtered: any[] = [];
  const rejected: any[] = [];

  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < equivalencies.length; i += batchSize) {
    const batch = equivalencies.slice(i, i + batchSize);
    
    const promises = batch.map(async (eq) => {
      const ccName = eq.course.name || "";
      const ucName = eq.equivalentCourseName || "";
      const ccCode = eq.course.code || "";
      const ucCode = eq.equivalentCourseCode || "";

      // Quick validation first
      if (ccName.length < 3 || ucName.length < 3) {
        return { eq, valid: false, reason: "Name too short" };
      }
      if (!/[a-zA-Z]/.test(ccName) || !/[a-zA-Z]/.test(ucName)) {
        return { eq, valid: false, reason: "No letters in name" };
      }

      // Check if this course is required for the major
      const isRequired = majorRequirements.some(
        req => req.courseCode === ucCode
      );

      const prompt = `You are validating course articulation data for a student transfer planning platform.

Community College Course:
- Code: "${ccCode}"
- Name: "${ccName}"
- Units: ${eq.course.units || 3}

University Course:
- Code: "${ucCode}"
- Name: "${ucName}"

Is this course required for the major? ${isRequired ? "Yes" : "No"}
Has the student completed this course? ${completedCourseCodes.includes(ccCode) ? "Yes" : "No"}

CRITICAL VALIDATION:
1. Are both course names valid (not just punctuation, numbers, or nonsense)?
2. Are the courses semantically related (same subject area)?
3. Does this articulation make sense academically?

Respond with ONLY a JSON object:
{
  "valid": true/false,
  "ccNameValid": true/false,
  "ucNameValid": true/false,
  "coursesRelated": true/false,
  "confidence": "high" or "medium" or "low",
  "reason": "brief explanation",
  "recommend": true/false
}`;

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
            max_tokens: 300
          })
        });

        if (!response.ok) {
          return { eq, valid: true, reason: "API error, keeping entry" };
        }

        const data = await response.json();
        const resultText = data.choices[0].message.content.trim();
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          
          if (result.valid && result.ccNameValid && result.ucNameValid && 
              result.coursesRelated && result.recommend) {
            return { 
              eq, 
              valid: true, 
              confidence: result.confidence,
              reason: result.reason 
            };
          } else {
            return { 
              eq, 
              valid: false, 
              reason: result.reason || "Failed validation" 
            };
          }
        }
      } catch (error) {
        console.error(`Error validating course ${ccCode}:`, error);
        // On error, keep the entry but mark as unverified
        return { eq, valid: true, reason: "Validation error, keeping entry" };
      }

      return { eq, valid: true, reason: "No AI response" };
    });

    const results = await Promise.all(promises);

    results.forEach(result => {
      if (result.valid) {
        filtered.push({
          id: result.eq.id,
          ccCourseCode: result.eq.course.code,
          ccCourseName: result.eq.course.name,
          ccUnits: result.eq.course.units,
          ucCourseCode: result.eq.equivalentCourseCode,
          ucCourseName: result.eq.equivalentCourseName,
          isVerified: result.eq.isVerified,
          confidence: result.confidence || "medium",
          relationshipType: null,
        });
      } else {
        rejected.push({
          ccCourseCode: result.eq.course.code,
          ucCourseCode: result.eq.equivalentCourseCode,
          reason: result.reason
        });
      }
    });

    // Small delay between batches to avoid rate limits
    if (i + batchSize < equivalencies.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return {
    filtered,
    rejected,
    message: `Filtered ${equivalencies.length} courses: ${filtered.length} valid, ${rejected.length} rejected`
  };
}

async function generateSuggestedEquivalenciesWithAI({
  apiKey,
  communityCollegeName,
  universityName,
  majorName,
  completedCourseCodes = [],
}: {
  apiKey: string;
  communityCollegeName: string;
  universityName: string;
  majorName: string;
  completedCourseCodes?: string[];
}) {
  const prompt = `Generate a realistic set of lower-division community college → university course articulations for a ${majorName} transfer student.

Community College: ${communityCollegeName}
Target University: ${universityName}
Include 6-8 courses with codes, names, and 3-4 unit counts. Prefer common CS/Engineering/GE prep if major name is unclear.

Respond with ONLY JSON in this format:
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
        max_tokens: 400
      })
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: any, idx: number) => ({
      id: `ai-${idx}`,
      ccCourseCode: item.ccCourseCode,
      ccCourseName: item.ccCourseName,
      ccUnits: Number(item.units) || 3,
      ucCourseCode: item.ucCourseCode,
      ucCourseName: item.ucCourseName,
      isVerified: false,
      confidence: "low",
      relationshipType: "ai_suggested",
      isCompleted: completedCourseCodes.includes(item.ccCourseCode),
    }));
  } catch (error) {
    console.error("AI suggestion error:", error);
    return [];
  }
}
