# TransferAble

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)

TransferAble is a sleek, student-first platform designed to support community college students on their path to transferring, combining smart course planning, UC/CSU requirement mapping, and mentorship from current university students. Built to remove confusion, eliminate outdated information, and give every student a clear, personalized roadmap.

## 🚀 Features

### Core Features (MVP)

- **Smart Course-Planning Engine**: Track required courses, prerequisites, and course equivalencies across all target universities
- **Transfer Timeline Generator**: Never miss a deadline with personalized timelines tracking applications, exams, and important dates
- **Peer Mentorship Network**: Connect with verified mentors from your target universities for personalized guidance
- **UC/CSU Application Hub**: PIQ brainstorming tools, essay tracking, activity logs, and automated feedback
- **Resource Hub**: Access scholarships, transfer stories, campus comparisons, and student-generated advice

### Planned Features (Phase 2)

- AI-Powered Course Audit (transcript parsing)
- Mentor Marketplace (paid mentorship options)
- College-Specific Micro Communities
- Mental Health & Study Skills Support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Vercel (Frontend) + Railway (Database)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or cloud)
- Clerk account for authentication

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd TransferAble
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/transferable?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
TransferAble/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── onboarding/       # Onboarding components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/                # Database schema
│   └── schema.prisma     # Prisma schema
└── public/                # Static assets
```

## 🗄️ Database Schema

The app uses Prisma with PostgreSQL. Key models include:

- **User**: Student, mentor, and counselor accounts
- **CommunityCollege**: Community college information
- **University**: Target universities (UC, CSU, Private)
- **Major**: Major requirements per university
- **Course**: Courses offered at community colleges
- **CourseEquivalency**: Course transfer equivalencies
- **Timeline**: Transfer timelines and milestones
- **Application**: UC/CSU applications
- **MentorProfile**: Mentor profiles and availability
- **MentorshipRequest**: Mentorship connections

See `prisma/schema.prisma` for the complete schema.

## 🎯 Key Pages

- `/` - Landing page
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/dashboard` - Main dashboard
- `/onboarding` - Initial setup flow
- `/courses` - Course planning
- `/timeline` - Transfer timeline
- `/mentors` - Mentor matching
- `/applications` - Application tracking
- `/resources` - Resource hub
- `/settings` - User settings

## 🚧 Development Roadmap

### Month 1-2 (Current)
- ✅ Project setup and core structure
- ✅ Authentication system
- ✅ Onboarding flow
- ✅ Dashboard and navigation
- ✅ Basic course planning UI
- ✅ Timeline generator UI
- ✅ Mentor matching UI
- ✅ Application hub UI
- ✅ Resource hub UI

### Month 2-3
- [ ] Connect course planning to database
- [ ] Implement mentor matching algorithm
- [ ] Build messaging system
- [ ] Add PIQ essay editor
- [ ] Integrate ASSIST API or build equivalency database

### Month 4-5
- [ ] Beta testing at partner community colleges
- [ ] User feedback and iterations
- [ ] Performance optimization
- [ ] Mobile responsiveness improvements

### Month 5-6
- [ ] AI transcript audit feature
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Gamification features

## 🤝 Contributing

This is a private project, but contributions are welcome! Please:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions, please open an issue in the repository.

## 🙏 Acknowledgments

Built with ❤️ for community college students navigating their transfer journey.
