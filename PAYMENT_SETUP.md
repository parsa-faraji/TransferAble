# Payment Setup Guide

## Stripe Configuration

### 1. Create Stripe Account
1. Go to https://stripe.com and create an account
2. Get your API keys from Dashboard → Developers → API keys
3. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### 2. Create Products & Prices
1. Go to Stripe Dashboard → Products
2. Create a product: "TransferAble Premium"
3. Create prices:
   - Monthly: $9.99/month (recurring)
   - Yearly: $99.99/year (recurring) - optional
4. Copy the Price IDs and add to `.env`:
   ```env
   NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_...
   NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=price_...
   ```

### 3. Set Up Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 4. Test Mode
- Use test cards: https://stripe.com/docs/testing
- Test card: `4242 4242 4242 4242`
- Any future expiry date, any CVC

## Email Setup (Resend)

### 1. Create Resend Account
1. Go to https://resend.com and create account
2. Verify your domain (or use their test domain)
3. Get API key from Dashboard
4. Add to `.env`:
   ```env
   RESEND_API_KEY=re_...
   COMPANY_EMAIL=hello@transferable.app
   ```

### 2. Domain Setup (Optional)
- For production, verify your domain in Resend
- Update DNS records as instructed
- Use verified domain in `COMPANY_EMAIL`

## Environment Variables Summary

Add all of these to your `.env` file:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=price_...

# Email (Resend)
RESEND_API_KEY=re_...
COMPANY_EMAIL=hello@transferable.app

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing Payments

1. Start dev server: `npm run dev`
2. Go to `/payments`
3. Click "Subscribe to Premium"
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify webhook updates user subscription in database

## Production Checklist

- [ ] Switch to live Stripe keys
- [ ] Verify domain in Resend
- [ ] Update webhook URL to production domain
- [ ] Test payment flow end-to-end
- [ ] Set up subscription management page
- [ ] Add cancel subscription functionality


