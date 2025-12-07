/**
 * Browser Helper Script for ASSIST.org
 * 
 * Copy and paste this into your browser console while on an ASSIST.org
 * articulation page to extract the data automatically.
 * 
 * IMPORTANT: Make sure you're on a page with VISIBLE ARTICULATION TABLES!
 * 
 * This script works in two scenarios:
 * 1. Single table page: One articulation table visible (after selecting major)
 * 2. Multi-table page: Multiple tables visible (one for each major option)
 * 
 * Usage:
 * 1. Navigate to ASSIST.org articulation page
 * 2. WAIT for the page to fully load (10-15 seconds - it's an Angular app!)
 * 3. Make sure you can SEE the course articulation table(s) on the page
 * 4. If multiple majors/tables are visible, the script will extract from ALL of them
 * 5. Scroll down to ensure all tables are visible
 * 6. Open browser console (F12)
 * 7. Paste this script and press Enter
 * 8. CSV file will download automatically with all extracted articulations
 * 
 * Multi-Major Pages:
 * - If you see tables next to major selection options, that's fine!
 * - The script will extract data from ALL visible tables
 * - If you want only one major, select it first, then run the script
 * 
 * Troubleshooting:
 * - If "No articulations found": Make sure tables are visible on the page
 * - Wait longer for page to load
 * - Check console output for diagnostic information
 * - See ASSIST_TROUBLESHOOTING.md for more help
 */

(function() {
  console.log("🔍 Extracting articulation data from ASSIST.org...");
  console.log("📄 Current URL:", window.location.href);
  
  // Diagnostic: Check page state
  const appRoot = document.querySelector("app-root");
  const tables = document.querySelectorAll("table");
  const pageText = document.body.textContent || "";
  
  console.log("🔍 Page Diagnostics:");
  console.log("   - Has app-root:", !!appRoot);
  console.log("   - app-root children:", appRoot?.children.length || 0);
  console.log("   - Tables found:", tables.length);
  console.log("   - Page text length:", pageText.length);
  
  if (tables.length > 0) {
    console.log("   - Table structures found:");
    tables.forEach((table, idx) => {
      const rows = table.querySelectorAll("tr");
      console.log(`     Table ${idx + 1}: ${rows.length} rows`);
    });
  }
  
  // Check for div-based structures
  const divRows = document.querySelectorAll("[role='row'], [class*='row'], [class*='Row']");
  const courseDivs = document.querySelectorAll("[class*='course'], [class*='Course'], [class*='articulation'], [class*='Articulation']");
  console.log("   - Div-based rows found:", divRows.length);
  console.log("   - Course-related divs found:", courseDivs.length);
  
  // Look for course codes in the page to verify data is there
  const courseCodesInPage = pageText.match(/\b[A-Z]{2,}\s*\d+[A-Z]*\b/g);
  if (courseCodesInPage) {
    const uniqueCodes = [...new Set(courseCodesInPage.slice(0, 10))];
    console.log("   - Course codes found in page:", uniqueCodes.length);
    console.log("      Sample:", uniqueCodes.join(", "));
  }
  
  const articulations = [];
  
  // Helper function to get text from element
  const getText = (element) => {
    if (!element) return "";
    return element.textContent?.trim().replace(/\s+/g, " ") || "";
  };
  
  // Helper function to check if text looks like a course code
  const isCourseCode = (text) => {
    if (!text || text.length > 20) return false;
    // Course codes usually have letters and numbers, e.g., "MATH 1A", "ENGL 1A"
    return /[A-Z]{2,}\s*\d+[A-Z]*/i.test(text);
  };
  
  // Check if we're on a multi-major page (multiple tables visible)
  const majorSelectors = document.querySelectorAll("select, [role='combobox'], [class*='major'], [class*='Major'], [class*='agreement']");
  const hasMajorSelection = majorSelectors.length > 0 || pageText.includes("Select") || pageText.includes("Major");
  
  console.log("\n📋 Page Type Detection:");
  console.log(`   - Tables found: ${tables.length}`);
  console.log(`   - Major selection options: ${majorSelectors.length > 0 ? 'Yes' : 'No'}`);
  
  if (tables.length > 1) {
    console.log(`   ⚠️  Multiple tables detected - this might be a multi-major page`);
    console.log(`   💡 Will extract from ALL visible tables`);
  }
  
  // Strategy 0: Look for div-based structures (Angular apps often use divs instead of tables)
  console.log("\n📊 Strategy 0: Looking for div-based structures (Angular components)...");
  
  // Look for specific Angular components that might contain data
  const angularComponents = document.querySelectorAll("app-report-items, app-transfer, [app-report-items], [app-transfer]");
  if (angularComponents.length > 0) {
    console.log(`   Found ${angularComponents.length} Angular report/transfer components`);
  }
  
  // Comprehensive approach to find div-based data structures
  const findDivBasedData = () => {
    const results = [];
    
    // First, try to find elements that actually contain course codes
    const allElementsWithCourseCodes = Array.from(document.querySelectorAll("*")).filter(el => {
      const text = getText(el);
      return isCourseCode(text) || (text.match(/\b[A-Z]{2,}\s*\d+[A-Z]*\b/) && text.length < 300);
    });
    
    console.log(`   Found ${allElementsWithCourseCodes.length} elements containing course codes`);
    
    // Group elements by their parent (likely rows/entries)
    const parentMap = new Map();
    allElementsWithCourseCodes.forEach(el => {
      const parent = el.parentElement;
      if (parent) {
        if (!parentMap.has(parent)) {
          parentMap.set(parent, []);
        }
        parentMap.get(parent).push(el);
      }
    });
    
    // Look for elements that might represent rows/entries
    const selectors = [
      "[role='row']",
      "[role='listitem']",
      "[class*='row']",
      "[class*='Row']",
      "[class*='course']",
      "[class*='Course']",
      "[class*='articulation']",
      "[class*='Articulation']",
      "[class*='agreement']",
      "[class*='Agreement']",
      "[class*='entry']",
      "[class*='Entry']",
      "[class*='item']",
      "[class*='Item']",
      "app-report-items > *",
      "app-report-items *[class*='row']",
      "app-report-items *[class*='item']",
    ];
    
    // Try each selector pattern
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const text = getText(element);
          
          // Look for course code patterns in the text
          const courseCodePattern = /\b([A-Z]{2,}\s*\d+[A-Z]*)\b/g;
          const matches = Array.from(text.matchAll(courseCodePattern));
          
          if (matches.length >= 1) {
            // Found at least one course code - try to extract full articulation
            const ccCode = matches[0][1];
            
            // Look for course name after the code
            const afterCode = text.substring(text.indexOf(ccCode) + ccCode.length);
            const nameMatch = afterCode.match(/^\s+([A-Z][^→\n]{10,80})/);
            const ccName = nameMatch ? nameMatch[1].trim() : "";
            
            // Look for equivalent/articulated course
            let ucCode = "";
            let ucName = "";
            
            if (matches.length >= 2) {
              // Found second course code - likely the equivalent
              ucCode = matches[1][1];
              const afterUCCode = text.substring(text.indexOf(ucCode, text.indexOf(ccCode)) + ucCode.length);
              const ucNameMatch = afterUCCode.match(/^\s+([A-Z][^\n]{10,80})/);
              ucName = ucNameMatch ? ucNameMatch[1].trim() : ucCode;
            } else {
              // Try to find arrow or equivalent indicator
              const arrowMatch = text.match(/→\s*([A-Z]{2,}\s*\d+[A-Z]*)/i);
              if (arrowMatch) {
                ucCode = arrowMatch[1];
              }
            }
            
            // Check if this looks like an articulation entry
            if (ccCode && (ucCode || text.includes("→") || text.includes("equivalent") || text.includes("articulates"))) {
              results.push({
                ccCourseCode: ccCode,
                ccCourseName: ccName || "",
                ccUnits: text.match(/(\d+)\s*unit/i)?.[1] || "3",
                ucCourseCode: ucCode || ccCode,
                ucCourseName: ucName || (ucCode || ccName),
                ucUnits: "3",
                source: "div-based",
              });
            }
          }
        });
      } catch (e) {
        // Skip invalid selectors
      }
    });
    
    // Also try extracting from elements that directly contain course codes
    allElementsWithCourseCodes.forEach(el => {
      const text = getText(el);
      const courseCodes = Array.from(text.matchAll(/\b([A-Z]{2,}\s*\d+[A-Z]*)\b/g));
      
      if (courseCodes.length >= 1) {
        const ccCode = courseCodes[0][1];
        
        // Look at sibling or parent elements for the full row/entry
        let container = el.parentElement;
        let attemptCount = 0;
        
        // Walk up the DOM to find the container that has both courses
        while (container && attemptCount < 5) {
          const containerText = getText(container);
          const allCodesInContainer = Array.from(containerText.matchAll(/\b([A-Z]{2,}\s*\d+[A-Z]*)\b/g));
          
          if (allCodesInContainer.length >= 2) {
            // This container has multiple course codes - likely an articulation entry
            const codes = allCodesInContainer.map(m => m[1]);
            const ccCodeIdx = codes.indexOf(ccCode);
            
            if (ccCodeIdx >= 0 && codes.length > ccCodeIdx + 1) {
              // Found the equivalent course
              const ucCode = codes[ccCodeIdx + 1];
              
              // Extract names by splitting the text
              const parts = containerText.split(ccCode);
              const ccName = parts[1]?.split(ucCode)[0]?.trim().substring(0, 80) || "";
              
              const ucParts = containerText.split(ucCode);
              const ucName = ucParts[1]?.trim().split(/\s+/).slice(0, 5).join(" ").substring(0, 80) || ucCode;
              
              // Avoid duplicates
              const exists = results.some(r => r.ccCourseCode === ccCode && r.ucCourseCode === ucCode);
              
              if (!exists && ccCode !== ucCode) {
                results.push({
                  ccCourseCode: ccCode,
                  ccCourseName: ccName || "",
                  ccUnits: containerText.match(/(\d+)\s*unit/i)?.[1] || "3",
                  ucCourseCode: ucCode,
                  ucCourseName: ucName || ucCode,
                  ucUnits: "3",
                  source: "parent-container",
                });
              }
            }
            break;
          }
          
          container = container.parentElement;
          attemptCount++;
        }
      }
    });
    
    return results;
  };
  
  const divArticulations = findDivBasedData();
  
  if (divArticulations.length > 0) {
    console.log(`   ✅ Found ${divArticulations.length} articulations in div structures`);
    articulations.push(...divArticulations);
  } else {
    console.log("   ℹ️  No div-based structures found with course data");
  }
  
  // Also try extracting from grouped/tagged divs (as user mentioned)
  console.log("   🔍 Looking for grouped/tagged div elements...");
  
  // Look for containers that group multiple items together
  const groupContainers = document.querySelectorAll(
    "[class*='group'], [class*='Group'], " +
    "[class*='container'], [class*='Container'], " +
    "[class*='list'], [class*='List'], " +
    "[data-group], [data-container]"
  );
  
  groupContainers.forEach(container => {
    // Get all direct children that might be entries
    const entries = Array.from(container.children).filter(child => {
      const text = getText(child);
      return isCourseCode(text) || text.match(/\b[A-Z]{2,}\s*\d+[A-Z]*\b/);
    });
    
    entries.forEach(entry => {
      const text = getText(entry);
      const courseCodes = Array.from(text.matchAll(/\b([A-Z]{2,}\s*\d+[A-Z]*)\b/g));
      
      if (courseCodes.length >= 1) {
        const ccCode = courseCodes[0][1];
        
        // Try to extract course name
        const parts = text.split(ccCode);
        const afterCode = parts[1] || "";
        const nameParts = afterCode.trim().split(/\s+/).slice(0, 5);
        const ccName = nameParts.join(" ").substring(0, 80);
        
        let ucCode = "";
        if (courseCodes.length >= 2) {
          ucCode = courseCodes[1][1];
        }
        
        if (ccCode) {
          articulations.push({
            ccCourseCode: ccCode,
            ccCourseName: ccName || "",
            ccUnits: "3",
            ucCourseCode: ucCode || ccCode,
            ucCourseName: ucCode || ccName || "",
            ucUnits: "3",
            source: "grouped-divs",
          });
        }
      }
    });
  });
  
  console.log(`   ✅ Total div-based articulations found: ${articulations.length}`);
  
  // Strategy 1: Look for actual HTML tables
  console.log("\n📊 Strategy 1: Looking for HTML tables...");
  
  // Try to identify major/agreement labels for each table
  const getTableContext = (table) => {
    // Look for headings or labels near the table
    let context = "";
    
    // Check for previous sibling headings
    let prev = table.previousElementSibling;
    let checkCount = 0;
    while (prev && checkCount < 5) {
      const tag = prev.tagName?.toLowerCase();
      if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
        const headingText = getText(prev);
        if (headingText.length < 100 && headingText.length > 0) {
          context = headingText;
          break;
        }
      }
      prev = prev.previousElementSibling;
      checkCount++;
    }
    
    // Check parent container for labels
    if (!context) {
      const parent = table.parentElement;
      if (parent) {
        const headings = parent.querySelectorAll("h1, h2, h3, h4, [class*='title'], [class*='label']");
        if (headings.length > 0) {
          context = getText(headings[0]);
        }
      }
    }
    
    return context;
  };
  
  tables.forEach((table, tableIndex) => {
    const rows = table.querySelectorAll("tr");
    const tableContext = getTableContext(table);
    
    console.log(`   Checking table ${tableIndex + 1} with ${rows.length} rows...`);
    if (tableContext) {
      console.log(`      Context: ${tableContext.substring(0, 60)}...`);
    }
    
    // Check if this looks like a real data table (not a navigation/selection table)
    const hasDataRows = rows.length > 2; // More than just header
    const firstRowCells = rows[0]?.querySelectorAll("td, th") || [];
    const looksLikeDataTable = firstRowCells.length >= 3;
    
    if (!hasDataRows || !looksLikeDataTable) {
      console.log(`      ⏭️  Skipping - doesn't look like a data table`);
      return;
    }
    
    for (let i = 1; i < rows.length; i++) { // Skip header
      const cells = rows[i].querySelectorAll("td, th");
      
      if (cells.length >= 4) {
        const ccCode = getText(cells[0]);
        const ccName = getText(cells[1]);
        const ucCode = getText(cells[2]) || getText(cells[3]);
        const ucName = getText(cells[3]) || getText(cells[4]) || getText(cells[2]);
        
        // Try different cell arrangements
        let extracted = null;
        
        // Pattern 1: CC Code | CC Name | UC Code | UC Name
        if (isCourseCode(ccCode) && (isCourseCode(ucCode) || ucCode)) {
          extracted = {
            ccCourseCode: ccCode,
            ccCourseName: ccName,
            ccUnits: getText(cells[2]) || "3",
            ucCourseCode: ucCode,
            ucCourseName: ucName,
            ucUnits: getText(cells[5]) || getText(cells[4]) || "3",
            major: tableContext || null, // Store major/context if found
          };
        }
        // Pattern 2: CC Code | CC Name | Units | UC Code | UC Name
        else if (cells.length >= 5 && isCourseCode(ccCode)) {
          extracted = {
            ccCourseCode: ccCode,
            ccCourseName: ccName,
            ccUnits: getText(cells[2]) || "3",
            ucCourseCode: getText(cells[3]),
            ucCourseName: getText(cells[4]) || getText(cells[3]),
            ucUnits: getText(cells[5]) || getText(cells[2]) || "3",
            major: tableContext || null,
          };
        }
        // Pattern 3: Try to find course codes in any cells
        else {
          const allTexts = Array.from(cells).map(getText);
          const courseCodeIndices = [];
          
          allTexts.forEach((text, idx) => {
            if (isCourseCode(text)) {
              courseCodeIndices.push(idx);
            }
          });
          
          // If we found at least 2 course codes, use them
          if (courseCodeIndices.length >= 2) {
            const ccIdx = courseCodeIndices[0];
            const ucIdx = courseCodeIndices[1];
            
            extracted = {
              ccCourseCode: allTexts[ccIdx],
              ccCourseName: allTexts[ccIdx + 1] || "",
              ccUnits: allTexts[ccIdx + 2] || "3",
              ucCourseCode: allTexts[ucIdx],
              ucCourseName: allTexts[ucIdx + 1] || allTexts[ucIdx],
              ucUnits: allTexts[ucIdx + 2] || "3",
              major: tableContext || null,
            };
          }
        }
        
        if (extracted && extracted.ccCourseCode) {
          // Check if UC course code is empty or "no articulation"
          const ucCodeText = extracted.ucCourseCode || "";
          const ucCodeLower = ucCodeText.toLowerCase().trim();
          
          // If UC code is empty or indicates no articulation, keep it empty
          if (ucCodeLower === "" || 
              ucCodeLower === "n/a" || 
              ucCodeLower === "none" ||
              ucCodeLower.includes("no articulation") ||
              ucCodeLower.includes("no equivalent")) {
            extracted.ucCourseCode = "";
            extracted.ucCourseName = "";
          }
          
          // Only add if we have at least a CC course code
          if (extracted.ccCourseCode.trim() !== "") {
            articulations.push(extracted);
          }
        }
        
        // Also check for rows where CC course exists but equivalent cell is empty
        if (cells.length >= 3) {
          const ccCode = getText(cells[0]);
          const equivalentCell = getText(cells[2]) || getText(cells[3]) || "";
          const equivalentLower = equivalentCell.toLowerCase().trim();
          
          // If we have a CC course code but empty/equivalent cell
          if (isCourseCode(ccCode) && 
              (equivalentCell.trim() === "" || 
               equivalentLower === "n/a" || 
               equivalentLower === "none" ||
               equivalentLower.includes("no articulation") ||
               equivalentLower.includes("no equivalent"))) {
            
            // Check if this course is already in articulations
            const alreadyExists = articulations.some(a => a.ccCourseCode === ccCode);
            
            if (!alreadyExists) {
              articulations.push({
                ccCourseCode: ccCode,
                ccCourseName: getText(cells[1]) || "",
                ccUnits: "3",
                ucCourseCode: "", // Empty - no articulation
                ucCourseName: "", // Empty - no articulation
                ucUnits: "3",
                major: tableContext || null,
              });
            }
          }
        }
      }
    }
  });
  
  // Strategy 2: Look for Angular Grid components or div-based tables
  if (articulations.length === 0) {
    console.log("\n📊 Strategy 2: Looking for Angular grid/div-based structures...");
    
    // Look for ag-grid or other Angular table components
    const gridRows = document.querySelectorAll("[role='row']:not([role='columnheader'])");
    const divTables = document.querySelectorAll("[class*='table'], [class*='grid'], [class*='row']");
    
    console.log(`   Found ${gridRows.length} grid rows, ${divTables.length} potential div structures`);
    
    // Try to find data rows with course-like patterns
    const allRows = document.querySelectorAll("tr, [role='row'], [class*='row']");
    
    for (const row of allRows) {
      const cells = row.querySelectorAll("td, th, [role='cell'], [class*='cell']");
      
      if (cells.length >= 3) {
        const texts = Array.from(cells).map(getText);
        
        // Look for rows that might contain course data
        for (let i = 0; i < texts.length - 1; i++) {
          if (isCourseCode(texts[i])) {
            // Found a potential course code, try to extract surrounding data
            const ccCode = texts[i];
            const ccName = texts[i + 1] || "";
            
            // Look for another course code (UC course)
            for (let j = i + 2; j < texts.length; j++) {
              if (isCourseCode(texts[j])) {
                articulations.push({
                  ccCourseCode: ccCode,
                  ccCourseName: ccName,
                  ccUnits: "3",
                  ucCourseCode: texts[j],
                  ucCourseName: texts[j + 1] || texts[j],
                  ucUnits: "3",
                });
                break;
              }
            }
            break;
          }
        }
      }
    }
  }
  
  // Strategy 3: Look for course code patterns in page text
  if (articulations.length === 0) {
    console.log("\n📊 Strategy 3: Searching for course patterns in page text...");
    
    // Look for common course code patterns
    const coursePattern = /([A-Z]{2,}\s*\d+[A-Z]*)\s+([A-Z][^A-Z0-9]+?)(?:\s+([A-Z]{2,}\s*\d+[A-Z]*))?/gi;
    const matches = pageText.matchAll(coursePattern);
    
    for (const match of matches) {
      if (match[1] && match[3]) { // Found both CC and UC course codes
        articulations.push({
          ccCourseCode: match[1].trim(),
          ccCourseName: match[2]?.trim() || "",
          ccUnits: "3",
          ucCourseCode: match[3].trim(),
          ucCourseName: match[3].trim(),
          ucUnits: "3",
        });
      }
    }
  }
  
  // Provide helpful error message
  if (articulations.length === 0) {
    console.error("\n❌ No articulations found.");
    
    // Check if tables exist but are empty
    if (tables.length > 0) {
      console.log(`\n⚠️  Found ${tables.length} table(s) on the page, but they appear to be empty.`);
      
      // Check what's actually in the tables
      console.log("\n🔍 Checking table contents...");
      tables.forEach((table, idx) => {
        const rows = table.querySelectorAll("tr");
        const dataRows = Array.from(rows).slice(1).filter(row => {
          const cells = row.querySelectorAll("td, th");
          const texts = Array.from(cells).map(cell => cell.textContent?.trim() || "");
          return texts.some(text => text.length > 0 && !text.match(/^[A-Z\s]+$/)); // Not just headers
        });
        
        console.log(`   Table ${idx + 1}: ${rows.length} rows total, ${dataRows.length} data rows`);
        
        if (dataRows.length > 0) {
          // Show sample of what's in the table
          const firstRow = dataRows[0];
          const cells = firstRow.querySelectorAll("td, th");
          const sample = Array.from(cells).slice(0, 4).map(cell => cell.textContent?.trim().substring(0, 30));
          console.log(`      Sample row: ${sample.join(" | ")}`);
        } else {
          console.log(`      ⚠️  This table appears to have no data rows (only headers or empty)`);
        }
      });
    }
    
    console.log("\n💡 Troubleshooting:");
    console.log("   1. Make sure you're on the actual articulation table page");
    console.log("   2. Wait for the page to fully load (Angular app needs time)");
    console.log("   3. Scroll down - tables might be below the fold");
    console.log("   4. Check if you need to select a major first");
    console.log("\n📋 Page Info:");
    console.log("   - URL:", window.location.href);
    console.log("   - Title:", document.title);
    console.log("   - Tables on page:", tables.length);
    
    if (pageText.length < 1000) {
      console.log("   ⚠️  Page seems very short - might not be fully loaded");
      console.log("   💡 Try waiting a few seconds and running the script again");
    }
    
    // Show sample of page content
    const sampleText = pageText.substring(0, 500);
    console.log("\n📄 Sample page content:");
    console.log(sampleText);
    
    // Check if we're on a multi-major page
    if (tables.length > 1) {
      console.log("\n💡 Multiple tables found on this page, but they appear empty.");
      console.log("   📝 To get data:");
      console.log("      1. Select a specific major/agreement from the dropdown");
      console.log("      2. Wait for the table to load with course data");
      console.log("      3. Make sure you can see course codes like 'MATH 1A' in the table");
      console.log("      4. Then run this script again");
    } else if (pageText.includes("Select") || pageText.includes("Choose") || pageText.includes("Major")) {
      console.log("\n💡 Major selection options detected.");
      console.log("   ⚠️  Tables are visible but appear to be empty.");
      console.log("   📝 To get data:");
      console.log("      1. Click on a major/agreement dropdown or selection option");
      console.log("      2. Select a specific major (e.g., 'Computer Science', 'Business', etc.)");
      console.log("      3. Wait 5-10 seconds for the articulation table to load");
      console.log("      4. Scroll down to see the table with course codes");
      console.log("      5. Make sure you can see actual course data (like 'MATH 1A', 'ENGL 1A')");
      console.log("      6. Then run this script again on that table page");
      
      // Try to help them find the selection dropdown
      const selects = document.querySelectorAll("select, [role='combobox'], button");
      if (selects.length > 0) {
        console.log(`\n   💡 Found ${selects.length} potential selection element(s) on the page.`);
        console.log("      Look for dropdown menus or buttons labeled 'Select Major', 'Agreement', etc.");
      }
    }
    
    // Check URL to see if we're on the right page
    const url = window.location.href;
    if (url.includes("view=agreement") && !url.includes("major")) {
      console.log("\n💡 Your URL suggests you should see an agreement table.");
      console.log("   Make sure the table has fully loaded (wait 5-10 seconds after page load).");
    }
    
    return;
  }
  
  // Group by major if available
  const byMajor = {};
  articulations.forEach(art => {
    const major = art.major || "General";
    if (!byMajor[major]) {
      byMajor[major] = [];
    }
    byMajor[major].push(art);
  });
  
  // Show summary
  if (Object.keys(byMajor).length > 1) {
    console.log("\n📊 Extracted by Major/Agreement:");
    Object.entries(byMajor).forEach(([major, arts]) => {
      console.log(`   - ${major}: ${arts.length} articulations`);
    });
  }
  
  // Remove duplicates (same course pair, regardless of major)
  const uniqueArticulations = [];
  const seen = new Set();
  for (const art of articulations) {
    const key = `${art.ccCourseCode}-${art.ucCourseCode}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueArticulations.push(art);
    }
  }
  
  console.log(`\n✅ Found ${uniqueArticulations.length} unique articulations (from ${articulations.length} total rows)`);
  
  // Show sample of extracted data
  if (uniqueArticulations.length > 0) {
    console.log("\n📊 Sample extracted data (first 3):");
    uniqueArticulations.slice(0, 3).forEach((art, idx) => {
      console.log(`   ${idx + 1}. ${art.ccCourseCode} → ${art.ucCourseCode}`);
      console.log(`      "${art.ccCourseName}" → "${art.ucCourseName}"`);
    });
    if (uniqueArticulations.length > 3) {
      console.log(`   ... and ${uniqueArticulations.length - 3} more`);
    }
  }
  
  // Use unique articulations
  articulations.length = 0;
  articulations.push(...uniqueArticulations);
  
  // Determine college and university codes from URL or page
  const urlParams = new URLSearchParams(window.location.search);
  
  // Try new URL format first (year=76&institution=58&agreement=79)
  const institutionId = urlParams.get("institution");
  const agreementId = urlParams.get("agreement");
  
  // Try old URL format (institution1=001286&institution2=001319)
  const institution1 = urlParams.get("institution1");
  const institution2 = urlParams.get("institution2");
  
  // Map new format institution IDs to our codes
  const newFormatMap = {
    // Community Colleges
    58: "BCC",  // Berkeley City College (from URL example)
    // TODO: Add more as discovered
  };
  
  // Map old format ASSIST codes to our codes
  const oldFormatMap = {
    // Community Colleges
    "001286": "BCC",
    "001287": "COA",
    "001288": "LANEY",
    "001289": "MERRITT",
    // UC Universities
    "001319": "UCB",
    "001312": "UCLA",
    "001320": "UCSD",
    "001313": "UCD",
    "001314": "UCSB",
    "001315": "UCI",
    "001316": "UCSC",
    "001317": "UCR",
    "001318": "UCM",
    // CSU Universities
    "001154": "SFSU",
    "001470": "SJSU",
    "001146": "CSUEB",
    "001145": "CSUMB",
    "001445": "SSU",
  };
  
  // Try to determine codes from URL and page content
  let ccCode = null;
  let uniCode = null;
  
  // Extract from page content first (most reliable)
  // pageText already declared above for diagnostics
  const pageTitle = document.title || "";
  
  // Map college names to codes
  const collegeNameMap = {
    "Berkeley City College": "BCC",
    "College of Alameda": "COA",
    "Laney College": "LANEY",
    "Merritt College": "MERRITT",
  };
  
  // Map university names to codes
  const universityNameMap = {
    "UC Berkeley": "UCB",
    "University of California, Berkeley": "UCB",
    "UCLA": "UCLA",
    "University of California, Los Angeles": "UCLA",
    "UC San Diego": "UCSD",
    "University of California, San Diego": "UCSD",
    "UC Davis": "UCD",
    "University of California, Davis": "UCD",
    "UC Santa Barbara": "UCSB",
    "University of California, Santa Barbara": "UCSB",
    "UC Irvine": "UCI",
    "University of California, Irvine": "UCI",
    "UC Santa Cruz": "UCSC",
    "University of California, Santa Cruz": "UCSC",
    "UC Riverside": "UCR",
    "University of California, Riverside": "UCR",
    "UC Merced": "UCM",
    "University of California, Merced": "UCM",
    "San Francisco State": "SFSU",
    "San Jose State": "SJSU",
    "Cal State East Bay": "CSUEB",
    "California State University, East Bay": "CSUEB",
    "Cal State Monterey Bay": "CSUMB",
    "California State University, Monterey Bay": "CSUMB",
  };
  
  // Try to extract from page content
  for (const [name, code] of Object.entries(collegeNameMap)) {
    if (pageText.includes(name) || pageTitle.includes(name)) {
      ccCode = code;
      break;
    }
  }
  
  for (const [name, code] of Object.entries(universityNameMap)) {
    if (pageText.includes(name) || pageTitle.includes(name)) {
      uniCode = code;
      break;
    }
  }
  
  // Fallback to URL parameters
  if (!ccCode) {
    if (institutionId) {
      // New URL format
      ccCode = newFormatMap[parseInt(institutionId)] || null;
    } else if (institution1) {
      // Old URL format
      ccCode = oldFormatMap[institution1] || null;
    }
  }
  
  if (!uniCode && institution2) {
    // Old URL format
    uniCode = oldFormatMap[institution2] || null;
  }
  
  // Final fallback to defaults if nothing found
  ccCode = ccCode || "BCC";
  uniCode = uniCode || "UCB";
  
  console.log(`📋 Detected: ${ccCode} → ${uniCode}`);
  if (institutionId) {
    console.log(`   URL Format: New (institution=${institutionId}, agreement=${agreementId})`);
  } else if (institution1) {
    console.log(`   URL Format: Old (institution1=${institution1}, institution2=${institution2})`);
  }
  
  // Generate CSV
  const header = "community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name\n";
  
  const csvRows = articulations.map(art => {
    // Handle courses with no articulation - leave equivalent fields empty
    const equivalentCode = art.ucCourseCode && art.ucCourseCode.trim() !== "" ? art.ucCourseCode : "";
    const equivalentName = art.ucCourseName && art.ucCourseName.trim() !== "" ? art.ucCourseName : "";
    
    return [
      ccCode,
      art.ccCourseCode || "",
      `"${(art.ccCourseName || "").replace(/"/g, '""')}"`,
      art.ccUnits || "3",
      uniCode,
      equivalentCode,
      `"${equivalentName.replace(/"/g, '""')}"`,
    ].join(",");
  });
  
  const csv = header + csvRows.join("\n");
  
  // Display results
  console.log("\n📋 CSV Data (copy this):");
  console.log("=".repeat(80));
  console.log(csv);
  console.log("=".repeat(80));
  
  // Create download link
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `articulations-${ccCode}-${uniCode}-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log("\n💾 CSV file downloaded!");
  console.log(`\n📥 Next: Import this file at /admin/articulations`);
  
  return csv;
})();

