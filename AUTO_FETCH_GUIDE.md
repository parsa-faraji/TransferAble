# Automatic ASSIST.org Data Fetching

## Two Methods Available

### Method 1: Web Interface (Easiest) ⭐

1. **Go to Admin Page**:
   - Navigate to: http://localhost:3000/admin/articulations
   - Click **"Fetch from ASSIST.org"** button

2. **Select Colleges**:
   - Choose Peralta college (BCC, COA, Laney, Merritt)
   - Choose target university (UCB, UCLA, etc.)

3. **Click "Fetch Articulations"**:
   - System will automatically:
     - Fetch data from ASSIST.org
     - Parse the articulation table
     - Convert to CSV format
     - Download the file

4. **Import**:
   - Download the CSV file
   - Or import directly to database

### Method 2: Command Line Script

For more control or batch processing:

```bash
# Install Puppeteer (one time)
npm install puppeteer

# Fetch articulations
npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB
```

This will:
- Launch a browser
- Navigate to ASSIST.org
- Extract articulation data
- Save as CSV file
- Output location: `public/downloads/`

## How It Works

1. **Fetches from ASSIST.org**: Uses the official ASSIST.org URL structure
2. **Parses HTML**: Extracts course articulation tables
3. **Converts to CSV**: Formats data for database import
4. **Saves File**: Downloads ready-to-import CSV

## Example Usage

### Fetch BCC → UC Berkeley:
```bash
npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB
```

### Fetch Laney → UCLA:
```bash
npx tsx scripts/fetch-assist-puppeteer.ts LANEY UCLA
```

## Available Codes

**Peralta Colleges:**
- `BCC` - Berkeley City College
- `COA` - College of Alameda
- `LANEY` - Laney College
- `MERRITT` - Merritt College

**UC Universities:**
- `UCB` - UC Berkeley
- `UCLA` - UCLA
- `UCSD` - UC San Diego
- `UCD` - UC Davis
- `UCSB` - UC Santa Barbara
- `UCI` - UC Irvine
- `UCSC` - UC Santa Cruz
- `UCR` - UC Riverside
- `UCM` - UC Merced

**CSU Universities:**
- `SFSU` - San Francisco State
- `SJSU` - San Jose State
- `CSUEB` - Cal State East Bay
- `CSUMB` - Cal State Monterey Bay
- `SSU` - Sonoma State

## Troubleshooting

### "No articulations found"
- Check if agreement exists on ASSIST.org manually
- ASSIST.org structure may have changed
- Try manual collection method instead

### "Failed to fetch"
- Check internet connection
- ASSIST.org may be down
- Rate limiting (wait a few minutes)

### Parsing errors
- ASSIST.org HTML structure may have changed
- Use manual CSV import as fallback

## Important Notes

⚠️ **Terms of Service**: Check ASSIST.org's ToS before automated fetching
⚠️ **Rate Limits**: Don't make too many requests quickly
⚠️ **Respectful Use**: Add delays between requests if batch processing

## Fallback: Manual Method

If automatic fetching doesn't work:
1. Go to ASSIST.org manually
2. Copy articulation table
3. Format as CSV
4. Use the CSV import feature

## Next Steps After Fetching

1. **Download CSV** from the fetch results
2. **Review Data** - Check if articulations look correct
3. **Import to Database**:
   - Go to `/admin/articulations`
   - Upload the CSV file
   - Verify import results

Happy fetching! 🎓

