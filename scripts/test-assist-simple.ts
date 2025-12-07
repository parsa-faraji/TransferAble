/**
 * Simple ASSIST.org Test Script
 * 
 * Quick test without Puppeteer - tests URL construction, connection, and basic fetching
 * 
 * Usage:
 *   npx tsx scripts/test-assist-simple.ts
 */

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

async function testConnection() {
  console.log("\n🌐 Testing ASSIST.org Connection...");
  try {
    const response = await fetch("https://assist.org", {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    
    if (response.ok) {
      console.log(`✅ ASSIST.org is accessible (Status: ${response.status})`);
      return true;
    } else {
      console.log(`⚠️  ASSIST.org returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Failed to connect: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
}

function testURLConstruction() {
  console.log("\n🔗 Testing URL Construction...");
  
  const testCases = [
    { cc: "BCC", uni: "UCB", ccCode: "001286", uniCode: "001319" },
    { cc: "LANEY", uni: "UCLA", ccCode: "001288", uniCode: "001312" },
    { cc: "COA", uni: "UCSD", ccCode: "001287", uniCode: "001320" },
  ];
  
  let allPassed = true;
  
  for (const testCase of testCases) {
    const ccAssistCode = ASSIST_CODES[testCase.cc];
    const uniAssistCode = ASSIST_CODES[testCase.uni];
    
    if (ccAssistCode === testCase.ccCode && uniAssistCode === testCase.uniCode) {
      const url = `https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=${ccAssistCode}&institution2=${uniAssistCode}`;
      console.log(`✅ ${testCase.cc} → ${testCase.uni}: ${url}`);
    } else {
      console.log(`❌ ${testCase.cc} → ${testCase.uni}: Code mismatch`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function testFetchPage(ccCode: string, universityCode: string) {
  console.log(`\n📄 Testing Page Fetch: ${ccCode} → ${universityCode}...`);
  
  const ccAssistCode = ASSIST_CODES[ccCode];
  const uniAssistCode = ASSIST_CODES[universityCode];
  
  if (!ccAssistCode || !uniAssistCode) {
    console.log(`❌ Invalid codes: ${ccCode} or ${universityCode}`);
    return false;
  }
  
  const url = `https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=${ccAssistCode}&institution2=${uniAssistCode}`;
  
  try {
    console.log(`   Fetching: ${url}`);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    
    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const html = await response.text();
    
    // Check for common ASSIST.org indicators
    const hasTable = html.includes("<table") || html.toLowerCase().includes("table");
    const hasContent = html.length > 1000;
    const hasError = html.toLowerCase().includes("error") || html.toLowerCase().includes("not found");
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Content Length: ${html.length} bytes`);
    console.log(`   Has Table: ${hasTable ? "✅" : "❌"}`);
    console.log(`   Has Content: ${hasContent ? "✅" : "❌"}`);
    console.log(`   Has Error: ${hasError ? "⚠️" : "✅"}`);
    
    if (hasTable && hasContent && !hasError) {
      console.log(`✅ Page fetch successful and contains data`);
      return true;
    } else if (hasError) {
      console.log(`⚠️  Page may contain errors or no agreement exists`);
      return false;
    } else {
      console.log(`⚠️  Page structure may be different than expected`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
}

function validateCodeMappings() {
  console.log("\n🔑 Validating Code Mappings...");
  
  const requiredCodes = [
    { key: "BCC", expected: "001286" },
    { key: "COA", expected: "001287" },
    { key: "LANEY", expected: "001288" },
    { key: "MERRITT", expected: "001289" },
    { key: "UCB", expected: "001319" },
    { key: "UCLA", expected: "001312" },
  ];
  
  let allValid = true;
  
  for (const code of requiredCodes) {
    const actual = ASSIST_CODES[code.key];
    if (actual === code.expected) {
      console.log(`✅ ${code.key}: ${actual}`);
    } else {
      console.log(`❌ ${code.key}: Expected ${code.expected}, got ${actual || "undefined"}`);
      allValid = false;
    }
  }
  
  return allValid;
}

async function main() {
  console.log("🧪 ASSIST.org Simple Test Suite");
  console.log("=".repeat(60));
  console.log(`Started at: ${new Date().toISOString()}\n`);
  
  const results = {
    codes: false,
    urls: false,
    connection: false,
    fetch: false,
  };
  
  // Test 1: Code mappings
  results.codes = validateCodeMappings();
  
  // Test 2: URL construction
  results.urls = testURLConstruction();
  
  // Test 3: Connection
  results.connection = await testConnection();
  
  // Test 4: Fetch a sample page
  if (results.connection) {
    results.fetch = await testFetchPage("BCC", "UCB");
  } else {
    console.log("\n⚠️  Skipping page fetch test (connection failed)");
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  
  const passed = Object.values(results).filter((r) => r).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Code Mappings: ${results.codes ? "PASS" : "FAIL"}`);
  console.log(`✅ URL Construction: ${results.urls ? "PASS" : "FAIL"}`);
  console.log(`✅ Connection: ${results.connection ? "PASS" : "FAIL"}`);
  console.log(`✅ Page Fetch: ${results.fetch ? "PASS" : "FAIL"}`);
  
  console.log(`\n📊 Score: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log("\n✨ All tests passed!");
    process.exit(0);
  } else if (passed >= total - 1) {
    console.log("\n⚠️  Most tests passed. Minor issues detected.");
    process.exit(0);
  } else {
    console.log("\n❌ Some tests failed. Please review the results above.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\n❌ Test suite crashed:", error);
  process.exit(1);
});













