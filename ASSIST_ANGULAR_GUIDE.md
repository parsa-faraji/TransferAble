# ASSIST.org Angular App - Complete Guide

## 🔍 Understanding the Problem

**ASSIST.org is an Angular application** that renders all content dynamically using JavaScript. This means:

- ✅ The HTML shell loads first: `<app-root></app-root>`
- ✅ Angular JavaScript bundles then load and execute
- ✅ Content (tables, articulations) is rendered **after** JavaScript runs
- ❌ Simple HTTP `fetch()` requests only get the empty shell
- ❌ Static HTML parsing will **never work**

### What You Get from Simple Fetch

```html
<!doctype html>
<html>
  <body>
    <app-root></app-root>  <!-- Empty! -->
    <script src="runtime.xxx.js"></script>
    <script src="main.xxx.js"></script>  <!-- Angular loads here -->
  </body>
</html>
```

No tables, no data - just an empty Angular component!

## ✅ Solutions (Ranked by Reliability)

### 1. Browser Console Script ⭐⭐⭐ (Most Reliable)

**Why it works**: Runs directly in the browser after Angular has fully loaded.

**Steps**:
1. Go to ASSIST.org manually: https://assist.org
2. Navigate to the articulation page you want
3. Wait for the table to fully load
4. Open browser console (F12 or Cmd+Option+I)
5. Copy and paste the script from `scripts/assist-browser-helper.js`
6. Press Enter
7. CSV file downloads automatically

**Pros**:
- ✅ Works 100% of the time
- ✅ No setup required
- ✅ Runs in the actual browser context
- ✅ Can see what you're extracting

**Cons**:
- ⚠️ Manual process (one page at a time)

### 2. Puppeteer Script ⭐⭐ (Automated but Needs Tuning)

**Why it works**: Puppeteer runs a real browser and executes JavaScript.

**Usage**:
```bash
npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB
```

**What it does**:
1. Launches headless Chrome browser
2. Navigates to ASSIST.org
3. Waits for Angular to load
4. Waits for content to render
5. Extracts table data
6. Saves as CSV

**Pros**:
- ✅ Automated
- ✅ Can batch multiple requests
- ✅ No manual steps

**Cons**:
- ⚠️ Requires Puppeteer installed
- ⚠️ May need adjustments if ASSIST.org changes
- ⚠️ Slower than browser console

**Current Status**: ⚠️ May need fine-tuning for wait times and selectors

### 3. Manual Collection + CSV Import ⭐ (Fallback)

**When to use**: If automated methods don't work or you need to verify data.

**Steps**:
1. Go to ASSIST.org manually
2. Copy/paste data into Excel/Google Sheets
3. Format as CSV matching the template
4. Upload via `/admin/articulations` interface

**CSV Format**:
```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition,3,UCB,ENGL R1A,Reading and Composition
```

## ❌ What Won't Work

### Simple HTTP Fetch
```typescript
const response = await fetch(url);
const html = await response.text();
// ❌ html only contains <app-root></app-root> - no data!
```

### Static HTML Parsing
```typescript
const tableMatch = html.match(/<table>...<\/table>/);
// ❌ No tables in the HTML - they're rendered by JavaScript!
```

## 🔧 Technical Details

### Why Angular Apps Need Special Handling

1. **Initial HTML** is just a shell
   ```html
   <app-root></app-root>
   ```

2. **JavaScript loads and executes**
   ```javascript
   // Angular runtime loads
   // Components initialize  
   // Data fetches happen
   // DOM gets populated
   ```

3. **Content appears** only after JavaScript runs

### What Puppeteer Does Differently

```typescript
// ❌ Simple fetch (doesn't work)
const html = await fetch(url).then(r => r.text());

// ✅ Puppeteer (works!)
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(url);
await page.waitForSelector('table');  // Wait for Angular to render
const data = await page.evaluate(() => {
  // Now we can access the rendered DOM!
  return document.querySelectorAll('table');
});
```

## 📝 Updated Code Approach

### Puppeteer Script Improvements

The updated `scripts/fetch-assist-puppeteer.ts` now:

1. **Waits for Angular to initialize**:
   ```typescript
   await page.waitForFunction(() => {
     const appRoot = document.querySelector("app-root");
     return appRoot && appRoot.children.length > 0;
   });
   ```

2. **Waits for content to render**:
   ```typescript
   await page.waitForTimeout(3000);  // Give Angular time
   await page.waitForSelector("table");
   ```

3. **Handles multiple table formats**:
   - Standard `<table>` elements
   - Angular Grid components
   - Various CSS classes

### API Route Limitations

The API route at `/api/admin/articulations/fetch` now:

- ✅ Detects Angular app shell
- ✅ Returns helpful error messages
- ✅ Suggests working alternatives
- ❌ Cannot extract data (by design - needs Puppeteer)

**Future Enhancement**: Could add a Puppeteer-based API endpoint, but it requires:
- Server-side browser automation
- More resources (memory, CPU)
- Longer request times

## 🧪 Testing

### Test 1: Verify Angular App Detection
```bash
npx tsx scripts/test-assist-simple.ts
```

This will show that simple fetch gets the Angular shell.

### Test 2: Test Puppeteer
```bash
npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB
```

This should extract data (may need tuning).

### Test 3: Browser Console (Manual)
1. Visit ASSIST.org
2. Run `scripts/assist-browser-helper.js` in console
3. Verify CSV download

## 💡 Recommendations

### For Development
- Use **browser console script** for quick testing
- Most reliable, immediate results

### For Production
- Use **Puppeteer script** for automation
- May need periodic maintenance if ASSIST.org changes
- Consider caching results

### For Bulk Import
- Combine browser console + CSV import
- Most reliable for large datasets
- Allows data verification

## 🚀 Quick Start

### Option 1: Browser Console (Recommended)
```bash
# 1. Open scripts/assist-browser-helper.js
# 2. Copy the script
# 3. Go to ASSIST.org articulation page
# 4. Paste in browser console
# 5. Download CSV
```

### Option 2: Puppeteer
```bash
npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB
```

### Option 3: Manual
```bash
# 1. Collect data manually from ASSIST.org
# 2. Format as CSV
# 3. Upload via /admin/articulations
```

## 📚 Related Files

- `scripts/assist-browser-helper.js` - Browser console script
- `scripts/fetch-assist-puppeteer.ts` - Puppeteer automation
- `app/api/admin/articulations/fetch/route.ts` - API route (limited)
- `ASSIST_TEST_SUMMARY.md` - Test results

## ❓ FAQ

**Q: Why doesn't the API route work?**  
A: ASSIST.org is an Angular app. Simple HTTP fetch only gets the shell HTML, not the rendered content.

**Q: Can we fix the API route?**  
A: Yes, but it would require Puppeteer running on the server, which has significant resource costs and complexity.

**Q: What's the best method?**  
A: Browser console script is most reliable. Puppeteer is best for automation.

**Q: Will this break if ASSIST.org updates?**  
A: Possibly. The browser console script is most resilient. Puppeteer may need selector updates.

## 🎯 Summary

- ✅ **ASSIST.org is Angular** - content rendered by JavaScript
- ✅ **Browser console script** works best (runs after Angular loads)
- ✅ **Puppeteer** works but needs proper wait strategies
- ❌ **Simple fetch** will never work (by design)

Use the browser console script for reliability, or Puppeteer for automation!













