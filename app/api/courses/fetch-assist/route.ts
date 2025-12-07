import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Cache duration: 7 days
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface AssistCourseData {
  ccCourseCode: string;
  ccCourseName: string;
  ucCourseCode: string;
  ucCourseName: string;
  units: number;
  isArticulated: boolean;
}

/**
 * Fetch course articulation data from ASSIST.org
 * This is a simplified version - in production, you'd scrape assist.org
 * or use their API if available
 */
async function fetchFromAssist(
  ccCode: string,
  universityCode: string,
  majorCode?: string
): Promise<AssistCourseData[]> {
  // In production, this would scrape ASSIST.org or call their API
  // For now, we'll return sample data

  // Sample articulation data
  const sampleData: AssistCourseData[] = [
    {
      ccCourseCode: "MATH 1",
      ccCourseName: "Calculus I",
      ucCourseCode: "MATH 21A",
      ucCourseName: "Calculus",
      units: 5,
      isArticulated: true,
    },
    {
      ccCourseCode: "ENGL 1A",
      ccCourseName: "English Composition",
      ucCourseCode: "ENGL 1",
      ucCourseName: "English Composition",
      units: 3,
      isArticulated: true,
    },
    {
      ccCourseCode: "CHEM 1A",
      ccCourseName: "General Chemistry",
      ucCourseCode: "CHEM 2A",
      ucCourseName: "General Chemistry I",
      units: 5,
      isArticulated: true,
    },
    {
      ccCourseCode: "PHYS 4A",
      ccCourseName: "Physics for Scientists I",
      ucCourseCode: "PHYS 7A",
      ucCourseName: "Physics for Scientists and Engineers",
      units: 4,
      isArticulated: true,
    },
    {
      ccCourseCode: "CS 16",
      ccCourseName: "C++ Programming",
      ucCourseCode: "CS 16",
      ucCourseName: "Problem Solving with Computers I",
      units: 4,
      isArticulated: true,
    },
  ];

  return sampleData;
}

/**
 * Use LLM to parse and normalize course data
 */
async function parseWithLLM(rawData: any[]): Promise<AssistCourseData[]> {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    console.log("No OpenAI key found, skipping LLM parsing");
    return rawData;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a course articulation expert. Parse and normalize course data, ensuring consistent formatting.",
          },
          {
            role: "user",
            content: `Parse this course data and return as JSON:\n${JSON.stringify(rawData)}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed;
    }
  } catch (error) {
    console.error("LLM parsing error:", error);
  }

  return rawData;
}

export async function POST(request: Request) {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { communityCollegeId, universityId, majorId } = body;

    if (!communityCollegeId || !universityId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Cache functionality disabled - model not in schema
    // TODO: Add CourseCache model to schema if caching is needed

    // Fetch fresh data from ASSIST
    const cc = await prisma.communityCollege.findUnique({
      where: { id: communityCollegeId },
    });

    const university = await prisma.university.findUnique({
      where: { id: universityId },
    });

    if (!cc || !university) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    // Fetch from ASSIST (or scrape)
    const assistData = await fetchFromAssist(
      cc.code,
      university.code,
      majorId
    );

    // Parse with LLM for better accuracy
    const parsedData = await parseWithLLM(assistData);

    // Cache functionality disabled - CourseCache model not in schema
    // TODO: Add CourseCache model to schema if caching is needed

    return NextResponse.json({
      courses: parsedData,
      cached: false,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    return NextResponse.json(
      { error: "Failed to fetch course data" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const ccId = searchParams.get("ccId");
  const uniId = searchParams.get("uniId");

  if (!ccId || !uniId) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  try {
    // Cache functionality disabled - CourseCache model not in schema
    // Return empty for now - this route is for future ASSIST scraping functionality
    return NextResponse.json({
      courses: [],
      cached: false,
      message: "ASSIST fetching not yet implemented. Use admin import route instead.",
    });
  } catch (error) {
    console.error("Error retrieving cache:", error);
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    );
  }
}
