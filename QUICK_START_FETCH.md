# 🚀 Quick Start: Auto-Fetch ASSIST.org Data

## The Easiest Way (Browser Console) ⭐

**This works 100% of the time because it runs directly on ASSIST.org!**

### Steps:

1. **Go to ASSIST.org**:
   - Visit: https://assist.org
   - Navigate to the articulation page you want
   - Make sure the table is visible

2. **Open Browser Console**:
   - Press `F12` (Windows) or `Cmd+Option+I` (Mac)
   - Click the "Console" tab

3. **Copy & Paste Script**:
   - Open: `scripts/assist-browser-helper.js`
   - Copy ALL the code
   - Paste into console
   - Press Enter

4. **CSV Downloads Automatically!** ✅
   - File saved to your Downloads folder
   - Ready to import

5. **Import to Database**:
   - Go to: http://localhost:3000/admin/articulations
   - Click "Choose CSV File"
   - Select the downloaded file
   - Done! 🎉

---

## Alternative: Web Interface

1. Start server: `npm run dev`
2. Go to: http://localhost:3000/admin/articulations
3. Click "Fetch from ASSIST.org"
4. Select colleges
5. Click "Fetch Articulations"
6. Download CSV
7. Import via upload form

---

## Alternative: Command Line

```bash
# Install Puppeteer (one time)
npm install puppeteer

# Fetch data
npx tsx scripts/fetch-assist-puppeteer.ts BCC UCB
```

CSV saved to: `public/downloads/`

---

## Which Method Should I Use?

- **Browser Console** = Most reliable, works on any ASSIST.org page
- **Web Interface** = Easiest, but may need adjustments
- **Command Line** = Best for batch processing

**Recommendation**: Start with Browser Console method! 🎯

