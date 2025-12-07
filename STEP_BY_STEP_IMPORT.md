# Step-by-Step: Collect and Import ASSIST.org Data

## Complete Walkthrough

### Step 1: Prepare Your Database

```bash
# Install dependencies (if not done)
npm install

# Seed colleges and universities
npm run db:seed
```

This adds all Peralta colleges and UC/CSU universities to your database.

### Step 2: Collect Data from ASSIST.org

#### A. Go to ASSIST.org
1. Open https://assist.org in your browser
2. Click **"Agreements"** in the top menu
3. Select **"Course-to-Course Articulation"**

#### B. Select Your Colleges
1. **From Institution**: 
   - Select "Peralta Community College District" 
   - OR select specific college:
     - Berkeley City College
     - College of Alameda
     - Laney College
     - Merritt College

2. **To Institution**: 
   - Select target university (e.g., UC Berkeley, UCLA, etc.)

3. Click **"View Agreement"** or **"Submit"**

#### C. View the Articulation Table
You'll see a table with columns like:
- Community College Course Code
- Community College Course Name
- University Course Code
- University Course Name
- Units
- Notes (if any)

#### D. Copy the Data
**Option 1: Copy-Paste to Excel/Sheets**
1. Select the entire table (Ctrl+A / Cmd+A)
2. Copy (Ctrl+C / Cmd+C)
3. Paste into Excel or Google Sheets
4. Make sure columns match this format:
   ```
   community_college_code | course_code | course_name | units | university_code | equivalent_course_code | equivalent_course_name
   ```

**Option 2: Manual Entry**
- Use the admin interface to enter one by one

**Option 3: Export (if available)**
- Look for "Export" or "Download" button on ASSIST.org
- Save as CSV

### Step 3: Format Your CSV

Your CSV file must have this exact header row:

```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
```

**Example data rows:**

```csv
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition and Reading,3,UCB,ENGL R1A,Reading and Composition
BCC,PHYS 2A,Physics for Scientists and Engineers,4,UCB,PHYSICS 7A,Physics for Scientists and Engineers
LANEY,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
```

**Important Codes:**

**Peralta Colleges:**
- `BCC` = Berkeley City College
- `COA` = College of Alameda
- `LANEY` = Laney College
- `MERRITT` = Merritt College

**UC Universities:**
- `UCB` = UC Berkeley
- `UCLA` = UCLA
- `UCSD` = UC San Diego
- `UCD` = UC Davis
- `UCSB` = UC Santa Barbara
- `UCI` = UC Irvine
- `UCSC` = UC Santa Cruz
- `UCR` = UC Riverside
- `UCM` = UC Merced

**CSU Universities:**
- `SFSU` = San Francisco State
- `SJSU` = San Jose State
- `CSUEB` = Cal State East Bay
- `CSUMB` = Cal State Monterey Bay
- `SSU` = Sonoma State
- `CSUS` = Sacramento State
- `CPSLO` = Cal Poly San Luis Obispo
- `CSULB` = Cal State Long Beach
- `CSUF` = Cal State Fullerton
- `CSUN` = Cal State Northridge

### Step 4: Import via Admin Interface

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Sign in** to your account

3. **Navigate to Admin Page**:
   - Go to: http://localhost:3000/admin/articulations
   - (You may need to add this route to your navigation)

4. **Upload CSV**:
   - Click "Download Template" to see the format
   - Click "Choose CSV File"
   - Select your formatted CSV file
   - Wait for import to complete

5. **Check Results**:
   - You'll see how many articulations were imported
   - Any errors will be shown
   - Check your database with `npm run db:studio` to verify

### Step 5: Verify Data

```bash
# Open Prisma Studio to view your data
npm run db:studio
```

Navigate to:
- `CourseEquivalency` table to see articulations
- `Course` table to see courses
- Verify data looks correct

## Example: BCC → UC Berkeley

1. Go to https://assist.org
2. Agreements → Course-to-Course Articulation
3. From: "Berkeley City College" (001286)
4. To: "UC Berkeley" (001319)
5. View Agreement
6. Copy table data
7. Format as CSV:
   ```csv
   community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
   BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
   BCC,ENGL 1A,Composition and Reading,3,UCB,ENGL R1A,Reading and Composition
   ```
8. Save as `bcc-ucb.csv`
9. Import via admin interface

## Tips

1. **Start Small**: Import one college-university pair first to test
2. **Check Format**: Make sure CSV matches template exactly
3. **Verify Codes**: Double-check college and university codes
4. **Batch by Pair**: Collect all articulations for one pair, import, then move to next
5. **Save Originals**: Keep your CSV files as backup

## Troubleshooting

**"Community college not found"**
- Make sure code is exactly: BCC, COA, LANEY, or MERRITT
- Run `npm run db:seed` if you haven't

**"University not found"**
- Check university code matches (UCB, UCLA, etc.)
- See seed script for all codes

**CSV won't parse**
- Check header row matches exactly
- No extra spaces or special characters
- Use commas, not semicolons
- Save as plain CSV (not Excel format)

**Import succeeds but no data**
- Check Prisma Studio to see if data is there
- Verify `isVerified` is true
- Check course and university IDs are correct

## Quick Reference

**Template CSV:**
```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
```

**Admin Interface:**
http://localhost:3000/admin/articulations

**Database Viewer:**
```bash
npm run db:studio
```

You're all set! Start collecting data from ASSIST.org and importing it! 🎓

