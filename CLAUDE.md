# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an LMS (Learning Management System) platform built with Next.js 15, TypeScript, and Supabase. The project uses the Next.js App Router architecture with server-side rendering and modern React patterns.

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
# or
npm run dev

# Build for production (uses Turbopack)
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

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
│   ├── auth/          # Authentication-related components
│   ├── home/          # Landing page sections (Hero, WhyChooseUs, etc.)
│   ├── layout/        # Layout components (Header, Footer)
│   └── ui/            # shadcn/ui components (50+ components)
├── app/
│   ├── (auth)/        # Auth route group
│   ├── api/           # API routes
│   │   └── auth/
│   │       └── signup/route.ts  # OAuth callback handler
│   ├── layout.tsx     # Root layout with Header/Footer
│   └── page.tsx       # Landing page composition
├── lib/
│   ├── supabase/      # Supabase client configs
│   └── utils.ts       # Utility functions (cn helper for class merging)
└── types/             # TypeScript type definitions
```

### Path Aliases

The project uses `@/*` as an alias for `src/*`:

```typescript
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
```

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

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

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

4. **Styling**:
   - Use Tailwind utility classes
   - Follow mobile-first responsive design
   - Reference commented Tailwind config for intended design system

## Current State

- Landing page with marketing sections implemented
- Auth UI pages built but not yet functional (forms need wiring)
- OAuth callback handler exists for Google sign-in
- Middleware configured but route protection not yet active
- Design system partially implemented (Nunito font, basic components)
