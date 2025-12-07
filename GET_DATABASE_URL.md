# How to Get Your Supabase Database Connection String

## Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `wgvvcsguyhwjjmlmxkyd`
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string** section
5. Select **URI** tab
6. Copy the connection string (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.wgvvcsguyhwjjmlmxkyd.supabase.co:5432/postgres
   ```
7. Replace `[YOUR-PASSWORD]` with your actual database password (or use the one shown)
8. Paste it into your `.env` file as `DATABASE_URL`

## Alternative: Connection Pooler (Recommended for Serverless)

If you're deploying to Vercel or using serverless functions, use the **Connection Pooler** string instead:
- Select **Connection pooling** tab
- Use the **Transaction** mode connection string
- Format: `postgresql://postgres.wgvvcsguyhwjjmlmxkyd:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

## Quick Copy Format:

Once you have your password, update `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.wgvvcsguyhwjjmlmxkyd.supabase.co:5432/postgres"
```

Or with connection pooler:
```env
DATABASE_URL="postgresql://postgres.wgvvcsguyhwjjmlmxkyd:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

