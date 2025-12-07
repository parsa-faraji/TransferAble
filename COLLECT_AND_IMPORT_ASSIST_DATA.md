# How to Collect and Import ASSIST.org Data

## Step-by-Step Guide

### Step 1: Seed Your Database

First, make sure you have the colleges and universities in your database:

```bash
npm run db:seed
```

This adds:
- 4 Peralta Community Colleges
- 9 UC Universities  
- 10 CSU Universities

### Step 2: Collect Data from ASSIST.org

#### Method A: Manual Collection (Easiest)

1. **Go to ASSIST.org**: https://assist.org

2. **Navigate to Articulations**:
   - Click "Agreements" in the top menu
   - Select "Course-to-Course Articulation"

3. **Select Your Colleges**:
   - **From**: Select "Peralta Community College District" or specific college:
     - Berkeley City College (001286)
     - College of Alameda (001287)
     - Laney College (001288)
     - Merritt College (001289)
   - **To**: Select target university (e.g., UC Berkeley, UCLA, etc.)

4. **View Articulation Agreement**:
   - The page will show a table with course equivalencies
   - Each row shows:
     - Community College Course (Code & Name)
     - University Course (Code & Name)
     - Units
     - Notes (if any)

5. **Copy the Data**:
   - Option 1: Copy the entire table and paste into Excel/Google Sheets
   - Option 2: Manually enter into the admin interface
   - Option 3: Use browser extension to export as CSV

#### Method B: Export from ASSIST.org (If Available)

Some articulation pages have export options:
- Look for "Export" or "Download" buttons
- Save as CSV or Excel
- Use the CSV import feature

### Step 3: Format Your Data

Your data needs to be in this format:

**CSV Format:**
```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition and Reading,3,UCB,ENGL R1A,Reading and Composition
BCC,PHYS 2A,Physics for Scientists and Engineers,4,UCB,PHYSICS 7A,Physics for Scientists and Engineers
```

**Required Fields:**
- `community_college_code`: BCC, COA, LANEY, or MERRITT
- `course_code`: Course code at community college (e.g., "MATH 1A")
- `course_name`: Full course name
- `units`: Number of units (usually 3 or 4)
- `university_code`: UCB, UCLA, UCSD, etc. (see codes below)
- `equivalent_course_code`: Course code at university
- `equivalent_course_name`: Course name at university

**University Codes:**
- UC Berkeley: `UCB`
- UCLA: `UCLA`
- UC San Diego: `UCSD`
- UC Davis: `UCD`
- UC Santa Barbara: `UCSB`
- UC Irvine: `UCI`
- UC Santa Cruz: `UCSC`
- UC Riverside: `UCR`
- UC Merced: `UCM`
- San Francisco State: `SFSU`
- San Jose State: `SJSU`
- Cal State East Bay: `CSUEB`
- (See seed script for all codes)

### Step 4: Import Data

#### Option A: Using Admin Interface (Recommended)

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Admin Page**:
   - Go to: http://localhost:3000/admin/articulations
   - (You may need to sign in first)

3. **Upload CSV File**:
   - Click "Choose File" button
   - Select your formatted CSV file
   - Click "Upload"
   - Wait for import to complete

#### Option B: Using Command Line Script

1. **Format your data as CSV** (see template above)

2. **Run the import script**:
   ```bash
   npx tsx scripts/parse-csv-import.ts path/to/your/file.csv
   ```

#### Option C: Manual Entry via Admin Interface

1. Go to `/admin/articulations/manual` (when built)
2. Fill out the form for each articulation
3. Submit to add to database

### Step 5: Verify Data

After importing:

1. **Check the database**:
   ```bash
   npm run db:studio
   ```
   - Opens Prisma Studio
   - Navigate to `CourseEquivalency` table
   - Verify your data is there

2. **Test in the app**:
   - Go to `/courses` page
   - Select a Peralta college
   - Select a target university
   - See if articulations appear

## Example: Collecting BCC → UC Berkeley Data

1. Go to https://assist.org
2. Click "Agreements" → "Course-to-Course Articulation"
3. Select:
   - From: "Berkeley City College" (001286)
   - To: "UC Berkeley" (001319)
4. Click "View Agreement"
5. You'll see a table like:

| CC Course | CC Course Name | UC Course | UC Course Name | Units |
|-----------|----------------|-----------|----------------|-------|
| MATH 1A | Calculus I | MATH 1A | Calculus | 4 |
| ENGL 1A | Composition | ENGL R1A | Reading & Composition | 3 |

6. Convert to CSV:
```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition and Reading,3,UCB,ENGL R1A,Reading and Composition
```

7. Save as `bcc-ucb-articulations.csv`

8. Import via admin interface or script

## Tips for Efficient Collection

1. **Start with Popular Combinations**:
   - BCC → UC Berkeley (most requested)
   - BCC → UCLA
   - Laney → UC Berkeley
   - Then expand to others

2. **Batch by College-University Pair**:
   - Collect all BCC → UC Berkeley articulations at once
   - Import as one CSV file
   - Move to next combination

3. **Use Spreadsheet Tools**:
   - Excel or Google Sheets for formatting
   - Use formulas to ensure consistent formatting
   - Validate codes before importing

4. **Check for Updates**:
   - ASSIST.org updates agreements periodically
   - Check dates on agreements
   - Re-import if agreements are updated

## Troubleshooting

### "Community college not found" error
- Make sure you're using correct codes: BCC, COA, LANEY, MERRITT
- Run `npm run db:seed` if you haven't

### "University not found" error
- Check university code matches seed data
- See `scripts/seed-peralta-colleges.ts` for all codes

### CSV import fails
- Check CSV format matches template exactly
- Ensure no extra spaces or special characters
- Verify all required columns are present

### Data not showing in app
- Check database with Prisma Studio
- Verify `isVerified` is true
- Check that courses are linked correctly

## Next Steps After Import

1. **Verify Data Accuracy**: Have counselors review critical articulations
2. **Add Major Requirements**: Link courses to major requirements
3. **Set Up Updates**: Schedule quarterly reviews of ASSIST.org
4. **User Testing**: Let students test the course planning feature

## Quick Reference

**Peralta College Codes:**
- BCC = Berkeley City College
- COA = College of Alameda
- LANEY = Laney College
- MERRITT = Merritt College

**Popular UC Codes:**
- UCB = UC Berkeley
- UCLA = UCLA
- UCSD = UC San Diego

**Popular CSU Codes:**
- SFSU = San Francisco State
- SJSU = San Jose State
- CSUEB = Cal State East Bay

Good luck building your database! 🎓

