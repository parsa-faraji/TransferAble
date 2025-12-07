# Building Course Articulation Database for Peralta Community Colleges

## Overview

This document outlines how to build a comprehensive database of course articulations between Peralta Community Colleges and UC/CSU systems.

## Peralta Community College District

The Peralta Community College District includes:
1. **Berkeley City College (BCC)** - Code: 001286
2. **College of Alameda (COA)** - Code: 001287
3. **Laney College** - Code: 001288
4. **Merritt College** - Code: 001289

## Data Sources

### 1. ASSIST.org (Primary Source)
**URL**: https://assist.org

ASSIST.org is the official articulation system for California. It provides:
- Course-to-course equivalencies
- Major preparation agreements
- IGETC (Intersegmental General Education Transfer Curriculum)
- CSU GE-Breadth requirements

**How to Access**:
- Go to https://assist.org
- Select "Agreements" → "Course-to-Course Articulation"
- Select Peralta Community College District
- Select target UC/CSU
- View articulation agreements

**Limitations**:
- No official public API
- Data must be scraped or manually entered
- Updates periodically (check dates on agreements)

### 2. Individual College Websites
Each Peralta college may have additional articulation information:
- Berkeley City College: https://www.berkeleycitycollege.edu
- College of Alameda: https://alameda.peralta.edu
- Laney College: https://laney.edu
- Merritt College: https://www.merritt.edu

### 3. UC and CSU Transfer Centers
- UC Transfer Admission Planner (TAP): https://uctap.universityofcalifornia.edu
- CSU Transfer Planning: https://www2.calstate.edu/apply/transfer

## Data Collection Strategy

### Option 1: Manual Data Entry (Most Reliable)
1. Visit ASSIST.org for each college-university pair
2. Export or copy course articulation data
3. Enter into database via admin interface

### Option 2: Web Scraping (Requires Careful Implementation)
**Important**: Check ASSIST.org's Terms of Service before scraping. Respect rate limits.

**Tools Needed**:
- Python with BeautifulSoup or Selenium
- Or Node.js with Puppeteer/Cheerio

**Basic Approach**:
1. Navigate to ASSIST.org articulation pages
2. Parse HTML tables for course equivalencies
3. Extract course codes, names, and equivalencies
4. Store in database

### Option 3: Partner with Peralta District
- Contact Peralta Community College District
- Request official articulation data
- May provide CSV/Excel files or database access

## Target Universities

### UC System (9 campuses)
1. UC Berkeley
2. UCLA
3. UC San Diego
4. UC Davis
5. UC Santa Barbara
6. UC Irvine
7. UC Santa Cruz
8. UC Riverside
9. UC Merced

### CSU System (23 campuses - focus on popular ones)
1. San Francisco State
2. San Jose State
3. Cal State East Bay
4. Cal State Monterey Bay
5. Sonoma State
6. Sacramento State
7. And others...

## Database Schema (Already in Prisma)

Your existing schema already supports this:
- `CommunityCollege` - Peralta colleges
- `University` - UC/CSU campuses
- `Course` - Courses at community colleges
- `CourseEquivalency` - The articulation mappings
- `Major` - Major requirements
- `MajorRequirement` - Specific course requirements

## Implementation Steps

### Step 1: Add Peralta Colleges to Database

```typescript
// Seed script to add Peralta colleges
const peraltaColleges = [
  { name: "Berkeley City College", code: "BCC", city: "Berkeley" },
  { name: "College of Alameda", code: "COA", city: "Alameda" },
  { name: "Laney College", code: "LANEY", city: "Oakland" },
  { name: "Merritt College", code: "MERRITT", city: "Oakland" },
];
```

### Step 2: Add UC/CSU Universities

```typescript
const universities = [
  // UC System
  { name: "UC Berkeley", code: "UCB", type: "UC" },
  { name: "UCLA", code: "UCLA", type: "UC" },
  // ... etc
  // CSU System
  { name: "San Francisco State", code: "SFSU", type: "CSU" },
  // ... etc
];
```

### Step 3: Create Data Collection Script

See `scripts/scrape-assist.ts` for implementation

### Step 4: Build Admin Interface

Create admin pages to:
- Import articulation data
- Verify equivalencies
- Update course information
- Manage major requirements

## Next Steps

1. **Create seed script** for Peralta colleges and UC/CSU universities
2. **Build scraping tool** (if allowed by ToS) or manual entry interface
3. **Create admin dashboard** for data management
4. **Set up data validation** to ensure accuracy
5. **Implement update mechanism** to keep data current

## Resources

- ASSIST.org: https://assist.org
- Peralta District: https://www.peralta.edu
- UC Transfer Info: https://admission.universityofcalifornia.edu/transfer/
- CSU Transfer Info: https://www2.calstate.edu/apply/transfer

## Legal Considerations

- Check ASSIST.org Terms of Service
- Respect robots.txt
- Don't overload servers with requests
- Consider reaching out to Peralta District for official data partnership

