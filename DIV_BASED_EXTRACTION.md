# Div-Based Data Extraction Guide

## Understanding the Problem

ASSIST.org uses **div-based structures** instead of traditional HTML tables. This is common in modern Angular applications where components render data using nested `<div>` elements.

## What This Means

Instead of:
```html
<table>
  <tr>
    <td>MATH 1A</td>
    <td>Calculus I</td>
  </tr>
</table>
```

ASSIST.org uses:
```html
<div class="course-row">
  <div class="course-code">MATH 1A</div>
  <div class="course-name">Calculus I</div>
</div>
```

## Updated Script

The browser helper script has been updated to:

1. ✅ **Detect div-based structures** automatically
2. ✅ **Look for multiple patterns** (role attributes, class names, etc.)
3. ✅ **Extract from grouped/tagged divs** (as you mentioned)
4. ✅ **Handle Angular component structures**

## How It Works Now

The script now tries multiple strategies:

### Strategy 0: Div-Based Extraction
- Looks for elements with `[role='row']`
- Finds divs with classes containing "course", "articulation", "agreement"
- Searches for grouped/container divs
- Extracts course codes from div structures

### Strategy 1: HTML Tables
- Still checks for traditional `<table>` elements
- Fallback if tables are used

### Strategy 2: Pattern Matching
- Searches page text for course code patterns
- Last resort if structured elements aren't found

## Using the Updated Script

1. **Go to the ASSIST.org page** with course data visible
2. **Wait for page to fully load** (10-15 seconds)
3. **Run the script** in browser console
4. Check the diagnostics output - it will show:
   - How many div-based rows were found
   - How many course-related divs were found
   - Sample course codes detected in the page

## Debugging

If extraction still doesn't work, the script will show:

```
🔍 Page Diagnostics:
   - Div-based rows found: X
   - Course-related divs found: Y
   - Course codes found in page: Z
      Sample: MATH 1A, ENGL 1A, ...
```

This helps identify:
- ✅ If course data is on the page (course codes found)
- ✅ If div structures are detected
- ✅ What patterns to look for

## Next Steps

The script should now work better with ASSIST.org's div-based structure! 

Try running it again and check:
1. The diagnostic output for div-based structures
2. Whether course codes are detected in the page
3. The extraction results

If it still doesn't work, the diagnostics will show what's on the page so we can further improve the extraction logic.












