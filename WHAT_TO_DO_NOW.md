# 🎯 What To Do Now: Extract ASSIST.org Data

## ✅ What We Just Fixed

All extraction scripts now properly handle:
- ✅ Courses with articulations (CC → UC)
- ✅ Courses with **no articulation** (empty equivalent)
- ✅ New ASSIST.org URL format
- ✅ Div-based data structures (Angular apps)

## 🚀 Next Steps: Extract Your First Dataset

### Recommended Method: Browser Console Script ⭐

**This is the most reliable way to extract data from ASSIST.org!**

#### Step 1: Go to ASSIST.org
1. Visit: https://assist.org
2. Navigate to the articulation page:
   - Click **"Agreements"** → **"Course-to-Course Articulation"**
   - Or go directly to a page like:
     - Berkeley City College → UC Berkeley
     - https://assist.org/transfer/results?year=76&institution=58&agreement=79&agreementType=to

#### Step 2: Select a Major (if needed)
- If you see a dropdown to select a major/agreement, **select one first**
- Wait for the articulation table to load (10-15 seconds)
- Make sure you can **see the course articulation table** on the page

#### Step 3: Run the Extraction Script
1. **Open Browser Console**:
   - Press `F12` (Windows) or `Cmd+Option+I` (Mac)
   - Click the **"Console"** tab

2. **Copy the Script**:
   - Open file: `scripts/assist-extract-simple.js`
   - Select ALL the code (Cmd+A / Ctrl+A)
   - Copy it (Cmd+C / Ctrl+C)

3. **Paste & Run**:
   - Paste into the browser console
   - Press Enter
   - Watch the console output for progress

4. **CSV Downloads Automatically!** 📥
   - File will download to your Downloads folder
   - Filename: `articulations-BCC-UCB-[timestamp].csv`

#### Step 4: Import to Database
1. **Start your server** (if not running):
   ```bash
   npm run dev
   ```

2. **Go to Admin Page**:
   - Navigate to: http://localhost:3000/admin/articulations
   - (Make sure you're logged in)

3. **Upload CSV**:
   - Click **"Choose CSV File"**
   - Select the downloaded CSV file
   - Click **"Upload"** or **"Import"**

4. **Check Results**:
   - You should see how many courses were imported
   - Courses with articulations will have equivalencies
   - Courses without articulations will still be added (but no equivalency record)

---

## 📋 Quick Test Checklist

- [ ] Navigate to ASSIST.org articulation page
- [ ] Select a major/agreement (if needed)
- [ ] Wait for table to fully load
- [ ] Open browser console (F12)
- [ ] Copy `assist-extract-simple.js` script
- [ ] Paste and run in console
- [ ] Verify CSV downloaded
- [ ] Start dev server (`npm run dev`)
- [ ] Go to `/admin/articulations`
- [ ] Upload CSV file
- [ ] Confirm successful import

---

## 🔍 Troubleshooting

### "No articulations found"
- ✅ Make sure the table is **visible** on the page
- ✅ Wait longer (15-20 seconds) for Angular app to load
- ✅ Try selecting a different major/agreement
- ✅ Check console output for diagnostic info

### CSV has empty equivalents
- ✅ This is **normal** for courses with no articulation
- ✅ The import will still add the CC course (just no UC equivalent)
- ✅ This is the correct behavior!

### Script errors
- ✅ Make sure you're on the articulation table page (not selection page)
- ✅ Try the diagnostic script first: `scripts/assist-diagnose-structure.js`
- ✅ Check `ASSIST_TROUBLESHOOTING.md` for more help

---

## 📚 Alternative Scripts

### Full Browser Helper (More Features)
- File: `scripts/assist-browser-helper.js`
- More comprehensive extraction
- Better error handling
- Try this if simple script doesn't work

### Diagnostic Script (Debugging)
- File: `scripts/assist-diagnose-structure.js`
- Analyzes page structure
- Shows what elements are found
- Run this first if extraction fails

---

## 🎯 Your Goal

Extract articulation data for:
- **Peralta Colleges**:
  - Berkeley City College (BCC)
  - College of Alameda (COA)
  - Laney College
  - Merritt College

- **Target Universities**:
  - UC Berkeley (UCB)
  - UCLA
  - UC San Diego (UCSD)
  - Other UC/CSU campuses

---

## 💡 Pro Tips

1. **Start with one college-university pair** (e.g., BCC → UCB)
2. **Test with a small dataset first** before bulk importing
3. **Check the CSV file** before importing to verify data looks correct
4. **Use the diagnostic script** if you're having trouble finding data
5. **Courses without articulation are normal** - not all CC courses transfer!

---

## 📖 More Help

- **Quick Start**: `QUICK_START_FETCH.md`
- **Troubleshooting**: `ASSIST_TROUBLESHOOTING.md`
- **URL Formats**: `ASSIST_URL_FORMAT.md`
- **Multi-Major Pages**: `ASSIST_MULTI_MAJOR_GUIDE.md`

---

**Ready? Start with Step 1 above!** 🚀














