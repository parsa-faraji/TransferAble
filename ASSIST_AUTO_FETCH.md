# Automatic ASSIST.org Data Collection - Complete Guide

## 🚀 Three Ways to Get ASSIST.org Data

### Method 1: Web Interface (Recommended) ⭐

**Easiest way - no coding required!**

1. **Start your server**:
   ```bash
   npm run dev
   ```

2. **Go to Admin Page**:
   - Navigate to: http://localhost:3000/admin/articulations
   - Click the **"Fetch from ASSIST.org"** button

3. **Select Colleges**:
   - Choose Peralta college (BCC, COA, Laney, Merritt)
   - Choose target university (UCB, UCLA, etc.)

4. **Click "Fetch Articulations"**:
   - System automatically fetches from ASSIST.org
   - Parses the data
   - Converts to CSV
   - Downloads the file

5. **Import**:
   - Download the CSV
   - Or import directly via the upload form

### Method 2: Browser Console Script (Most Reliable) ⭐⭐

**Works directly in your browser on ASSIST.org**

1. **Go to ASSIST.org**:
   - Navigate to the articulation page you want
   - Make sure the table is visible

2. **Open Browser Console**:
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to "Console" tab

3. **Run the Script**:
   - Copy the script from `scripts/assist-browser-helper.js`
   - Paste into console
   - Press Enter

4. **Download CSV**:
   - Script automatically downloads CSV file
   - Or copy the CSV from console output

5. **Import**:
   - Go to `/admin/articulations`
   - Upload the downloaded CSV

### Method 3: Command Line Script

**For batch processing or automation**

1. **Install Puppeteer** (one time):
   ```bash
   npm install puppeteer
   ```

2. **Run the script**:
   ```bash
   npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB
   ```

3. **Find the CSV**:
   - Saved in `public/downloads/`
   - Filename: `BCC-UCB-articulations-[timestamp].csv`

4. **Import**:
   - Use the admin interface to upload

## 📋 Step-by-Step: Browser Console Method (Recommended)

This is the most reliable method since it works directly with the page you're viewing.

### Step 1: Go to ASSIST.org

1. Visit https://assist.org
2. Click **"Agreements"** → **"Course-to-Course Articulation"**
3. Select:
   - **From**: Peralta Community College District (or specific college)
   - **To**: Target UC/CSU
4. Click **"View Agreement"** or **"Submit"**

### Step 2: Run Browser Script

1. **Open Console**: Press `F12` (Windows) or `Cmd+Option+I` (Mac)
2. **Go to Console Tab**
3. **Copy Script**: Open `scripts/assist-browser-helper.js` and copy all content
4. **Paste** into console
5. **Press Enter**

### Step 3: Get Your CSV

The script will:
- ✅ Extract all articulations from the table
- ✅ Convert to CSV format
- ✅ Automatically download the file
- ✅ Show the CSV in console (for copying)

### Step 4: Import to Database

1. Go to http://localhost:3000/admin/articulations
2. Click **"Choose CSV File"**
3. Select the downloaded file
4. Click upload
5. ✅ Done!

## 🎯 Quick Example

**Fetch BCC → UC Berkeley:**

1. Go to ASSIST.org
2. Select: Berkeley City College → UC Berkeley
3. View agreement
4. Open console (F12)
5. Paste browser helper script
6. CSV downloads automatically
7. Import via admin interface

## 📝 CSV Format Generated

The script creates CSV files with this format:

```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition and Reading,3,UCB,ENGL R1A,Reading and Composition
```

## 🔧 Troubleshooting

### Browser Script Doesn't Work
- Make sure you're on the articulation table page
- Check that the table is fully loaded
- Try refreshing the page and running again

### Web Interface Fails
- ASSIST.org structure may have changed
- Use browser console method instead
- Or manually collect and format CSV

### Command Line Script Fails
- Make sure Puppeteer is installed: `npm install puppeteer`
- Check internet connection
- ASSIST.org may be blocking automated requests

## 💡 Pro Tips

1. **Start with Popular Combinations**:
   - BCC → UCB (most requested)
   - BCC → UCLA
   - Then expand

2. **Batch Process**:
   - Use browser script for each combination
   - Collect all CSV files
   - Import them all at once

3. **Verify Data**:
   - Check a few rows manually
   - Compare with ASSIST.org
   - Verify in Prisma Studio after import

4. **Keep Originals**:
   - Save CSV files as backup
   - Note the date collected
   - Re-check quarterly for updates

## 🎓 You're Ready!

Choose the method that works best for you:
- **Web Interface**: Easiest, but may need adjustments
- **Browser Script**: Most reliable, works on any ASSIST.org page
- **Command Line**: Best for automation

All methods produce the same CSV format that can be imported! 🚀

