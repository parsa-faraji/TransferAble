# AI Features Setup Guide

## ✅ What's Been Implemented

### 1. **Improved Course Name Validation**
- More aggressive filtering in extraction script
- Rejects punctuation-only, numbers-only, and nonsensical names
- Requires meaningful words (3+ letters)

### 2. **AI-Filtered Course Recommendations**
- API endpoint: `/api/courses/ai-filter`
- Uses LLM to validate course equivalencies
- Only shows accurate, semantically related courses
- Returns confidence scores (high/medium/low)

### 3. **Education Plan Generator**
- API endpoint: `/api/education-plan/generate`
- Creates personalized course plans
- Tracks completed vs remaining courses
- Recommends next courses based on prerequisites

### 4. **Updated UI**
- Courses page uses AI filtering
- New Education Plan page
- Real-time filtering with "Re-filter with AI" button

## 🔧 Setup Steps

### Step 1: Add OpenAI API Key to Environment

Create a `.env` file in the root directory (if it doesn't exist):

```bash
# Copy from .env.example
cp .env.example .env
```

Or manually create `.env` and add:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The extraction script (`assist-extract-simple.js`) has the key hardcoded, but the API routes need it in `.env`.

### Step 2: Test the Setup

Run the test script:

```bash
npx tsx scripts/test-ai-filtering.ts
```

This will:
- Check if API key is configured
- Test database connection
- Show sample course equivalencies
- Verify everything is ready

### Step 3: Import Course Data

1. Go to ASSIST.org and extract course data using `scripts/assist-extract-simple.js`
2. Import the CSV via `/admin/articulations`
3. The AI filtering will automatically validate entries

### Step 4: Test the Features

1. **Courses Page** (`/courses`):
   - View AI-filtered course equivalencies
   - Click "Re-filter with AI" to re-validate
   - Only accurate courses are shown

2. **Education Plan** (`/education-plan`):
   - Click "Generate Education Plan"
   - Get personalized course recommendations
   - See progress and next steps

## 🎯 How It Works

### AI Filtering Process

1. **Basic Validation** (always runs):
   - Filters out short names (< 3 chars)
   - Rejects punctuation-only names
   - Requires meaningful words

2. **AI Validation** (if API key available):
   - Validates course names are not nonsense
   - Checks if courses are semantically related
   - Assigns confidence scores
   - Rejects invalid articulations

### Education Plan Generation

1. Gets user's target universities and majors
2. Fetches major requirements
3. Maps requirements to CC courses via equivalencies
4. Filters with AI to ensure accuracy
5. Categorizes: completed, remaining, recommended
6. Sorts by prerequisites and sequencing

## 🔍 Troubleshooting

### "No courses found"
- Make sure you've imported course data
- Check database connection
- Verify community college and university IDs

### "Filtered without AI"
- Add `OPENAI_API_KEY` to `.env` file
- Restart the Next.js server
- The basic filtering still works, but AI adds extra validation

### API Errors
- Check if API key is valid
- Verify rate limits aren't exceeded
- Check console for detailed error messages

## 📊 What Gets Filtered

The AI filtering rejects:
- ❌ Nonsensical course names (just punctuation)
- ❌ Unrelated course equivalencies (e.g., History = Math)
- ❌ Invalid course codes
- ❌ Courses that don't make academic sense

The AI filtering keeps:
- ✅ Valid course names with meaningful words
- ✅ Semantically related courses (same subject)
- ✅ Verified course equivalencies
- ✅ Courses that make academic sense

## 🚀 Next Features to Build

Based on your requirements, here's what to build next:

1. **Mentor Matching with AI** - Use embeddings to match students with mentors
2. **PIQ Essay Feedback** - AI-powered essay review
3. **Transcript Parsing** - Upload transcript, AI extracts courses
4. **Application Deadline Tracking** - Automated timeline with notifications
5. **Scholarship Finder** - AI-powered scholarship matching










