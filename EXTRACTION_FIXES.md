# 🔧 Extraction Script Fixes

## Issues Fixed

### 1. ✅ Column Order Reversal
- **Problem**: UC courses were showing in CC columns and vice versa
- **Fix**: Better column detection from headers and page structure
- **How it works**: 
  - Checks table headers for "University", "Community College", "Berkeley", etc.
  - Detects which column comes first
  - Automatically swaps if needed

### 2. ✅ Units in Wrong Column  
- **Problem**: Units (like "4.00units") were being parsed as course codes
- **Fix**: 
  - Better course code validation (excludes roman numerals like "II", "III")
  - Excludes pure numbers
  - Properly extracts units from course names
  - Places units in the correct column

### 3. ✅ Multiple Equivalencies
- **Problem**: Some CC courses articulate to multiple UC courses, but only one was captured
- **Fix**: Creates separate rows for each equivalent course
- **Example**: 
  ```
  CC Course → UC Course 1
  CC Course → UC Course 2
  ```

### 4. ✅ Course Name Cleaning
- **Problem**: Course names included units, extra text, etc.
- **Fix**: 
  - Removes units from course names
  - Cleans up extra whitespace
  - Limits length appropriately

## How to Use the Fixed Script

1. **Open ASSIST.org** in your browser
2. **Navigate to articulation page** (select major if needed)
3. **Wait for table to fully load** (15-20 seconds)
4. **Open browser console** (F12 or Cmd+Option+I)
5. **Copy script** from `scripts/assist-extract-simple.js`
6. **Paste and run** in console
7. **CSV downloads automatically**

## What Changed in the Output

### Before:
- Wrong order (UC → CC instead of CC → UC)
- Units in course code column
- Only one equivalent per course
- Messy course names

### After:
- ✅ Correct order (CC → UC)
- ✅ Units in units column
- ✅ Multiple rows for multiple equivalents
- ✅ Clean course names

## Troubleshooting

If the order is still wrong:
1. Check console output - it will show detected column order
2. The script should auto-detect and fix it
3. If issues persist, check the table headers on ASSIST.org page

If units are still wrong:
1. Check the "Sample articulations" in console output
2. Verify units are being extracted correctly
3. The script excludes roman numerals now

If multiple equivalencies aren't captured:
1. The script now creates one row per equivalent
2. Check CSV for duplicate CC courses with different UC equivalents
3. This is expected behavior!












