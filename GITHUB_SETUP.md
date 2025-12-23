# GitHub Setup Guide - Step by Step

## ⚠️ IMPORTANT: Security First!

**NEVER commit these to GitHub:**
- `.env` files
- API keys (Stripe, OpenAI, Clerk, etc.)
- Database passwords
- Private keys
- Any sensitive credentials

All sensitive data should be in `.env` files which are already in `.gitignore`.

## 🎯 Repository Type Recommendation

### **RECOMMENDED: Private Repository**
- ✅ Protects your code and business logic
- ✅ Keeps API keys and structure private
- ✅ Can be made public later if needed
- ✅ Free for personal accounts
- ✅ Better for a commercial product

### Public Repository (Only if):
- You want open-source contributions
- You're building a community project
- You don't mind exposing your architecture

**For TransferAble, I recommend PRIVATE** since it's a commercial product.

## 📋 Step-by-Step GitHub Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `transferable` or `transferable-app`
3. **Description**: "Smart course planning and mentorship platform for community college transfer students"
4. **Visibility**: Select **Private** ✅
5. **DO NOT** check "Add a README file" (we'll add our own)
6. Click "Create repository"

### Step 2: Prepare Your Local Repository

```bash
# Navigate to your project
cd "/Users/parsafaraji/Desktop/Projects Fall 2025/TransferAble"

# Initialize git (if not already done)
git init

# Check what will be committed
git status
```

### Step 3: Verify .gitignore is Working

```bash
# Check that .env files are ignored
git status | grep .env
# Should return nothing (meaning .env is ignored)

# Verify sensitive files are not tracked
ls -la .env* 2>/dev/null
# These files should exist locally but NOT be in git
```

### Step 4: Add Files to Git

```bash
# Add all safe files
git add .

# Check what's being added (make sure no .env files!)
git status

# You should see:
# - Source code files
# - Configuration files (package.json, etc.)
# - Documentation
# - Components, pages, etc.
# 
# You should NOT see:
# - .env
# - .env.local
# - node_modules/
# - .next/
```

### Step 5: Create Initial Commit

```bash
# Create your first commit
git commit -m "Initial commit: TransferAble MVP

- Course planning and equivalency database
- Timeline generator
- Mentorship network
- Application hub with PIQ editor
- Premium features (homework help, AI counselor)
- Payment integration (Stripe)
- Email service (Resend)
- Real university photos
- Complete documentation and guides"
```

### Step 6: Connect to GitHub

```bash
# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/transferable.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/transferable.git

# Verify remote is set
git remote -v
```

### Step 7: Push to GitHub

```bash
# Push to GitHub (first time)
git branch -M main
git push -u origin main
```

### Step 8: Set Up Environment Variables Template

Create a `.env.example` file (this WILL be committed):

```bash
# Create .env.example template
cat > .env.example << 'EOF'
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_...

# Email (Resend)
RESEND_API_KEY=re_...
COMPANY_EMAIL=hello@transferable.app

# OpenAI
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# Add and commit .env.example
git add .env.example
git commit -m "Add environment variables template"
git push
```

## 🔒 Security Checklist

Before pushing, verify:

- [ ] `.env` file is NOT in git (`git status` should not show it)
- [ ] `.env.local` is NOT in git
- [ ] No API keys in source code
- [ ] No database passwords in code
- [ ] `.gitignore` includes all sensitive files
- [ ] `.env.example` exists with placeholder values

## 📝 What Should Be Committed

### ✅ Safe to Commit:
- Source code (`.tsx`, `.ts`, `.js` files)
- Configuration files (`package.json`, `tsconfig.json`, `tailwind.config.ts`)
- Documentation (`.md` files)
- Public assets (`public/` folder)
- Prisma schema (`prisma/schema.prisma`)
- Components and pages
- API routes (code only, no keys)

### ❌ Never Commit:
- `.env` files
- `node_modules/`
- `.next/` build folder
- API keys or secrets
- Database connection strings with passwords
- Private keys (`.pem`, `.key` files)
- Local development files

## 🚀 After First Push

### 1. Add README.md
Create a professional README:

```bash
# The README.md already exists, but you can enhance it
```

### 2. Set Up Branch Protection (Optional)
- Go to GitHub repo → Settings → Branches
- Add rule for `main` branch
- Require pull request reviews
- Require status checks

### 3. Add GitHub Actions (Optional)
For CI/CD:
- Automatic testing
- Build verification
- Deployment automation

## 🔄 Future Workflow

### Daily Development:
```bash
# Make changes
git add .
git commit -m "Description of changes"
git push
```

### Feature Branches:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push feature branch
git push -u origin feature/new-feature

# Create Pull Request on GitHub
# Merge after review
```

## 🆘 Troubleshooting

### If you accidentally commit .env:
```bash
# Remove from git (but keep local file)
git rm --cached .env

# Add to .gitignore (if not already)
echo ".env" >> .gitignore

# Commit the fix
git add .gitignore
git commit -m "Remove .env from tracking"

# Push
git push

# IMPORTANT: If you already pushed, rotate your API keys!
```

### If repository is already public with secrets:
1. **Immediately rotate all API keys**
2. Make repository private
3. Remove sensitive files from history (advanced)
4. Or create new repository

## 📚 Next Steps After GitHub Setup

1. **Connect to Vercel**:
   - Vercel can auto-deploy from GitHub
   - Add environment variables in Vercel dashboard

2. **Set Up CI/CD**:
   - GitHub Actions for testing
   - Automatic deployments

3. **Collaboration**:
   - Add team members
   - Set up code review process

## ✅ Final Checklist

Before pushing:
- [ ] Repository is **PRIVATE**
- [ ] `.gitignore` is correct
- [ ] No `.env` files in `git status`
- [ ] `.env.example` created
- [ ] README.md is good
- [ ] All sensitive data excluded
- [ ] Initial commit message is descriptive

**Ready to push!** 🚀




