# TransferAble - Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to your `.env` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 3: Set Up Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE transferable;
```

3. Update `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/transferable?schema=public"
```

#### Option B: Cloud Database (Recommended)

1. Sign up for [Railway](https://railway.app) or [Supabase](https://supabase.com)
2. Create a new PostgreSQL database
3. Copy the connection string to your `.env` file

### Step 4: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📝 Next Steps

1. **Seed Initial Data** (Optional)
   - Add community colleges
   - Add universities
   - Add course equivalencies

2. **Test the Flow**
   - Sign up for an account
   - Complete onboarding
   - Explore the dashboard

3. **Customize**
   - Update branding/colors in `tailwind.config.ts`
   - Add your own community colleges/universities
   - Customize the onboarding flow

## 🔧 Common Issues

### Database Connection Error
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running (if local)
- Verify database credentials

### Clerk Authentication Not Working
- Verify your Clerk keys are correct
- Check that middleware is properly configured
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_`

### Prisma Errors
- Run `npm run db:generate` after schema changes
- Use `npm run db:push` for development
- Use `npm run db:migrate` for production

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🆘 Need Help?

Check the main [README.md](./README.md) for more detailed information.


