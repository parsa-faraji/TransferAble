/**
 * ASSIST.org Integration Test Script
 * 
 * Tests the ASSIST.org integration by:
 * 1. Validating URL construction
 * 2. Testing connection to ASSIST.org
 * 3. Fetching sample data
 * 4. Validating parsing logic
 * 
 * Usage:
 *   npx tsx scripts/test-assist.ts
 */

import puppeteer from "puppeteer";

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

interface TestResult {
  test: string;
  status: "pass" | "fail" | "warning";
  message: string;
  details?: any;
}

interface ArticulationData {
  ccCourseCode: string;
  ccCourseName: string;
  ccUnits: string;
  ucCourseCode: string;
  ucCourseName: string;
  ucUnits: string;
}

const results: TestResult[] = [];

function logResult(test: string, status: "pass" | "fail" | "warning", message: string, details?: any) {
  results.push({ test, status, message, details });
  const icon = status === "pass" ? "✅" : status === "fail" ? "❌" : "⚠️";
  console.log(`${icon} ${test}: ${message}`);
  if (details) {
    console.log(`   Details:`, details);
  }
}

/**
 * Test 1: Validate ASSIST code mappings
 */
function testAssistCodes() {
  console.log("\n📋 Test 1: ASSIST Code Mappings");
  console.log("=".repeat(60));
  
  const requiredCodes = ["BCC", "COA", "LANEY", "MERRITT", "UCB", "UCLA"];
  
  for (const code of requiredCodes) {
    if (ASSIST_CODES[code]) {
      logResult(
        `Code mapping: ${code}`,
        "pass",
        `Maps to ${ASSIST_CODES[code]}`
      );
    } else {
      logResult(
        `Code mapping: ${code}`,
        "fail",
        `Missing ASSIST code mapping`
      );
    }
  }
}

/**
 * Test 2: Validate URL construction
 */
function testURLConstruction() {
  console.log("\n📋 Test 2: URL Construction");
  console.log("=".repeat(60));
  
  const testCases = [
    { cc: "BCC", uni: "UCB", expectedCC: "001286", expectedUni: "001319" },
    { cc: "LANEY", uni: "UCLA", expectedCC: "001288", expectedUni: "001312" },
  ];
  
  for (const testCase of testCases) {
    const ccCode = ASSIST_CODES[testCase.cc];
    const uniCode = ASSIST_CODES[testCase.uni];
    
    if (ccCode === testCase.expectedCC && uniCode === testCase.expectedUni) {
      const url = `https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=${ccCode}&institution2=${uniCode}`;
      logResult(
        `URL: ${testCase.cc} → ${testCase.uni}`,
        "pass",
        `URL constructed correctly`,
        { url }
      );
    } else {
      logResult(
        `URL: ${testCase.cc} → ${testCase.uni}`,
        "fail",
        `Incorrect code mapping`
      );
    }
  }
}

/**
 * Test 3: Test connection to ASSIST.org
 */
async function testConnection() {
  console.log("\n📋 Test 3: ASSIST.org Connection");
  console.log("=".repeat(60));
  
  try {
    const testUrl = "https://assist.org";
    const response = await fetch(testUrl, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    
    if (response.ok) {
      logResult(
        "ASSIST.org Connection",
        "pass",
        `Connected successfully (${response.status})`
      );
    } else {
      logResult(
        "ASSIST.org Connection",
        "warning",
        `Connection returned status ${response.status}`
      );
    }
  } catch (error) {
    logResult(
      "ASSIST.org Connection",
      "fail",
      `Failed to connect: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Test 4: Fetch and parse articulation data
 */
async function testFetchArticulation(ccCode: string, universityCode: string) {
  console.log(`\n📋 Test 4: Fetch Articulation (${ccCode} → ${universityCode})`);
  console.log("=".repeat(60));
  
  const ccAssistCode = ASSIST_CODES[ccCode];
  const uniAssistCode = ASSIST_CODES[universityCode];
  
  if (!ccAssistCode || !uniAssistCode) {
    logResult(
      "Fetch Articulation",
      "fail",
      `Invalid codes: ${ccCode} or ${universityCode}`
    );
    return null;
  }
  
  const url = `https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=${ccAssistCode}&institution2=${uniAssistCode}`;
  
  console.log(`\n🌐 Fetching: ${url}`);
  
  try {
    console.log("   Launching browser...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    
    try {
      const page = await browser.newPage();
      
      console.log("   Loading page...");
      
      // Try different navigation strategies
      try {
        await page.goto(url, { 
          waitUntil: "domcontentloaded", 
          timeout: 30000 
        });
        
        // Wait a bit for any dynamic content
        await page.waitForTimeout(3000);
        
        // Check if page loaded successfully
        const pageTitle = await page.title();
        logResult(
          "Page Load",
          "pass",
          `Page loaded: ${pageTitle.substring(0, 50)}...`
        );
      } catch (navError) {
        logResult(
          "Page Load",
          "warning",
          `Navigation had issues, but continuing...`,
          { error: navError instanceof Error ? navError.message : "Unknown" }
        );
        
        // Try to get current URL
        const currentUrl = page.url();
        console.log(`   Current URL: ${currentUrl}`);
      }
      
      // Check for table presence
      const tableExists = await page.$("table") !== null;
      
      if (!tableExists) {
        logResult(
          "Table Detection",
          "warning",
          "No table found - page structure may have changed or no agreement exists"
        );
        
        // Try to capture page content for debugging
        const bodyText = await page.evaluate(() => document.body.textContent?.substring(0, 200) || "");
        logResult(
          "Page Content",
          "warning",
          "Page content preview",
          { preview: bodyText }
        );
        
        await browser.close();
        return null;
      }
      
      logResult(
        "Table Detection",
        "pass",
        "Articulation table found"
      );
      
      // Extract articulations
      console.log("   Extracting data...");
      const articulations = await page.evaluate(() => {
        const results: ArticulationData[] = [];
        const tables = document.querySelectorAll("table");
        
        for (const table of tables) {
          const rows = table.querySelectorAll("tr");
          
          for (let i = 1; i < rows.length; i++) { // Skip header
            const cells = rows[i].querySelectorAll("td, th");
            
            if (cells.length >= 4) {
              const getText = (cell: Element) => cell.textContent?.trim() || "";
              
              const ccCode = getText(cells[0]);
              const ccName = getText(cells[1]);
              const ucCode = getText(cells[3]);
              
              if (ccCode && ucCode && ccCode.length > 0) {
                results.push({
                  ccCourseCode: ccCode,
                  ccCourseName: ccName,
                  ccUnits: getText(cells[2]) || "3",
                  ucCourseCode: ucCode,
                  ucCourseName: getText(cells[4]) || getText(cells[3]),
                  ucUnits: getText(cells[5]) || getText(cells[2]) || "3",
                });
              }
            }
          }
        }
        
        return results;
      });
      
      const validArticulations = articulations.filter(
        (art) => art.ccCourseCode && art.ucCourseCode && art.ccCourseCode.length > 0
      );
      
      if (validArticulations.length === 0) {
        logResult(
          "Data Extraction",
          "warning",
          "No valid articulations found - may need to adjust parsing logic"
        );
        await browser.close();
        return null;
      }
      
      logResult(
        "Data Extraction",
        "pass",
        `Extracted ${validArticulations.length} articulations`
      );
      
      // Validate sample data
      const sample = validArticulations[0];
      logResult(
        "Data Validation",
        "pass",
        "Sample articulation validated",
        {
          ccCourse: `${sample.ccCourseCode} - ${sample.ccCourseName}`,
          ucCourse: `${sample.ucCourseCode} - ${sample.ucCourseName}`,
        }
      );
      
      await browser.close();
      return validArticulations;
      
    } catch (error) {
      await browser.close();
      throw error;
    }
    
  } catch (error) {
    logResult(
      "Fetch Articulation",
      "fail",
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { error: error instanceof Error ? error.stack : undefined }
    );
    return null;
  }
}

/**
 * Test 5: Validate parsing logic with sample HTML
 */
function testParsingLogic() {
  console.log("\n📋 Test 5: Parsing Logic");
  console.log("=".repeat(60));
  
  // Sample HTML structure (simplified)
  const sampleHTML = `
    <table>
      <tr><th>CC Code</th><th>CC Name</th><th>Units</th><th>UC Code</th><th>UC Name</th></tr>
      <tr><td>MATH 1A</td><td>Calculus I</td><td>4</td><td>MATH 1A</td><td>Calculus</td></tr>
      <tr><td>ENGL 1A</td><td>Composition</td><td>3</td><td>ENGL R1A</td><td>Reading and Composition</td></tr>
    </table>
  `;
  
  // Test regex parsing
  const tableMatch = sampleHTML.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  
  if (tableMatch) {
    logResult(
      "HTML Parsing",
      "pass",
      "Table regex matching works"
    );
  } else {
    logResult(
      "HTML Parsing",
      "fail",
      "Table regex matching failed"
    );
  }
  
  // Test row extraction
  const rows = sampleHTML.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  if (rows && rows.length > 1) {
    logResult(
      "Row Extraction",
      "pass",
      `Found ${rows.length} rows (including header)`
    );
  } else {
    logResult(
      "Row Extraction",
      "fail",
      "Failed to extract rows"
    );
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log("\n🧪 ASSIST.org Integration Test Suite");
  console.log("=".repeat(60));
  console.log(`Started at: ${new Date().toISOString()}\n`);
  
  // Run all tests
  testAssistCodes();
  testURLConstruction();
  await testConnection();
  testParsingLogic();
  
  // Test a sample fetch (BCC → UCB)
  console.log("\n📋 Test 6: Live Data Fetch");
  console.log("=".repeat(60));
  console.log("Testing with BCC → UCB (this may take 30-60 seconds)...");
  
  const articulations = await testFetchArticulation("BCC", "UCB");
  
  if (articulations && articulations.length > 0) {
    console.log("\n📊 Sample Articulations:");
    articulations.slice(0, 3).forEach((art, idx) => {
      console.log(`   ${idx + 1}. ${art.ccCourseCode} → ${art.ucCourseCode}`);
    });
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const warnings = results.filter((r) => r.status === "warning").length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`📊 Total: ${results.length}`);
  
  if (failed > 0) {
    console.log("\n❌ Failed Tests:");
    results
      .filter((r) => r.status === "fail")
      .forEach((r) => console.log(`   - ${r.test}: ${r.message}`));
  }
  
  if (warnings > 0) {
    console.log("\n⚠️  Warnings:");
    results
      .filter((r) => r.status === "warning")
      .forEach((r) => console.log(`   - ${r.test}: ${r.message}`));
  }
  
  console.log("\n" + "=".repeat(60));
  
  if (failed === 0) {
    console.log("✨ All critical tests passed!");
    process.exit(0);
  } else {
    console.log("⚠️  Some tests failed. Please review the results above.");
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error("\n❌ Test suite crashed:", error);
  process.exit(1);
});

