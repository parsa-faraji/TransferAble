# Quick Guide: How to See Your Extracted Data

## You just ran the script and saw:
```
💡 Major selection options detected.
✅ The script extracted data from visible tables.
```

## Where to see the extracted data:

### 1. Look at the BROWSER CONSOLE (where you pasted the script)

Scroll UP in the console to see:

```
✅ Found X unique articulations

📊 Sample extracted data (first 3):
   1. MATH 1A → MATH 1A
   2. ENGL 1A → ENGL R1A
   ... and X more

📋 CSV Data (copy this):
================================================================================
[Full CSV data will be shown here]
================================================================================

💾 CSV file downloaded!
```

### 2. Check your DOWNLOADS folder

A CSV file should have automatically downloaded:
- **File name**: `articulations-BCC-UCB-[timestamp].csv`
- **Location**: Your Downloads folder

**Quick ways to find it:**
- Press `Cmd+J` (Mac) or `Ctrl+J` (Windows) to open Downloads
- Or go to your Downloads folder manually

### 3. If you see "Found 0 articulations"

This means no data was extracted. Check the console for:
- How many tables were found
- Diagnostic information
- Error messages

## Step-by-Step: View Your Data

### Step 1: Check Console Output
1. Look at the browser console (where you pasted the script)
2. Scroll through the messages
3. Look for: `✅ Found X articulations`

### Step 2: Find the CSV File
1. Open your Downloads folder
2. Look for a file starting with `articulations-`
3. Double-click to open in Excel/Sheets

### Step 3: If CSV Not Found
1. Scroll back up in the console
2. Look for the section that says `📋 CSV Data (copy this):`
3. Copy that entire CSV text
4. Paste into a text file and save as `.csv`

## Still can't see tables?

The message you saw means:
- ✅ Script ran successfully
- ✅ It detected major selection options
- ❓ But you need to check if it actually found data

**Do this:**
1. Scroll UP in the console
2. Look for: `✅ Found X unique articulations`
3. If X = 0, then no data was extracted
4. If X > 0, check your Downloads folder for the CSV file

## Need help?

Check these in the console:
1. `Tables found: X` - How many tables were on the page?
2. `Found X articulations` - How many were extracted?
3. Error messages - Any problems?

Scroll through ALL the console output to see everything!












