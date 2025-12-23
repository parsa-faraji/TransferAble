# ASSIST.org URL Format Guide

## Overview

ASSIST.org uses different URL formats depending on how you access the articulation agreements. This document explains both formats and how to use them.

## URL Format 1: New Format (Current)

### Structure
```
https://assist.org/transfer/results?year=X&institution=Y&agreement=Z&agreementType=to&viewAgreementsOptions=true&view=agreement
```

### Example
```
https://assist.org/transfer/results?year=76&institution=58&agreement=79&agreementType=to&viewAgreementsOptions=true&view=agreement
```

### Parameters

- **year**: Academic year ID (e.g., `76` = 2024-2025)
- **institution**: Source institution ID (e.g., `58` = Berkeley City College)
- **agreement**: Agreement ID (e.g., `79` = BCC to UCB agreement)
- **agreementType**: `to` (transferring to) or `from`
- **viewAgreementsOptions**: `true`
- **view**: `agreement`

### Where to Find This URL

1. Go to [assist.org](https://assist.org)
2. Navigate through the interface:
   - Select Academic Year
   - Select "From" institution (Community College)
   - Select "To" institution (UC/CSU)
   - Click "View Agreements"
   - **Before selecting major option** - you'll see this URL format

### Mapping IDs

We need to map these numeric IDs to our college/university codes:

#### Known Mappings

| Institution ID | College/University | Our Code |
|---------------|-------------------|----------|
| 58 | Berkeley City College | BCC |
| ? | College of Alameda | COA |
| ? | Laney College | LANEY |
| ? | Merritt College | MERRITT |

#### Agreement IDs

- Agreement ID `79` = BCC → UC Berkeley
- More mappings need to be discovered

#### Year IDs

- Year `76` = 2024-2025 Academic Year
- More mappings need to be discovered

## URL Format 2: Old Format (Legacy)

### Structure
```
https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=XXXXX&institution2=YYYYY
```

### Example
```
https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=001286&institution2=001319
```

### Parameters

- **institution1**: Source institution code (6-digit, e.g., `001286` = BCC)
- **institution2**: Destination institution code (6-digit, e.g., `001319` = UCB)

### Known Institution Codes

#### Community Colleges
- `001286` = Berkeley City College (BCC)
- `001287` = College of Alameda (COA)
- `001288` = Laney College
- `001289` = Merritt College

#### UC Universities
- `001319` = UC Berkeley (UCB)
- `001312` = UCLA
- `001320` = UC San Diego (UCSD)
- `001313` = UC Davis (UCD)
- `001314` = UC Santa Barbara (UCSB)
- `001315` = UC Irvine (UCI)
- `001316` = UC Santa Cruz (UCSC)
- `001317` = UC Riverside (UCR)
- `001318` = UC Merced (UCM)

#### CSU Universities
- `001154` = San Francisco State (SFSU)
- `001470` = San Jose State (SJSU)
- `001146` = Cal State East Bay (CSUEB)
- `001145` = Cal State Monterey Bay (CSUMB)
- `001445` = Sonoma State (SSU)

## Which Format to Use?

### Browser Console Script
✅ **Works with both formats** - The script automatically detects which format is being used and extracts data accordingly.

### Puppeteer Script
⚠️ **Currently uses old format** - Needs to be updated to support new format or detect automatically.

### API Route
⚠️ **Currently uses old format** - Needs to be updated to support new format.

## How to Discover Mappings

### Method 1: Inspect URLs
1. Go to ASSIST.org
2. Navigate to an articulation page
3. Copy the URL from browser address bar
4. Note the parameter values
5. Map them to known colleges/universities

### Method 2: Browser Console
1. Go to articulation page
2. Open browser console
3. Check URL parameters:
   ```javascript
   const params = new URLSearchParams(window.location.search);
   console.log('Institution:', params.get('institution'));
   console.log('Agreement:', params.get('agreement'));
   console.log('Year:', params.get('year'));
   ```

### Method 3: Network Tab
1. Open browser DevTools
2. Go to Network tab
3. Navigate to articulation page
4. Look for API calls or page requests
5. Check request parameters

## Example: BCC → UC Berkeley

### New Format
```
https://assist.org/transfer/results?year=76&institution=58&agreement=79&agreementType=to&viewAgreementsOptions=true&view=agreement
```

- Year: 76 (2024-2025)
- Institution: 58 (Berkeley City College)
- Agreement: 79 (BCC → UCB)

### Old Format
```
https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=001286&institution2=001319
```

- Institution1: 001286 (Berkeley City College)
- Institution2: 001319 (UC Berkeley)

## Recommendations

1. **Use Browser Console Script** - It automatically handles both URL formats
2. **Extract from Page Content** - The script can read institution names from the page itself
3. **Manual Verification** - Always verify the extracted data matches what you see on screen

## Next Steps

1. ✅ Browser console script updated to handle both formats
2. ⚠️ Need to discover more institution/agreement ID mappings
3. ⚠️ Update Puppeteer script to support new format
4. ⚠️ Update API route to support new format

## Resources

- [ASSIST.org](https://assist.org)
- Browser Console Script: `scripts/assist-browser-helper.js`
- Puppeteer Script: `scripts/fetch-assist-puppeteer.ts`














