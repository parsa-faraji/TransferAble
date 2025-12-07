# Course Articulation Data Collection Guide

## Peralta Community College District

The Peralta Community College District includes 4 colleges:
1. **Berkeley City College (BCC)** - Code: 001286
2. **College of Alameda (COA)** - Code: 001287  
3. **Laney College** - Code: 001288
4. **Merritt College** - Code: 001289

## Primary Data Source: ASSIST.org

**URL**: https://assist.org

ASSIST.org is the **official** articulation system for California community colleges transferring to UC and CSU systems.

### How to Access Data

1. **Go to ASSIST.org**
2. **Navigate to**: "Agreements" → "Course-to-Course Articulation"
3. **Select**:
   - Source: Peralta Community College District (or specific college)
   - Destination: Target UC or CSU
4. **View/Export** the articulation agreement

### ASSIST.org College Codes

- Berkeley City College: **001286**
- College of Alameda: **001287**
- Laney College: **001288**
- Merritt College: **001289**

### ASSIST.org University Codes (Examples)

- UC Berkeley: **001319**
- UCLA: **001312**
- UC San Diego: **001320**
- UC Davis: **001313**
- San Francisco State: **001154**
- San Jose State: **001470**

## Data Collection Methods

### Method 1: Manual Entry (Recommended for Accuracy)

**Pros**: Most accurate, you control the data
**Cons**: Time-consuming

**Steps**:
1. Visit ASSIST.org for each college-university pair
2. Copy course articulation data
3. Use admin interface to enter data
4. Verify each entry

**Estimated Time**: 2-4 hours per college-university pair

### Method 2: CSV/Excel Import

**Pros**: Faster than manual entry
**Cons**: Requires data formatting

**Steps**:
1. Export data from ASSIST.org (if available) or create CSV
2. Format CSV with columns:
   - `cc_course_code` (e.g., "MATH 1A")
   - `cc_course_name` (e.g., "Calculus I")
   - `university_course_code` (e.g., "MATH 1A")
   - `university_course_name` (e.g., "Calculus I")
   - `units` (e.g., "4")
   - `notes` (optional)
3. Upload via admin interface

### Method 3: Web Scraping (Use with Caution)

**⚠️ Important**: 
- Check ASSIST.org Terms of Service
- Respect rate limits
- Don't overload their servers
- Consider reaching out for permission

**Tools Needed**:
- Node.js with Puppeteer or Cheerio
- Python with BeautifulSoup or Selenium

**Template Script**: See `scripts/scrape-assist.ts`

### Method 4: Partner with Peralta District

**Best Option**: Contact Peralta Community College District directly

**Contact**: 
- Website: https://www.peralta.edu
- They may provide:
  - Official CSV/Excel files
  - Database access
  - API access (if available)

## Target Universities

### UC System (9 campuses)
Focus on these popular ones first:
- UC Berkeley
- UCLA
- UC San Diego
- UC Davis
- UC Santa Barbara
- UC Irvine

### CSU System (23 campuses)
Focus on these popular ones first:
- San Francisco State
- San Jose State
- Cal State East Bay
- Cal State Monterey Bay
- Sonoma State
- Sacramento State

## Data Structure

Each articulation should include:
- **Source Course**: Community college course code and name
- **Target Course**: University course code and name
- **Units**: Credit units
- **Effective Date**: When the articulation is valid
- **Notes**: Any special conditions or restrictions
- **Verification Status**: Verified by counselor/admin

## Quick Start

1. **Seed the database** with colleges and universities:
   ```bash
   npm run db:seed
   ```

2. **Access admin interface** (when built):
   - Go to `/admin/articulations`
   - Start importing data

3. **For each college-university pair**:
   - Visit ASSIST.org
   - Get articulation data
   - Import into database

## Priority Order

Start with most popular combinations:
1. BCC → UC Berkeley
2. BCC → UCLA
3. BCC → UC San Diego
4. Laney → UC Berkeley
5. Laney → San Francisco State
6. Continue with other combinations...

## Maintenance

- **Update Frequency**: Check ASSIST.org quarterly for updates
- **Verification**: Have counselors verify critical articulations
- **User Feedback**: Allow users to report discrepancies
- **Version Control**: Track when articulations were last updated

## Resources

- **ASSIST.org**: https://assist.org
- **Peralta District**: https://www.peralta.edu
- **UC Transfer Info**: https://admission.universityofcalifornia.edu/transfer/
- **CSU Transfer Info**: https://www2.calstate.edu/apply/transfer

## Next Steps

1. Run seed script to add colleges/universities
2. Build admin interface for data entry
3. Start collecting data from ASSIST.org
4. Consider reaching out to Peralta District for official data

