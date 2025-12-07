/**
 * ASSIST.org Structure Diagnostic Script
 * 
 * Run this FIRST to analyze the page structure and identify
 * how the data is organized. This helps debug extraction issues.
 * 
 * Usage:
 * 1. Go to ASSIST.org articulation page
 * 2. Wait for page to fully load
 * 3. Open browser console (F12)
 * 4. Paste this script and press Enter
 * 5. Review the diagnostic output
 */

(function() {
  console.log("🔍 ASSIST.org Structure Diagnostic");
  console.log("=".repeat(80));
  
  const getText = (el) => el?.textContent?.trim() || "";
  
  // Check for tables
  const tables = document.querySelectorAll("table");
  console.log(`\n📊 HTML Tables: ${tables.length}`);
  
  if (tables.length > 0) {
    tables.forEach((table, idx) => {
      const rows = table.querySelectorAll("tr");
      console.log(`   Table ${idx + 1}: ${rows.length} rows`);
      if (rows.length > 0) {
        const firstRow = rows[0];
        const cells = firstRow.querySelectorAll("td, th");
        console.log(`      First row has ${cells.length} cells`);
      }
    });
  }
  
  // Check for div-based structures
  console.log(`\n📦 Div-Based Structures:`);
  
  // Role-based elements
  const roleRows = document.querySelectorAll("[role='row']");
  const roleCells = document.querySelectorAll("[role='cell']");
  console.log(`   [role='row']: ${roleRows.length}`);
  console.log(`   [role='cell']: ${roleCells.length}`);
  
  // Class-based patterns
  const classPatterns = [
    { pattern: "*[class*='row']", name: "Elements with 'row' in class" },
    { pattern: "*[class*='course']", name: "Elements with 'course' in class" },
    { pattern: "*[class*='articulation']", name: "Elements with 'articulation' in class" },
    { pattern: "*[class*='agreement']", name: "Elements with 'agreement' in class" },
    { pattern: "*[class*='group']", name: "Elements with 'group' in class" },
    { pattern: "*[class*='container']", name: "Elements with 'container' in class" },
    { pattern: "*[class*='item']", name: "Elements with 'item' in class" },
    { pattern: "*[class*='entry']", name: "Elements with 'entry' in class" },
  ];
  
  classPatterns.forEach(({ pattern, name }) => {
    try {
      const elements = document.querySelectorAll(pattern);
      if (elements.length > 0) {
        console.log(`   ${name}: ${elements.length}`);
        
        // Show sample classes
        if (elements.length > 0 && elements.length <= 5) {
          elements.forEach((el, idx) => {
            const classes = Array.from(el.classList).join(", ");
            const text = getText(el).substring(0, 50);
            console.log(`      ${idx + 1}. Classes: ${classes}`);
            console.log(`         Text: ${text}...`);
          });
        } else if (elements.length > 0) {
          // Show first 3 examples
          Array.from(elements).slice(0, 3).forEach((el, idx) => {
            const classes = Array.from(el.classList).join(", ");
            const text = getText(el).substring(0, 50);
            console.log(`      ${idx + 1}. Classes: ${classes}`);
            console.log(`         Text: ${text}...`);
          });
        }
      }
    } catch (e) {
      // Skip invalid selectors
    }
  });
  
  // Look for course codes in the page
  console.log(`\n📚 Course Code Detection:`);
  const pageText = document.body.textContent || "";
  const courseCodes = pageText.match(/\b([A-Z]{2,}\s*\d+[A-Z]*)\b/g);
  let uniqueCodes = [];
  
  if (courseCodes) {
    uniqueCodes = [...new Set(courseCodes)];
    console.log(`   Found ${uniqueCodes.length} unique course codes in page text`);
    console.log(`   Sample: ${uniqueCodes.slice(0, 10).join(", ")}`);
    
    // Find which elements contain course codes
    console.log(`\n   Elements containing course codes:`);
    uniqueCodes.slice(0, 5).forEach(code => {
      const elements = Array.from(document.querySelectorAll("*")).filter(el => {
        const text = getText(el);
        return text.includes(code) && text.length < 200; // Not the whole page
      });
      
      if (elements.length > 0) {
        const el = elements[0];
        const tag = el.tagName.toLowerCase();
        const classes = Array.from(el.classList).slice(0, 3).join(", ");
        const parentClasses = Array.from(el.parentElement?.classList || []).slice(0, 3).join(", ");
        console.log(`      "${code}" found in: <${tag} class="${classes}">`);
        console.log(`         Parent: <${el.parentElement?.tagName.toLowerCase()} class="${parentClasses}">`);
        console.log(`         Text: ${getText(el).substring(0, 100)}...`);
      }
    });
  } else {
    console.log(`   ⚠️  No course codes found in page text`);
  }
  
  // Check for data attributes
  console.log(`\n🏷️  Data Attributes:`);
  const dataAttrs = document.querySelectorAll("[data-course], [data-articulation], [data-agreement], [data-row]");
  console.log(`   Elements with data-* attributes: ${dataAttrs.length}`);
  if (dataAttrs.length > 0) {
    Array.from(dataAttrs).slice(0, 3).forEach((el, idx) => {
      const attrs = Array.from(el.attributes)
        .filter(attr => attr.name.startsWith("data-"))
        .map(attr => `${attr.name}="${attr.value}"`)
        .join(", ");
      console.log(`      ${idx + 1}. ${attrs}`);
    });
  }
  
  // Check Angular component structure
  console.log(`\n⚛️  Angular Component Structure:`);
  const appRoot = document.querySelector("app-root");
  if (appRoot) {
    console.log(`   ✅ app-root found`);
    console.log(`   Children: ${appRoot.children.length}`);
    
    // Look for Angular component tags
    const angularComponents = Array.from(document.querySelectorAll("*"))
      .filter(el => el.tagName.includes("-") && el.tagName !== "app-root")
      .map(el => el.tagName.toLowerCase())
      .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
      .slice(0, 10);
    
    if (angularComponents.length > 0) {
      console.log(`   Angular components found: ${angularComponents.join(", ")}`);
    }
  }
  
  // Summary and recommendations
  console.log(`\n💡 Recommendations:`);
  
  if (courseCodes && courseCodes.length > 0 && uniqueCodes.length > 0) {
    console.log(`   ✅ Course data IS on the page (found ${uniqueCodes.length} course codes)`);
    console.log(`   📝 Try running the extraction script now`);
  } else {
    console.log(`   ⚠️  No course codes detected - page might not be fully loaded`);
    console.log(`   💡 Try waiting 10-15 seconds and run this diagnostic again`);
  }
  
  if (tables.length === 0 && roleRows.length === 0) {
    console.log(`   📝 Page uses div-based structure (no HTML tables)`);
    console.log(`   ✅ Extraction script should handle this automatically`);
  }
  
  console.log(`\n` + "=".repeat(80));
  console.log(`✨ Diagnostic complete!`);
  console.log(`\nNext: Run the extraction script to try extracting the data.`);
  
})();

