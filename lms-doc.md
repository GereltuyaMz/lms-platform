# LMS

## Project Description
The LMS project is an interactive learning platform for high school students, inspired by Khan Academy and Duolingo. It features engaging courses (like Math, Science, and English), user progress tracking with XP and badges

## Product Requirements Document
Product Requirements Document (PRD)

1. Introduction

This document outlines the product requirements for the "LMS" project, an interactive learning platform designed for high school students. Inspired by the engaging methodologies of Khan Academy and Duolingo, and the modern UI of Brilliant.org, this platform aims to provide high-quality, gamified educational content in core subjects like Math, Science, and English. The core objective is to offer an accessible, motivating, and effective learning experience that tracks user progress through experience points (XP) and badges, ultimately helping students improve their academic performance, particularly for significant examinations like the Mongolian ЭЕШ.

2. Goals & Objectives

2.1. Enhance Learning Accessibility: Provide quality learning resources and tutoring, especially for students with limited access outside school.
2.2. Improve Exam Performance: Equip students with the tools and knowledge to excel in national and college entrance exams (e.g., ЭЕШ).
2.3. Deliver Structured Learning: Offer comprehensive, structured courses across multiple subjects (Math, Science, English) within a single platform.
2.4. Boost Student Engagement: Utilize gamified elements (XP, badges, streaks) to motivate and maintain student interest in learning.
2.5. Track Progress Effectively: Implement robust user progress tracking to provide learners with clear insights into their achievements and areas for improvement.
2.6. Create an Intuitive User Experience: Design a user interface that is clean, distraction-free, and engaging for high school students (Gen Z, Gen Alpha).

3. Target Audience

3.1. Primary Demographic: High school students aged 14-18 (grades 9-12).
3.2. Exam Preparation: Students actively preparing for major national examinations in Mongolia, specifically the ЭЕШ.
3.3. Resource-Limited Learners: Students who have limited access to quality learning resources or tutoring services outside their school environment.
3.4. Holistic Learners: Students seeking a single, comprehensive platform to address fragmented learning needs across various subjects.
3.5. Mobile & Device-Agnostic Users: Students who require the flexibility to learn anytime, anywhere, potentially without high-end devices.

4. Key User Journeys

4.1. First-Time User Onboarding:
    a. User lands on the platform\"s homepage.
    b. Clicks the \"Get Started\" button.
    c. Proceeds to the \"Sign Up\" page (e.g., via Google).
    d. Completes an interactive onboarding tour (3-4 steps) to understand features and set learning goals.
    e. Receives an initial +50XP as a welcome bonus.
    f. Is directed to their personalized Dashboard.

4.2. Course Discovery & Enrollment:
    a. User navigates to the \"Browse Courses\" page.
    b. Selects a course to view its \"Course Detail\" page.
    c. Clicks \"Enroll\" or similar button.
    d. Accesses free preview content of the course.
    e. To unlock full content, user is prompted for payment (e.g., $50 for the whole course).
    f. Upon enrollment (or purchase), the course is added to the user\"s \"My Courses\" section on the Dashboard, along with progress tracking.

4.3. Lesson & Quiz Interaction:
    a. User continues a course from their Dashboard.
    b. Watches the first few video lessons.
    c. Encounters an interactive multiple-choice quiz.
    d. Answers a question:
        i. If correct: Receives instant feedback and +15XP.
        ii. If incorrect: Sees an explanation pop-up and is offered a retry option.
    e. Completes the lesson, views total XP earned for that lesson.
    f. Clicks \"Next Lesson\" to continue their learning path.

4.4. Dashboard & Progress Tracking:
    a. User accesses their Dashboard.
    b. Views their current XP bar and Level, along with total XP earned.
    c. Navigates to the \"My Courses\" tab.
    d. Sees a list of enrolled courses with their respective progress (e.g., \"Continue\", \"Completed\").
    e. Navigates to the \"My Achievements\" tab.
    f. Views all earned badges and achievement milestones.

5. Features (MVP)

5.1. User Authentication & Profile Management:
    a. Secure User Authentication: Support for third-party authentication providers (e.g., Google OAuth).
    b. Basic User Profile: Display username, profile picture (optional).
    c. Personalized Dashboard: Central hub showing XP points, earned badges, and overall progress.
    d. Progress Tracking: System to track completed lessons, quiz scores, and course completion status.

5.2. Course System:
    a. Course List Page: Displays all available courses with basic information (e.g., title, subject, instructor, brief description).
    b. Course Detail Page: Comprehensive view of a selected course, including a list of modules, lessons, learning objectives, and materials. Highlights free preview content.
    c. Lesson Player: Integrated player for video lessons.
    d. Interactive Quizzes: Multi-choice quizzes embedded within lessons.
        i. Instant feedback upon answer submission.
        ii. Explanation pop-ups for incorrect answers.
        iii. Option to retry quizzes.

5.3. Gamified Learning:
    a. Experience Points (XP):
        i. Earning Mechanics: Users earn XP for various activities:
            - Completing a lesson: +50XP
            - Scoring 100% on a quiz: +100XP
            - Watching a full video lesson: +20XP
            - Maintaining a daily learning streak: +10XP (daily)
        ii. Leveling System: XP contributes to the user\"s overall level. Example progression:
            - Level 1: 0 – 499 XP
            - Level 2: 500 – 999 XP
            - (and so on)
    b. Badges:
        i. Achievement Milestones: Badges are awarded for significant accomplishments and serve as motivational rewards.
        ii. Examples: \"Learning Streak\" (e.g., 7-day streak), \"Performance Excellent\" (e.g., 5 consecutive perfect quiz scores), \"Committed Learner\" (e.g., 10 courses completed), \"Mastery at [Topic]\" (e.g., perfect score on a final exam).

6. UX/UI Design Principles

6.1. Core Inspirations:
    a. Duolingo: Adopt playfulness, gamified progression (XP, levels, streaks), reward systems, and interactive elements. Avoid overly cute or childish characters; instead, lean towards a \"cool mentor\" or suitable character design for high schoolers.
    b. Khan Academy: Maintain a clean, distraction-free layout, ensuring educational credibility without sacrificing engaging elements.
    c. Brilliant.org: Emulate the UI style, which balances playfulness and colorful aesthetics with academic rigor and an effective XP reward system. This platform is considered the closest aesthetic target.

6.2. Tone & Style:
    a. Target Audience Alignment: The design should appeal to high school students (Gen Z, Gen Alpha) by being playful and "cool" without appearing childish or overly cartoonish.
    b. Credibility: Ensure the design conveys educational value and seriousness when necessary, preventing it from being perceived as solely entertainment.

7. Business Model & Monetization

7.1. Revenue Model (MVP):
    a. Paid Courses: All full courses will require a fee for access.
    b. Free Previews: Only introductory content or a limited number of lessons will be available for free as previews.
    c. Pricing Structure: Example pricing for a full course would be approximately $50.

8. Content Management Strategy

8.1. Course Structure:
    a. Hierarchical Organization: Courses will be structured into Modules, which contain individual Lessons. Each lesson can include various content types such as video lessons, textual notes, and interactive quizzes.

8.2. MVP Content Upload:
    a. Manual Upload: In the initial MVP phase, all course content (videos, quizzes, notes) will be manually uploaded and managed by the project team.

8.3. Future Content Management (Post-MVP):
    a. CMS/Admin Panel: As the user base grows, an automated Content Management System (CMS) or dedicated admin panel will be developed.
    b. Role-Based Permissions: This future system will support defined roles (Admin, Instructor, Reviewer, Student) with specific permissions for content and course management.

9. Technical Specifications & Constraints (MVP)

9.1. Mandatory Tech Stack:
    a. Frontend Framework: Next.js (App Router).
    b. Language: TypeScript.
    c. Styling: Tailwind CSS, Shadcn UI.
    d. Backend/Database/Authentication/Storage: Supabase.
    e. Hosting: Vercel.

9.2. Scalability Goals (MVP Phase 1):
    a. Initial User Capacity: Aim to support 1 – 100 students for the first phase of the MVP.

9.3. Video Streaming Strategy:
    a. Initial Storage: Supabase Storage will be used for video hosting in the MVP.
    b. Future Consideration: Evaluate and integrate specialized video streaming services if Supabase Storage proves insufficient for performance or scalability with increased user load.

9.4. Future Scalability (Beyond MVP):
    a. Vertical Scaling: Leverage Supabase\"s capabilities for vertical scaling.
    b. Caching: Implement caching mechanisms to improve performance and reduce database load.

10. Timeline & Budget Constraints

10.1. Development Sprints: Project development will follow a weekly sprint cycle, with milestones targeted at the end of each week.
10.2. MVP Completion Target: The initial MVP version is targeted for completion by November 11. This is considered a tight deadline.

11. Performance, Scalability & KPIs

(No specific answers provided for this section yet. Implicitly, the MVP aims for a minimal goal of 1-100 students as per tech stack details. Further KPIs and detailed performance targets will be defined in subsequent iterations or as the project scales.)

12. Future Enhancements & Integrations

(No specific answers provided for this section yet. Potential future enhancements could include peer learning features, live tutoring, advanced analytics for students/parents, integration with school systems, or additional gamification elements.)

## Technology Stack
TECHSTACK

1.  INTRODUCTION

This document outlines the technology stack recommended for the Learning Management System (LMS) project. The choices prioritize rapid development, developer experience, scalability, and cost-effectiveness to meet the project's ambitious timeline and deliver a high-quality, engaging platform for high school students. The core objective is to deliver a Minimum Viable Product (MVP) by November 11th, utilizing a specified mandatory tech stack.

2.  CORE PRINCIPLES GUIDING TECH CHOICES

*   **Rapid MVP Development**: Given the tight timeline, technologies enabling quick iteration and deployment are paramount.
*   **Developer Experience (DX)**: A cohesive and productive stack reduces context switching and boosts team efficiency.
*   **Scalability**: While starting small (1-100 students for MVP), the chosen stack should allow for future growth and increased user load without a complete overhaul.
*   **Cost-Effectiveness**: Leverage services that offer generous free tiers or cost-efficient plans suitable for startup phases.
*   **Performance & User Experience**: Ensure a fast, responsive, and visually appealing platform to keep students engaged.
*   **Mandatory Stack Compliance**: Adherence to the specified technologies for the initial MVP phase.

3.  FRONTEND TECHNOLOGIES

3.1. Framework: Next.js (App Router)
    *   **Justification**: Next.js is explicitly mandated for the MVP. Its App Router offers a modern, performant foundation with features like Server Components, Nested Layouts, and Streaming. It provides excellent developer experience, built-in routing, API routes, and static site generation/server-side rendering capabilities, crucial for SEO and initial page load performance, aligning with a professional educational platform.

3.2. Language: TypeScript
    *   **Justification**: Mandated for the MVP. TypeScript enhances code quality, reduces bugs through static type checking, and improves maintainability and collaboration, especially as the project grows. It provides robust tooling and a better developer experience.

3.3. Styling: Tailwind CSS
    *   **Justification**: Mandated for the MVP. Tailwind CSS is a utility-first CSS framework that enables rapid UI development, ensures design consistency, and produces highly optimized CSS bundles. This aligns with the need for a clean, distraction-free, yet playful and cool UI inspired by Brilliant.org and Khan Academy.

3.4. UI Components: Shadcn UI
    *   **Justification**: Mandated for the MVP. Shadcn UI provides accessible, customizable UI components that integrate seamlessly with Tailwind CSS and Next.js. It allows for quick assembly of a polished user interface, speeding up MVP development while maintaining a professional and modern aesthetic, avoiding an overly "cartoonish" feel.

4.  BACKEND TECHNOLOGIES

4.1. API Layer: Next.js API Routes (for MVP)
    *   **Justification**: For the MVP, leveraging Next.js API routes allows for the creation of backend endpoints directly within the frontend project. This reduces context switching, simplifies deployment, and accelerates development, which is critical given the tight timeline. It's suitable for handling basic authentication flows, user progress updates, and data retrieval in the initial phase.

5.  DATABASE, AUTHENTICATION & CONTENT MANAGEMENT

5.1. Platform: Supabase
    *   **Justification**: Supabase is explicitly mandated for the MVP as the core backend-as-a-service (BaaS) provider.
        *   **Database**: Provides a robust PostgreSQL database, offering reliability, scalability, and powerful features like Row Level Security (RLS) for fine-grained access control, essential for user progress, courses, and gamification data (XP, badges).
        *   **Authentication**: Offers a comprehensive and easy-to-integrate authentication service supporting various providers (e.g., Google, email/password), vital for user sign-up and login as specified in MVP features.
        *   **Storage**: Used for storing course materials, lesson videos, notes, and other static assets. This simplifies content management for the MVP, where content is initially uploaded manually.
        *   **Edge Functions**: Provides serverless functions for custom backend logic without needing a separate server setup, ideal for specific gamification logic or data processing if Next.js API routes prove insufficient.
        *   **Realtime**: Built-in real-time capabilities can be leveraged for instant feedback on quizzes or live updates on XP.
        *   **Cost-Effective**: Offers a generous free tier, making it suitable for early-stage development and initial user base (1-100 students).

6.  VIDEO STREAMING & STORAGE

6.1. Primary for MVP: Supabase Storage
    *   **Justification**: For the initial MVP, video content will be stored in Supabase Storage. This simplifies the tech stack by keeping all core backend functionalities within Supabase, aligning with the "minimal goal" for 1-100 students.

6.2. Future Consideration: Dedicated Video Streaming Service (e.g., Cloudflare Stream, Mux, Vimeo API)
    *   **Justification**: As the platform scales and user numbers grow, dedicated video streaming services will become essential. These services offer optimized video transcoding, adaptive bitrate streaming, global content delivery networks (CDNs), and advanced player features, ensuring a high-quality and reliable viewing experience for a larger audience, which Supabase Storage alone may not fully support at high scale.

7.  HOSTING & DEPLOYMENT

7.1. Platform: Vercel
    *   **Justification**: Vercel is explicitly mandated for the MVP. It is optimized for Next.js applications, providing seamless deployments directly from Git repositories, automatic serverless function deployment, a global CDN, and excellent performance characteristics. Its integration with Next.js and serverless functions (including Next.js API routes) makes it the ideal choice for rapid, reliable, and scalable hosting.

8.  DEVELOPMENT & COLLABORATION TOOLS

8.1. Version Control: Git / GitHub
    *   **Justification**: Industry standard for source code management, enabling collaborative development, version tracking, and seamless integration with Vercel's deployment pipeline.

8.2. Package Manager: npm / Yarn / pnpm
    *   **Justification**: Standard JavaScript package managers for managing project dependencies.

8.3. Code Editor: VS Code
    *   **Justification**: A highly extensible and popular code editor with excellent TypeScript support, debugging capabilities, and a vast ecosystem of extensions, promoting developer productivity.

8.4. Design Tool: Figma
    *   **Justification**: A leading UI/UX design tool for collaborative prototyping, wireframing, and creating high-fidelity mockups, ensuring the "cool mentor" and "playful but academic" UI vision is realized.

9.  SCALABILITY & FUTURE CONSIDERATIONS

*   **Vertical Scaling via Supabase**: The initial strategy involves leveraging Supabase's inherent ability to vertically scale its PostgreSQL database and services.
*   **Caching**: Implementing caching mechanisms (e.g., Redis, or Supabase's caching capabilities if available) would be beneficial to reduce database load and improve response times for frequently accessed data (e.g., course lists, user dashboards).
*   **CDN Optimization**: Vercel provides CDN for static assets, but further optimization for video delivery will be crucial once a dedicated video streaming service is integrated.
*   **Dedicated Backend**: As the project evolves and business logic becomes more complex, a transition from Next.js API routes to a dedicated backend service (e.g., Node.js with a framework like Express/NestJS, or a different language/framework) might be considered to separate concerns and handle more intricate microservices architectures.
*   **Monitoring & Analytics**: Future integration of tools like Sentry for error tracking, Vercel Analytics for basic usage, or Google Analytics for deeper user behavior insights will be essential for performance monitoring and informed decision-making.

10. CONCLUSION

The chosen technology stack—centered around Next.js, TypeScript, Tailwind CSS, Shadcn UI, Supabase, and Vercel—forms a robust, efficient, and cost-effective foundation for the LMS project's MVP. This stack is specifically tailored to meet the tight development timeline, deliver an engaging user experience for high school students, and provide a clear path for future scalability and enhancements.

## Project Structure
PROJECTSTRUCTURE

This document outlines the planned file and folder organization for the LMS project, adhering to the specified tech stack (Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI, Supabase) and MVP requirements. The structure is designed to promote modularity, maintainability, and scalability, with a clear separation of concerns for frontend components, backend API routes, and shared utilities.

1.  **Root Directory**
    The top-level directory contains essential configuration files and the primary source code.

    *   `.env.local`: Environment variables, particularly for Supabase credentials and other API keys.
    *   `.eslintrc.json`: ESLint configuration for code quality and consistency.
    *   `.prettierrc.json`: Prettier configuration for code formatting.
    *   `next.config.js`: Next.js configuration file, including potential image optimizations or custom webpack settings.
    *   `package.json`: Project metadata, scripts, and dependency declarations.
    *   `pnpm-lock.yaml`: (Assuming pnpm is used based on typical Next.js setups) Lock file for exact dependency versions.
    *   `postcss.config.js`: PostCSS configuration, primarily for Tailwind CSS.
    *   `public/`: Static assets served directly by Next.js (e.g., images, fonts, favicon).
        *   `images/`: Application images (logos, avatars, course thumbnails, gamification assets).
        *   `fonts/`: Custom font files.
        *   `favicon.ico`: Website favicon.
    *   `README.md`: Project overview, setup instructions, and deployment guide.
    *   `tailwind.config.ts`: Tailwind CSS configuration, including theme, plugins, and custom styles.
    *   `tsconfig.json`: TypeScript compiler configuration.

2.  **`src/` Directory (Optional - can be directly in root)**
    While Next.js App Router can have `app/` directly in the root, using a `src/` directory can provide a cleaner separation for source code. For this project, we'll assume `app/`, `components/`, `lib/` etc. are directly in the root, which is common with the App Router.

3.  **`app/` Directory (Next.js App Router - Primary Application Logic)**
    This directory contains all pages, layouts, and API routes, leveraging Next.js App Router conventions.

    *   `layout.tsx`: The root layout for the entire application, wrapping all pages. Includes global providers (e.g., Supabase, context providers) and shared UI elements (e.g., navigation).
    *   `page.tsx`: The landing page of the application, serving as the entry point before authentication.
    *   `loading.tsx`: Global loading UI for pages/segments.
    *   `not-found.tsx`: Custom 404 page.
    *   `global-error.tsx`: Custom global error boundary.
    *   `(auth)/`: A route group for authentication-related pages. The parentheses denote it's not part of the URL path.
        *   `layout.tsx`: Specific layout for authentication pages (e.g., without a dashboard sidebar).
        *   `login/page.tsx`: User login page.
        *   `signup/page.tsx`: User registration page.
        *   `onboarding/page.tsx`: Multi-step interactive onboarding guide for new users.
    *   `(dashboard)/`: A route group for authenticated user pages and features.
        *   `layout.tsx`: Dashboard-specific layout, including sidebar navigation, header, and potentially a user profile summary.
        *   `page.tsx`: The main user dashboard, displaying XP, courses, and achievements.
        *   `profile/page.tsx`: User profile management, settings.
        *   `courses/`: Course browsing and management.
            *   `page.tsx`: List of available courses.
            *   `[courseId]/`: Dynamic segment for a specific course.
                *   `page.tsx`: Course detail page (overview, modules, free previews).
                *   `[lessonId]/`: Dynamic segment for a specific lesson within a course.
                    *   `page.tsx`: Lesson player page (video, notes, interactive quizzes).
        *   `my-courses/page.tsx`: User's enrolled courses and progress tracking.
        *   `achievements/page.tsx`: Displays earned badges and achievement milestones.
        *   `settings/page.tsx`: User settings and preferences.
    *   `api/`: Next.js API Routes for backend functionality. These routes interact with Supabase.
        *   `auth/`: API routes for authentication-related actions (e.g., OAuth callbacks, session management).
            *   `callback/route.ts`: Supabase authentication callback handler.
        *   `courses/`: API routes for course-related operations.
            *   `route.ts`: Get list of courses, enroll in a course.
            *   `[courseId]/route.ts`: Get specific course details.
            *   `[courseId]/lessons/[lessonId]/route.ts`: Mark lesson as complete, submit quiz answers.
        *   `users/`: API routes for user data management.
            *   `route.ts`: Get/update user profile.
            *   `xp/route.ts`: Update user XP.
        *   `gamification/route.ts`: API routes for badge and achievement management.

4.  **`components/` Directory**
    Reusable UI components, organized by domain or function.

    *   `ui/`: Shadcn UI components (e.g., Button, Input, Card, Dialog). These are generated and extended as needed.
    *   `shared/`: Generic, application-wide components (e.g., `Spinner`, `Modal`, `Alert`, `CustomLink`).
    *   `layout/`: Components forming the overall page structure (e.g., `Header`, `Sidebar`, `Footer`, `AuthLayout`, `DashboardLayout`).
    *   `auth/`: Components specific to authentication (e.g., `LoginForm`, `SignUpForm`, `OAuthButtons`).
    *   `dashboard/`: Components used on the user dashboard (e.g., `XPProgressBar`, `CourseCard`, `AchievementCard`).
    *   `courses/`: Components for displaying and interacting with courses and lessons (e.g., `CourseList`, `CourseDetailHeader`, `LessonPlayer`, `QuizComponent`).
    *   `gamification/`: Components related to gamified elements (e.g., `XPDisplay`, `BadgeIcon`, `LevelIndicator`).
    *   `forms/`: Reusable form components or elements (e.g., `FormField`, `FormInput`).

5.  **`lib/` Directory**
    Utility functions, helper modules, and client-side logic that doesn't directly render UI.

    *   `supabase/`: Supabase client initialization and specific helper functions for data access.
        *   `client.ts`: Initializes the Supabase client for client-side operations.
        *   `server.ts`: Initializes the Supabase client for server-side operations (e.g., API routes, server components).
        *   `queries/`: Functions encapsulating common Supabase queries (e.g., `getCourseById`, `getUserProgress`).
    *   `utils/`: General utility functions (e.g., `formatDate`, `slugify`, `calculateLevel`).
    *   `constants/`: Application-wide constants (e.g., `XP_EARNING_RULES`, `BADGE_DEFINITIONS`, `COURSE_CATEGORIES`).
    *   `validators/`: Schema definitions for input validation (e.g., using Zod for forms).
        *   `auth.ts`: Schemas for login/signup.
        *   `course.ts`: Schemas for course enrollment.
        *   `quiz.ts`: Schemas for quiz answers.
    *   `gamification/`: Logic for XP calculation, level progression, and badge awarding.
        *   `xp.ts`: Functions to calculate and update XP.
        *   `badges.ts`: Functions to check for and award badges.
    *   `auth/`: Client-side authentication helpers (e.g., session management, redirect logic).

6.  **`hooks/` Directory**
    Custom React hooks for encapsulating reusable stateful logic.

    *   `useAuth.ts`: Hook for accessing user authentication state.
    *   `useCourseProgress.ts`: Hook for tracking and updating course progress.
    *   `useXP.ts`: Hook for managing and displaying user XP and level.
    *   `useMediaQuery.ts`: Responsive design helper hook.

7.  **`styles/` Directory**
    Global styles and Tailwind CSS configuration overrides.

    *   `globals.css`: Main CSS file, including Tailwind directives and any custom global styles.
    *   `variables.css`: CSS variables for theme customization (if not handled entirely by Tailwind).

8.  **`types/` Directory**
    TypeScript type definitions and interfaces for better code clarity and safety.

    *   `db.d.ts`: Interfaces reflecting Supabase database table schemas.
    *   `auth.d.ts`: Interfaces for user authentication data.
    *   `courses.d.ts`: Interfaces for Course, Module, Lesson, Quiz, and Video objects.
    *   `gamification.d.ts`: Interfaces for XP, Level, and Badge objects.
    *   `index.d.ts`: General or global type declarations.

9.  **Database (Supabase - Logical Structure)**
    While not a file-system directory, the logical organization within Supabase is crucial.

    *   **Tables:**
        *   `users`: Stores user profiles (id, email, username, avatar, total_xp, current_level, created_at, updated_at).
        *   `courses`: Stores course metadata (id, title, description, category, price, thumbnail_url, created_by, created_at).
        *   `modules`: Stores course modules (id, course_id, title, order_index).
        *   `lessons`: Stores lesson metadata (id, module_id, title, description, video_url, duration, lesson_type, order_index).
        *   `quizzes`: Stores quiz questions (id, lesson_id, question_text, type, options, correct_answer).
        *   `user_courses`: Tracks user enrollment in courses (user_id, course_id, enrolled_at, progress_status, last_accessed_lesson_id).
        *   `user_progress`: Tracks individual lesson completion and quiz scores (user_id, lesson_id, course_id, completed_at, xp_earned, quiz_score, attempts).
        *   `user_badges`: Tracks earned badges (user_id, badge_id, awarded_at).
        *   `badges`: Defines available badges (id, name, description, icon_url, criteria_json).
        *   `payments`: Records course purchases (id, user_id, course_id, amount, status, transaction_id, created_at).
    *   **Row Level Security (RLS):** Policies configured for each table to ensure data privacy and access control (e.g., users can only see their own progress).
    *   **Functions:** (Future consideration) Supabase Edge Functions for complex server-side logic (e.g., awarding XP based on triggers).

This detailed structure provides a clear roadmap for development, supporting the described MVP features like user authentication, course browsing, lesson playback with interactive quizzes, and gamified progress tracking with XP and badges, all within the specified Next.js and Supabase ecosystem.

## Database Schema Design
## SCHEMADESIGN: Database Schema Design for LMS

This document outlines the database schema design for the Learning Management System (LMS), detailing the data models, relationships, and overall database structure. The design prioritizes the core functionalities identified in the MVP phase, focusing on user management, course delivery, gamification, and progress tracking, with a forward-looking approach for scalability. The database will be implemented using PostgreSQL, as supported by Supabase.

### 1. Core Entities and Relationships Overview

The LMS data model revolves around the following primary entities:
*   **Users:** Stores user profiles and authentication details.
*   **Courses:** Defines the structure and details of each learning course.
*   **Modules:** Organizes lessons within a course.
*   **Lessons:** Individual learning units, which can be videos, notes, or quizzes.
*   **Quizzes & Questions:** Structure for interactive assessments.
*   **Gamification:** Manages XP, Levels, and Badges.
*   **Progress Tracking:** Records user advancement through courses, lessons, and quizzes.
*   **Payments:** Handles course enrollment and payment status.

### 2. Table Definitions

#### 2.1 Users
Stores core user information and links to Supabase Auth.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user_id` | `UUID` | **Primary Key**, Links to `auth.users.id` in Supabase Auth. |
| `email` | `TEXT` | `NOT NULL`, `UNIQUE`, User's email address, from Supabase Auth. |
| `username` | `TEXT` | `UNIQUE`, Display name for user, required for profile. |
| `display_name` | `TEXT` | Optional, Full name or preferred display name. |
| `avatar_url` | `TEXT` | URL to user's profile picture, can be from Supabase Auth or custom upload to Supabase Storage. |
| `current_xp` | `INT` | `DEFAULT 0`, `NOT NULL`, Total experience points accumulated by the user. |
| `level_id` | `UUID` | `FOREIGN KEY` references `Levels.level_id`, User's current level. |
| `last_login_streak_date` | `DATE` | Last date the user logged in, for daily streak calculation. |
| `login_streak_count` | `INT` | `DEFAULT 0`, `NOT NULL`, Consecutive daily login count. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, Timestamp of user creation. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`, Timestamp of last update. |

#### 2.2 Courses
Defines the available learning courses.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :--------------------------------------------------------------------------------------------------- |
| `course_id` | `UUID` | **Primary Key** |
| `title` | `TEXT` | `NOT NULL`, Name of the course. |
| `description` | `TEXT` | Detailed description of the course. |
| `image_url` | `TEXT` | URL to the course thumbnail image, stored in Supabase Storage. |
| `price` | `DECIMAL(10, 2)` | `NOT NULL`, Cost of the course, e.g., 50.00. |
| `is_published` | `BOOLEAN` | `DEFAULT FALSE`, `NOT NULL`, Indicates if the course is visible to students. |
| `estimated_time` | `TEXT` | e.g., "10 hours", "3 weeks", estimated duration to complete the course. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, Timestamp of course creation. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`, Timestamp of last update. |

#### 2.3 Modules
Organizes lessons within a course.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :------------------------------------------------------------------ |
| `module_id` | `UUID` | **Primary Key** |
| `course_id` | `UUID` | `FOREIGN KEY` references `Courses.course_id`, `NOT NULL`. |
| `title` | `TEXT` | `NOT NULL`, Name of the module. |
| `description` | `TEXT` | Optional description for the module. |
| `order_index` | `INT` | `NOT NULL`, Order of the module within its course (e.g., 1, 2, 3). |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.4 Lessons
Individual learning units, content type can vary.

| Column Name | Data Type | Constraints / Description |
| :-------------------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lesson_id` | `UUID` | **Primary Key** |
| `module_id` | `UUID` | `FOREIGN KEY` references `Modules.module_id`, `NOT NULL`. |
| `title` | `TEXT` | `NOT NULL`, Name of the lesson. |
| `description` | `TEXT` | Optional, detailed description or overview of the lesson. |
| `lesson_type` | `ENUM ('video', 'quiz', 'notes')` | `NOT NULL`, Defines the type of content for the lesson. |
| `content_url` | `TEXT` | URL for video content (Supabase Storage) or external link, or identifier for associated quiz/notes data if lesson_type is 'quiz'/'notes'. |
| `duration_seconds` | `INT` | For `video` type lessons, approximate duration in seconds. |
| `xp_reward` | `INT` | `DEFAULT 0`, `NOT NULL`, Base XP awarded upon lesson completion. |
| `order_index` | `INT` | `NOT NULL`, Order of the lesson within its module. |
| `is_preview` | `BOOLEAN` | `DEFAULT FALSE`, `NOT NULL`, Indicates if this lesson is accessible as a free preview. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.5 Quizzes
Defines the structure of quizzes, linked to `lesson_type = 'quiz'` lessons.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :----------------------------------------------------------------------------------------------- |
| `quiz_id` | `UUID` | **Primary Key** |
| `lesson_id` | `UUID` | `FOREIGN KEY` references `Lessons.lesson_id`, `NOT NULL`, `UNIQUE` (a lesson can have only one main quiz). |
| `title` | `TEXT` | `NOT NULL`, Title of the quiz. |
| `description` | `TEXT` | Optional, introductory text for the quiz. |
| `pass_xp_reward` | `INT` | `NOT NULL`, XP awarded for correctly answering a question/passing the quiz. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.6 Questions
Individual questions within a quiz.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `question_id` | `UUID` | **Primary Key** |
| `quiz_id` | `UUID` | `FOREIGN KEY` references `Quizzes.quiz_id`, `NOT NULL`. |
| `question_text` | `TEXT` | `NOT NULL`, The actual question. |
| `question_type` | `ENUM ('multiple_choice')` | `NOT NULL`, Type of question. Initially, only multiple choice for MVP. |
| `explanation` | `TEXT` | Explanation provided to the user after an incorrect answer. |
| `order_index` | `INT` | `NOT NULL`, Order of the question within the quiz. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.7 Answers
Possible answers for a question.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :--------------------------------------------------------------------- |
| `answer_id` | `UUID` | **Primary Key** |
| `question_id` | `UUID` | `FOREIGN KEY` references `Questions.question_id`, `NOT NULL`. |
| `answer_text` | `TEXT` | `NOT NULL`, The text of the answer choice. |
| `is_correct` | `BOOLEAN` | `NOT NULL`, `DEFAULT FALSE`, Indicates if this is the correct answer. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.8 User_Courses
Tracks user enrollment and overall progress in a course.

| Column Name | Data Type | Constraints / Description |
| :-------------------- | :----------- | :---------------------------------------------------------------------------------------------------- |
| `user_id` | `UUID` | `FOREIGN KEY` references `Users.user_id`, **Composite Primary Key part**. |
| `course_id` | `UUID` | `FOREIGN KEY` references `Courses.course_id`, **Composite Primary Key part**. |
| `enrollment_date` | `TIMESTAMPZ` | `DEFAULT NOW()`, `NOT NULL`. |
| `completion_date` | `TIMESTAMPZ` | `NULLABLE`, Date when the user completed the course. |
| `progress_percentage` | `DECIMAL(5, 2)` | `DEFAULT 0.00`, `NOT NULL`, Overall percentage completion for the course. |
| `is_paid` | `BOOLEAN` | `DEFAULT FALSE`, `NOT NULL`, True if the user has paid for the course. |
| `last_accessed_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, Timestamp of the last user activity in this course. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.9 User_Lessons
Tracks user's progress and completion status for individual lessons.

| Column Name | Data Type | Constraints / Description |
| :-------------------- | :----------- | :------------------------------------------------------------------------------------------------------- |
| `user_id` | `UUID` | `FOREIGN KEY` references `Users.user_id`, **Composite Primary Key part**. |
| `lesson_id` | `UUID` | `FOREIGN KEY` references `Lessons.lesson_id`, **Composite Primary Key part**. |
| `status` | `ENUM ('not_started', 'in_progress', 'completed')` | `DEFAULT 'not_started'`, `NOT NULL`. |
| `completion_date` | `TIMESTAMPZ` | `NULLABLE`, Date when the user completed the lesson. |
| `xp_earned` | `INT` | `DEFAULT 0`, `NOT NULL`, XP earned specifically from this lesson. |
| `last_watched_timestamp` | `INT` | For video lessons, the last known playback position in seconds. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.10 User_Quiz_Attempts
Records each attempt a user makes on a quiz.

| Column Name | Data Type | Constraints / Description |
| :-------------------- | :----------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `attempt_id` | `UUID` | **Primary Key** |
| `user_id` | `UUID` | `FOREIGN KEY` references `Users.user_id`, `NOT NULL`. |
| `quiz_id` | `UUID` | `FOREIGN KEY` references `Quizzes.quiz_id`, `NOT NULL`. |
| `attempt_number` | `INT` | `NOT NULL`, `DEFAULT 1`, Increments for each new attempt. |
| `score` | `DECIMAL(5, 2)` | `NULLABLE`, Percentage of correct answers (e.g., 85.50). |
| `xp_earned` | `INT` | `DEFAULT 0`, `NOT NULL`, XP awarded for this specific quiz attempt. |
| `is_passed` | `BOOLEAN` | `NULLABLE`, Indicates if the user passed the quiz based on defined criteria. |
| `started_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, Timestamp when the attempt began. |
| `completed_at` | `TIMESTAMPZ` | `NULLABLE`, Timestamp when the attempt was submitted/completed. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.11 User_Question_Answers
Records specific answers given by a user for each question in a quiz attempt.

| Column Name | Data Type | Constraints / Description |
| :-------------------- | :----------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `user_id` | `UUID` | `FOREIGN KEY` references `Users.user_id`, **Composite Primary Key part**. |
| `question_id` | `UUID` | `FOREIGN KEY` references `Questions.question_id`, **Composite Primary Key part**. |
| `attempt_id` | `UUID` | `FOREIGN KEY` references `User_Quiz_Attempts.attempt_id`, `NOT NULL`, **Composite Primary Key part**. |
| `selected_answer_id` | `UUID` | `FOREIGN KEY` references `Answers.answer_id`, `NOT NULL`, The answer chosen by the user. |
| `is_correct` | `BOOLEAN` | `NOT NULL`, Indicates if the selected answer was correct. |
| `answered_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, Timestamp when the answer was recorded. |

#### 2.12 XP_Transactions
Logs all experience point (XP) changes for a user.

| Column Name | Data Type | Constraints / Description |
| :-------------------- | :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `xp_transaction_id` | `UUID` | **Primary Key** |
| `user_id` | `UUID` | `FOREIGN KEY` references `Users.user_id`, `NOT NULL`. |
| `xp_amount` | `INT` | `NOT NULL`, Amount of XP gained or lost (can be negative, but positive for MVP). |
| `reason` | `ENUM ('lesson_completion', 'quiz_100_percent', 'video_watch', 'daily_streak', 'welcome_bonus', 'badge_achievement', 'enroll_course', 'initial_onboarding')` | `NOT NULL`, Describes why the XP was awarded. |
| `related_entity_id` | `UUID` | `NULLABLE`, ID of the related entity (e.g., `lesson_id`, `quiz_id`, `badge_id`). |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |

#### 2.13 Levels
Defines the XP thresholds for each user level.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :------------------------------------------------------------------------------------------------------ |
| `level_id` | `UUID` | **Primary Key** |
| `level_number` | `INT` | `NOT NULL`, `UNIQUE`, The numerical level (e.g., 1, 2, 3). |
| `level_name` | `TEXT` | `NOT NULL`, Descriptive name for the level (e.g., "Novice Learner", "Adept"). |
| `xp_threshold` | `INT` | `NOT NULL`, Minimum total XP required to reach this level (e.g., Level 1: 0, Level 2: 500). |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.14 Badges
Defines the different achievement badges available.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `badge_id` | `UUID` | **Primary Key** |
| `name` | `TEXT` | `NOT NULL`, Name of the badge (e.g., "First Lesson Complete", "Daily Streak Master"). |
| `description` | `TEXT` | Detailed description of the badge and how to earn it. |
| `image_url` | `TEXT` | URL to the badge icon/image, stored in Supabase Storage. |
| `criteria` | `TEXT` | Textual description of the criteria to earn the badge (e.g., "Complete 5 lessons", "Achieve 3-day streak"). |
| `xp_reward` | `INT` | Optional XP bonus for earning this badge. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

#### 2.15 User_Badges
Tracks which badges a user has earned.

| Column Name | Data Type | Constraints / Description |
| :---------------- | :----------- | :---------------------------------------------------------------------------------------------- |
| `user_id` | `UUID` | `FOREIGN KEY` references `Users.user_id`, **Composite Primary Key part**. |
| `badge_id` | `UUID` | `FOREIGN KEY` references `Badges.badge_id`, **Composite Primary Key part**. |
| `earned_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `NOT NULL`, Timestamp when the badge was earned. |

#### 2.16 Payments
Records payment transactions for paid courses.

| Column Name | Data Type | Constraints / Description |
| :-------------------- | :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payment_id` | `UUID` | **Primary Key** |
| `user_id` | `UUID` | `FOREIGN KEY` references `Users.user_id`, `NOT NULL`. |
| `course_id` | `UUID` | `FOREIGN KEY` references `Courses.course_id`, `NOT NULL`. |
| `amount` | `DECIMAL(10, 2)` | `NOT NULL`, The amount paid. |
| `currency` | `TEXT` | `NOT NULL`, e.g., "USD", "MNT". |
| `status` | `ENUM ('pending', 'completed', 'failed', 'refunded')` | `NOT NULL`, Current status of the payment. |
| `payment_gateway_id` | `TEXT` | `NULLABLE`, Reference ID from the external payment gateway. |
| `paid_at` | `TIMESTAMPZ` | `NULLABLE`, Timestamp when the payment was successfully processed. |
| `created_at` | `TIMESTAMPZ` | `DEFAULT NOW()`. |
| `updated_at` | `TIMESTAMPZ` | `DEFAULT NOW()`, `ON UPDATE NOW()`. |

### 3. Relationships Summary

*   **Users** one-to-many **User_Courses**, **User_Lessons**, **User_Quiz_Attempts**, **User_Question_Answers**, **XP_Transactions**, **User_Badges**, **Payments**.
*   **Levels** one-to-many **Users** (each user belongs to one level).
*   **Courses** one-to-many **Modules**, **User_Courses**, **Payments**.
*   **Modules** one-to-many **Lessons**.
*   **Lessons** one-to-many **User_Lessons**. One-to-one with **Quizzes** (if `lesson_type = 'quiz'`).
*   **Quizzes** one-to-many **Questions**, **User_Quiz_Attempts**.
*   **Questions** one-to-many **Answers**, **User_Question_Answers**.
*   **Answers** one-to-many **User_Question_Answers**.
*   **Badges** one-to-many **User_Badges**.

### 4. MVP Scope Considerations

For the initial MVP, the following aspects are crucial:
*   **User Authentication & Profiles:** `Users` table integrated with Supabase Auth.
*   **Course Structure:** `Courses`, `Modules`, `Lessons` tables to support video lessons, notes, and quizzes.
*   **Content Management:** Initially, content will be manually uploaded to Supabase Storage and database records inserted. No admin panel for content management in MVP.
*   **Gamification:** `XP_Transactions`, `Levels`, `Badges`, `User_Badges` will track and display progress.
*   **Progress Tracking:** `User_Courses`, `User_Lessons`, `User_Quiz_Attempts`, `User_Question_Answers` are essential.
*   **Monetization:** `Payments` table and `is_paid` flag in `User_Courses` to manage paid course access.
*   **Simplified Quiz:** `question_type` in `Questions` is limited to 'multiple_choice'.
*   **No Roles/Permissions:** Instructor/admin roles and associated permissions are out of scope for MVP.

### 5. Supabase Integration Notes

*   **Authentication:** The `Users.user_id` will directly correspond to `auth.users.id`. Row-level security (RLS) will be extensively used to ensure users can only access their own data (e.g., `User_Lessons`, `XP_Transactions`).
*   **Database:** PostgreSQL will be the underlying database for all defined tables.
*   **Storage:** `image_url` and `content_url` (for videos) will leverage Supabase Storage buckets, with appropriate RLS rules to protect content.
*   **Edge Functions:** Server-side logic for XP calculation, level progression, and badge awarding might be implemented using Supabase Edge Functions for efficiency and to encapsulate business logic.
*   **Realtime:** Supabase Realtime capabilities could be explored for instant XP updates on the user dashboard (future enhancement, not MVP core).
*   **UUIDs:** All primary keys will use UUIDs for distributed and predictable unique identifiers, aligning with modern database practices and Supabase's capabilities.
*   **Default Timestamps:** `created_at` and `updated_at` columns will utilize `DEFAULT NOW()` and `ON UPDATE NOW()` to automatically manage record timestamps.

## User Flow
User Flow Document: LMS Project

**User Flow 1: New User Onboarding & First Dashboard View**

*   **User Goal:** A new high school student signs up for the LMS, completes an initial onboarding, and lands on their personalized dashboard to begin their learning journey.
*   **Actors:** Student (New User)
*   **Pre-conditions:** User has access to the internet and a web browser. User has not previously signed up for the LMS.
*   **Main Flow:**
    *   **Step 1: Landing Page Access**
        *   **Action:** User navigates to the LMS website (e.g., `www.lms-platform.mn`).
        *   **System Response:** The LMS displays the "Landing Page". This page features a compelling hero section, clear value proposition (e.g., "Master your exams with engaging courses"), an explanation of gamified learning (XP, badges), and a prominent "Get Started" Call-to-Action (CTA).
        *   **UI/Interaction:** Hero image/video, catchy headlines, brief feature overview, "Get Started" button (primary CTA), "Sign In" button (secondary CTA).
    *   **Step 2: Initiate Sign Up**
        *   **Action:** User clicks the "Get Started" button.
        *   **System Response:** The system redirects to the "Sign Up" page/modal.
        *   **UI/Interaction:** The "Get Started" button visually indicates interaction (e.g., hover/click state).
    *   **Step 3: User Registration**
        *   **Action:** User chooses a sign-up method (e.g., "Continue with Google", "Continue with Email"). For email, they provide email, password, and confirm password.
        *   **System Response:**
            *   If using Google/OAuth: Authenticates via third-party provider and creates an LMS account.
            *   If using email: Validates input, creates account, and typically sends a verification email (MVP might skip this for initial onboarding simplicity, or auto-verify for a smoother flow).
            *   Upon successful registration, the system redirects to the "Onboarding Tour" sequence.
        *   **UI/Interaction:** Clear options for social login (e.g., "Continue with Google" button), email/password input fields, "Sign Up" button, "Forgot Password?" link (for returning users or if they chose email signup).
    *   **Step 4: Interactive Onboarding Tour (3-4 Steps)**
        *   **Action:** User progresses through an interactive, multi-step onboarding guide. Each step involves a brief explanation and a simple interaction or choice.
        *   **System Response:** The system records user preferences and goals based on their input.
        *   **UI/Interaction:** A full-screen overlay or distinct onboarding screens.
            *   **Step 4.1: Welcome & Value Prop:** "Welcome to [LMS Name]! Let's get you set up for success." (brief animated intro, perhaps a "cool mentor" character as per inspiration).
            *   **Step 4.2: Set Learning Goals:** "What are your main goals?" (e.g., "Improve grades", "Prepare for ЭЕШ", "Explore new subjects"). User selects one or more.
            *   **Step 4.3: Choose Subjects of Interest:** "Which subjects are you most excited to learn?" (e.g., Math, Science, English, Mongolian History). User selects subjects.
            *   **Step 4.4: Quick Feature Highlight:** Briefly introduces XP, Badges, and My Courses section. "You'll earn XP for every lesson and ace quizzes to unlock badges!"
            *   Each step has "Next" and "Skip" (optional) buttons. A progress indicator (e.g., 1/4, 2/4) is visible.
    *   **Step 5: First XP Award & Dashboard Arrival**
        *   **Action:** User completes the final step of the onboarding tour (e.g., clicks "Finish" or "Go to Dashboard").
        *   **System Response:** The system awards +50 XP as a "welcome point" and navigates the user to their personalized "Dashboard".
        *   **UI/Interaction:** A brief, celebratory animation or pop-up confirming "Welcome Bonus! +50 XP" before transitioning to the Dashboard.
*   **Alternative Flows / Error Handling:**
    *   **Already Signed Up:** If a user tries to sign up with an existing email, an error message "Account already exists. Please sign in." is displayed.
    *   **Invalid Input:** If email or password criteria are not met, appropriate error messages appear next to the input fields.
    *   **Onboarding Skip:** If the user skips onboarding, they are still directed to the dashboard, perhaps with a prompt to set goals later.
*   **Post-conditions:** User is logged in. User has an account. User has accumulated +50 XP. User's chosen goals and subjects are saved to their profile. User is on the Dashboard.
*   **Wireframe Description / Key UI Elements:**
    *   **Landing Page:** Large hero section with background image/video, main headline, sub-headline, "Get Started" button (prominent), "Sign In" link. Navigation bar with "Courses", "About".
    *   **Sign Up Page:** Centered card or modal. "Sign Up" title. Buttons for "Continue with Google", "Continue with Email". Email/password input fields, "Sign Up" button. "Already have an account? Sign In" link.
    *   **Onboarding Tour:** Full-screen overlay or dedicated pages. Animated mentor character (aligned with "cool mentor" inspiration). Progress dots. Content area for text and interactive elements (radio buttons/checkboxes for goals/subjects). "Next", "Skip", "Finish" buttons.
    *   **Dashboard:** Top navigation bar (LMS logo, search, profile icon, settings). Main content area: prominently displays current XP and Level (XP bar). Tabs for "My Courses" (initially empty or suggested courses), "My Achievements" (initially empty). Personalized greeting (e.g., "Hello, [Username]!").
*   **Interaction Patterns:**
    *   **Clear Call-to-Actions:** Primary CTAs are visually distinct.
    *   **Gamified Feedback:** Instant, positive visual and auditory feedback for XP gain.
    *   **Interactive Onboarding:** Guided sequence, making setup feel engaging rather than a chore.
    *   **Brilliant.org/Duolingo Inspired UI:** Playful, colorful, and cool aesthetic for high school students, avoiding overly cartoonish elements. Clean, distraction-free layout from Khan Academy.

**User Flow 2: Browsing Courses & Enrollment**

*   **User Goal:** A logged-in student explores available courses, views details of a specific course, and enrolls in it to add it to their "My Courses" list.
*   **Actors:** Student (Logged-in User)
*   **Pre-conditions:** User is logged in and on the Dashboard or any other page with access to the main navigation.
*   **Main Flow:**
    *   **Step 1: Access Course List**
        *   **Action:** User clicks on "Courses" in the main navigation or a "Browse Courses" CTA on the Dashboard.
        *   **System Response:** The system displays the "Course List Page".
        *   **UI/Interaction:** Navigation link for "Courses" is highlighted or visually indicates active state.
    *   **Step 2: Browse Courses**
        *   **Action:** User scrolls through the list of available courses. They might use search or filter options (e.g., by subject, difficulty) if available (MVP might have basic filtering).
        *   **System Response:** The page updates to show relevant courses. Each course is presented as a card with a title, thumbnail, brief description, and possibly an "XP potential" indicator or "Level requirement".
        *   **UI/Interaction:** Course cards are visually appealing (Brilliant.org style). Hover effects on cards. Filter/search bar at the top of the list.
    *   **Step 3: View Course Details**
        *   **Action:** User clicks on a specific course card.
        *   **System Response:** The system navigates to the "Course Detail Page" for the selected course.
        *   **UI/Interaction:** Course card click leads to a dedicated page.
    *   **Step 4: Explore Course Content & Preview**
        *   **Action:** On the Course Detail Page, user reviews the course description, objectives, modules/lessons outline, instructor information, and looks for a "Preview" option.
        *   **System Response:** The page displays all relevant information. The system identifies if the course has free preview content.
        *   **UI/Interaction:**
            *   Course title, banner image.
            *   "About Course" section (description, learning outcomes).
            *   "Curriculum" section (expandable list of Modules and Lessons).
            *   "Free Preview" button or icon next to eligible lessons.
            *   "Enroll Now" button, prominently displayed with pricing (e.g., "$50").
    *   **Step 5: Initiate Enrollment**
        *   **Action:** User clicks the "Enroll Now" button.
        *   **System Response:**
            *   If monetization is implemented (MVP: all non-preview content is paid): The system initiates the payment flow. This involves redirecting to a secure payment gateway or displaying a payment modal.
            *   Upon successful payment: The system marks the user as "Enrolled" in the course.
            *   If the user already owns the course (e.g., via a previous purchase or if it were free): The button might say "Continue Learning" or "Go to Course" instead.
        *   **UI/Interaction:** "Enroll Now" button leads to a payment interface (e.g., "Stripe checkout" pop-up or redirect). Confirmation message upon successful enrollment.
    *   **Step 6: Course Added to Dashboard**
        *   **Action:** (Automatic after successful enrollment/payment).
        *   **System Response:** The newly enrolled course is added to the "My Courses" tab on the user's Dashboard, showing its status as "Not Started" or "Continue Learning" if any preview content was consumed.
        *   **UI/Interaction:** A success notification (e.g., "You've successfully enrolled in [Course Name]!") might appear, with an option to "Go to My Courses".
*   **Alternative Flows / Error Handling:**
    *   **Payment Failure:** If payment fails, an error message "Payment failed. Please try again or use another payment method." is displayed, and the user remains on the Course Detail Page or payment modal.
    *   **Already Enrolled:** The "Enroll Now" button changes to "Continue Learning" or "Go to Course".
*   **Post-conditions:** User is successfully enrolled in the selected course. The course appears in "My Courses" on the Dashboard. User has access to all course content (paid).
*   **Wireframe Description / Key UI Elements:**
    *   **Course List Page:** Header with title "All Courses". Search bar. Filter options (e.g., dropdowns for "Subject", "Difficulty"). Grid layout of course cards. Each card: Thumbnail image, Course Title, Instructor Name, brief description, "View Details" button.
    *   **Course Detail Page:** Large hero section with course title and image. Sections: "About this Course" (description, learning goals), "What you'll learn", "Instructor". "Curriculum" section: Expandable list of Modules, each containing lessons. Each lesson: Title, duration, "Preview" tag/button for free content, "Locked" icon for paid content. Prominent "Enroll Now" button with price.
    *   **Payment Interface:** Secure payment form (modal or redirect) asking for payment details.
    *   **Dashboard (My Courses tab):** List of enrolled courses. Each course card shows: Thumbnail, Course Title, Progress Bar (e.g., 0% complete), "Continue" button, "View Course" button.
*   **Interaction Patterns:**
    *   **Clear Information Hierarchy:** Course details are presented logically, with key actions (enrollment) standing out.
    *   **Visual Cues for Content Access:** "Preview" and "Locked" indicators clearly communicate what's accessible.
    *   **Brilliant.org/Khan Academy Style:** Clean, distraction-free layout for course content. Playful yet academic visual design.

**User Flow 3: Completing a Lesson & Taking an Interactive Quiz**

*   **User Goal:** A student watches a video lesson, successfully completes an interactive quiz for that lesson, earns XP, and moves to the next lesson.
*   **Actors:** Student (Logged-in User)
*   **Pre-conditions:** User is logged in and enrolled in a course. User has navigated to a specific lesson within that course.
*   **Main Flow:**
    *   **Step 1: Access Lesson Player**
        *   **Action:** From the Dashboard "My Courses" tab or the Course Detail Page, user clicks "Continue" or a specific lesson title.
        *   **System Response:** The system loads the "Lesson Player" interface, typically for the next uncompleted lesson or the selected one.
        *   **UI/Interaction:** Clicking a lesson link/button redirects to the lesson player.
    *   **Step 2: Watch Video Lesson**
        *   **Action:** User starts playing the video lesson and watches it.
        *   **System Response:** The video player streams the content. The system tracks video watch time.
        *   **UI/Interaction:** Standard video player controls (play/pause, volume, fullscreen, scrub bar). The player is centrally located, potentially with notes/transcripts alongside (Khan Academy style). Progress bar might update below the video.
    *   **Step 3: Earn XP for Video Completion**
        *   **Action:** User watches the entire video lesson.
        *   **System Response:** Upon detecting that the video has been watched to completion (or a significant percentage, e.g., 90%), the system awards +20 XP.
        *   **UI/Interaction:** A subtle notification (e.g., "Video Watched! +20 XP") appears briefly on screen. The user's total XP count on the dashboard (or a persistent XP display) updates.
    *   **Step 4: Access Interactive Quiz**
        *   **Action:** After the video, the user scrolls down or clicks a "Take Quiz" button/tab, revealing the interactive quiz for the lesson.
        *   **System Response:** The system presents the multiple-choice quiz questions.
        *   **UI/Interaction:** Quiz section appears below the video player, or as a new screen/modal within the lesson player. Clearly labeled questions and radio buttons for multiple-choice answers. "Submit Answer" button.
    *   **Step 5: Answer Quiz Questions**
        *   **Action:** User selects an answer for each question and clicks "Submit Answer".
        *   **System Response:**
            *   **Correct Answer:** The system immediately provides positive feedback (e.g., green highlight, "Correct!"). It awards +15 XP for each correctly answered question.
            *   **Incorrect Answer:** The system provides negative feedback (e.g., red highlight, "Incorrect.") and displays an "explanation pop-up" detailing why the answer was wrong and the correct solution. A "Retry" button appears for that question.
        *   **UI/Interaction:**
            *   **Correct:** "Correct!" message, +15 XP animation/pop-up.
            *   **Incorrect:** "Incorrect." message, explanation modal (overlaying current content or appearing inline). "Got it!" or "Retry" button within the explanation.
    *   **Step 6: Quiz Completion & Total XP Display**
        *   **Action:** User successfully answers all quiz questions (possibly after retries).
        *   **System Response:** The system registers the quiz as completed. If 100% correct on the first attempt (or overall after retries), awards +100 XP for "100% Quiz Score" (if that's an MVP specific condition, otherwise just cumulative +15XP per correct answer). The system marks the lesson as "Completed" and awards +50 XP for "Lesson Completion".
        *   **UI/Interaction:** A "Lesson Completed!" screen or pop-up. Displays total XP earned for *this lesson* (e.g., "Total XP for this lesson: 135 XP"). A "Next Lesson" button and a "Return to Course" button.
*   **Alternative Flows / Error Handling:**
    *   **User Leaves During Video:** Progress is saved, and the video resumes from where they left off. No XP awarded until sufficient watch time is met.
    *   **User Skips Quiz:** The lesson is not marked as fully complete, and no quiz-related XP is awarded. A prompt might appear to encourage quiz completion.
*   **Post-conditions:** User has completed the lesson. User has earned XP for watching the video, answering quiz questions, and completing the lesson. The lesson is marked as "Completed" in the course progress. User is ready to proceed to the next lesson or return to the course overview.
*   **Wireframe Description / Key UI Elements:**
    *   **Lesson Player Page:** Top navigation. Left sidebar for course navigation (list of modules/lessons, indicating completed/current lesson). Main content area: Video player. Below video: "Notes/Transcript" section (optional). Below that: "Quiz" section.
    *   **Quiz Section:** Multiple-choice questions. Each question has radio buttons for answers. "Submit Answer" button.
    *   **Feedback Pop-up (Incorrect):** Modal overlay with "Incorrect Answer" title. Explanation text. Correct answer highlight. "Got it!" button.
    *   **XP Notification:** Small, transient overlay or animated text (e.g., "+15 XP") appearing near the XP display or where the interaction happened.
    *   **Lesson Completion Screen:** Full-screen overlay or distinct page. "Lesson Completed!" title. Summary of XP earned. "Next Lesson" button (primary), "Return to Course" button (secondary).
*   **Interaction Patterns:**
    *   **Instant Feedback:** Immediate visual feedback for quiz answers (green/red highlights).
    *   **Gamified Rewards:** Prominent display of XP earned, celebrating achievements.
    *   **Clear Progression:** "Next Lesson" button encourages continuous learning.
    *   **Educational Clarity:** Explanation for wrong answers supports learning (Khan Academy principle).
    *   **Duolingo-like Motivation:** Frequent, small rewards (XP) to keep engagement high.

**User Flow 4: Viewing Dashboard & Tracking Progress**

*   **User Goal:** A logged-in student wants to review their overall progress, check their XP and level, see the status of their enrolled courses, and view their earned badges.
*   **Actors:** Student (Logged-in User)
*   **Pre-conditions:** User is logged in. User has completed some lessons, earned XP, and potentially earned badges.
*   **Main Flow:**
    *   **Step 1: Access Dashboard**
        *   **Action:** User clicks on the "Dashboard" link in the main navigation or automatically lands on it after login.
        *   **System Response:** The system displays the "Dashboard" page, personalized for the user.
        *   **UI/Interaction:** Dashboard link in navigation.
    *   **Step 2: Review Overall Progress (XP & Level)**
        *   **Action:** User visually scans the top section of the Dashboard.
        *   **System Response:** The system prominently displays the user's current Experience Points (XP) and their corresponding "Level". An XP bar visually indicates progress towards the next level.
        *   **UI/Interaction:** Large, clear display of "Your XP: [Total XP]" and "Level: [Current Level]". An animated progress bar shows "XP to next level: [X]". This should be dynamic and engaging, similar to Duolingo's progression bar.
    *   **Step 3: Check "My Courses" Progress**
        *   **Action:** User clicks on the "My Courses" tab (if not already active) or scrolls down to the "My Courses" section.
        *   **System Response:** The system lists all courses the user is enrolled in. For each course, it displays its status (e.g., "Not Started", "In Progress", "Completed") and a detailed progress indicator (e.g., percentage complete, number of lessons completed out of total).
        *   **UI/Interaction:** A card for each enrolled course. Each card: Thumbnail, Course Title, a visual progress bar (e.g., "75% Complete"), "Continue" button (if in progress), "Start Course" button (if not started), "View Course" button (if completed).
    *   **Step 4: View "My Achievements" (Badges)**
        *   **Action:** User clicks on the "My Achievements" tab.
        *   **System Response:** The system displays all badges the user has earned, along with any "locked" badges that are available to earn in the future, possibly with criteria.
        *   **UI/Interaction:** A grid or list of badge icons. Earned badges are in full color; unearned badges are grayed out or have a "locked" icon. Clicking an earned badge reveals a pop-up with badge name, description, and date earned.
    *   **Step 5: Review Daily Streak (if implemented in MVP)**
        *   **Action:** User glances at the streak counter (if visible on dashboard).
        *   **System Response:** The system displays the current daily learning streak.
        *   **UI/Interaction:** A small, persistent icon (e.g., flame icon) with a number (e.g., "7-day streak").
*   **Alternative Flows / Error Handling:**
    *   **No Courses Enrolled:** "My Courses" tab shows a message like "You haven't enrolled in any courses yet. Browse our courses to get started!" with a CTA to the Course List.
    *   **No Badges Earned:** "My Achievements" tab shows a message like "Keep learning to earn your first badge!" and shows some future badges as "locked."
*   **Post-conditions:** User has a clear understanding of their learning progress, achievements, and next steps within their enrolled courses.
*   **Wireframe Description / Key UI Elements:**
    *   **Dashboard Header:** User profile picture/avatar, user name. Prominent "XP: [Current XP]" and "Level: [Current Level]" display, with a visual XP progress bar (e.g., circle or horizontal bar) that animates when XP is gained.
    *   **Dashboard Tabs:** "My Courses", "My Achievements".
    *   **My Courses Tab:** Grid of course cards. Each card contains: Course thumbnail, Course Title, Progress Bar, "Continue" button, and possibly a "Last Studied" date.
    *   **My Achievements Tab:** Grid of badge icons. Earned badges are vibrant, unearned are desaturated/locked. Hover/click on a badge to show a modal with details (name, description, criteria).
    *   **Daily Streak:** A small, persistent widget, often in a corner or top bar, showing streak count (e.g., fire icon with "15").
*   **Interaction Patterns:**
    *   **Gamified Progress Visualization:** XP bar and Level display is central and visually rewarding.
    *   **Clear Actionable Next Steps:** "Continue" buttons on course cards make it easy to jump back into learning.
    *   **Motivational Achievement Display:** Badges provide a visual history of accomplishments, encouraging further engagement.
    *   **Duolingo/Brilliant.org Inspired:** Focus on making progress visible, engaging, and motivating through playful yet mature UI elements.

## Styling Guidelines
**STYLING**

**1. Introduction**
This document outlines the styling guidelines and UI/UX principles for the LMS project, an interactive learning platform for high school students. The goal is to create an engaging, motivating, and educationally credible experience that resonates with Gen Z and Gen Alpha, blending playfulness with academic seriousness.

**2. Core UI/UX Principles**
Our design philosophy is centered around creating a "cool mentor" experience, drawing inspiration from leading educational and gamified platforms while maintaining a unique identity suitable for high school students.

*   **Engaging & Playful, Not Childish**: Inspired by Duolingo's gamification (XP, levels, streaks, rewards), but with a more mature, academic, and "cool" aesthetic. We will avoid overly cartoonish elements. The "cool mentor" concept will guide interactive elements and overall tone.
*   **Clear & Distraction-Free**: Adhering to Khan Academy's principle of clean layouts, ensuring that educational content remains the primary focus. Information should be presented clearly and concisely.
*   **Motivating & Rewarding**: Implement visual feedback for progress (XP, badges, levels, streaks) prominently. Every interaction should feel purposeful and contribute to the user's learning journey. Inspired by Brilliant.org's colorful, playful UI and XP system.
*   **Intuitive & Accessible**: The platform must be easy to navigate for all users, regardless of technical proficiency. Design for responsiveness to ensure a consistent experience across various devices and screen sizes. Adhere to accessibility standards for color contrast, typography, and interactive elements, enabling students to learn "anytime, anywhere, even without high-end devices."
*   **Modern & Dynamic**: Utilize contemporary design trends that appeal to high school students, incorporating smooth animations, interactive elements, and a vibrant aesthetic without compromising educational credibility.

**3. Design System Foundations**

**3.1. Color Palette**
Our color palette is designed to be vibrant and motivating while maintaining an academic feel. It balances playful accents with professional neutrals to ensure clarity and reduce eye strain.

*   **Primary Brand Colors**:
    *   `--primary-500`: `#3B82F6` (e.g., a vibrant blue) - Dominant accent color for CTAs, main interactive elements, key branding.
    *   `--secondary-500`: `#10B981` (e.g., a contrasting green) - Supporting accent color, for secondary buttons, highlights, or complementary elements.
*   **Educational / Status Colors**:
    *   `--success-500`: `#22C55E` - For correct answers, completion, positive feedback.
    *   `--error-500`: `#EF4444` - For incorrect answers, warnings, critical states.
    *   `--warning-500`: `#F59E0B` - For important notices, pending actions.
    *   `--info-500`: `#0EA5E9` - For general information, hints.
*   **Neutral Palette**:
    *   `--gray-900`: `#1F2937` - Primary text color.
    *   `--gray-700`: `#4B5563` - Secondary text, subtitles.
    *   `--gray-500`: `#6B7280` - Placeholder text, icons, disabled states.
    *   `--gray-200`: `#E5E7EB` - Borders, separators.
    *   `--gray-100`: `#F3F4F6` - Light backgrounds, hover states.
    *   `--background`: `#FFFFFF` - Main page background.

*Note*: These hex codes are examples and will be finalized and documented in `tailwind.config.js` using CSS variables as recommended by Shadcn UI.

**3.2. Typography**
Typography ensures readability and establishes a clear information hierarchy. We will use a modern, clean, and highly readable sans-serif font family.

*   **Primary Font Family**: `Inter` or `Poppins`
    *   *Rationale*: Chosen for its excellent legibility across various screen sizes, modern aesthetic, and ability to convey both professionalism and approachability, suitable for educational content and UI elements.
*   **Font Weights**: Regular (400), Medium (500), Semi-bold (600), Bold (700)
*   **Heading Styles**:
    *   `H1` (e.g., 2.5rem / 40px, `font-bold`): Page titles, major section headings (e.g., Dashboard title).
    *   `H2` (e.g., 2rem / 32px, `font-semibold`): Sub-sections, major component titles (e.g., "My Courses").
    *   `H3` (e.g., 1.5rem / 24px, `font-semibold`): Card titles, minor section headings (e.g., Course card title).
    *   `H4` (e.g., 1.25rem / 20px, `font-medium`): Within-component titles (e.g., Lesson title within a module).
*   **Body Text**:
    *   `Body L` (e.g., 1.125rem / 18px, `font-regular`): For dense educational content, primary paragraphs in lessons.
    *   `Body M` (e.g., 1rem / 16px, `font-regular`): Standard body text, descriptions, general UI text.
    *   `Body S` (e.g., 0.875rem / 14px, `font-regular`): Small text, labels, metadata, captions.
*   **Accent Text**:
    *   `Button Text` (e.g., 1rem / 16px, `font-medium`): Consistent across all buttons.
    *   `Link Text` (e.g., 1rem / 16px, `font-medium`): Underlined or color-differentiated.

*Note*: Line heights will be carefully managed for optimal readability (typically 1.5 for body text, 1.2-1.3 for headings). All font sizes and line heights will be defined in `tailwind.config.js`.

**3.3. Spacing & Layout**
Consistent spacing is crucial for a clean, organized, and professional interface. We will adhere to a 4-point or 8-point grid system.

*   **Grid System**: Based on multiples of 4px (e.g., `spacing-px`, `spacing-0.5` (2px), `spacing-1` (4px), `spacing-2` (8px), etc., as per Tailwind CSS defaults).
*   **Horizontal & Vertical Rhythm**: Maintain consistent gaps between elements and sections to create visual harmony and clear hierarchy.
*   **Max Width**: Pages and content areas should have a defined maximum width (e.g., `max-w-7xl` or a custom container width) to prevent overly wide lines of text and improve readability on large screens.
*   **Responsiveness**: All layouts must be fully responsive, ensuring optimal display and interaction across mobile, tablet, and desktop viewports, leveraging Tailwind's responsive utilities for a seamless "learn anytime, anywhere" experience.

**3.4. Components (Shadcn UI & Custom)**
We will leverage Shadcn UI components as a foundation, customizing them to fit our brand's aesthetic, color palette, and typography.

*   **Buttons**: Clear hierarchy (Primary, Secondary, Outline, Ghost, Link). Consistent hover/active states for all interactive elements.
*   **Forms**: Intuitive input fields, clear labels, and immediate validation feedback (e.g., error messages, success indicators).
*   **Cards**: Used for courses, lessons, and achievements. Consistent padding, borders, and subtle shadows for visual grouping and separation.
*   **Navigation**: Clear global navigation (e.g., Dashboard, Courses, Achievements) and contextual navigation (e.g., course progress sidebar, lesson navigation).
*   **Modals/Dialogs**: For quizzes, explanations, confirmations, and onboarding steps. Consistent styling, accessible closing mechanisms.
*   **Progress Indicators**: For XP bars, lesson progress, loading states. Visually engaging and clear.

**4. Visual Elements & Gamification**

**4.1. Iconography**
Icons should be clean, consistent in style, and immediately recognizable to enhance usability.

*   **Style**: Prioritize a modern, slightly rounded, line-icon style, potentially with a secondary fill color for active states or specific gamified contexts (e.g., badges).
*   **Library**: Utilize a consistent icon library (e.g., Lucide Icons, or a custom SVG set if unique designs are required for gamification elements).
*   **Usage**: Accompany text for clarity, serve as standalone indicators (e.g., 'play', 'pause', 'settings', 'achievements', 'quiz').

**4.2. Imagery & Illustrations**
Imagery should be engaging and supportive of the "cool mentor" theme without being childish, appealing to high school students.

*   **Illustrations**:
    *   For onboarding, empty states, achievement unlocks, or interactive characters, use custom illustrations that embody the "cool mentor" persona or abstract representations of learning and progress.
    *   Style should be modern, clean, with geometric or organic shapes, and align with the defined color palette. Avoid overly complex or realistic illustrations.
*   **Avatars**: User profiles should feature customizable avatars or allow profile picture uploads. Default avatars should reflect the "cool mentor" aesthetic.
*   **Course Thumbnails**: High-quality, engaging thumbnails for courses, reflecting the subject matter in a modern and appealing way.

**4.3. Gamified Elements**
These elements are crucial for motivation, progress tracking, and delivering an addictive, rewarding learning experience.

*   **XP Bar & Level Display**: Prominently displayed on the Dashboard and possibly in a persistent header on other pages. A visually appealing progress bar with clear indicators for current XP and next level target. Use subtle animations for XP gain.
*   **Badges**:
    *   Unique, visually distinct designs for each badge, reflecting its achievement (e.g., "Learning Streak", "Mastery at Algebra").
    *   Displayed in a dedicated "My Achievements" section.
    *   Pop-up animation or notification upon earning a new badge, providing instant positive reinforcement.
*   **Streak Counter**: Clear, daily streak indicator, perhaps with a subtle animation when incremented, encouraging consistent engagement.
*   **Interactive Quizzes**:
    *   Instant visual feedback for correct/incorrect answers (e.g., green checkmark/red cross, subtle "pop" animation, sound effects).
    *   "Wrong answer explanation pop-up": Clear, concise explanation with distinct, helpful styling, offering a retry option.
    *   XP gain notification: Small, positive pop-up or animation showing "+15XP" (or appropriate value) for correct answers.
*   **Onboarding Tour**: Visually guided, interactive steps with clear progression indicators (e.g., step dots). Use friendly, encouraging tone and visuals to introduce features and set user goals.

**5. UI Patterns for Key User Journeys**

*   **Onboarding**: A multi-step process with clear progress indicators. Each step features engaging illustrations or "cool mentor" interactions, focuses on one action (e.g., "know your goals"), and provides immediate positive feedback (e.g., "+50XP as a welcome point").
*   **Dashboard**: A modular layout. The XP bar and Level are prominently displayed at the top. "My Courses" tab shows each course with a progress bar and "Continue" button. "My Achievement" tab visually showcases earned badges. Clear calls to action for continuing courses or exploring new ones.
*   **Course Browsing**: Grid or list view for courses, with clean cards displaying course title, description, and status (e.g., "Enroll", "Continue"). Filter and sort options should be easily accessible.
*   **Course Detail Page**: Clear structure: overview, curriculum (modules/lessons), materials, and potentially reviews. Distinct visual separation for "free previews" versus paid content. A prominent "Enroll" button with clear pricing information.
*   **Lesson Player**: Focus mode for video content, minimizing distractions. Interactive quiz elements are integrated seamlessly after content segments. "Next Lesson" button clearly visible and active upon lesson completion, often accompanied by an XP gain notification. Feedback pop-ups for quizzes are styled consistently.

**6. Implementation Notes**

*   **Tech Stack**: Leveraging Tailwind CSS for utility-first styling and Shadcn UI for pre-built, customizable components will ensure consistency, accelerate development, and maintain a modern aesthetic.
*   **CSS Variables**: Core colors, typography sizes, and spacing units will be defined as CSS variables within `tailwind.config.js` to enable easy theme management, ensure consistency, and improve maintainability.
*   **Component-Driven Development**: Prioritize building reusable and accessible components to ensure a consistent user experience and efficient development across the platform.

This styling guide will serve as a living document, evolving with user feedback and design iterations, always aiming to deliver the best learning experience for high school students.
