# You Need to Select a Major First!

## What's Happening

You're seeing:
```
💡 Major selection options detected.
✅ The script extracted data from visible tables.
```

But this means:
- ✅ The script found tables on the page
- ❌ But the tables are **empty** (no course data yet)
- 💡 You need to **select a major first** to populate the tables

## What to Do Next

### Step 1: Look for Major Selection Options

On the ASSIST.org page, look for:
- A **dropdown menu** labeled "Select Major", "Agreement", "Program", etc.
- **Radio buttons** or **checkboxes** with major names
- **Buttons** that say "View Agreement" or "Select"

### Step 2: Select a Major

1. **Click** on the dropdown/selection option
2. **Choose a major** (e.g., "Computer Science", "Business Administration", "General Education")
3. **Wait** for the page to update (5-10 seconds)

### Step 3: Verify Table Has Data

After selecting, you should see:
- ✅ A table with **course codes** (like "MATH 1A", "ENGL 1A")
- ✅ **Course names** in the table
- ✅ **Multiple rows** of data

**If you see:**
- ❌ Empty table
- ❌ Only headers, no data
- ❌ "No data available" message

Then try selecting a different major or waiting longer.

### Step 4: Run the Script Again

Once you can **see course data in the table**:

1. **Scroll down** to make sure the table is fully visible
2. **Wait** 5 more seconds to be sure it's loaded
3. **Run the script again** in the console
4. This time you should see: `✅ Found X articulations`

## Visual Guide

### Before (Empty Tables)
```
[Dropdown: Select Major ▼]
┌─────────────────────────┐
│ Course Code | Course... │  ← Empty table
├─────────────────────────┤
│ (no data)               │
└─────────────────────────┘
```

### After (Table with Data)
```
[Dropdown: Computer Science ✓]
┌─────────────────────────┐
│ Course Code | Course... │
├─────────────────────────┤
│ MATH 1A     | Calculus  │  ← Data!
│ ENGL 1A     | Composition│ ← Data!
│ PHYS 2A     | Physics   │  ← Data!
└─────────────────────────┘
```

## Where to Find Major Selection

The major selection might be:

1. **At the top of the page** - A dropdown menu
2. **Next to the tables** - Selection options beside each table
3. **In a sidebar** - Left or right side of the page
4. **In tabs** - Different majors in different tabs

Look for text like:
- "Select Major"
- "Choose Agreement"
- "View by Program"
- Major names (Computer Science, Business, etc.)

## Quick Checklist

Before running the script, make sure:

- [ ] I can see a **dropdown or selection option** for majors
- [ ] I have **selected a specific major**
- [ ] I can see a **table with actual course data** (not just headers)
- [ ] The table shows **course codes** like "MATH 1A"
- [ ] I've **waited 10 seconds** after selecting the major
- [ ] I've **scrolled down** to see the full table

## Still Can't Find It?

Try this:

1. **Look at the page carefully** - Major selection might be small or in an unexpected place
2. **Try clicking different elements** - Dropdowns, buttons, tabs
3. **Check if there are multiple views** - Maybe you need to click "View Agreement" first
4. **Read the page text** - Look for instructions about selecting a major

## Summary

**The key is:** You need to see **actual course data in a table** before running the script. Empty tables won't work - you must select a major first to populate them with data!

Once you see course codes and names in the table, then run the script and it will work! ✅












