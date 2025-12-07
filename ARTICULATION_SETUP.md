# Setting Up Course Articulation Database

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `tsx` - For running TypeScript scripts
- `cheerio` - For web scraping (optional)
- `csv-parse` - For parsing CSV imports

### 2. Seed Colleges and Universities

Run the seed script to add all Peralta colleges and UC/CSU universities:

```bash
npm run db:seed
```

This will add:
- 4 Peralta Community Colleges (BCC, COA, Laney, Merritt)
- 9 UC Universities
- 10 CSU Universities

### 3. Get Data from ASSIST.org

**Option A: Manual Collection (Recommended)**
1. Go to https://assist.org
2. Navigate: "Agreements" → "Course-to-Course Articulation"
3. Select Peralta college → Select UC/CSU
4. Copy course articulation data
5. Use admin interface at `/admin/articulations` to import

**Option B: CSV Import**
1. Export or create CSV file (see template: `scripts/articulation-import-template.csv`)
2. Format: `community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name`
3. Import via admin interface or use script:
   ```bash
   npx tsx scripts/parse-csv-import.ts path/to/your/file.csv
   ```

**Option C: Contact Peralta District**
- Email: Contact Peralta Community College District
- Request: Official articulation data files
- They may provide CSV/Excel files directly

## Data Collection Priority

Start with the most popular combinations:

1. **Berkeley City College → UC Berkeley** (Highest priority)
2. **Berkeley City College → UCLA**
3. **Berkeley City College → UC San Diego**
4. **Laney College → UC Berkeley**
5. **Laney College → San Francisco State**
6. Continue with other combinations...

## ASSIST.org Access

### Peralta College Codes on ASSIST.org:
- Berkeley City College: **001286**
- College of Alameda: **001287**
- Laney College: **001288**
- Merritt College: **001289**

### Popular UC Codes:
- UC Berkeley: **001319**
- UCLA: **001312**
- UC San Diego: **001320**
- UC Davis: **001313**

### Popular CSU Codes:
- San Francisco State: **001154**
- San Jose State: **001470**
- Cal State East Bay: **001146**

## CSV Format

Your CSV should have these columns:

```csv
community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition and Reading,3,UCB,ENGL R1A,Reading and Composition
```

## Admin Interface

Once you have data, use the admin interface:
- Navigate to `/admin/articulations`
- Upload CSV files
- Or manually enter articulations
- Verify and approve entries

## Next Steps

1. ✅ Run `npm run db:seed` to populate colleges/universities
2. 📊 Collect data from ASSIST.org
3. 📥 Import data via admin interface
4. ✅ Verify articulations are correct
5. 🔄 Set up regular updates (quarterly recommended)

## Resources

- **ASSIST.org**: https://assist.org
- **Peralta District**: https://www.peralta.edu
- **Template CSV**: `scripts/articulation-import-template.csv`

Good luck building your articulation database! 🎓

