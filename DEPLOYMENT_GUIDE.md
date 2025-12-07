# TransferAble - Complete Deployment & Hosting Guide

## 🚀 Recommended Hosting Stack

### Primary Stack (Recommended)
- **Frontend/Backend**: Vercel (Next.js optimized)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk (already integrated)
- **Email**: Resend
- **Payments**: Stripe
- **CDN**: Vercel Edge Network (included)
- **Domain**: Namecheap, Google Domains, or Cloudflare

### Alternative Stack
- **Frontend/Backend**: AWS Amplify or Railway
- **Database**: AWS RDS (PostgreSQL) or Railway PostgreSQL
- **File Storage**: AWS S3 (if needed)
- **Email**: AWS SES or SendGrid
- **Payments**: Stripe (same)
- **CDN**: CloudFront (AWS) or Cloudflare

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Create `.env.production` with all required variables:

```env
# Database
DATABASE_URL=postgresql://...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_...

# Email (Resend)
RESEND_API_KEY=re_...
COMPANY_EMAIL=hello@transferable.app

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=https://transferable.app

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 2. Database Setup
```bash
# Run migrations
npx prisma migrate deploy

# Or push schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 3. Build Test
```bash
npm run build
npm start
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Steps:
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/transferable.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.production`
   - Set for "Production", "Preview", and "Development"

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get your URL: `https://your-project.vercel.app`

5. **Custom Domain**
   - Settings → Domains
   - Add your domain
   - Update DNS records as instructed

#### Vercel Advantages:
- ✅ Zero-config Next.js deployment
- ✅ Automatic HTTPS
- ✅ Edge network (fast global CDN)
- ✅ Preview deployments for PRs
- ✅ Automatic builds on git push
- ✅ Free tier: 100GB bandwidth/month

#### Pricing:
- **Hobby (Free)**: Good for MVP
- **Pro ($20/month)**: Better limits, team features
- **Enterprise**: Custom pricing

### Option 2: AWS (More Control)

#### Architecture:
```
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
Elastic Beanstalk / ECS / EC2 (App)
    ↓
RDS PostgreSQL (Database)
    ↓
S3 (Static Assets)
```

#### Steps:
1. **Set up RDS PostgreSQL**
   - AWS Console → RDS → Create Database
   - Choose PostgreSQL
   - Set up security groups
   - Note connection string

2. **Deploy App**
   - Option A: Elastic Beanstalk
     - Upload Next.js build
     - Configure environment variables
   - Option B: ECS (Docker)
     - Create Dockerfile
     - Push to ECR
     - Deploy to ECS
   - Option C: EC2
     - Launch EC2 instance
     - Install Node.js
     - Run `npm start`

3. **Set up CloudFront**
   - Create distribution
   - Point to app origin
   - Configure caching

4. **Set up Route 53**
   - Create hosted zone
   - Add DNS records

#### AWS Advantages:
- ✅ Full control
- ✅ Scalable
- ✅ Enterprise-grade
- ❌ More complex setup
- ❌ Higher cost

#### Estimated Monthly Cost:
- RDS (db.t3.micro): ~$15/month
- EC2 (t3.small): ~$15/month
- CloudFront: ~$5-20/month
- Route 53: ~$0.50/month
- **Total**: ~$35-50/month minimum

### Option 3: Railway (Simple Alternative)

#### Steps:
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Add PostgreSQL service
5. Add environment variables
6. Deploy

#### Railway Advantages:
- ✅ Simple deployment
- ✅ Built-in PostgreSQL
- ✅ Automatic HTTPS
- ✅ $5/month credit (free tier)

## 📧 Email Domain Setup

### Option 1: Resend (Recommended)
1. Sign up at https://resend.com
2. Verify domain:
   - Add domain in dashboard
   - Add DNS records:
     - TXT record for verification
     - MX records (if needed)
     - SPF record
     - DKIM records
3. Wait for verification (usually < 1 hour)
4. Use verified domain in `COMPANY_EMAIL`

### Option 2: Google Workspace
1. Sign up at https://workspace.google.com
2. Choose domain
3. Verify domain ownership
4. Set up email: `hello@transferable.app`
5. Use SMTP with Nodemailer

### Option 3: Cloudflare Email Routing (Free)
1. Add domain to Cloudflare
2. Enable Email Routing
3. Create email address
4. Forward to personal email
5. Use Cloudflare API for sending

## 🔒 Security Checklist

- [ ] All API keys in environment variables (never commit)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Database connection string secured
- [ ] Stripe webhook signature verified
- [ ] CORS configured properly
- [ ] Rate limiting on API routes
- [ ] Input validation on all forms
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React auto-escapes)
- [ ] CSRF protection (Next.js built-in)

## 📊 Monitoring & Analytics

### Recommended Tools:
1. **Vercel Analytics** (built-in)
   - Page views
   - Performance metrics
   - Real user monitoring

2. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   ```
   - Error tracking
   - Performance monitoring
   - User feedback

3. **Google Analytics** (Optional)
   - User behavior
   - Conversion tracking
   - Custom events

4. **PostgreSQL Monitoring**
   - Supabase dashboard (if using Supabase)
   - AWS CloudWatch (if using RDS)
   - pgAdmin (self-hosted)

## 🚀 Post-Deployment Steps

1. **Test All Features**
   - Sign up flow
   - Onboarding
   - Course planning
   - Payments
   - Email sending

2. **Set up Monitoring**
   - Error tracking
   - Performance monitoring
   - Uptime monitoring (UptimeRobot, Pingdom)

3. **Backup Strategy**
   - Database backups (daily)
   - Code in version control (GitHub)
   - Environment variables documented

4. **SSL Certificate**
   - Automatic on Vercel
   - Let's Encrypt on AWS/Railway

5. **CDN Configuration**
   - Cache static assets
   - Optimize images
   - Enable compression

## 💰 Cost Estimates

### MVP (Low Traffic)
- **Vercel Hobby**: Free
- **Supabase**: Free tier
- **Clerk**: Free tier (10K MAU)
- **Stripe**: 2.9% + $0.30 per transaction
- **Resend**: Free tier (3K emails/month)
- **Domain**: ~$12/year
- **Total**: ~$1-5/month

### Growth Stage (10K users)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Clerk**: ~$25/month
- **Stripe**: Transaction fees only
- **Resend**: ~$20/month
- **Domain**: ~$12/year
- **Total**: ~$90-100/month

### Scale Stage (100K users)
- **Vercel Pro**: $20/month
- **Supabase**: ~$100/month
- **Clerk**: ~$200/month
- **Stripe**: Transaction fees
- **Resend**: ~$100/month
- **Total**: ~$420+/month

## 🔄 CI/CD Setup

### GitHub Actions (Recommended)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npx prisma generate
```

## 📝 Next Steps After Deployment

1. **SEO Optimization**
   - Submit sitemap to Google
   - Set up Google Search Console
   - Optimize meta tags

2. **Performance**
   - Run Lighthouse audit
   - Optimize images
   - Enable caching

3. **Marketing**
   - Set up Google Analytics
   - Create social media accounts
   - Start content marketing

4. **Support**
   - Set up help desk (Intercom, Zendesk)
   - Create FAQ page
   - Set up email support

## 🆘 Troubleshooting

### Common Issues:
1. **Build Fails**
   - Check environment variables
   - Verify Prisma schema
   - Check Node.js version

2. **Database Connection Issues**
   - Verify DATABASE_URL
   - Check firewall rules
   - Test connection locally

3. **API Routes Not Working**
   - Check middleware
   - Verify authentication
   - Check CORS settings

4. **Stripe Webhook Not Working**
   - Verify webhook URL
   - Check signature verification
   - Test with Stripe CLI

## 📚 Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Resend Docs](https://resend.com/docs)


