# TransferAble Deployment Guide

This guide will walk you through deploying TransferAble to production.

## Pre-Deployment Checklist

### 1. Environment Variables

Copy `.env.example` to create a production `.env` file and fill in all required values:

- [ ] **Clerk Authentication**
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - Get from [Clerk Dashboard](https://dashboard.clerk.com/)

- [ ] **Database**
  - `DATABASE_URL` - PostgreSQL connection string
  - Recommended: [Railway](https://railway.app/), [Supabase](https://supabase.com/), or [Neon](https://neon.tech/)

- [ ] **App URL**
  - `NEXT_PUBLIC_APP_URL` - Your production domain (e.g., https://transferable.app)

- [ ] **Supabase (if using for storage)**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_ACCESS_TOKEN`

- [ ] **OpenAI API (for AI features)**
  - `OPENAI_API_KEY`
  - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

- [ ] **Stripe (for payments)**
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

- [ ] **Resend (for emails)**
  - `RESEND_API_KEY`
  - Get from [Resend](https://resend.com/api-keys)

### 2. Database Setup

- [ ] Run Prisma migrations:
  ```bash
  npm run db:generate
  npm run db:migrate
  ```

- [ ] (Optional) Seed the database:
  ```bash
  npm run db:seed
  ```

### 3. Build Test

- [ ] Test production build locally:
  ```bash
  npm run build
  npm start
  ```

- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Verify database connections

### 4. Code Quality

- [ ] Run linter:
  ```bash
  npm run lint
  ```

- [ ] Fix any critical linting errors
- [ ] Review all console warnings

## Deployment Platforms

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub/GitLab repository

2. **Configure Environment Variables**
   - Add all environment variables from `.env`
   - Make sure to set `NEXT_PUBLIC_APP_URL` to your Vercel domain

3. **Database Configuration**
   - Set up PostgreSQL database (Railway, Supabase, or Neon)
   - Add `DATABASE_URL` to Vercel environment variables

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

5. **Post-Deployment**
   - Run database migrations if needed
   - Test all features in production
   - Set up custom domain in Vercel settings

### Option 2: Railway

1. **Create New Project**
   - Go to [Railway](https://railway.app/)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the connection string to `DATABASE_URL`

3. **Configure Environment Variables**
   - Add all environment variables from `.env`
   - Set `NEXT_PUBLIC_APP_URL` to your Railway domain

4. **Deploy**
   - Railway will automatically detect Next.js and deploy

### Option 3: Self-Hosted (Docker)

```bash
# Build Docker image
docker build -t transferable .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-key" \
  # ... add all other env vars
  transferable
```

## Post-Deployment Steps

### 1. Domain Setup

- [ ] Configure custom domain
- [ ] Set up SSL/TLS certificate (automatic on Vercel/Railway)
- [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain
- [ ] Update Clerk allowed domains

### 2. Stripe Setup

- [ ] Create Stripe products and prices
- [ ] Set up webhook endpoint: `https://your-domain.com/api/payments/webhook`
- [ ] Add webhook secret to environment variables
- [ ] Test payment flow in production

### 3. Email Setup

- [ ] Configure Resend domain
- [ ] Verify email sending works
- [ ] Set up email templates

### 4. Monitoring

- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure analytics (Google Analytics, Plausible, etc.)
- [ ] Set up uptime monitoring
- [ ] Enable Vercel/Railway logs

### 5. SEO

- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt is accessible
- [ ] Test OpenGraph images on social media
- [ ] Set up Google Analytics verification

### 6. Security

- [ ] Review CORS settings
- [ ] Verify authentication redirects
- [ ] Test rate limiting on API routes
- [ ] Enable Content Security Policy (CSP)
- [ ] Review and rotate any exposed API keys

### 7. Performance

- [ ] Run Lighthouse audit
- [ ] Optimize images (already using Next.js Image)
- [ ] Enable caching headers
- [ ] Test on mobile devices
- [ ] Verify loading states work

## Testing in Production

### Functional Tests

- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Onboarding completes successfully
- [ ] Course planning features work
- [ ] Mentor matching works
- [ ] Timeline generation works
- [ ] Payment flow completes
- [ ] Email notifications send

### Browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Performance Checks

- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Images load correctly
- [ ] Responsive on all screen sizes

## Rollback Plan

If something goes wrong:

1. **Vercel**: Click "Rollback" to previous deployment
2. **Railway**: Redeploy previous commit
3. **Database**: Restore from backup (set up automated backups!)

## Maintenance

### Regular Tasks

- [ ] Monitor error logs weekly
- [ ] Check database performance
- [ ] Review user feedback
- [ ] Update dependencies monthly
- [ ] Backup database regularly

### Updates

When deploying updates:

1. Test locally first
2. Deploy to staging environment (if available)
3. Run migrations before deploying code changes
4. Monitor error logs after deployment
5. Be ready to rollback if needed

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Clerk Docs**: https://clerk.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Stripe Docs**: https://stripe.com/docs

## Emergency Contacts

Add your team contacts here:

- **Technical Lead**: [Name/Email]
- **DevOps**: [Name/Email]
- **On-Call**: [Phone/Email]

---

**Last Updated**: 2025-12-11
**Version**: 1.0.0
