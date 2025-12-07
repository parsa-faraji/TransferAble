# How to View Extracted Articulation Data

After running the browser helper script, here's how to see your extracted data:

## 1. Check the Console Output

After running the script, scroll through the browser console. You should see:

### Diagnostic Information
```
🔍 Page Diagnostics:
   - Tables found: X
   - Page text length: X
```

### Extraction Results
```
✅ Found X unique articulations
📊 Sample extracted data (first 3):
   1. MATH 1A → MATH 1A
      "Calculus I" → "Calculus"
   2. ENGL 1A → ENGL R1A
      "Composition" → "Reading and Composition"
   ... and X more
```

### CSV Data Display
```
📋 CSV Data (copy this):
================================================================================
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition,3,UCB,ENGL R1A,Reading and Composition
...
================================================================================
```

### Download Confirmation
```
💾 CSV file downloaded!
📥 Next: Import this file at /admin/articulations
```

## 2. Check Your Downloads Folder

The script automatically downloads a CSV file:

- **Filename**: `articulations-BCC-UCB-[timestamp].csv`
- **Location**: Your browser's default downloads folder
- **Format**: CSV (can be opened in Excel, Google Sheets, etc.)

### How to Find It:

**Chrome/Edge:**
1. Click the download icon (usually top-right, looks like a down arrow)
2. Or press `Cmd+J` (Mac) or `Ctrl+J` (Windows)
3. Click on the downloaded file to open it

**Firefox:**
1. Click the download icon (top-right)
2. Or press `Cmd+Shift+Y` (Mac) or `Ctrl+Shift+Y` (Windows)
3. Click on the downloaded file

**Safari:**
1. Check your Downloads folder
2. Or press `Cmd+Option+L` to open Downloads

## 3. View the CSV File

### Option A: Open in Excel/Google Sheets

1. **Double-click** the CSV file
2. It will open in:
   - Excel (if installed)
   - Google Sheets (if you have Google Drive)
   - Or your default spreadsheet app

### Option B: Open in Text Editor

1. **Right-click** the CSV file
2. Choose "Open With" → Text Editor
3. You'll see the raw CSV data

### Option C: View in Browser Console

The **full CSV is printed in the console** - just scroll up to see it!

## 4. Verify the Data

Check that you see:
- ✅ Course codes (e.g., "MATH 1A", "ENGL 1A")
- ✅ Course names
- ✅ Units
- ✅ Equivalent courses

If you see:
- ❌ Empty CSV file
- ❌ Only headers, no data
- ❌ Error messages

Then the extraction might not have worked. See troubleshooting below.

## 5. What to Do Next

### Import to Database

1. Go to `/admin/articulations` in your app
2. Upload the CSV file
3. Data will be imported automatically

### Or Use the Data Directly

- Open in Excel/Sheets
- Review and edit if needed
- Save as needed

## Troubleshooting

### "No articulations found"

If you see this message:
1. Check the console diagnostics
2. Make sure tables are visible on the page
3. Wait longer for page to load
4. Try scrolling down to see all tables

### CSV File Not Downloading

If the file doesn't download:
1. Check browser settings (some browsers block downloads)
2. Check if downloads are paused
3. Look in your Downloads folder manually
4. Copy the CSV from the console instead

### Empty CSV File

If the CSV only has headers:
1. Check console for error messages
2. Verify tables are actually visible on the page
3. Try selecting a major first
4. Wait longer for page to fully load

### Can't See Console Output

1. Make sure console is open (F12)
2. Scroll up in console to see all messages
3. Clear console and run script again
4. Check if console is filtered (click "All levels" filter)

## Quick Checklist

After running the script, you should see:

- [ ] Console shows "Found X articulations"
- [ ] Sample data displayed in console
- [ ] CSV data printed in console
- [ ] CSV file downloaded to Downloads folder
- [ ] File can be opened in Excel/Sheets

## Still Can't See Data?

1. **Check console messages** - look for errors or warnings
2. **Verify tables are visible** - can you see course data on the page?
3. **Check download folder** - file might be there even if notification didn't show
4. **Copy from console** - the full CSV is printed there, you can copy it

The script shows everything in the console - scroll through it to see all the information!












