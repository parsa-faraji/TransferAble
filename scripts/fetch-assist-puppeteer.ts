/**
 * ASSIST.org Articulation Fetcher using Puppeteer
 * 
 * This script uses Puppeteer to fetch and parse ASSIST.org data more reliably.
 * 
 * Usage: 
 *   npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB
 * 
 * WARNING: Check ASSIST.org Terms of Service. Use responsibly.
 */

import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

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
};

interface ArticulationData {
  ccCourseCode: string;
  ccCourseName: string;
  ccUnits: string;
  ucCourseCode: string;
  ucCourseName: string;
  ucUnits: string;
}

async function fetchWithPuppeteer(
  ccCode: string,
  universityCode: string
): Promise<ArticulationData[]> {
  const ccAssistCode = ASSIST_CODES[ccCode];
  const uniAssistCode = ASSIST_CODES[universityCode];

  if (!ccAssistCode || !uniAssistCode) {
    throw new Error(`Invalid codes: ${ccCode} or ${universityCode}`);
  }

  console.log(`\n🌐 Launching browser...`);
  const browser = await puppeteer.launch({
    headless: "new", // Use new headless mode for better compatibility
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to ASSIST.org
    const url = `https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=${ccAssistCode}&institution2=${uniAssistCode}`;
    
    console.log(`📄 Loading: ${url}`);
    
    // ASSIST.org is an Angular app - we need to wait for it to fully load
    await page.goto(url, { 
      waitUntil: "domcontentloaded", 
      timeout: 30000 
    });
    
    console.log(`   Waiting for Angular app to load...`);
    
    // Wait for Angular app to initialize (app-root is populated)
    await page.waitForFunction(
      () => {
        const appRoot = document.querySelector("app-root");
        return appRoot && appRoot.children.length > 0;
      },
      { timeout: 30000 }
    );
    
    console.log(`   Waiting for articulation content...`);
    
    // Wait a bit more for dynamic content to load
    await page.waitForTimeout(3000);
    
    // Try multiple selectors for tables - ASSIST.org may use different structures
    let tableFound = false;
    const tableSelectors = [
      "table",
      ".table",
      "[role='table']",
      "ag-grid-table", // Angular grid component
      "ng-table", // Angular table component
    ];
    
    for (const selector of tableSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`   ✅ Found table with selector: ${selector}`);
        tableFound = true;
        break;
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!tableFound) {
      console.warn("⚠️  No table found with standard selectors, checking page content...");
      // Wait a bit more and check if there's any content
      await page.waitForTimeout(2000);
    }

    // Extract table data - handle Angular-rendered content
    const articulations = await page.evaluate(() => {
      const results: ArticulationData[] = [];
      
      const getText = (element: Element | null) => {
        if (!element) return "";
        return element.textContent?.trim().replace(/\s+/g, " ") || "";
      };
      
      // Try multiple table selectors
      const tableSelectors = [
        "table",
        ".table",
        "[role='table']",
        "ag-grid-table",
        "ng-table",
      ];
      
      let tables: NodeListOf<Element> | null = null;
      
      for (const selector of tableSelectors) {
        const found = document.querySelectorAll(selector);
        if (found.length > 0) {
          tables = found;
          break;
        }
      }
      
      // If no tables found, look for any data rows in the page
      if (!tables || tables.length === 0) {
        // Try to find rows that might contain course data
        const allRows = document.querySelectorAll("[class*='row'], [class*='Row'], tr");
        
        for (const row of allRows) {
          const cells = row.querySelectorAll("td, th, [class*='cell'], [class*='Cell']");
          
          if (cells.length >= 4) {
            const firstCell = getText(cells[0]);
            const thirdCell = getText(cells[2]);
            
            // Heuristic: course codes are usually short and contain letters/numbers
            if (firstCell && firstCell.length < 20 && /[A-Z]/.test(firstCell)) {
              results.push({
                ccCourseCode: getText(cells[0]),
                ccCourseName: getText(cells[1]),
                ccUnits: getText(cells[2]) || "3",
                ucCourseCode: getText(cells[3]),
                ucCourseName: getText(cells[4]) || getText(cells[3]),
                ucUnits: getText(cells[5]) || getText(cells[2]) || "3",
              });
            }
          }
        }
      } else {
        // Process tables normally
        for (const table of tables) {
          const rows = table.querySelectorAll("tr");
          
          for (let i = 1; i < rows.length; i++) { // Skip header
            const cells = rows[i].querySelectorAll("td, th");
            
            if (cells.length >= 4) {
              const firstCell = getText(cells[0]);
              
              // Filter out header rows and empty rows
              if (firstCell && firstCell.length > 0 && firstCell.length < 50) {
                results.push({
                  ccCourseCode: getText(cells[0]),
                  ccCourseName: getText(cells[1]),
                  ccUnits: getText(cells[2]) || "3",
                  ucCourseCode: getText(cells[3]),
                  ucCourseName: getText(cells[4]) || getText(cells[3]),
                  ucUnits: getText(cells[5]) || getText(cells[2]) || "3",
                });
              }
            }
          }
        }
      }
      
      return results;
    });
    
    // Log what we found for debugging
    if (articulations.length === 0) {
      console.log("\n⚠️  No articulations extracted. Checking page content...");
      
      // Get page title and some content for debugging
      const pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          bodyText: document.body.textContent?.substring(0, 500) || "",
          hasAppRoot: !!document.querySelector("app-root"),
          appRootChildren: document.querySelector("app-root")?.children.length || 0,
        };
      });
      
      console.log(`   Page Title: ${pageInfo.title}`);
      console.log(`   Has app-root: ${pageInfo.hasAppRoot}`);
      console.log(`   App-root children: ${pageInfo.appRootChildren}`);
      console.log(`   Body text preview: ${pageInfo.bodyText.substring(0, 200)}...`);
    }

    return articulations.filter(
      (art) => art.ccCourseCode && art.ucCourseCode && art.ccCourseCode.length > 0
    );
  } finally {
    await browser.close();
  }
}

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
      `"${art.ccCourseName.replace(/"/g, '""')}"`,
      art.ccUnits || "3",
      universityCode,
      art.ucCourseCode,
      `"${art.ucCourseName.replace(/"/g, '""')}"`,
    ].join(",");
  });

  return header + rows.join("\n");
}

function saveToFile(content: string, filename: string): string {
  const outputDir = path.join(process.cwd(), "public", "downloads");
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, content, "utf-8");
  
  return filePath;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("Usage: npx tsx scripts/fetch-assist-puppeteer.ts <CC_CODE> <UNIVERSITY_CODE>");
    console.log("\nExample: npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB");
    process.exit(1);
  }

  const [ccCode, universityCode] = args;
  
  console.log(`\n📚 Fetching Articulations`);
  console.log(`   From: ${ccCode}`);
  console.log(`   To: ${universityCode}`);

  try {
    const articulations = await fetchWithPuppeteer(ccCode, universityCode);
    
    if (articulations.length === 0) {
      console.log("\n⚠️  No articulations found.");
      console.log("   This could mean:");
      console.log("   1. No agreement exists for this combination");
      console.log("   2. ASSIST.org structure has changed");
      console.log("   3. Need to manually check ASSIST.org");
      process.exit(0);
    }

    console.log(`\n✅ Found ${articulations.length} articulations`);

    const csv = convertToCSV(articulations, ccCode, universityCode);
    const filename = `${ccCode}-${universityCode}-articulations-${Date.now()}.csv`;
    const filePath = saveToFile(csv, filename);

    console.log(`\n💾 Saved to: ${filePath}`);
    console.log(`\n✨ Success!`);
    console.log(`   File: ${filename}`);
    console.log(`   Articulations: ${articulations.length}`);
    console.log(`\n📥 Next: Import via /admin/articulations`);

  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

main();

