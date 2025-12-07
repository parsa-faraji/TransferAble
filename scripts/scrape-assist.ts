/**
 * ASSIST.org Course Articulation Scraper
 * 
 * WARNING: Check ASSIST.org Terms of Service before using this script.
 * This is a template - you may need to adapt it based on ASSIST.org's structure.
 * 
 * Usage: npx tsx scripts/scrape-assist.ts
 */

import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

interface ArticulationData {
  ccCourseCode: string;
  ccCourseName: string;
  universityCourseCode: string;
  universityCourseName: string;
  notes?: string;
}

/**
 * Scrape ASSIST.org articulation page
 * Note: This is a template - ASSIST.org structure may vary
 */
async function scrapeAssistArticulation(
  ccCode: string,
  universityCode: string
): Promise<ArticulationData[]> {
  // ASSIST.org URL structure (example - verify actual structure)
  const url = `https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=${ccCode}&institution2=${universityCode}`;
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const articulations: ArticulationData[] = [];
    
    // Parse articulation table (adjust selectors based on actual HTML structure)
    $("table.articulation-table tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 4) {
        articulations.push({
          ccCourseCode: $(cells[0]).text().trim(),
          ccCourseName: $(cells[1]).text().trim(),
          universityCourseCode: $(cells[2]).text().trim(),
          universityCourseName: $(cells[3]).text().trim(),
          notes: $(cells[4])?.text().trim(),
        });
      }
    });
    
    return articulations;
  } catch (error) {
    console.error(`Error scraping ${ccCode} → ${universityCode}:`, error);
    return [];
  }
}

/**
 * Store articulations in database
 */
async function storeArticulations(
  ccId: string,
  universityId: string,
  articulations: ArticulationData[]
) {
  for (const art of articulations) {
    // Find or create the course
    const course = await prisma.course.upsert({
      where: {
        communityCollegeId_code: {
          communityCollegeId: ccId,
          code: art.ccCourseCode,
        },
      },
      update: {
        name: art.ccCourseName,
      },
      create: {
        code: art.ccCourseCode,
        name: art.ccCourseName,
        units: 3, // Default - update from actual data
        communityCollegeId: ccId,
        prerequisites: [],
      },
    });

    // Create equivalency
    await prisma.courseEquivalency.upsert({
      where: {
        id: `${course.id}-${universityId}`, // Adjust based on your needs
      },
      update: {
        equivalentCourseCode: art.universityCourseCode,
        equivalentCourseName: art.universityCourseName,
        source: "ASSIST",
        isVerified: true,
      },
      create: {
        courseId: course.id,
        universityId: universityId,
        communityCollegeId: ccId,
        equivalentCourseCode: art.universityCourseCode,
        equivalentCourseName: art.universityCourseName,
        source: "ASSIST",
        isVerified: true,
      },
    });
  }
}

/**
 * Main scraping function
 */
async function main() {
  console.log("🔍 Starting ASSIST.org scraping...");
  
  // Get Peralta colleges
  const peraltaColleges = await prisma.communityCollege.findMany({
    where: {
      code: { in: ["BCC", "COA", "LANEY", "MERRITT"] },
    },
  });

  // Get UC/CSU universities
  const universities = await prisma.university.findMany({
    where: {
      type: { in: ["UC", "CSU"] },
    },
  });

  // Scrape articulations for each college-university pair
  for (const college of peraltaColleges) {
    for (const university of universities) {
      console.log(`\n📚 Scraping ${college.name} → ${university.name}...`);
      
      // Note: You'll need to map college/university codes to ASSIST.org codes
      // ASSIST.org uses different codes (e.g., "001286" for BCC)
      const assistCCCode = getAssistCode(college.code);
      const assistUniCode = getAssistCode(university.code);
      
      if (!assistCCCode || !assistUniCode) {
        console.log(`⚠️  Skipping - no ASSIST code mapping`);
        continue;
      }

      const articulations = await scrapeAssistArticulation(
        assistCCCode,
        assistUniCode
      );

      if (articulations.length > 0) {
        await storeArticulations(college.id, university.id, articulations);
        console.log(`✅ Stored ${articulations.length} articulations`);
      } else {
        console.log(`⚠️  No articulations found`);
      }

      // Be respectful - add delay between requests
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log("\n✨ Scraping complete!");
}

/**
 * Map our codes to ASSIST.org codes
 * You'll need to look up the actual ASSIST.org codes
 */
function getAssistCode(ourCode: string): string | null {
  const mapping: Record<string, string> = {
    BCC: "001286", // Berkeley City College
    COA: "001287", // College of Alameda
    LANEY: "001288", // Laney College
    MERRITT: "001289", // Merritt College
    UCB: "001319", // UC Berkeley
    UCLA: "001312", // UCLA
    // Add more mappings as needed
  };
  return mapping[ourCode] || null;
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

