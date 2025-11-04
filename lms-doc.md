# LMS Project Summary (Short Version)

## Overview
Interactive learning platform for high school students inspired by Khan Academy and Duolingo.  
Focus: engaging courses (Math, Science, English), gamified progress (XP, levels, badges), and exam prep for Mongolian ЭЕШ.

## Goals
- Provide quality education access.  
- Help improve exam results.  
- Centralize structured learning in one platform.  
- Motivate through XP, badges, streaks.  
- Deliver clean, modern UX.

## Target Audience
High schoolers (ages 14–18), exam preppers, and learners needing accessible, mobile-friendly study tools.

---

## MVP Features
### 1. Authentication
- Google/email login via Supabase Auth.
- User profile with XP, badges, and dashboard.

### 2. Courses
- Course List & Detail pages.  
- Lessons include video, notes, quizzes.  
- Free preview + paid unlock (~$50/course).

### 3. Gamification
- XP System:  
  - Lesson complete +50XP  
  - Perfect quiz +100XP  
  - Full video watch +20XP  
  - Daily streak +10XP  
- Badges: Streak, Quiz Master, Course Completion, etc.

### 4. Dashboard
- Shows XP bar, level, streaks.  
- Tabs: My Courses & My Achievements.

---

## Tech Stack
Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI.  
Backend: Supabase (PostgreSQL, Auth, Storage).  
Hosting: Vercel.  
Design: Figma.  
Version Control: GitHub.

---

## Database Overview
Core tables:
- users: profile, XP, level.  
- courses, modules, lessons: learning hierarchy.  
- quizzes, questions, answers.  
- user_courses, user_lessons, user_quiz_attempts: progress tracking.  
- xp_transactions, levels, badges, user_badges.  
- payments: paid enrollments.

All use UUIDs, timestamps, and Supabase RLS for user data protection.

---

## User Journeys
1. Onboarding → set goals/subjects → +50XP → Dashboard.  
2. Browse & Enroll → pay or preview → added to My Courses.  
3. Learning → watch lessons, take quiz → earn XP → next lesson.  
4. Progress → dashboard shows XP, streaks, badges.

---

## Project Structure
app/(auth|dashboard|api), components/, lib/, types/, hooks/, styles/.

---

## Styling Guidelines
- “Cool mentor” tone — playful but credible.  
- Inspired by Brilliant.org + Khan Academy + Duolingo.  
- Clean typography (h1: 56px → body: 16–20px).  
- Minimalist, colorful UI with soft shadows.  
- Lucide icons, subtle animations for XP feedback.

---

## Scalability & Future Plans
- Scale Supabase vertically.  
- Add caching, monitoring.  
- Move to dedicated backend (Node/NestJS).  
- Add CMS/admin panel.  
- Future: live tutoring, analytics, peer learning.

---

## Timeline
MVP target: Nov 11.  
Phase 1: Auth, Dashboard, Course System, Gamification.  
Phase 2: Payment, CMS, video optimization.
