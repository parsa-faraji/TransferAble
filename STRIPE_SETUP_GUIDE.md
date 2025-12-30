# Stripe Payment Setup Guide for TransferAble

## 📋 **Complete Setup Checklist**

### ✅ Step 1: Get Stripe API Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/test/apikeys
2. **Copy these keys**:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

3. **Update your `.env` file**:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

---

### ✅ Step 2: Create $29/Year Premium Product

1. **Go to Products**: https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**
3. Fill in the form:

```
Product Name: TransferAble Premium
Description: Annual subscription with unlimited universities, TAG tracker, AI predictions, and priority mentor matching

Pricing Model: Recurring
Price: $29.00 USD
Billing Period: Yearly
Trial Period: 14 days (optional)
```

4. Click **"Save product"**
5. **COPY THE PRICE ID** - it looks like: `price_1XxXxXxXxXxXxX`

6. **Add to `.env` file**:
```env
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_YOUR_ACTUAL_PRICE_ID_HERE
```

**OR** Use Stripe CLI (if installed):
```bash
stripe products create \
  --name="TransferAble Premium" \
  --description="Annual subscription for California transfer students"

stripe prices create \
  --product=prod_YOUR_PRODUCT_ID \
  --unit-amount=2900 \
  --currency=usd \
  --recurring[interval]=year \
  --recurring[trial_period_days]=14
```

---

### ✅ Step 3: Set Up Webhook Endpoint

Webhooks notify your app when payments succeed, subscriptions cancel, etc.

#### For Local Testing (Development):

1. **Install Stripe CLI** (if not already installed):
```bash
brew install stripe/stripe-cli/stripe
```

2. **Login to Stripe**:
```bash
stripe login
```

3. **Forward webhooks to localhost**:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the webhook signing secret (starts with `whsec_`)
5. Add to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LOCAL_WEBHOOK_SECRET
```

#### For Production (Vercel):

1. **Go to Webhooks**: https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. **Endpoint URL**: `https://your-domain.vercel.app/api/webhooks/stripe`
4. **Select events to listen to**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. Click **"Add endpoint"**
6. **Copy the Signing secret** (starts with `whsec_`)
7. Add to Vercel environment variables or `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET
```

---

### ✅ Step 4: Complete `.env` File

Your final `.env` should have these Stripe variables:

```env
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_YOUR_PRICE_ID_HERE
```

**Replace the placeholders** with your actual keys from Stripe Dashboard.

---

### ✅ Step 5: Test the Payment Flow

1. **Restart your dev server** (to load new env variables):
```bash
npm run dev
```

2. **Go to**: http://localhost:3000/payments

3. Click **"Start Free Trial"** on the Premium card

4. **Use Stripe test card**:
```
Card Number: 4242 4242 4242 4242
Expiration: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

5. Complete the checkout

6. **Verify**:
   - You're redirected to `/payments/success`
   - Check your database - user's `subscriptionTier` should be `PREMIUM`
   - Check Stripe Dashboard > Customers - you should see the new subscription

---

## 🚀 **What Happens During Payment Flow**

### 1. User clicks "Start Free Trial"
- App calls `/api/payments/create-checkout`
- Creates Stripe Checkout session with 14-day trial
- Redirects to Stripe-hosted checkout page

### 2. User enters payment info
- Stripe securely processes payment (you never see card details)
- No charge for 14 days (trial period)

### 3. Checkout completes
- User redirected to `/payments/success?session_id=...`
- Stripe sends webhook to `/api/webhooks/stripe`
- Webhook updates user's `subscriptionTier` to `PREMIUM` in database

### 4. After 14 days
- Stripe automatically charges $29
- Subscription becomes active
- Webhooks notify your app of successful payment

### 5. On subscription renewal (1 year later)
- Stripe automatically charges $29 again
- Webhooks confirm payment
- Subscription continues

---

## 🔧 **Troubleshooting**

### "Stripe not configured" error
- Make sure all 4 env variables are in `.env` file
- Restart dev server: `npm run dev`

### Webhook not working locally
- Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Keep terminal open while testing
- Copy the `whsec_` secret to `.env`

### Test payments not working
- Use test keys (`pk_test_`, `sk_test_`)
- Use test card: 4242 4242 4242 4242
- Check Stripe Dashboard > Logs for errors

### User not upgraded after payment
- Check `/api/webhooks/stripe` is receiving events
- Check Stripe Dashboard > Webhooks > Events
- Look for `checkout.session.completed` event
- Verify webhook signature is correct

---

## 💰 **Pricing Model**

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/forever | 2 universities, basic planning, timeline |
| **Premium** | $29/year | Unlimited universities, TAG tracker, AI predictions, SMS reminders |

**Trial Period**: 14 days free, then $29/year

**Renewal**: Automatic yearly billing

**Cancellation**: User can cancel anytime, keeps access until end of billing period

---

## 📊 **Monitoring Payments**

### Stripe Dashboard
- **Test Mode**: https://dashboard.stripe.com/test/dashboard
- **Live Mode**: https://dashboard.stripe.com/dashboard (after going live)

### Key Metrics to Track
1. **New subscriptions** (MRR growth)
2. **Churn rate** (cancellations)
3. **Trial conversions** (% of trials that convert to paid)
4. **Failed payments** (update payment method emails)

---

## 🔴 **Going Live (Production)**

When ready to accept real payments:

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get LIVE API keys**: https://dashboard.stripe.com/apikeys
3. **Create LIVE product** (same $29/year setup)
4. **Update production env variables** in Vercel:
```env
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_YOUR_LIVE_PRICE_ID
```

5. **Set up live webhook** pointing to your production domain

6. **Test with real card** (small amount first!)

---

## 📞 **Support**

- **Stripe Docs**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Test Cards**: https://stripe.com/docs/testing

---

## ✅ **Quick Verification**

After setup, verify:
- [ ] `.env` has all 4 Stripe variables
- [ ] Product created in Stripe Dashboard ($29/year)
- [ ] Price ID copied to `.env`
- [ ] Webhook endpoint added (local or production)
- [ ] Test payment completes successfully
- [ ] User's database record updates to `PREMIUM`
- [ ] Subscription visible in Stripe Dashboard

**Your Stripe setup is complete!** 🎉
