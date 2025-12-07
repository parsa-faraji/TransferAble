#!/bin/bash

# Safe GitHub Push Script for TransferAble
# This script helps you push your code safely without exposing secrets

echo "🔒 TransferAble - Safe GitHub Push"
echo "=================================="
echo ""

# Check if .env exists and is ignored
echo "1. Checking security..."
if [ -f .env ]; then
    if git check-ignore .env > /dev/null 2>&1; then
        echo "   ✅ .env file is properly ignored"
    else
        echo "   ⚠️  WARNING: .env file is NOT ignored!"
        echo "   Please add .env to .gitignore before continuing"
        exit 1
    fi
else
    echo "   ✅ No .env file found (this is okay)"
fi

# Check for any secrets in tracked files
echo ""
echo "2. Checking for exposed secrets..."
if git grep -i "sk_live_\|sk_test_\|pk_live_\|pk_test_" -- ':!*.md' ':!*.sh' 2>/dev/null | grep -v ".env.example" | head -5; then
    echo "   ⚠️  WARNING: Found potential API keys in tracked files!"
    echo "   Please remove them before pushing"
    exit 1
else
    echo "   ✅ No exposed API keys found"
fi

# Show what will be committed
echo ""
echo "3. Files to be committed:"
git status --short | head -20

echo ""
read -p "Continue with commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Add all files
echo ""
echo "4. Adding files..."
git add .

# Create commit
echo ""
echo "5. Creating commit..."
git commit -m "Add premium features, deployment guides, and security improvements

- Premium plan tracking and access control
- AI homework help feature (premium)
- AI counselor feature (premium)
- Rotating university background photos
- Complete deployment guide
- Complete marketing guide
- Enhanced .gitignore for security
- Environment variables template"

# Show final status
echo ""
echo "6. Final check..."
echo "   Files in commit:"
git diff --cached --name-only | head -10

echo ""
read -p "Push to GitHub? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Commit created but not pushed. Run 'git push' when ready."
    exit 0
fi

# Push
echo ""
echo "7. Pushing to GitHub..."
git push

echo ""
echo "✅ Done! Your code is safely on GitHub."
echo ""
echo "⚠️  REMINDER: Never commit your .env file or API keys!"
echo "   Your Stripe key should stay in .env (local only)"


