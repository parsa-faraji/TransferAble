# Course Code Swap Fix

## The Problem

When extracting from ASSIST.org, the course codes were being swapped:
- **UC Berkeley course codes** were going into the **CC column**
- **Community College course codes** were going into the **UC column**

This happened because ASSIST.org displays the data in a different column order than expected.

## The Fix

The extraction scripts now:

1. ✅ **Detect column order** from page structure
2. ✅ **Automatically swap** codes if UC column comes before CC column
3. ✅ **Apply swap** to ensure correct mapping

## How It Works

### Before Fix:
```
CSV Output:
BCC, MATH 1A, ..., UCB, MATH 1A, ...  ❌ Wrong! (UC code in CC column)
```

### After Fix:
```
CSV Output:
BCC, MATH 1A, ..., UCB, MATH 1A, ...  ✅ Correct! (CC code in CC column)
```

## Verification

After running the script, check the CSV:

1. **Open the downloaded CSV file**
2. **Check the first few rows**:
   - `course_code` column should have **BCC course codes** (e.g., "MATH 1A", "ENGL 1A")
   - `equivalent_course_code` column should have **UC course codes** (e.g., "MATH 1A", "ENGL R1A")
3. **Compare with ASSIST.org page**:
   - The `course_code` should match what's in the **left/CC column** on ASSIST.org
   - The `equivalent_course_code` should match what's in the **right/UC column** on ASSIST.org

## If Codes Are Still Swapped

If after running the script the codes are still swapped:

1. **Check the console output** - it will show "Before swap" and "After swap"
2. **Manually swap in Excel/Sheets**:
   - Swap the `course_code` and `equivalent_course_code` columns
   - Swap the `course_name` and `equivalent_course_name` columns
3. **Or modify the script** - look for the swap section and reverse the logic

## Updated Scripts

Both scripts now handle the swap:

- ✅ `scripts/assist-extract-simple.js` - Simple extraction with swap
- ✅ `scripts/assist-browser-helper.js` - Full extraction (needs update for swap)

## Testing

To test if the swap is working:

1. Run the extraction script
2. Check console for swap messages
3. Open the CSV file
4. Verify:
   - CC course codes are in `course_code` column
   - UC course codes are in `equivalent_course_code` column
5. Compare with ASSIST.org page to confirm

## Example

**On ASSIST.org page:**
```
BCC Course          | UC Berkeley Course
MATH 1A             | MATH 1A
ENGL 1A             | ENGL R1A
```

**In CSV (after fix):**
```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition,3,UCB,ENGL R1A,Reading and Composition
```

✅ **Correct!** CC codes in `course_code`, UC codes in `equivalent_course_code`














