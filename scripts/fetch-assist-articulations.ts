/**
 * ASSIST.org Articulation Fetcher and Parser
 * 
 * This script fetches course articulation data from ASSIST.org and converts it
 * to the format needed for database import.
 * 
 * Usage: 
 *   npx tsx scripts/fetch-assist-articulations.ts BCC UCB
 *   (Fetches Berkeley City College → UC Berkeley articulations)
 * 
 * WARNING: Check ASSIST.org Terms of Service. Use responsibly with delays.
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// ASSIST.org institution codes
const ASSIST_CODES: Record<string, string> = {
  // Peralta Colleges
  BCC: "001286",      // Berkeley City College
  COA: "001287",      // College of Alameda
  LANEY: "001288",    // Laney College
  MERRITT: "001289",  // Merritt College
  
  // UC Universities
  UCB: "001319",      // UC Berkeley
  UCLA: "001312",     // UCLA
  UCSD: "001320",     // UC San Diego
  UCD: "001313",      // UC Davis
  UCSB: "001314",     // UC Santa Barbara
  UCI: "001315",      // UC Irvine
  UCSC: "001316",     // UC Santa Cruz
  UCR: "001317",      // UC Riverside
  UCM: "001318",      // UC Merced
  
  // Popular CSU Universities
  SFSU: "001154",     // San Francisco State
  SJSU: "001470",     // San Jose State
  CSUEB: "001146",    // Cal State East Bay
  CSUMB: "001145",    // Cal State Monterey Bay
  SSU: "001445",      // Sonoma State
  CSUS: "001470",     // Sacramento State
};

interface ArticulationData {
  ccCourseCode: string;
  ccCourseName: string;
  ccUnits: string;
  ucCourseCode: string;
  ucCourseName: string;
  ucUnits: string;
  notes?: string;
}

/**
 * Fetch articulation data from ASSIST.org
 * Note: This is a template - ASSIST.org structure may require adjustment
 */
async function fetchAssistArticulation(
  ccCode: string,
  universityCode: string
): Promise<ArticulationData[]> {
  const ccAssistCode = ASSIST_CODES[ccCode];
  const uniAssistCode = ASSIST_CODES[universityCode];

  if (!ccAssistCode || !uniAssistCode) {
    throw new Error(`Invalid codes: ${ccCode} or ${universityCode}`);
  }

  // ASSIST.org URL structure
  // Note: This URL format may need adjustment based on actual ASSIST.org structure
  const url = `https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=${ccAssistCode}&institution2=${uniAssistCode}`;

  console.log(`\n🌐 Fetching from ASSIST.org...`);
  console.log(`   URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Parse HTML (using simple regex/string parsing - may need more sophisticated parser)
    const articulations = parseAssistHTML(html);
    
    return articulations;
  } catch (error) {
    console.error(`Error fetching from ASSIST.org:`, error);
    throw error;
  }
}

/**
 * Parse ASSIST.org HTML to extract articulation data
 * This is a template - adjust based on actual ASSIST.org HTML structure
 */
function parseAssistHTML(html: string): ArticulationData[] {
  const articulations: ArticulationData[] = [];
  
  // ASSIST.org typically uses tables for articulations
  // This regex pattern is a template - adjust based on actual structure
  const tableRegex = /<table[^>]*class="[^"]*articulation[^"]*"[^>]*>([\s\S]*?)<\/table>/i;
  const tableMatch = html.match(tableRegex);
  
  if (!tableMatch) {
    console.warn("⚠️  Could not find articulation table in HTML");
    return [];
  }

  const tableHTML = tableMatch[1];
  
  // Extract rows (adjust selector based on actual structure)
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  let isFirstRow = true;

  while ((rowMatch = rowRegex.exec(tableHTML)) !== null) {
    if (isFirstRow) {
      isFirstRow = false;
      continue; // Skip header row
    }

    const rowHTML = rowMatch[1];
    const cells = extractTableCells(rowHTML);
    
    if (cells.length >= 4) {
      articulations.push({
        ccCourseCode: cleanText(cells[0]),
        ccCourseName: cleanText(cells[1]),
        ccUnits: cleanText(cells[2] || "3"),
        ucCourseCode: cleanText(cells[3]),
        ucCourseName: cleanText(cells[4] || cells[3]),
        ucUnits: cleanText(cells[5] || cells[2] || "3"),
        notes: cells[6] ? cleanText(cells[6]) : undefined,
      });
    }
  }

  return articulations;
}

function extractTableCells(rowHTML: string): string[] {
  const cells: string[] = [];
  const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  let cellMatch;

  while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
    cells.push(cellMatch[1]);
  }

  return cells;
}

function cleanText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/**
 * Convert to CSV format
 */
function convertToCSV(
  articulations: ArticulationData[],
  ccCode: string,
  universityCode: string
): string {
  const header = "community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name\n";
  
  const rows = articulations.map((art) => {
    return [
      ccCode,
      art.ccCourseCode,
      `"${art.ccCourseName}"`,
      art.ccUnits || "3",
      universityCode,
      art.ucCourseCode,
      `"${art.ucCourseName}"`,
    ].join(",");
  });

  return header + rows.join("\n");
}

/**
 * Save to file
 */
function saveToFile(content: string, filename: string) {
  const outputDir = path.join(process.cwd(), "data", "articulations");
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, content, "utf-8");
  
  console.log(`\n💾 Saved to: ${filePath}`);
  return filePath;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("Usage: npx tsx scripts/fetch-assist-articulations.ts <CC_CODE> <UNIVERSITY_CODE>");
    console.log("\nExample:");
    console.log("  npx tsx scripts/fetch-assist-articulations.ts BCC UCB");
    console.log("\nAvailable codes:");
    console.log("  Colleges: BCC, COA, LANEY, MERRITT");
    console.log("  Universities: UCB, UCLA, UCSD, UCD, UCSB, UCI, UCSC, UCR, UCM, SFSU, SJSU, CSUEB");
    process.exit(1);
  }

  const [ccCode, universityCode] = args;
  
  console.log(`\n📚 Fetching Articulations`);
  console.log(`   From: ${ccCode}`);
  console.log(`   To: ${universityCode}`);

  try {
    // Fetch from ASSIST.org
    const articulations = await fetchAssistArticulation(ccCode, universityCode);
    
    if (articulations.length === 0) {
      console.log("\n⚠️  No articulations found. This could mean:");
      console.log("   1. ASSIST.org structure has changed");
      console.log("   2. No articulation agreement exists");
      console.log("   3. Need to adjust parsing logic");
      console.log("\n💡 Try manually checking ASSIST.org first");
      process.exit(0);
    }

    console.log(`\n✅ Found ${articulations.length} articulations`);

    // Convert to CSV
    const csv = convertToCSV(articulations, ccCode, universityCode);
    
    // Save to file
    const filename = `${ccCode}-${universityCode}-articulations-${Date.now()}.csv`;
    const filePath = saveToFile(csv, filename);

    console.log(`\n✨ Success!`);
    console.log(`   File: ${filename}`);
    console.log(`   Articulations: ${articulations.length}`);
    console.log(`\n📥 Next step: Import via admin interface at /admin/articulations`);

    // Optionally import directly to database
    console.log(`\n💡 To import directly, use:`);
    console.log(`   npx tsx scripts/parse-csv-import.ts ${filePath}`);

  } catch (error) {
    console.error("\n❌ Error:", error);
    console.log("\n💡 Alternative: Manually collect from ASSIST.org and use admin interface");
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

