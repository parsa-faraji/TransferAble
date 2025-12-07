# ASSIST.org Script Troubleshooting Guide

## Error: "No articulations found"

If you see this error, here's how to fix it:

### Step 1: Check You're on the Right Page

The script needs to run on the **actual articulation table page**, not the selection page.

**Wrong Page** (Agreement Selection):
- URL might include `viewAgreementsOptions=true`
- Page shows "Select Agreement" or "Choose Major"
- No course table visible yet

**Right Page** (Articulation Table):
- Shows a table with course codes
- Columns like "Course Code", "Course Name", "Units", "Equivalent Course"
- Actual course data visible (e.g., "MATH 1A", "ENGL 1A")

### Step 2: Wait for Page to Load

ASSIST.org is an Angular app - it needs time to load:

1. **Go to the articulation page**
2. **Wait 10-15 seconds** after page loads
3. **Scroll down** to make sure table is visible
4. **Then** run the script

### Step 3: Verify Table is Visible

Before running the script:
- Can you see a table with course data?
- Are there multiple rows of courses?
- Is the page fully loaded (no loading spinners)?

If NO:
- Wait longer
- Scroll down (table might be below)
- Check if you need to select a major first

### Step 4: Run Diagnostic Version

The updated script now includes diagnostics. When you run it, check the console output:

```
🔍 Page Diagnostics:
   - Has app-root: true/false
   - app-root children: X
   - Tables found: X
   - Page text length: X
```

**What to look for:**
- `Tables found: 0` = No tables on page (wrong page or not loaded)
- `Page text length: < 1000` = Page might not be fully loaded
- `Tables found: X` but no articulations = Table structure different than expected

### Step 5: Try Different Approaches

#### Option A: Manual Selection First

1. Go to ASSIST.org
2. Navigate through the interface:
   - Select Academic Year
   - Select "From" college
   - Select "To" university
   - **Select a major/agreement** (if prompted)
   - Wait for table to load
3. **Then** run the script

#### Option B: Use Direct URL

If you know the direct URL to the articulation table:
1. Copy the full URL from browser
2. Paste it in a new tab
3. Wait for table to load
4. Run the script

#### Option C: Check Page Structure

Run this in console to see what's on the page:

```javascript
// Check for tables
console.log("Tables:", document.querySelectorAll("table").length);

// Check page content
console.log("Page text length:", document.body.textContent.length);

// Look for course codes
const text = document.body.textContent;
const courseCodes = text.match(/\b[A-Z]{2,}\s*\d+[A-Z]*\b/g);
console.log("Course codes found:", courseCodes?.slice(0, 10));
```

### Step 6: Common Issues

#### Issue: "Tables found: 0"

**Cause**: Not on the articulation table page

**Solution**:
- Navigate to the actual table page
- Make sure table is visible on screen
- Wait for page to fully load

#### Issue: Tables found but no data extracted

**Cause**: Table structure is different than expected

**Solution**:
- Check what the table looks like
- The script tries multiple patterns, but might need adjustment
- Try selecting a specific major/agreement

#### Issue: Page text is very short

**Cause**: Angular app hasn't loaded content yet

**Solution**:
- Wait 10-15 seconds
- Refresh the page
- Check internet connection
- Try disabling browser extensions

#### Issue: "You might be on an agreement selection page"

**Cause**: On the selection page, not the table page

**Solution**:
- Select an agreement/major first
- Wait for the table to load
- Then run the script

### Step 7: Verify URL Format

Check your URL format:

**New Format** (before major selection):
```
https://assist.org/transfer/results?year=76&institution=58&agreement=79&...
```

**After selecting major** (should have table):
The URL might change or you might be on a different view.

### Step 8: Get Help

If nothing works, provide:

1. **Full URL** you're on
2. **Screenshot** of the page
3. **Console output** from the script
4. **What you see** on the page (table? selection? loading?)

## Quick Checklist

Before running the script:

- [ ] I'm on the articulation table page (not selection page)
- [ ] I can see a table with course data
- [ ] Page has been loaded for at least 10 seconds
- [ ] I've scrolled to see the table
- [ ] No loading spinners visible
- [ ] Table has multiple rows of courses

## Still Not Working?

1. **Try the diagnostic commands** above
2. **Take a screenshot** of the page
3. **Copy the console output**
4. **Note the exact URL** you're on

The script has been updated with better diagnostics - run it again and check the console output for clues!












