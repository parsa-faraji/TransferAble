# How to Run TransferAble

## Quick Start

Since TransferAble is built with Next.js, the frontend and backend run together in a single process.

### 1. Install Dependencies (if not already done)

```bash
npm install
```

### 2. Set Up Environment Variables

Make sure your `.env` file is configured with:
- Clerk authentication keys
- Supabase database URL
- Supabase access token

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Start the Development Server

```bash
npm run dev
```

This single command starts **both** the frontend and backend:
- **Frontend**: React pages served at `http://localhost:3000`
- **Backend**: API routes available at `http://localhost:3000/api/*`

## How It Works

### Next.js Architecture

Next.js is a **full-stack framework** where:
- **Frontend** (React components) = `app/` directory
- **Backend** (API routes) = `app/api/` directory
- Both run in the **same Node.js process**

### File Structure

```
app/
├── page.tsx              # Frontend: Homepage
├── (dashboard)/         # Frontend: Dashboard pages
│   ├── dashboard/
│   ├── courses/
│   └── ...
└── api/                 # Backend: API routes
    ├── courses/
    ├── timeline/
    ├── mentors/
    └── ...
```

### API Routes (Backend)

Your API routes are automatically available at:
- `http://localhost:3000/api/courses`
- `http://localhost:3000/api/timeline`
- `http://localhost:3000/api/mentors`
- `http://localhost:3000/api/applications`
- etc.

### Frontend Pages

Your React pages are available at:
- `http://localhost:3000/` (Homepage)
- `http://localhost:3000/dashboard`
- `http://localhost:3000/courses`
- etc.

## Development Commands

```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Run migrations
npm run db:studio      # Open Prisma Studio (database GUI)
```

## Production Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Self-Hosted

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Troubleshooting

### Port Already in Use

If port 3000 is taken, Next.js will automatically use the next available port (3001, 3002, etc.)

Or specify a port:
```bash
PORT=3001 npm run dev
```

### Database Connection Issues

1. Check your `.env` file has correct `DATABASE_URL`
2. Verify Supabase database is running
3. Run `npm run db:push` to sync schema

### Clerk Authentication Issues

1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env`
2. Check Clerk dashboard for correct redirect URLs

## Testing the App

1. **Start the server**: `npm run dev`
2. **Open browser**: `http://localhost:3000`
3. **Test frontend**: Navigate to different pages
4. **Test backend**: Check API routes in browser or use:
   ```bash
   curl http://localhost:3000/api/mentors
   ```

## Summary

✅ **One command runs everything**: `npm run dev`
✅ **Frontend + Backend together**: No separate servers needed
✅ **Hot reload**: Changes update automatically
✅ **API routes**: Available at `/api/*` endpoints

That's it! Next.js handles everything for you.

