import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import * as fs from "fs";
import * as path from "path";

// ASSIST.org institution codes
const ASSIST_CODES: Record<string, string> = {
  BCC: "001286",
  COA: "001287",
  LANEY: "001288",
  MERRITT: "001289",
  UCB: "001319",
  UCLA: "001312",
  UCSD: "001320",
  UCD: "001313",
  UCSB: "001314",
  UCI: "001315",
  UCSC: "001316",
  UCR: "001317",
  UCM: "001318",
  SFSU: "001154",
  SJSU: "001470",
  CSUEB: "001146",
  CSUMB: "001145",
  SSU: "001445",
  CSUS: "001470",
};

interface ArticulationData {
  ccCourseCode: string;
  ccCourseName: string;
  ccUnits: string;
  ucCourseCode: string;
  ucCourseName: string;
  ucUnits: string;
}

function parseAssistHTML(html: string): ArticulationData[] {
  const articulations: ArticulationData[] = [];
  
  // Try to find table with articulations
  // ASSIST.org structure may vary - this is a template
  const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  
  if (!tableMatch) {
    return [];
  }

  // Extract rows (simplified - may need more sophisticated parsing)
  const rows = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  
  for (let i = 1; i < rows.length; i++) { // Skip header
    const row = rows[i];
    const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || [];
    
    if (cells.length >= 4) {
      const cleanCell = (cell: string) => 
        cell.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
      
      articulations.push({
        ccCourseCode: cleanCell(cells[0] || ""),
        ccCourseName: cleanCell(cells[1] || ""),
        ccUnits: cleanCell(cells[2] || "3"),
        ucCourseCode: cleanCell(cells[3] || ""),
        ucCourseName: cleanCell(cells[4] || cleanCell(cells[3] || "")),
        ucUnits: cleanCell(cells[5] || cleanCell(cells[2] || "3")),
      });
    }
  }

  return articulations;
}

function convertToCSV(
  articulations: ArticulationData[],
  ccCode: string,
  universityCode: string
): string {
  const header = "community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name\n";
  
  const rows = articulations
    .filter((art) => art.ccCourseCode && art.ucCourseCode) // Filter out empty rows
    .map((art) => {
      return [
        ccCode,
        art.ccCourseCode,
        `"${art.ccCourseName.replace(/"/g, '""')}"`,
        art.ccUnits || "3",
        universityCode,
        art.ucCourseCode,
        `"${art.ucCourseName.replace(/"/g, '""')}"`,
      ].join(",");
    });

  return header + rows.join("\n");
}

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const college = searchParams.get("college");
    const university = searchParams.get("university");

    if (!college || !university) {
      return NextResponse.json(
        { error: "Missing college or university parameter" },
        { status: 400 }
      );
    }

    const ccAssistCode = ASSIST_CODES[college];
    const uniAssistCode = ASSIST_CODES[university];

    if (!ccAssistCode || !uniAssistCode) {
      return NextResponse.json(
        { error: "Invalid college or university code" },
        { status: 400 }
      );
    }

    // Construct ASSIST.org URL
    const url = `https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=${ccAssistCode}&institution2=${uniAssistCode}`;

    console.log(`Fetching from ASSIST.org: ${url}`);

    // IMPORTANT: ASSIST.org is an Angular application that renders content dynamically via JavaScript.
    // A simple fetch() will only return the HTML shell with <app-root></app-root>.
    // The actual articulation tables are rendered by Angular after page load.
    // This API route will NOT work with simple fetch - it needs Puppeteer or browser automation.
    
    // Fetch from ASSIST.org (this will only get the Angular shell)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from ASSIST.org: ${response.status}` },
        { status: 500 }
      );
    }

    const html = await response.text();
    
    // Check if we got the Angular shell (which means simple fetch won't work)
    if (html.includes("<app-root></app-root>") && !html.includes("<table")) {
      return NextResponse.json(
        {
          error: "ASSIST.org uses Angular and requires JavaScript execution",
          details: "The page content is rendered dynamically by Angular. Simple HTTP fetch cannot extract the data.",
          solutions: [
            "Use the browser console script: Go to ASSIST.org manually, open browser console, paste scripts/assist-browser-helper.js",
            "Use the Puppeteer script: npx tsx scripts/fetch-assist-puppeteer.ts " + college + " " + university,
            "Manually collect data and use the CSV import feature"
          ],
          url: url,
        },
        { status: 400 }
      );
    }
    
    // Parse HTML (this won't work for Angular apps, but kept for backwards compatibility)
    const articulations = parseAssistHTML(html);

    if (articulations.length === 0) {
      return NextResponse.json(
        { 
          error: "No articulations found. ASSIST.org is an Angular app that requires JavaScript execution.",
          details: "ASSIST.org renders content dynamically. Use the browser console script or Puppeteer instead.",
          solutions: [
            "Browser console: scripts/assist-browser-helper.js (most reliable)",
            "Puppeteer: npx tsx scripts/fetch-assist-puppeteer.ts " + college + " " + university,
            "Manual CSV import via admin interface"
          ],
          url: url,
        },
        { status: 404 }
      );
    }

    // Convert to CSV
    const csv = convertToCSV(articulations, college, university);

    // Save to file
    const outputDir = path.join(process.cwd(), "public", "downloads");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `${college}-${university}-articulations-${Date.now()}.csv`;
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, csv, "utf-8");

    return NextResponse.json({
      success: true,
      count: articulations.length,
      fileUrl: `/downloads/${filename}`,
      message: `Successfully fetched ${articulations.length} articulations`,
    });
  } catch (error) {
    console.error("Error fetching articulations:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch articulations",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

