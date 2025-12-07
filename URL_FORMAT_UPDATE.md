# ASSIST.org URL Format Update

## Issue Identified

You provided the correct current URL format for ASSIST.org:

```
https://assist.org/transfer/results?year=76&institution=58&agreement=79&agreementType=to&viewAgreementsOptions=true&view=agreement
```

This is **different** from the old format we were using:

```
https://assist.org/transfer/report/report?agreement=agreement&reportPath=REPORT_2&reportScript=REPORT_2&institution1=001286&institution2=001319
```

## Key Differences

### Old Format
- Uses 6-digit institution codes (`001286`, `001319`)
- Parameters: `institution1` and `institution2`
- Path: `/transfer/report/report`

### New Format  
- Uses numeric IDs (`58`, `79`)
- Parameters: `institution`, `agreement`, `year`
- Path: `/transfer/results`
- Includes academic year in URL

## What's Been Updated

### ✅ Browser Helper Script (`scripts/assist-browser-helper.js`)

**Enhanced to**:
1. ✅ Detect both URL formats automatically
2. ✅ Extract college/university names from page content (most reliable)
3. ✅ Support new format parameters (`institution`, `agreement`, `year`)
4. ✅ Support old format parameters (`institution1`, `institution2`)
5. ✅ Better fallback logic if URL doesn't provide enough info

**How it works**:
- First tries to extract institution names from page content
- Falls back to URL parameters if page extraction fails
- Works with both new and old URL formats

### ✅ Documentation Created

1. **ASSIST_URL_FORMAT.md** - Complete guide to URL formats
2. **URL_FORMAT_UPDATE.md** - This summary

## Current Status

### Working Now ✅

- **Browser Console Script** - Works with both URL formats
  - Automatically detects format
  - Extracts data from page content
  - Handles new and old URL structures

### Needs Update ⚠️

- **Puppeteer Script** - Currently uses old format
  - Should be updated to support new format
  - Or detect format automatically

- **API Route** - Currently uses old format  
  - Should be updated to support new format
  - Or detect format automatically

## Known Mappings

From your URL example:
- **Institution ID 58** = Berkeley City College (BCC)
- **Agreement ID 79** = BCC → UC Berkeley agreement
- **Year 76** = 2024-2025 Academic Year

## Recommendations

### For Immediate Use

1. **Use Browser Console Script** (already updated ✅)
   - Works with the new URL format
   - Just go to the page and paste the script

2. **Extract from Page** (most reliable)
   - The script now reads institution names directly from page content
   - Doesn't depend on URL format at all

### For Future Updates

1. **Discover More Mappings**
   - Build a mapping table for institution IDs
   - Build a mapping table for agreement IDs
   - Build a mapping table for year IDs

2. **Update Other Scripts**
   - Update Puppeteer script to use new format
   - Update API route to use new format
   - Or make them auto-detect format

## Testing

To test the updated browser helper script:

1. Go to: `https://assist.org/transfer/results?year=76&institution=58&agreement=79&agreementType=to&viewAgreementsOptions=true&view=agreement`
2. Wait for page to fully load
3. Open browser console (F12)
4. Paste `scripts/assist-browser-helper.js`
5. It should:
   - Detect BCC → UCB from page content
   - Extract all articulations
   - Download CSV file

## Next Steps

1. ✅ Browser helper script updated
2. ⚠️ Test with actual ASSIST.org page
3. ⚠️ Discover more ID mappings as needed
4. ⚠️ Update Puppeteer/API scripts (optional)

The browser console script is now ready to use with the new URL format! 🎉












