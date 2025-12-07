# TransferAble - Project Plan & Architecture

## Overview

TransferAble is a comprehensive platform designed to help community college students successfully transfer to 4-year universities (UC, CSU, and private institutions). The app addresses key pain points: confusing articulation agreements, difficulty tracking requirements, lack of personalized guidance, and limited access to mentors.

## Core Problem Statement

Community college students face:
- Confusing, outdated articulation agreements
- Difficulty tracking major requirements across multiple universities
- No personalized guidance
- Limited access to real mentors from 4-year schools
- Anxiety about competitiveness, course sequencing, and timelines

## Solution

A unified platform that provides:
1. Smart course planning with real-time equivalency data
2. Automated timeline generation
3. Peer mentorship network
4. Application support tools
5. Comprehensive resource library

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend
- **API**: Next.js API Routes
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: Clerk

### Infrastructure
- **Hosting**: Vercel (frontend)
- **Database**: Railway or Supabase
- **File Storage**: (Future) AWS S3 or Cloudinary

## Database Schema Highlights

### Core Entities

1. **User**: Students, mentors, counselors
   - Role-based access (STUDENT, MENTOR, COUNSELOR, ADMIN)
   - Subscription tiers (FREE, PREMIUM)
   - Gamification (badges, levels, XP)

2. **Course Planning**
   - CommunityCollege: CC information
   - University: Target universities
   - Major: Major requirements per university
   - Course: Courses at CCs
   - CourseEquivalency: Transfer mappings
   - CourseCompletion: Student progress

3. **Mentorship**
   - MentorProfile: Mentor information
   - MentorshipRequest: Connection requests
   - Message: Chat messages

4. **Applications**
   - Application: UC/CSU applications
   - ApplicationEssay: PIQ essays
   - ApplicationActivity: Extracurriculars

5. **Timeline**
   - Timeline: User timelines
   - TimelineMilestone: Deadlines and events

## Feature Implementation Status

### ✅ Completed (MVP Structure)
- Project setup and configuration
- Database schema design
- Authentication integration
- Onboarding flow
- Dashboard layout and navigation
- Course planning UI
- Timeline generator UI
- Mentor matching UI
- Application hub UI
- Resource hub UI

### 🚧 In Progress
- Database integration for all features
- Real course equivalency data
- Mentor matching algorithm
- Messaging system

### 📋 Planned
- AI transcript parsing
- Real-time notifications
- Advanced search and filtering
- Mobile app
- Gamification system
- Payment integration for premium features

## User Flows

### Student Onboarding
1. Sign up with Clerk
2. Complete onboarding:
   - Select community college
   - Choose intended major
   - Select target universities
   - Add completed courses (optional)
3. Redirect to dashboard

### Course Planning
1. View required courses for target universities
2. See course equivalencies
3. Track completion progress
4. Get recommendations for next courses
5. Receive alerts for prerequisites and sequencing

### Mentorship
1. Browse available mentors
2. Filter by university, major, specialty
3. Send mentorship request
4. Chat with mentor
5. Schedule calls (future feature)

### Application Management
1. Create application for target university
2. Track PIQ essay progress
3. Build activity log
4. Get feedback on essays
5. Submit application

## API Endpoints (Planned)

### User Management
- `POST /api/onboarding` - Save onboarding data
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

### Course Planning
- `GET /api/courses` - Get course requirements
- `GET /api/equivalencies` - Get course equivalencies
- `POST /api/courses/complete` - Mark course as complete
- `GET /api/courses/progress` - Get progress summary

### Mentorship
- `GET /api/mentors` - List available mentors
- `POST /api/mentors/request` - Request mentorship
- `GET /api/mentors/requests` - Get mentorship requests
- `POST /api/mentors/message` - Send message

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `POST /api/applications/:id/essays` - Save essay

### Timeline
- `GET /api/timeline` - Get user timeline
- `POST /api/timeline/milestones` - Add milestone
- `PUT /api/timeline/milestones/:id` - Update milestone

## Security Considerations

1. **Authentication**: Clerk handles all auth securely
2. **Authorization**: Role-based access control
3. **Data Validation**: Zod schemas for all inputs
4. **SQL Injection**: Prisma ORM prevents SQL injection
5. **XSS**: React automatically escapes content
6. **CSRF**: Next.js built-in CSRF protection

## Performance Optimizations

1. **Database Indexing**: Strategic indexes on foreign keys and search fields
2. **Caching**: Next.js automatic caching for static pages
3. **Image Optimization**: Next.js Image component
4. **Code Splitting**: Automatic with Next.js
5. **API Optimization**: Pagination, filtering, and limiting

## Testing Strategy

1. **Unit Tests**: Jest for utility functions
2. **Component Tests**: React Testing Library
3. **Integration Tests**: API route testing
4. **E2E Tests**: Playwright or Cypress
5. **Database Tests**: Prisma test client

## Deployment Strategy

1. **Development**: Local with Docker Compose
2. **Staging**: Vercel preview deployments
3. **Production**: Vercel + Railway
4. **Database Migrations**: Prisma migrations
5. **Environment Variables**: Vercel environment config

## Monitoring & Analytics

1. **Error Tracking**: Sentry (planned)
2. **Analytics**: Vercel Analytics + custom events
3. **Performance**: Vercel Speed Insights
4. **User Feedback**: In-app feedback widget (planned)

## Future Enhancements

### Phase 2 Features
- AI transcript parsing
- Advanced mentor marketplace
- College-specific communities
- Study skills and mental health support
- Mobile app (React Native)

### Phase 3 Features
- Counselor dashboard (B2B)
- Advanced analytics for institutions
- Integration with CC student information systems
- Automated course recommendation engine
- Predictive acceptance probability

## Success Metrics

1. **User Engagement**
   - Daily active users
   - Course plan completion rate
   - Mentor connection rate
   - Application submission rate

2. **User Success**
   - Transfer acceptance rate
   - Time to complete course requirements
   - User satisfaction scores

3. **Business Metrics**
   - Free to premium conversion
   - Monthly recurring revenue
   - Customer acquisition cost
   - Lifetime value

## Next Steps

1. Set up Clerk authentication
2. Set up PostgreSQL database
3. Run database migrations
4. Seed initial data (universities, community colleges)
5. Connect UI to database
6. Implement core business logic
7. Add real course equivalency data
8. Beta test with partner colleges


