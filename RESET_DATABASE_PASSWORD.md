# How to Reset Your Supabase Database Password

## Steps to Reset Password:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `wgvvcsguyhwjjmlmxkyd`
3. Go to **Settings** → **Database**
4. Scroll down to **Database password** section
5. Click **Reset database password**
6. Enter a new password (or generate one)
7. **IMPORTANT**: Copy and save this password immediately - you won't be able to see it again!
8. Update your `.env` file with the new password

## Update .env File:

Replace `[YOUR_PASSWORD]` in your `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_NEW_PASSWORD_HERE@db.wgvvcsguyhwjjmlmxkyd.supabase.co:5432/postgres?schema=public"
```

## Alternative: Get Connection String Directly

After resetting, you can also:
1. Go to **Settings** → **Database**
2. Scroll to **Connection string** → **URI** tab
3. Copy the entire connection string (it already includes the password)
4. Paste it directly into `.env` as `DATABASE_URL`

## After Setting Password:

Once you've updated the password in `.env`, run:

```bash
npm install
npm run db:generate
npm run db:push
```

This will create all your database tables!

