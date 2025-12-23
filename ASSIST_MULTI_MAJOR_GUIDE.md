# Handling Multiple Majors on ASSIST.org

## The Situation

You're on a page where you can see:
- ✅ Articulation tables (one or more)
- ✅ Major selection options/dropdowns
- ✅ Multiple tables visible at once

This is actually **perfectly fine**! The script can handle this.

## Two Approaches

### Option 1: Extract from ALL Tables (Recommended)

If you want articulations for **all majors** at once:

1. **Make sure all tables are visible on the page**
   - Scroll down if needed
   - The tables should be fully loaded

2. **Run the script**
   - It will automatically extract from ALL visible tables
   - You'll get one CSV with all articulations

3. **Benefits**:
   - ✅ Faster - get everything at once
   - ✅ Complete dataset
   - ✅ No need to select each major separately

### Option 2: Extract One Major at a Time

If you want articulations for a **specific major**:

1. **Select the major** from the dropdown/options
2. **Wait for the page to update** (5-10 seconds)
3. **Make sure the table for that major is visible**
4. **Run the script**
5. **Repeat** for other majors as needed

## How the Script Works

The updated script:

1. ✅ **Detects all tables** on the page
2. ✅ **Extracts from each table** automatically
3. ✅ **Groups by major** if it can identify them
4. ✅ **Removes duplicates** across tables
5. ✅ **Creates one CSV** with all data

## What You'll See in Console

When you run the script, you'll see:

```
📋 Page Type Detection:
   - Tables found: 3
   - Multiple tables detected - this might be a multi-major page
   💡 Will extract from ALL visible tables

📊 Extracted by Major/Agreement:
   - Computer Science: 45 articulations
   - Business Administration: 38 articulations
   - General Education: 120 articulations

✅ Found 180 unique articulations (from 203 total rows)
```

## CSV Output

The CSV will include:
- All articulations from all visible tables
- No duplicates (same course pairs removed)
- Ready to import into your database

## Tips

### If Tables Are Empty

If you see tables but they're empty:

1. **Select a major first**
   - The tables might be placeholders until you select
2. **Wait for table to populate**
   - Angular apps need time to load data
3. **Then run the script**

### If You Only See Selection Options

If you see major selection but NO tables yet:

1. **Select a major/agreement**
2. **Wait for table to appear**
3. **Then run the script**

### Best Practice

**For complete data collection:**
- Option 1 (extract all) is fastest
- You get everything in one go
- Can filter/separate later if needed

**For specific majors:**
- Option 2 (select then extract) is better
- More focused dataset
- Easier to organize

## Example Workflow

### Scenario: BCC → UC Berkeley, Multiple Majors

1. Navigate to: `https://assist.org/transfer/results?...`
2. Page loads showing major selection and multiple tables
3. **Either:**
   - **Option A**: Run script now → Get all majors at once
   - **Option B**: Select "Computer Science" → Wait → Run script → Repeat for other majors
4. CSV downloads automatically
5. Import to `/admin/articulations`

## Still Having Issues?

If the script says "No articulations found":

1. **Check the console diagnostics**:
   ```
   🔍 Page Diagnostics:
      - Tables found: X
   ```

2. **If tables found = 0**:
   - Tables might not be loaded yet
   - Wait 10-15 seconds
   - Scroll down to check

3. **If tables found but no data**:
   - Tables might be empty
   - Select a major first
   - Wait for table to populate

4. **Check page content**:
   - Can you see course codes like "MATH 1A"?
   - Are there actual rows of data?
   - Or just empty tables/headers?

## Summary

✅ **Multiple tables visible = Good!**  
✅ **Script extracts from all of them**  
✅ **One CSV with everything**  
✅ **Works with or without major selection**

Just make sure the tables are **visible and loaded** before running the script!














