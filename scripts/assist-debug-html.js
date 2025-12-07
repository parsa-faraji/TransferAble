/**
 * ASSIST.org HTML Structure Diagnostic Script
 * 
 * Run this in the browser console on an ASSIST.org articulation page
 * It will show the exact HTML structure so we can fix the parsing
 * 
 * Copy the output and share it with me!
 */

(function() {
  console.log("🔍 ASSIST.org HTML Structure Diagnostic");
  console.log("=".repeat(80));
  
  // Find all potential row containers
  const allRows = document.querySelectorAll(
    "tr, " +
    "[role='row'], " +
    "[class*='row'], [class*='Row'], " +
    "[class*='entry'], [class*='Entry'], " +
    "[class*='item'], [class*='Item'], " +
    "[class*='course'], [class*='Course'], " +
    "[class*='articulation'], [class*='Articulation']"
  );
  
  console.log(`\n📊 Found ${allRows.length} potential row elements`);
  
  // Get first 5 rows and show their structure
  const sampleRows = Array.from(allRows).slice(0, 5);
  
  sampleRows.forEach((row, idx) => {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`Row ${idx + 1}:`);
    console.log(`  Tag: ${row.tagName}`);
    console.log(`  Classes: ${row.className || 'none'}`);
    console.log(`  Role: ${row.getAttribute('role') || 'none'}`);
    
    // Get all children
    const children = Array.from(row.children);
    console.log(`  Children: ${children.length}`);
    
    children.forEach((child, childIdx) => {
      const text = child.textContent?.trim().substring(0, 100) || '';
      console.log(`    Child ${childIdx + 1}:`);
      console.log(`      Tag: ${child.tagName}`);
      console.log(`      Classes: ${child.className || 'none'}`);
      console.log(`      Role: ${child.getAttribute('role') || 'none'}`);
      console.log(`      Text preview: "${text}"`);
      
      // Get inner HTML structure (first 200 chars)
      const innerHTML = child.innerHTML?.substring(0, 200) || '';
      if (innerHTML) {
        console.log(`      Inner HTML preview: ${innerHTML}...`);
      }
    });
    
    // Show full HTML for first 2 rows
    if (idx < 2) {
      console.log(`  Full HTML (first 500 chars):`);
      console.log(row.outerHTML.substring(0, 500) + '...');
    }
  });
  
  // Check for tables
  const tables = document.querySelectorAll("table");
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📋 Tables found: ${tables.length}`);
  
  tables.forEach((table, idx) => {
    const rows = table.querySelectorAll("tr");
    console.log(`\nTable ${idx + 1}:`);
    console.log(`  Classes: ${table.className || 'none'}`);
    console.log(`  Rows: ${rows.length}`);
    
    if (rows.length > 0) {
      // Show first row structure
      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll("td, th");
      console.log(`  First row cells: ${cells.length}`);
      
      cells.forEach((cell, cellIdx) => {
        const text = cell.textContent?.trim().substring(0, 50) || '';
        console.log(`    Cell ${cellIdx + 1}: "${text}"`);
      });
      
      // Show HTML of first row
      if (idx === 0 && rows.length > 1) {
        console.log(`  First data row HTML (first 300 chars):`);
        console.log(rows[1].outerHTML.substring(0, 300) + '...');
      }
    }
  });
  
  // Check for div-based structures
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📦 Div-based structures:`);
  
  const divRows = document.querySelectorAll("[role='row']");
  console.log(`  [role='row']: ${divRows.length}`);
  
  if (divRows.length > 0) {
    const firstDivRow = divRows[0];
    const divCells = firstDivRow.querySelectorAll("[role='cell'], [role='gridcell']");
    console.log(`  First div row cells: ${divCells.length}`);
    
    divCells.forEach((cell, cellIdx) => {
      const text = cell.textContent?.trim().substring(0, 50) || '';
      console.log(`    Cell ${cellIdx + 1}: "${text}"`);
    });
    
    console.log(`  First div row HTML (first 300 chars):`);
    console.log(firstDivRow.outerHTML.substring(0, 300) + '...');
  }
  
  // Find course codes in the page
  console.log(`\n${"=".repeat(80)}`);
  console.log(`🔤 Course codes found in page text:`);
  
  const pageText = document.body.textContent || "";
  const courseCodeMatches = Array.from(pageText.matchAll(/\b([A-Z]{2,}\s*\d+[A-Z]*)\b/g));
  const uniqueCodes = [...new Set(courseCodeMatches.map(m => m[1]))].slice(0, 20);
  console.log(`  Found ${uniqueCodes.length} unique course codes`);
  console.log(`  Sample codes: ${uniqueCodes.join(", ")}`);
  
  // Try to find where these codes are in the DOM
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📍 Finding where course codes appear in DOM:`);
  
  uniqueCodes.slice(0, 3).forEach(code => {
    const codeRegex = new RegExp(code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const elements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && codeRegex.test(el.textContent) && 
      el.textContent.trim().length < 200
    );
    
    if (elements.length > 0) {
      const firstMatch = elements[0];
      console.log(`  "${code}" found in:`);
      console.log(`    Tag: ${firstMatch.tagName}`);
      console.log(`    Classes: ${firstMatch.className || 'none'}`);
      console.log(`    Parent: ${firstMatch.parentElement?.tagName} (${firstMatch.parentElement?.className || 'none'})`);
      console.log(`    Text: "${firstMatch.textContent?.trim().substring(0, 100)}"`);
    }
  });
  
  // Summary
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📝 SUMMARY - Please share this output:`);
  console.log(`  1. How many rows were found: ${allRows.length}`);
  console.log(`  2. How many tables: ${tables.length}`);
  console.log(`  3. How many div rows: ${divRows.length}`);
  console.log(`  4. Sample course codes: ${uniqueCodes.slice(0, 5).join(", ")}`);
  console.log(`\n💡 Copy the full console output above and share it!`);
  
  // Also create a simple HTML dump of first few rows
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📄 HTML DUMP (first 3 rows):`);
  sampleRows.slice(0, 3).forEach((row, idx) => {
    console.log(`\n--- Row ${idx + 1} HTML ---`);
    console.log(row.outerHTML);
  });
  
})();










