/**
 * Improved ASSIST.org Extraction - Better Parsing & Order Detection
 * 
 * Fixes:
 * - Correct column order detection (CC vs UC)
 * - Better course code detection (excludes roman numerals, units, etc.)
 * - Proper units extraction from course names
 * - Handles multiple equivalencies (one CC course → multiple UC courses)
 * - Cleaner course name extraction
 * - LLM-based validation for course code/name matching
 * 
 * Usage:
 * 1. Go to ASSIST.org articulation page
 * 2. Select major/agreement and wait for table to load
 * 3. Open browser console (F12)
 * 4. Paste this script and press Enter
 */

(async function() {
  console.log("🔍 Improved ASSIST.org Extraction");
  console.log("=".repeat(80));
  
  // ============================================================================
  // CONFIGURATION: LLM Validation
  // ============================================================================
  // LLM validation will check if course codes match course names and detect swaps
  const ENABLE_LLM_VALIDATION = true;
  const OPENAI_API_KEY = "process.env.OPENAI_API_KEY || "your_openai_api_key_here"";
  
  // ⚠️ SECURITY NOTE: This API key is embedded in the script. 
  // Don't share this script publicly or commit it to public repositories.
  // ============================================================================
  
  const getText = (el) => el?.textContent?.trim().replace(/\s+/g, " ") || "";
  
  // Improved course code detection - supports numbers OR roman numerals
  // Pattern: WORD + (NUMBER or ROMAN_NUMERAL) + optional letter suffix
  const isValidCourseCode = (text) => {
    if (!text || text.length > 25 || text.length < 3) return false;
    
    const trimmed = text.trim();
    
    // Pattern 1: Letters (2+) + Number + optional letter (e.g., "MATH 3A", "COMPSCI 61A")
    const pattern1 = /^[A-Z]{2,}\s*\d+[A-Z]*$/i;
    
    // Pattern 2: Letters (2+) + Roman Numeral (e.g., "MATH I", "MATH II", "MATH III", "MATH IV", "MATH V")
    // Roman numerals: I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII, etc.
    const pattern2 = /^[A-Z]{2,}\s*(I{1,3}|IV|VI{0,3}|IX|X{1,3}|XI{0,3}|XII{0,3})$/i;
    
    if (!pattern1.test(trimmed) && !pattern2.test(trimmed)) return false;
    
    // Exclude common false positives
    const lower = trimmed.toLowerCase();
    if (lower === "units" || lower === "unit" || lower.match(/^\d+$/)) return false;
    
    // Exclude standalone roman numerals (without prefix)
    if (/^(I{1,3}|IV|V|VI{0,3}|IX|X)$/i.test(trimmed)) return false;
    
    // Exclude things that are just numbers with letters at end (like "4.00units")
    if (/^\d+\.?\d*[a-z]*$/i.test(trimmed)) return false;
    
    return true;
  };
  
  // Extract course code from text - supports numbers and roman numerals
  const extractCourseCodes = (text, strict = true) => {
    // Pattern 1: Standard codes with numbers (MATH 3A, COMPSCI 61A)
    const matches1 = Array.from(text.matchAll(/\b([A-Z]{2,}\s*\d+[A-Z]*)\b/g));
    
    // Pattern 2: Codes with roman numerals (MATH I, MATH II, MATH III, MATH IV, MATH V)
    const matches2 = Array.from(text.matchAll(/\b([A-Z]{2,}\s*(?:I{1,3}|IV|VI{0,3}|IX|X|XI{0,3}|XII{0,3}))\b/g));
    
    // Combine and deduplicate
    const allMatches = [...matches1, ...matches2];
    const codes = allMatches.map(m => m[1].trim());
    const uniqueCodes = [...new Set(codes)];
    
    if (strict) {
      return uniqueCodes.filter(code => isValidCourseCode(code));
    } else {
      // Less strict: just filter out obvious non-codes
      return uniqueCodes.filter(code => {
        if (!code || code.length > 25 || code.length < 3) return false;
        const lower = code.toLowerCase();
        // Exclude obvious non-codes
        if (lower === "units" || lower === "unit") return false;
        if (/^\d+$/i.test(code)) return false; // Pure numbers
        // Allow codes with roman numerals
        return true;
      });
    }
  };
  
  // Extract units from text (looks for patterns like "4.00units", "3 units", "4units")
  const extractUnits = (text) => {
    // Match patterns like "4.00units", "3 units", "4units"
    const unitMatch = text.match(/(\d+\.?\d*)\s*unit/i);
    if (unitMatch) return unitMatch[1];
    
    // Try to find standalone number that might be units
    const standaloneMatch = text.match(/\b(\d+)\s*$/);
    if (standaloneMatch) {
      const num = parseInt(standaloneMatch[1]);
      if (num >= 1 && num <= 10) return num.toString(); // Reasonable unit range
    }
    
    return "3"; // Default
  };
  
  // Detect AND vs OR relationship for multiple course equivalencies
  const detectRelationshipType = (text, numCourses) => {
    if (numCourses <= 1) return null; // No relationship for single course
    
    const lower = text.toLowerCase();
    
    // AND indicators: "and", "plus", "both", "all", "together", "combined", "with"
    // Also look for patterns like "MATH 3A and MATH 3B" (explicit "and" between courses)
    const andPatterns = [
      /\band\b/, // Explicit "and"
      /\bplus\b/,
      /\bboth\b/,
      /\ball\b/,
      /\btogether\b/,
      /\bcombined\b/,
      /\bwith\b/,
      /\bplus\s+the\b/,
      /\band\s+the\b/,
      /,\s*and\s+/, // Comma followed by "and"
    ];
    
    // OR indicators: "or", "either", "one of", "any of", "/" (slash), comma-separated
    const orPatterns = [
      /\bor\b/, // Explicit "or"
      /\beither\b/,
      /\bone\s+of\b/,
      /\bany\s+of\b/,
      /\b\/\b/, // Slash often means "or"
      /,\s*or\s+/, // Comma followed by "or"
    ];
    
    // Check for explicit AND patterns first (more specific)
    const hasAnd = andPatterns.some(pattern => pattern.test(lower));
    if (hasAnd) {
      // Double-check: if it says "or" too, the last one wins
      const hasOr = orPatterns.some(pattern => pattern.test(lower));
      if (hasOr) {
        // If both present, check which comes last or is more prominent
        const lastAnd = Math.max(...andPatterns.map(p => {
          const match = lower.match(p);
          return match ? match.index : -1;
        }).filter(i => i >= 0));
        const lastOr = Math.max(...orPatterns.map(p => {
          const match = lower.match(p);
          return match ? match.index : -1;
        }).filter(i => i >= 0));
        
        // Use the one that appears later (more specific)
        return lastOr > lastAnd ? "OR" : "AND";
      }
      return "AND";
    }
    
    // Check for OR patterns
    const hasOr = orPatterns.some(pattern => pattern.test(lower));
    if (hasOr) return "OR";
    
    // If multiple courses separated by comma but no explicit "and"/"or"
    // Check if it's a list format - comma-separated usually means OR
    if (numCourses > 1 && /,/.test(text)) {
      // Comma-separated list without "and" usually means OR
      return "OR";
    }
    
    // Default: if multiple courses but no clear indicator, assume OR
    // (most common case: "MATH 3A or MATH 3B")
    return "OR";
  };
  
  // Validate course name - reject nonsensical names (MORE AGGRESSIVE)
  const isValidCourseName = (name) => {
    if (!name || name.trim().length === 0) return false;
    
    const trimmed = name.trim();
    
    // Reject if it's mostly punctuation or special characters
    const punctuationOnly = /^[^\w\s]+$/.test(trimmed);
    if (punctuationOnly) return false;
    
    // Reject if it's too short (less than 3 characters of actual text)
    const textOnly = trimmed.replace(/[^\w\s]/g, "");
    if (textOnly.length < 3) return false;
    
    // Reject if it's just numbers and punctuation
    if (/^[\d\s\.,;:!?\-_]+$/.test(trimmed)) return false;
    
    // Reject if it's just common separators
    if (/^[\s\-\.,;:]+$/.test(trimmed)) return false;
    
    // Reject if it's just "and", "or", "plus", etc. (relationship words without context)
    const relationshipWords = /^(and|or|plus|with|the|a|an|to|from|of|no|course|articulated|equivalent)$/i;
    if (relationshipWords.test(trimmed)) return false;
    
    // Reject if it contains mostly punctuation (more than 50% punctuation)
    const punctuationCount = (trimmed.match(/[^\w\s]/g) || []).length;
    if (punctuationCount > trimmed.length * 0.5) return false;
    
    // Must have at least one letter
    if (!/[a-zA-Z]/.test(trimmed)) return false;
    
    // Reject if it's just repeated characters (e.g., "---", "...", "   ")
    if (/^(.)\1{2,}$/.test(trimmed.replace(/\s/g, ""))) return false;
    
    // Must have at least one word with 3+ letters (actual meaningful word)
    const words = trimmed.split(/\s+/).filter(w => w.length >= 3);
    if (words.length === 0) return false;
    
    // Check if any word is actually meaningful (has letters, not just numbers/punctuation)
    const hasMeaningfulWord = words.some(word => /[a-zA-Z]{3,}/.test(word));
    if (!hasMeaningfulWord) return false;
    
    return true;
  };
  
  // Clean course name - remove units, course codes, and repeated information
  const cleanCourseName = (text, courseCode) => {
    if (!text) return "";
    
    let cleaned = text.trim();
    
    // Remove the course code (case-insensitive, handle variations)
    if (courseCode) {
      const codePattern = new RegExp(courseCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleaned = cleaned.replace(codePattern, "").trim();
    }
    
    // Remove unit patterns (4.00units, 3 units, etc.)
    cleaned = cleaned.replace(/\d+\.?\d*\s*unit/gi, "").trim();
    
    // Remove trailing numbers that might be units
    cleaned = cleaned.replace(/\s+\d+\.?\d*\s*$/, "").trim();
    
    // Remove any other course codes that might be in the name
    const allCodes = extractCourseCodes(cleaned, false);
    allCodes.forEach(code => {
      const codeRegex = new RegExp(code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleaned = cleaned.replace(codeRegex, "").trim();
    });
    
    // Remove common repeated phrases
    const repeatedPhrases = [
      /^course\s*name\s*:?/i,
      /^name\s*:?/i,
      /^title\s*:?/i,
      /^description\s*:?/i,
    ];
    repeatedPhrases.forEach(phrase => {
      cleaned = cleaned.replace(phrase, "").trim();
    });
    
    // Remove extra whitespace and normalize
    cleaned = cleaned.replace(/\s+/g, " ").trim();
    
    // Remove leading/trailing punctuation and separators
    cleaned = cleaned.replace(/^[:\-,\s;.]+|[:\-,\s;.]+$/g, "").trim();
    
    // If after cleaning it's mostly punctuation, return empty
    if (!isValidCourseName(cleaned)) {
      return "";
    }
    
    // Take first reasonable chunk (before multiple course codes or long descriptions)
    const parts = cleaned.split(/\s+/);
    let result = [];
    let seenWords = new Set();
    
    for (let part of parts) {
      // Stop if we hit another course code pattern
      if (isValidCourseCode(part)) break;
      
      // Skip punctuation-only parts
      if (/^[^\w]+$/.test(part)) continue;
      
      // Skip if we've seen this word already (avoid repetition)
      const lowerPart = part.toLowerCase();
      if (seenWords.has(lowerPart) && result.length > 2) {
        // Allow some repetition if it's early in the name
        continue;
      }
      seenWords.add(lowerPart);
      
      // Stop if we hit standalone roman numeral that's not part of name
      if (/^(I{1,3}|IV|V|VI{0,3}|IX|X)$/i.test(part)) {
        // Might be part of course name (like "Calculus III"), continue if we have context
        if (result.length > 0) {
          result.push(part);
          continue;
        }
        break;
      }
      
      result.push(part);
      // Limit length to avoid overly long names
      if (result.length >= 15) break;
    }
    
    let finalName = result.join(" ").trim();
    
    // Final cleanup: remove leading/trailing punctuation
    finalName = finalName.replace(/^[:\-,\s;.]+|[:\-,\s;.]+$/g, "").trim();
    
    // Validate again after all cleaning
    if (!isValidCourseName(finalName)) {
      return "";
    }
    
    return finalName.substring(0, 150);
  };
  
  const articulations = [];
  
  // Find column structure from table headers
  // NOTE: On ASSIST.org, BCC (Community College) is typically on the RIGHT side
  // and UC Berkeley is on the LEFT side
  const findColumnStructure = () => {
    const headers = document.querySelectorAll("th, [role='columnheader'], [class*='header']");
    const headerTexts = Array.from(headers).map(h => getText(h).toLowerCase());
    
    // Find which column is which
    let ccColumnIndex = -1;
    let ucColumnIndex = -1;
    
    headerTexts.forEach((text, idx) => {
      if (text.includes("community") || text.includes("college") || text.includes("sending") || 
          text.includes("bcc") || text.includes("peralta") || text.includes("berkeley city")) {
        ccColumnIndex = idx;
      }
      if (text.includes("university") || text.includes("receiving") || 
          text.includes("berkeley") || text.includes("uc ") || text === "ucb") {
        // Make sure it's not BCC (Berkeley City College)
        if (!text.includes("city college") && !text.includes("community")) {
          ucColumnIndex = idx;
        }
      }
    });
    
    // If we couldn't detect from headers, use position-based logic:
    // Rightmost column (higher index) = CC, Leftmost = UC
    if (ccColumnIndex === -1 || ucColumnIndex === -1) {
      if (headerTexts.length >= 2) {
        // Assume leftmost is UC, rightmost is CC
        if (ucColumnIndex === -1) ucColumnIndex = 0;
        if (ccColumnIndex === -1) ccColumnIndex = headerTexts.length - 1;
      }
    }
    
    return { ccColumnIndex, ucColumnIndex, headers: headerTexts };
  };
  
  const columnStructure = findColumnStructure();
  console.log(`\n📋 Column Structure:`, columnStructure);
  if (columnStructure.ccColumnIndex !== -1 && columnStructure.ucColumnIndex !== -1) {
    console.log(`   Detected: Column ${columnStructure.ucColumnIndex} = UC, Column ${columnStructure.ccColumnIndex} = CC`);
    if (columnStructure.ccColumnIndex > columnStructure.ucColumnIndex) {
      console.log(`   ✅ Order looks correct: UC on left (${columnStructure.ucColumnIndex}), CC on right (${columnStructure.ccColumnIndex})`);
    } else {
      console.log(`   ⚠️  Order might be reversed: CC on left (${columnStructure.ccColumnIndex}), UC on right (${columnStructure.ucColumnIndex})`);
    }
  }
  
  // Strategy: Extract from ASSIST.org structure
  // Based on actual HTML: div.articRow contains the row
  // div.rowReceiving = UC side, div.rowSending = CC side
  console.log("\n📊 Extracting from ASSIST.org structure...");
  
  // Primary strategy: Look for articRow divs (the actual articulation rows)
  let allRows = document.querySelectorAll("div.articRow, [class*='articRow'], [class*='ArticRow']");
  
  console.log(`   Found ${allRows.length} articulation rows (div.articRow)`);
  
  // Fallback: If no articRow found, try other row patterns
  if (allRows.length === 0) {
    console.log(`   Trying fallback selectors...`);
    allRows = document.querySelectorAll(
      "tr, " +
      "div[class*='row'], " +
      "[role='row'], " +
      "[class*='entry'], [class*='Entry'], " +
      "[class*='item'], [class*='Item']"
    );
    console.log(`   Fallback found ${allRows.length} potential rows`);
  }
  
  // Diagnostic: Show what we found
  if (allRows.length === 0) {
    console.log(`   ⚠️  No rows found with standard selectors!`);
    console.log(`   Checking page structure...`);
    
    // Try to find ANY structured data
    const tables = document.querySelectorAll("table");
    const divs = document.querySelectorAll("div");
    console.log(`   - Tables found: ${tables.length}`);
    console.log(`   - Divs found: ${divs.length}`);
    
    // Look for elements with course codes
    const allCourseCodes = Array.from(document.body.textContent.matchAll(/\b([A-Z]{2,}\s*\d+[A-Z]*)\b/g))
      .map(m => m[1])
      .filter(code => code.length < 20);
    const uniqueCodes = [...new Set(allCourseCodes)];
    console.log(`   - Course codes in page text: ${uniqueCodes.length}`);
    if (uniqueCodes.length > 0) {
      console.log(`   - Sample codes: ${uniqueCodes.slice(0, 5).join(", ")}`);
    }
  }
  
  // Determine column order - check first data row
  let detectedOrder = null; // null = unknown, true = UC first, false = CC first
  
  allRows.forEach((row, rowIndex) => {
    // ASSIST.org structure: div.articRow contains div.rowReceiving and div.rowSending
    // rowReceiving = UC side, rowSending = CC side
    const rowReceiving = row.querySelector("div.rowReceiving, [class*='rowReceiving'], [class*='RowReceiving']");
    const rowSending = row.querySelector("div.rowSending, [class*='rowSending'], [class*='RowSending']");
    
    let ucText = "";
    let ccText = "";
    let ucCellIdx = -1;
    let ccCellIdx = -1;
    
    // Try ASSIST.org specific structure first
    if (rowReceiving && rowSending) {
      ucText = getText(rowReceiving);
      ccText = getText(rowSending);
      ucCellIdx = 0; // UC is first (left side)
      ccCellIdx = 1; // CC is second (right side)
      
      if (rowIndex < 3) {
        console.log(`   Row ${rowIndex + 1}: Using ASSIST.org structure (rowReceiving/rowSending)`);
        console.log(`      UC text preview: ${ucText.substring(0, 50)}`);
        console.log(`      CC text preview: ${ccText.substring(0, 50)}`);
      }
    } else {
      // Fallback to generic cell structure
      let cells = row.querySelectorAll("td, th, [role='cell'], [role='gridcell']");
      
      // If no cells found with standard selectors, try child elements
      if (cells.length < 2) {
        // Try direct children as cells (for div-based structures)
        const children = Array.from(row.children);
        if (children.length >= 2) {
          cells = children;
        }
      }
      
      if (cells.length < 2) return;
      
      const cellTexts = Array.from(cells).map(c => getText(c));
      
      // Use column structure to determine which cell is which
      if (columnStructure.ccColumnIndex !== -1 && columnStructure.ucColumnIndex !== -1) {
        ucCellIdx = columnStructure.ucColumnIndex;
        ccCellIdx = columnStructure.ccColumnIndex;
        ucText = cellTexts[ucCellIdx] || "";
        ccText = cellTexts[ccCellIdx] || "";
      } else {
        // Default: assume left = UC, right = CC
        ucCellIdx = 0;
        ccCellIdx = cellTexts.length - 1;
        ucText = cellTexts[ucCellIdx] || "";
        ccText = cellTexts[ccCellIdx] || "";
      }
    }
    
    // Skip header row (check if it looks like a header)
    if (rowIndex === 0) {
      const combinedText = (ucText + " " + ccText).toLowerCase();
      if (combinedText.includes("university") || combinedText.includes("college") || 
          combinedText.includes("receiving") || combinedText.includes("sending")) {
        // This is likely a header row
        if (combinedText.includes("university") || combinedText.includes("receiving")) {
          const hasUC = combinedText.includes("university") || combinedText.includes("berkeley");
          const hasCC = combinedText.includes("college") || combinedText.includes("sending");
          if (hasUC && hasCC) {
            detectedOrder = ucText.toLowerCase().includes("university") || ucText.toLowerCase().includes("receiving");
            console.log(`   📍 Detected column order from headers: ${detectedOrder ? 'UC first' : 'CC first'}`);
          }
        }
        return; // Skip header row
      }
    }
    
    // Extract course codes from UC and CC texts
    const ccCodes = extractCourseCodes(ccText);
    let ucCodes = extractCourseCodes(ucText);
    
    // Check if CC side says "no course articulated" (UC course with no BCC equivalent)
    const ccLower = ccText.toLowerCase();
    const ccHasNoArticulation = ccLower.includes("no course articulated") || 
                                 ccLower.includes("no articulation") || 
                                 ccLower.includes("no equivalent") ||
                                 (ccLower.trim() === "" && ucCodes.length > 0);
    
    // Check if UC side says "no articulation" (BCC course with no UC equivalent)
    const ucLower = ucText.toLowerCase();
    const ucHasNoArticulation = ucLower.includes("no articulation") || 
                                 ucLower.includes("no equivalent") ||
                                 ucLower === "n/a" ||
                                 ucLower === "none" ||
                                 (ucLower.trim() === "" && ccCodes.length > 0);
    
    // Handle case: UC course with no BCC equivalent (UC codes exist, CC says "no course articulated")
    if (ucCodes.length > 0 && ccHasNoArticulation && ccCodes.length === 0) {
      // This is a UC course with no BCC equivalent
      ucCodes.forEach(ucCode => {
        const ucName = cleanCourseName(ucText, ucCode);
        const ucUnits = extractUnits(ucText);
        
        // Create entry with UC course but empty CC fields
        articulations.push({
          ccCourseCode: "",
          ccCourseName: "",
          ccUnits: "",
          ucCourseCode: ucCode,
          ucCourseName: ucName,
          ucUnits: ucUnits,
        });
      });
      return; // Skip to next row
    }
    
    // Handle case: BCC course with no UC equivalent (CC codes exist, UC says "no articulation")
    if (ccCodes.length > 0 && ucHasNoArticulation) {
      ucCodes = []; // Clear UC codes
    }
    
    // Create articulation entries for normal cases (BCC → UC)
    if (ccCodes.length > 0) {
      ccCodes.forEach(ccCode => {
        const ccName = cleanCourseName(ccText, ccCode);
        const ccUnits = extractUnits(ccText);
        
        if (ucCodes.length === 0) {
          // No articulation - create entry with empty equivalent
          articulations.push({
            ccCourseCode: ccCode,
            ccCourseName: ccName,
            ccUnits: ccUnits,
            ucCourseCode: "",
            ucCourseName: "",
            ucUnits: "",
          });
        } else {
          // Has articulation(s) - detect AND vs OR relationship
          // Check the text for indicators of AND (both required) vs OR (either one)
          const relationshipType = detectRelationshipType(ucText, ucCodes.length);
          
          if (ucCodes.length > 1 && relationshipType) {
            if (rowIndex < 5) {
              console.log(`   Row ${rowIndex + 1}: Detected ${relationshipType} relationship for ${ucCodes.length} UC courses`);
            }
          }
          
          // Create entries with relationship type
          ucCodes.forEach((ucCode, idx) => {
            let ucName = cleanCourseName(ucText, ucCode);
            const ucUnits = extractUnits(ucText);
            
            // Validate UC course name
            if (!isValidCourseName(ucName) && ucName !== "") {
              if (rowIndex < 5) {
                console.warn(`   Row ${rowIndex + 1}: UC course "${ucCode}" has invalid name: "${ucName}"`);
              }
              // Try fallback
              const fallbackName = ucText.replace(ucCode, "").trim().substring(0, 100);
              if (isValidCourseName(fallbackName)) {
                ucName = fallbackName;
              } else {
                ucName = ""; // Allow empty if we can't extract valid name
              }
            }
            
            // Check if this pairing already exists
            const exists = articulations.some(a => 
              a.ccCourseCode === ccCode && a.ucCourseCode === ucCode
            );
            
            if (!exists) {
              articulations.push({
                ccCourseCode: ccCode,
                ccCourseName: ccName || "",
                ccUnits: ccUnits,
                ucCourseCode: ucCode,
                ucCourseName: ucName || "",
                ucUnits: ucUnits,
                relationshipType: relationshipType, // "AND", "OR", or null
                groupIndex: ucCodes.length > 1 ? idx : null, // Index in the group
                groupSize: ucCodes.length > 1 ? ucCodes.length : null, // Total courses in group
              });
            }
          });
        }
      });
    }
  });
  
  console.log(`\n✅ Extracted ${articulations.length} articulation entries from table structure`);
  
  // Fallback Strategy: If no entries found, try extracting from entire row text
  if (articulations.length === 0) {
    console.log("\n📊 Fallback Strategy: Extracting from row text content (less strict)...");
    
    allRows.forEach((row, rowIndex) => {
      // Skip header rows
      if (rowIndex === 0) return;
      
      const rowText = getText(row);
      if (!rowText || rowText.length < 10) return;
      
      // Extract all course codes from the row - use less strict validation
      const codes = extractCourseCodes(rowText, false); // Less strict
      
      if (rowIndex < 3) {
        console.log(`   Row ${rowIndex + 1}: Found ${codes.length} codes - ${codes.slice(0, 3).join(", ")}`);
      }
      
      if (codes.length >= 1) {
        // Try to find pairs or single courses
        const ccCode = codes[0];
        const ucCode = codes.length >= 2 ? codes[1] : null;
        
        // Clean course name from row text
        let ccName = rowText;
        codes.forEach(code => {
          ccName = ccName.replace(code, "").trim();
        });
        ccName = cleanCourseName(ccName, "");
        const ccUnits = extractUnits(rowText);
        
        if (ucCode) {
          // Has articulation
          const ucName = cleanCourseName(rowText, ucCode);
          const ucUnits = extractUnits(rowText);
          
          articulations.push({
            ccCourseCode: ccCode,
            ccCourseName: ccName,
            ccUnits: ccUnits,
            ucCourseCode: ucCode,
            ucCourseName: ucName,
            ucUnits: ucUnits,
          });
        } else {
          // No articulation - check if row indicates this
          const rowLower = rowText.toLowerCase();
          if (rowLower.includes("no articulation") || 
              rowLower.includes("no equivalent") ||
              rowLower.trim() === "") {
            articulations.push({
              ccCourseCode: ccCode,
              ccCourseName: ccName,
              ccUnits: ccUnits,
              ucCourseCode: "",
              ucCourseName: "",
              ucUnits: "",
            });
          }
        }
      }
    });
    
    console.log(`   Fallback extracted ${articulations.length} entries`);
  }
  
  // Check if we still have zero entries
  if (articulations.length === 0) {
    console.log("\n⚠️  NO ENTRIES FOUND!");
    console.log("\n🔍 Troubleshooting:");
    console.log("   1. Make sure you're on the articulation table page");
    console.log("   2. Wait 15-20 seconds for the Angular app to fully load");
    console.log("   3. Make sure the table/rows are visible on the page");
    console.log("   4. Check the diagnostics above to see what was found");
    console.log("   5. Try running the diagnostic script first:");
    console.log("      scripts/assist-diagnose-structure.js");
    console.log("\n💡 The script looked for:");
    console.log("   - Table rows (tr elements)");
    console.log("   - Div-based rows ([role='row'], [class*='row'])");
    console.log("   - Course codes matching pattern: [LETTERS][NUMBER]");
    console.log("\n📋 Next steps:");
    console.log("   - Check the console output above for diagnostics");
    console.log("   - Look for 'Found X rows' and 'Sample codes' messages");
    console.log("   - Share the console output if you need help debugging");
    return null;
  }
  
  // Validate and clean articulations using LLM-based verification
  const validateWithLLM = async (articulations) => {
    // Heuristic validation is always enabled - uses pattern matching and rules
    
    const validated = [];
    const suspicious = [];
    
    // First pass: Simple heuristic validation
    articulations.forEach((art, idx) => {
      let isValid = true;
      const issues = [];
      
      // Check CC course code and name match
      if (art.ccCourseCode && art.ccCourseName) {
        const ccCodeNorm = art.ccCourseCode.trim().toUpperCase();
        const ccNameNorm = art.ccCourseName.trim().toUpperCase();
        
        // Extract subject from code (e.g., "MATH" from "MATH 3A")
        const ccSubject = ccCodeNorm.split(/\d/)[0].trim();
        
        // Check if subject appears in name (allowing some flexibility)
        if (!ccNameNorm.includes(ccSubject) && ccSubject.length >= 2) {
          // Might be okay if name is descriptive, but flag it
          if (ccSubject.length >= 4) { // Only flag for longer subjects
            issues.push(`CC subject "${ccSubject}" not clearly in name`);
          }
        }
        
        // Check if code appears in name (should not normally)
        if (ccNameNorm.includes(ccCodeNorm)) {
          // Code shouldn't be in name - might be extraction issue
          issues.push(`CC code "${ccCodeNorm}" appears in name (might be duplicate)`);
        }
        
        // Check for units in wrong place - AUTO-FIX
        if (art.ccCourseCode && /^\d+$/.test(art.ccCourseCode.trim())) {
          issues.push(`CC code looks like units: "${art.ccCourseCode}" - trying to extract correct code from name`);
          isValid = false;
          // Try to extract correct code from name
          const codesInName = extractCourseCodes(art.ccCourseName);
          if (codesInName.length > 0) {
            art.ccCourseCode = codesInName[0];
            issues.push(`   → Auto-corrected to: "${art.ccCourseCode}"`);
          }
        }
      }
      
      // Check UC course code and name match
      if (art.ucCourseCode && art.ucCourseName) {
        const ucCodeNorm = art.ucCourseCode.trim().toUpperCase();
        const ucNameNorm = art.ucCourseName.trim().toUpperCase();
        
        // Extract subject from code
        const ucSubject = ucCodeNorm.split(/\d/)[0].trim();
        
        // Check if subject appears in name
        if (!ucNameNorm.includes(ucSubject) && ucSubject.length >= 2) {
          if (ucSubject.length >= 4) {
            issues.push(`UC subject "${ucSubject}" not clearly in name`);
          }
        }
        
        // Check if code appears in name
        if (ucNameNorm.includes(ucCodeNorm)) {
          issues.push(`UC code "${ucCodeNorm}" appears in name (might be duplicate)`);
        }
        
        // Check for units in wrong place - AUTO-FIX
        if (art.ucCourseCode && /^\d+$/.test(art.ucCourseCode.trim())) {
          issues.push(`UC code looks like units: "${art.ucCourseCode}" - trying to extract correct code from name`);
          isValid = false;
          // Try to extract correct code from name
          const codesInName = extractCourseCodes(art.ucCourseName);
          if (codesInName.length > 0) {
            art.ucCourseCode = codesInName[0];
            issues.push(`   → Auto-corrected to: "${art.ucCourseCode}"`);
          }
        }
      }
      
      // Check if codes are swapped (BCC patterns in UC, UC patterns in CC) - AUTO-FIX
      if (art.ccCourseCode && art.ucCourseCode) {
        const ccCode = art.ccCourseCode.trim().toUpperCase();
        const ucCode = art.ucCourseCode.trim().toUpperCase();
        
        // BCC-specific codes shouldn't be in UC position - AUTO-SWAP
        const bccSpecific = /^(ATH|CON|NGIN)\s*\d+/i;
        if (bccSpecific.test(ucCode)) {
          issues.push(`BCC-specific code "${ucCode}" in UC position - AUTO-SWAPPING`);
          isValid = false;
          // Auto-swap
          [art.ccCourseCode, art.ucCourseCode] = [art.ucCourseCode, art.ccCourseCode];
          [art.ccCourseName, art.ucCourseName] = [art.ucCourseName, art.ccCourseName];
          [art.ccUnits, art.ucUnits] = [art.ucUnits, art.ccUnits];
          issues.push(`   → Swapped: CC="${art.ccCourseCode}", UC="${art.ucCourseCode}"`);
        }
        
        // UC Berkeley codes are usually simpler (MATH 51 vs MATH 3A)
        // MATH 3A (with letter after number) is more likely BCC
        // MATH 51 (number only) is more likely UC
        const ccHasLetterAfterNum = /[A-Z]+\s*\d+[A-Z]$/i.test(ccCode);
        const ucHasLetterAfterNum = /[A-Z]+\s*\d+[A-Z]$/i.test(ucCode);
        const ccIsNumberOnly = /[A-Z]+\s*\d+$/i.test(ccCode);
        const ucIsNumberOnly = /[A-Z]+\s*\d+$/i.test(ucCode);
        
        // If CC has letter after number but UC doesn't, might be swapped
        // (BCC often has letters like MATH 3A, UC often just MATH 51)
        if (ccHasLetterAfterNum && ucIsNumberOnly && 
            ccCode.split(/\d/)[0] === ucCode.split(/\d/)[0]) {
          // Same subject but different format - might be swapped
          issues.push(`Potential swap: CC="${ccCode}" (letter) vs UC="${ucCode}" (no letter) for same subject`);
        }
      }
      
      // If we auto-fixed issues, mark as valid
      if (issues.length > 0) {
        // Check if all issues were auto-fixed (they'll have "→ Auto-corrected" or "→ Swapped" messages)
        const autoFixed = issues.some(issue => issue.includes("→ Auto-corrected") || issue.includes("→ Swapped"));
        if (autoFixed && isValid) {
          // Was fixed and is now valid
          validated.push(art);
          // Keep one issue message to show what was fixed
          art._fixMessage = issues.find(i => i.includes("→")) || issues[0];
        } else {
          // Still has issues after attempts to fix
          suspicious.push({ ...art, issues, index: idx });
        }
      } else if (isValid) {
        validated.push(art);
      } else {
        suspicious.push({ ...art, issues, index: idx });
      }
    });
    
    // Report auto-fixed entries
    const autoFixed = validated.filter(a => a._fixMessage);
    if (autoFixed.length > 0) {
      console.log(`   🔧 Auto-fixed ${autoFixed.length} entries:`);
      autoFixed.slice(0, 3).forEach((fixed, idx) => {
        console.log(`      ${idx + 1}. ${fixed.ccCourseCode || '?'} → ${fixed.ucCourseCode || 'none'}`);
        console.log(`         ${fixed._fixMessage}`);
        delete fixed._fixMessage; // Clean up
      });
      if (autoFixed.length > 3) {
        console.log(`      ... and ${autoFixed.length - 3} more auto-fixed`);
      }
      // Clean up remaining fix messages
      validated.forEach(a => delete a._fixMessage);
    }
    
    // Report suspicious entries that couldn't be auto-fixed
    if (suspicious.length > 0) {
      console.log(`   ⚠️  Found ${suspicious.length} entries with potential issues (could not auto-fix):`);
      suspicious.slice(0, 5).forEach((sus, idx) => {
        console.log(`      ${idx + 1}. ${sus.ccCourseCode || '?'} → ${sus.ucCourseCode || 'none'}`);
        sus.issues.forEach(issue => {
          if (!issue.includes("→")) { // Don't show auto-fix messages for suspicious
            console.log(`         ⚠️  ${issue}`);
          }
        });
      });
      if (suspicious.length > 5) {
        console.log(`      ... and ${suspicious.length - 5} more`);
      }
      console.log(`   💡 Using LLM to validate and fix these...`);
    } else if (autoFixed.length === 0) {
      console.log(`   ✅ All entries passed heuristic validation`);
    }
    
    // LLM validation (if enabled) - will validate ALL entries for semantic relevance
    // Also validate suspicious entries for correctness
    if (ENABLE_LLM_VALIDATION && OPENAI_API_KEY) {
      // Validate ALL entries (not just suspicious) for semantic relevance
      const allEntriesToValidate = [...validated, ...suspicious];
      console.log(`   🤖 Using LLM to validate ${allEntriesToValidate.length} entries for semantic relevance...`);
      
      if (suspicious.length > 0) {
        console.log(`      (Including ${suspicious.length} suspicious entries for correctness check)`);
      }
      
      try {
        const validationPromises = allEntriesToValidate.map(async (entry) => {
          const sus = entry;
          // Skip LLM validation for entries with no articulation (one side is empty)
          if ((!sus.ccCourseCode || sus.ccCourseCode.trim() === "") || 
              (!sus.ucCourseCode || sus.ucCourseCode.trim() === "")) {
            // Entry with no articulation - always valid, return as-is
            return sus;
          }
          
          const prompt = `You are validating course articulation data extracted from ASSIST.org.

IMPORTANT: You must verify TWO things:
1. That course codes match their course names logically
2. That the two courses are SEMANTICALLY RELATED and make sense as equivalents

Community College Course:
- Code: "${sus.ccCourseCode}"
- Name: "${sus.ccCourseName}"
- Units: "${sus.ccUnits}"

University Course:
- Code: "${sus.ucCourseCode}"
- Name: "${sus.ucCourseName}"
- Units: "${sus.ucUnits}"

Issues detected by heuristics: ${(sus.issues || []).join("; ") || "none"}

CRITICAL: Check if these courses are semantically related. For example:
- ✅ GOOD: "MATH 3A" (Calculus) = "MATH 51" (Calculus) - SAME SUBJECT
- ✅ GOOD: "ENGL 1A" (Composition) = "ENGL R1A" (Composition) - SAME SUBJECT
- ❌ BAD: "AFRICAM 5A" (African American Studies) = "UGBA 10" (Business) - DIFFERENT SUBJECTS
- ❌ BAD: "HIST 7A" (History) = "MATH 1A" (Math) - DIFFERENT SUBJECTS

If the courses are NOT semantically related, set "valid": false and "coursesRelated": false.

Respond with ONLY a JSON object in this exact format:
{
  "valid": true/false,
  "coursesRelated": true/false,
  "ccCodeCorrect": true/false,
  "ccNameCorrect": true/false,
  "ccNameValid": true/false,
  "ucCodeCorrect": true/false,
  "ucNameCorrect": true/false,
  "ucNameValid": true/false,
  "needsSwap": true/false,
  "relationshipType": "AND" or "OR" or null,
  "correctedCCCode": "corrected code or null",
  "correctedCCName": "corrected name or null",
  "correctedUCCode": "corrected code or null",
  "correctedUCName": "corrected name or null",
  "explanation": "brief explanation of why valid/invalid, if courses are related, and relationship type"
}`;

          try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                max_tokens: 500
              })
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`API error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
              throw new Error("Invalid API response format");
            }
            
            const resultText = data.choices[0].message.content.trim();
            
            // Extract JSON from response
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                const result = JSON.parse(jsonMatch[0]);
                return { ...sus, llmResult: result };
              } catch (parseErr) {
                console.warn(`   ⚠️  Failed to parse LLM JSON for ${sus.ccCourseCode || '?'} → ${sus.ucCourseCode || 'none'}:`, parseErr.message);
                console.warn(`      Response: ${resultText.substring(0, 200)}`);
              }
            } else {
              console.warn(`   ⚠️  No JSON found in LLM response for ${sus.ccCourseCode || '?'} → ${sus.ucCourseCode || 'none'}`);
              console.warn(`      Response: ${resultText.substring(0, 200)}`);
            }
          } catch (err) {
            console.warn(`   ⚠️  LLM validation failed for ${sus.ccCourseCode || '?'} → ${sus.ucCourseCode || 'none'}:`, err.message);
            if (err.message.includes("401") || err.message.includes("Unauthorized")) {
              console.warn(`      ⚠️  API key may be invalid or expired`);
            }
          }
          
          // Return entry without LLM result if validation failed
          return { ...sus, llmResult: null, _llmError: true };
        });
        
        const llmValidated = await Promise.all(validationPromises);
        
        // Clear validated array and rebuild with LLM-validated entries
        const llmValidatedEntries = [];
        let llmFixedCount = 0;
        let llmRejectedCount = 0;
        
        llmValidated.forEach(item => {
          if (item.llmResult) {
            // Check if courses are related (if field exists)
            const coursesRelated = item.llmResult.coursesRelated !== false; // Default to true if not specified
            const ccNameValid = item.llmResult.ccNameValid !== false; // Default to true
            const ucNameValid = item.llmResult.ucNameValid !== false; // Default to true
            
            // For entries with no UC course (no articulation), always accept
            if (!item.ucCourseCode || item.ucCourseCode.trim() === "") {
              llmValidatedEntries.push(item);
              return;
            }
            
            // Check if names are valid
            if (!ccNameValid || !ucNameValid) {
              console.log(`   ❌ Rejected: ${item.ccCourseCode || '?'} → ${item.ucCourseCode || 'none'}`);
              console.log(`      Reason: Invalid course name${!ccNameValid ? ' (CC)' : ''}${!ucNameValid ? ' (UC)' : ''}`);
              llmRejectedCount++;
              return;
            }
            
            if (item.llmResult.valid && coursesRelated) {
              // Apply corrections if provided
              const corrected = { ...item };
              if (item.llmResult.correctedCCCode) corrected.ccCourseCode = item.llmResult.correctedCCCode;
              if (item.llmResult.correctedCCName) corrected.ccCourseName = item.llmResult.correctedCCName;
              if (item.llmResult.correctedUCCode) corrected.ucCourseCode = item.llmResult.correctedUCCode;
              if (item.llmResult.correctedUCName) corrected.ucCourseName = item.llmResult.correctedUCName;
              
              // Update relationship type if LLM detected it
              if (item.llmResult.relationshipType) {
                corrected.relationshipType = item.llmResult.relationshipType;
              }
              
              if (item.llmResult.needsSwap && item.ucCourseCode) {
                // Swap CC and UC
                [corrected.ccCourseCode, corrected.ucCourseCode] = [corrected.ucCourseCode, corrected.ccCourseCode];
                [corrected.ccCourseName, corrected.ucCourseName] = [corrected.ucCourseName, corrected.ccCourseName];
                [corrected.ccUnits, corrected.ucUnits] = [corrected.ucUnits, corrected.ccUnits];
              }
              
              llmValidatedEntries.push(corrected);
              llmFixedCount++;
            } else {
              // Invalid or unrelated courses - reject this articulation
              console.log(`   ❌ Rejected: ${item.ccCourseCode || '?'} → ${item.ucCourseCode || 'none'}`);
              if (item.llmResult.explanation) {
                console.log(`      Reason: ${item.llmResult.explanation}`);
              }
              if (!coursesRelated) {
                console.log(`      ⚠️  Courses are NOT semantically related - removing articulation`);
              }
              // Don't add to validated - this articulation is invalid
              llmRejectedCount++;
            }
          } else if (item._llmError) {
            // LLM validation failed - keep entry but mark as unvalidated
            console.warn(`   ⚠️  LLM validation failed for: ${item.ccCourseCode || '?'} → ${item.ucCourseCode || 'none'} - keeping but not validated`);
            delete item._llmError;
            llmValidatedEntries.push(item);
          } else {
            // No LLM result - this shouldn't happen, but keep entry anyway
            console.warn(`   ⚠️  No LLM result for: ${item.ccCourseCode || '?'} → ${item.ucCourseCode || 'none'} - keeping anyway`);
            llmValidatedEntries.push(item);
          }
        });
        
        // Replace validated array with LLM-validated entries
        validated.length = 0;
        validated.push(...llmValidatedEntries);
        
        if (llmFixedCount > 0) {
          console.log(`   ✅ LLM validated ${llmFixedCount} entries`);
        }
        if (llmRejectedCount > 0) {
          console.log(`   ❌ LLM rejected ${llmRejectedCount} invalid/unrelated articulations`);
        }
      } catch (err) {
        console.warn(`   ⚠️  LLM validation error:`, err.message);
        // Add all suspicious to validated anyway (better than losing data)
        validated.push(...suspicious.map(s => {
          delete s.issues;
          delete s.index;
          return s;
        }));
      }
    } else {
      // If LLM not enabled, keep suspicious entries but flag them
      if (suspicious.length > 0) {
        // Add suspicious entries to validated anyway (better than losing data)
        validated.push(...suspicious.map(s => {
          delete s.issues;
          delete s.index;
          return s;
        }));
      }
    }
    
    return validated;
  };
  
  // Run validation
  console.log(`\n🔍 Validating ${articulations.length} extracted entries...`);
  const validated = await validateWithLLM(articulations);
  console.log(`   ✅ Validated: ${validated.length} entries`);
  
  // Remove duplicates - ensure one row per CC course
  // If a CC course has multiple UC equivalents, keep only the first one
  const unique = [];
  const seenCCCodes = new Set();
  
  validated.forEach(art => {
    // Normalize CC code for comparison (case-insensitive, trim spaces)
    const ccCodeNorm = (art.ccCourseCode || "").trim().toUpperCase().replace(/\s+/g, " ");
    
    // Only add if we haven't seen this CC course code before
    // This ensures one row per CC course
    if (!seenCCCodes.has(ccCodeNorm)) {
      seenCCCodes.add(ccCodeNorm);
      unique.push(art);
    }
  });
  
  console.log(`   After deduplication: ${unique.length} unique CC courses (removed ${validated.length - unique.length} duplicate entries)`);
  
  // Show samples
  console.log("\n📊 Sample articulations:");
  unique.slice(0, 5).forEach((art, idx) => {
    if (art.ucCourseCode) {
      console.log(`   ${idx + 1}. ${art.ccCourseCode} (${art.ccUnits} units) → ${art.ucCourseCode} (${art.ucUnits} units)`);
    } else {
      console.log(`   ${idx + 1}. ${art.ccCourseCode} (${art.ccUnits} units) → [NO ARTICULATION]`);
    }
  });
  
  // Determine college and university codes
  const urlParams = new URLSearchParams(window.location.search);
  const institutionId = urlParams.get("institution");
  
  const codeMap = {
    58: "BCC", // Berkeley City College
  };
  
  let ccCode = codeMap[parseInt(institutionId)] || "BCC";
  let uniCode = "UCB"; // Default
  
  const pageText = document.body.textContent || "";
  const pageTextLower = pageText.toLowerCase();
  
  if (pageTextLower.includes("berkeley") && !pageTextLower.includes("city college")) {
    uniCode = "UCB";
  } else if (pageTextLower.includes("ucla")) {
    uniCode = "UCLA";
  } else if (pageTextLower.includes("uc san diego") || pageTextLower.includes("ucsd")) {
    uniCode = "UCSD";
  }
  
  console.log(`\n📋 Detected: ${ccCode} → ${uniCode}`);
  
  // Final verification: Swap if order is reversed
  // ASSIST.org layout: LEFT = UC Berkeley, RIGHT = BCC (Community College)
  // If we detected UC on right or CC on left, we need to swap
  console.log("\n🔄 Final order verification...");
  console.log(`   Column positions: UC=${columnStructure.ucColumnIndex}, CC=${columnStructure.ccColumnIndex}`);
  
  if (unique.length > 0 && unique[0].ccCourseCode && unique[0].ucCourseCode) {
    // Check if we need to swap based on detected order
    // On ASSIST.org: LEFT (lower index) = UC, RIGHT (higher index) = CC
    // If CC column index < UC column index, they're swapped
    const needsSwap = detectedOrder === true || 
                     (detectedOrder === null && 
                      columnStructure.ccColumnIndex !== -1 && 
                      columnStructure.ucColumnIndex !== -1 &&
                      columnStructure.ccColumnIndex < columnStructure.ucColumnIndex);
    
    // Check if codes are in wrong positions by analyzing patterns
    // UC Berkeley codes: MATH 3A, COMPSCI 61A, ECON 2, etc.
    // BCC codes: ATH 51, MATH 51, CON 1, etc. (often simpler)
    
    // Analyze multiple samples to be more confident
    // Expected format:
    // - BCC codes: Math 3A (has letter after number), ATH 51, CON 1, NGIN 7
    // - UC Berkeley codes: Math 51 (number only, no letter), MATH 3C, COMPSCI 61A
    const samples = unique.slice(0, Math.min(10, unique.length));
    let ucCodesInCCPosition = 0;
    let ccCodesInUCPosition = 0;
    
    // UC Berkeley course patterns - often just numbers (Math 51) - NO LETTER after number
    const ucBerkeleyPatterns = [
      /^MATH\s*\d+$/i,                  // MATH 51 (number only - UC Berkeley style)
      /^COMPSCI\s*\d+[A-Z]?$/i,        // COMPSCI 61A (but can have letter)
      /^ECON\s*\d+$/i,                  // ECON 2 (number only)
      /^PHYSICS\s*\d+[A-Z]?$/i,        // PHYSICS 7A
      /^CHEM\s*\d+[A-Z]?$/i,           // CHEM 1A
      /^DATA\s*[A-Z]?\d+$/i,           // DATA C8
      /^ENGL\s*[A-Z]?\d+$/i,           // ENGL R1A (but might have letter before)
    ];
    
    // BCC course patterns - often have letters AFTER number (Math 3A) or BCC-specific codes
    const bccPatterns = [
      /^ATH\s*\d+[A-Z]?$/i,            // ATH 51, ATH 3B (BCC-specific)
      /^CON\s*\d+[A-Z]?$/i,            // CON 1 (BCC-specific)
      /^NGIN\s*\d+[A-Z]?$/i,           // NGIN 7 (BCC-specific)
      /^MATH\s*\d+[A-Z]$/i,            // MATH 3A (has letter AFTER number - BCC style)
      /^ENGL\s*\d+[A-Z]$/i,            // ENGL 1A (has letter AFTER number - BCC style)
    ];
    
    samples.forEach(art => {
      if (art.ccCourseCode && art.ucCourseCode) {
        const ccCode = art.ccCourseCode.trim().toUpperCase();
        const ucCode = art.ucCourseCode.trim().toUpperCase();
        
        // Check if codes are in wrong positions
        // UC code in CC position: CC column has UC patterns
        const ccLooksLikeUC = ucBerkeleyPatterns.some(pattern => pattern.test(ccCode));
        // CC code in UC position: UC column has BCC patterns  
        const ucLooksLikeCC = bccPatterns.some(pattern => pattern.test(ucCode));
        
        if (ccLooksLikeUC) ucCodesInCCPosition++;
        if (ucLooksLikeCC) ccCodesInUCPosition++;
      }
    });
    
    const firstCC = unique[0].ccCourseCode?.trim().toUpperCase() || "";
    const firstUC = unique[0].ucCourseCode?.trim().toUpperCase() || "";
    
    // Specific pattern checks:
    // - If CC column has "MATH 51" (number only, no letter) → UC Berkeley pattern, WRONG position
    // - If CC column has "MATH 3A" (with letter after number) → BCC pattern, CORRECT position
    // - If UC column has "MATH 3A" (with letter) → BCC pattern, WRONG position
    // - If UC column has "ATH", "CON", "NGIN" → BCC-specific codes, WRONG position
    const ccHasUCPattern = /^MATH\s*\d+$/i.test(firstCC); // MATH 51 (no letter) in CC column = wrong
    const ucHasCCPattern = /^ATH\s*\d+|^CON\s*\d+|^NGIN\s*\d+/i.test(firstUC) || // BCC-specific codes in UC column = wrong
                          /^MATH\s*\d+[A-Z]$|^ENGL\s*\d+[A-Z]$/i.test(firstUC); // MATH 3A (with letter) in UC column = wrong
    
    // Decision logic:
    // - Swap if CC column has UC patterns (like MATH 51 - number only)
    // - Swap if UC column has BCC patterns (like MATH 3A - with letter, or ATH/CON/NGIN)
    // - Swap if we detect from headers that UC column comes first
    const shouldSwap = needsSwap || 
                       ucCodesInCCPosition > samples.length / 2 ||
                       (ucCodesInCCPosition > 0 && ucCodesInCCPosition > ccCodesInUCPosition) ||
                       ccHasUCPattern ||
                       ucHasCCPattern ||
                       (ucCodesInCCPosition > 0 && ccCodesInUCPosition === 0); // UC codes in CC position, but no CC codes in UC position
    
    console.log(`   Analysis:`);
    console.log(`      - ${ucCodesInCCPosition} UC codes in CC position`);
    console.log(`      - ${ccCodesInUCPosition} CC codes in UC position`);
    console.log(`      - CC column has UC pattern: ${ccHasUCPattern}`);
    console.log(`      - UC column has CC pattern: ${ucHasCCPattern}`);
    console.log(`   Sample: "${firstCC}" → "${firstUC}"`);
    
    if (shouldSwap) {
      console.log(`   ⚠️  Detected reversed order - swapping CC ↔ UC for all entries...`);
      console.log(`   Before: "${firstCC}" → "${firstUC}"`);
      
      // Swap ALL entries that have both codes (don't swap entries with empty fields)
      unique.forEach(art => {
        // Only swap if both CC and UC have codes (not empty)
        if (art.ccCourseCode && art.ccCourseCode.trim() !== "" && 
            art.ucCourseCode && art.ucCourseCode.trim() !== "") {
          // Swap CC and UC
          const tempCode = art.ccCourseCode;
          const tempName = art.ccCourseName;
          const tempUnits = art.ccUnits;
          
          art.ccCourseCode = art.ucCourseCode;
          art.ccCourseName = art.ucCourseName || "";
          art.ccUnits = art.ucUnits || "";
          
          art.ucCourseCode = tempCode;
          art.ucCourseName = tempName || "";
          art.ucUnits = tempUnits || "";
        }
        // If one side is empty (no articulation), don't swap - it's already correct
      });
      
      console.log(`   After: "${unique[0]?.ccCourseCode}" → "${unique[0]?.ucCourseCode}"`);
      console.log(`   ✅ Swap complete!`);
      
      // After swapping, remove duplicates again (swapping might create duplicates)
      // Ensure one row per CC course
      const afterSwapUnique = [];
      const afterSwapSeen = new Set();
      unique.forEach(art => {
        const ccNorm = (art.ccCourseCode || "").trim().toUpperCase().replace(/\s+/g, " ");
        
        // Only keep first occurrence of each CC course
        if (!afterSwapSeen.has(ccNorm)) {
          afterSwapSeen.add(ccNorm);
          afterSwapUnique.push(art);
        }
      });
      
      // Replace unique array with deduplicated version
      unique.length = 0;
      unique.push(...afterSwapUnique);
      
      console.log(`   After swap deduplication: ${unique.length} unique CC courses`);
    } else {
      console.log(`   ✅ Order appears correct`);
    }
  }
  
  // Generate CSV with relationship type
  const header = "community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name,relationship_type,group_index,group_size\n";
  
  const csvRows = unique.map(art => {
    const equivalentCode = art.ucCourseCode && art.ucCourseCode.trim() !== "" ? art.ucCourseCode : "";
    const equivalentName = art.ucCourseName && art.ucCourseName.trim() !== "" ? art.ucCourseName : "";
    
    // Relationship type: "AND" (both required), "OR" (either one), or empty (single course)
    const relationshipType = art.relationshipType || "";
    const groupIndex = art.groupIndex !== null && art.groupIndex !== undefined ? art.groupIndex : "";
    const groupSize = art.groupSize !== null && art.groupSize !== undefined ? art.groupSize : "";
    
    return [
      ccCode,
      art.ccCourseCode || "",
      `"${(art.ccCourseName || "").replace(/"/g, '""')}"`,
      art.ccUnits || "3",
      uniCode,
      equivalentCode,
      `"${equivalentName.replace(/"/g, '""')}"`,
      relationshipType,
      groupIndex,
      groupSize,
    ].join(",");
  });
  
  const csv = header + csvRows.join("\n");
  
  // Display summary
  const withArticulation = unique.filter(a => a.ucCourseCode);
  const andRelationships = unique.filter(a => a.relationshipType === "AND");
  const orRelationships = unique.filter(a => a.relationshipType === "OR");
  
  console.log("\n📋 CSV Summary:");
  console.log(`   Total rows: ${csvRows.length}`);
  console.log(`   With articulation: ${withArticulation.length}`);
  console.log(`   No articulation: ${unique.filter(a => !a.ucCourseCode).length}`);
  if (andRelationships.length > 0) {
    console.log(`   AND relationships (both required): ${andRelationships.length} groups`);
  }
  if (orRelationships.length > 0) {
    console.log(`   OR relationships (either one): ${orRelationships.length} groups`);
  }
  
  // Download
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
  console.log(`\n✨ Success! Extracted ${unique.length} articulation entries`);
  
  return csv;
})();
