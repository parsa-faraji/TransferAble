# Future Self AI - Quick Start (30 Minutes)

## 🎯 Goal
Build a working MVP that can predict what "future you" would do based on past decisions.

---

## Step 1: Setup (5 min)

```bash
# Create new Next.js project
npx create-next-app@latest future-self-ai --typescript --tailwind --app

cd future-self-ai

# Install dependencies
npm install @clerk/nextjs @prisma/client zod
npm install -D prisma

# Initialize Prisma
npx prisma init
```

---

## Step 2: Database Schema (5 min)

Replace `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  createdAt DateTime @default(now())
  
  decisions    Decision[]
  outcomes     Outcome[]
  predictions  Prediction[]
}

model Decision {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  timestamp     DateTime @default(now())
  question      String
  situation     String
  decision      String
  reasoning     String
  stressLevel   Int      @default(5)
  tags          String[]
  emotions      String[]
  
  outcome       Outcome?
  predictions   Prediction[]
  
  @@index([userId])
}

model Outcome {
  id            String   @id @default(cuid())
  decisionId    String   @unique
  decision      Decision @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  timestamp     DateTime @default(now())
  actualOutcome String
  satisfaction  Int      // 1-10
  regret        Int      // 1-10
  wouldDoAgain  Boolean
}

model Prediction {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  question        String
  context         Json
  timestamp       DateTime @default(now())
  recommendation  String
  confidence      Float
  reasoning       String
  futureSelfPerspective String
  regretProbability Float
  
  @@index([userId])
}
```

Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## Step 3: Create Prisma Client (2 min)

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Step 4: Prediction Engine (10 min)

Create `lib/prediction-engine.ts` (copy from main guide)

---

## Step 5: API Routes (5 min)

Create `app/api/decisions/route.ts` and `app/api/predictions/route.ts` (copy from main guide)

---

## Step 6: Frontend (3 min)

Create `app/page.tsx`:

```typescript
import { PredictionInterface } from '@/components/predictions/prediction-interface';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Future Self AI
      </h1>
      <PredictionInterface />
    </main>
  );
}
```

Create the component (copy from main guide)

---

## Step 7: Test It! (5 min)

1. Start dev server: `npm run dev`
2. Log a few decisions manually in the database
3. Ask a prediction question
4. See what "future you" says!

---

## 🎉 You're Done!

You now have a working MVP. Next steps:
1. Add decision logging UI
2. Add outcome tracking
3. Improve prediction algorithm
4. Add value system

See `FUTURE_SELF_AI_GUIDE.md` for full details!


