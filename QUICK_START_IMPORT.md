# Quick Start: Import ASSIST.org Data

## 3 Simple Steps

### 1️⃣ Seed Database (One Time)
```bash
npm run db:seed
```
Adds all Peralta colleges and UC/CSU universities.

### 2️⃣ Get Data from ASSIST.org

1. Go to **https://assist.org**
2. Click **"Agreements"** → **"Course-to-Course Articulation"**
3. Select: **Peralta College** → **UC/CSU**
4. Copy the articulation table
5. Paste into Excel/Google Sheets
6. Format as CSV with this header:
   ```csv
   community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
   ```
7. Save as CSV file

### 3️⃣ Import via Admin Interface

1. Start server: `npm run dev`
2. Go to: **http://localhost:3000/admin/articulations**
3. Click **"Choose CSV File"**
4. Select your CSV file
5. Wait for import to complete ✅

## CSV Format Example

```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition and Reading,3,UCB,ENGL R1A,Reading and Composition
```

## Codes You Need

**Colleges:** BCC, COA, LANEY, MERRITT  
**Universities:** UCB, UCLA, UCSD, SFSU, SJSU, etc.

See `STEP_BY_STEP_IMPORT.md` for complete details!

