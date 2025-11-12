# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an LMS (Learning Management System) platform built with Next.js 15, TypeScript, and Supabase. The project uses the Next.js App Router architecture with server-side rendering and modern React patterns.
If need more detail of the project read this file: `/lms-doc.md`

## Tech Stack

- **Framework**: Next.js 15.5.5 with App Router and Turbopack
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind)
- **Authentication/Backend**: Supabase (Auth, Database, Storage)
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: Bun (preferred) or npm
- **Font**: Nunito (Google Fonts)

## Development Commands

```bash
# Install dependencies
bun install

# Run development server with Turbopack
bun dev

## Architecture

### Supabase Client Architecture

The project uses **two separate Supabase client implementations**:

1. **Client Components** (`src/lib/supabase/client.ts`):
   - Uses `createBrowserClient` from `@supabase/ssr`
   - For components that need client-side interactivity
   - Import: `import { createClient } from "@/lib/supabase/client"`

2. **Server Components** (`src/lib/supabase/server.ts`):
   - Uses `createServerClient` from `@supabase/ssr` with Next.js cookies
   - For Server Components, Server Actions, and API Routes
   - Import: `import { createClient } from "@/lib/supabase/server"`

**Critical**: Always use the correct client for the context. Using the browser client in server components will cause runtime errors.

### Middleware (`src/middleware.ts`)

- Runs on every request (except static assets)
- Manages Supabase session refresh via cookies
- **Important**: Do not add logic between `createServerClient` and `supabase.auth.getUser()` - this can cause session bugs
- Must return the `supabaseResponse` object with cookies intact to avoid premature session termination
- Currently contains placeholder for protected route logic (commented out)

### Route Groups

The app uses Next.js route groups for organization:

- `(auth)/*` - Authentication pages (signup, signin)
  - These pages currently have no layout wrapper (standalone auth flows)
- Root level - Public marketing pages with Header/Footer layout

### Component Organization

```

src/
├── components/
│ ├── auth/ # Authentication-related components
│ ├── home/ # Landing page sections (Hero, WhyChooseUs, etc.)
│ ├── layout/ # Layout components (Header, Footer)
│ └── ui/ # shadcn/ui components (50+ components)
├── app/
│ ├── (auth)/ # Auth route group
│ ├── api/ # API routes
│ │ └── auth/
│ │ └── signup/route.ts # OAuth callback handler
│ ├── layout.tsx # Root layout with Header/Footer
│ └── page.tsx # Landing page composition
├── lib/
│ ├── supabase/ # Supabase client configs
│ └── utils.ts # Utility functions (cn helper for class merging)
└── types/ # TypeScript type definitions

````

### Path Aliases

The project uses `@/*` as an alias for `src/*`:

```typescript
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
````

### Styling Patterns

- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- Custom Tailwind theme configuration in `tailwind.config.ts` (currently commented out but shows intended design system with custom font sizes)
- Global styles in `src/styles/globals.css`
- Font: Nunito with weights 300-800 configured in root layout

### Authentication Flow

1. **Sign Up/Sign In Pages**: UI-only pages in `(auth)` route group (forms not yet wired)
2. **OAuth Callback**: `/api/auth/signup/route.ts` handles OAuth code exchange
3. **Session Management**: Middleware refreshes sessions on every request
4. **Protected Routes**: Not yet implemented (placeholder in middleware)

## Important Patterns

### When Adding New Features

1. **Server vs Client Components**: Default to Server Components. Only use "use client" when you need:

   - Browser APIs (localStorage, window)
   - Event handlers (onClick, onChange)
   - React hooks (useState, useEffect)
   - Interactive shadcn/ui components

2. **Authentication**:

   - Use `src/lib/supabase/server` for Server Components/Actions
   - Use `src/lib/supabase/client` for Client Components
   - Always check which context you're in before importing

3. **UI Components**:

   - All shadcn/ui components are in `src/components/ui`
   - Use `cn()` utility for conditional class merging
   - Follow existing component patterns from shadcn
   - Add cursor-pointer classname when the element is interactive
   - Use the shadcn component if possible, if the design element not in the shadcn then create the element yourself

4. **Styling**:
   - Use Tailwind utility classes
   - Follow mobile-first responsive design
   - Reference commented Tailwind config for intended design system

## Current State(Progress)

please read `/PROGRESS.md`

## Gamification System

For XP awards, shop economy, and gamification mechanics, read `/XP-SYSTEM.md`

## Developer Preferences

1. Be concise and direct — write code and explanations only when necessary. Avoid filler or self-explaining comments.
2. Limit comments to logic that is complex, non-obvious, or needs future context.
3. Follow project conventions — match existing folder structure, naming, linting, and formatting. Don’t invent new patterns unless explicitly told.
4. Understand the current context before coding — analyze existing files, read nearby code, and infer intent from structure.
5. If uncertain, ask in chat — don’t make assumptions that change architecture or dependencies.
6. Think long-term — suggest scalable, maintainable patterns when relevant.

### Coding Style

- Use **arrow functions** and **named exports** for all React components.
- Limit files to **≤170 lines**; if longer, split into smaller components.
- Prefer **type** over **interface** in UI-related files (`components`, `pages`).
  - Exception: use `interface` if extending another type or describing an object shape more clearly.
- Maintain consistent **imports order** (React → libraries → local files).
- Always use **TypeScript strict mode** and explicit return types where possible.
- Keep component files self-contained — avoid unnecessary props drilling or global state unless required.
- Use clear, semantic naming for files and variables and specific (e.g., `LessonCard`, not `Card1`).
- Destructure imports when possible (eg. import { foo } from 'bar') and spread operators
- Be sure to typecheck when you’re done making a series of code changes, DO NOT UUSE ANY TYPE!!
- Make sure to use the `/src/types/database` that created based on supabase table, to limit repeated types in UI if possible
- If the function is gonna used 2+ places then make the function in `/src/lib/utils.ts` file
- Mobile-first approach: Start with mobile styles, add md: and lg: for larger screens
  - Reusable patterns: If you use the same responsive grid/layout 2+ times, extract it to /src/lib/utils.ts or a shared component
  - Test breakpoints: Common responsive issues happen at md (768px) and lg (1024px)
  - Typography scale: Use responsive text sizes (text-base md:text-lg lg:text-xl)
  - Spacing: Use responsive padding/margin (p-4 md:p-6 lg:p-8)
- If the imported component, function, hook and etc... not used anymore then delete the import
- Use DRY Principle, KISS principle, and Separation of Concerns on every code file

### Database structure

- Read the `/supabase/migrations/*` to understand the current database structure and what function we could use in the frontend, if it's not usable, then think about is the function need to implemented in supabase's function or trigger, the commented ones are not yet implemented one
- Read the `/supabase/seeds/*` to understand the current data content
