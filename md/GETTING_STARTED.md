# Getting Started with Your LMS Platform

Welcome! Your LMS platform is now set up with a powerful tech stack. This guide will help you get started quickly.

## 🎉 What's Included

Your project comes pre-configured with:

- ✅ **Next.js 15.5.5** - Latest Next.js with App Router
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS v4** - Modern utility-first CSS
- ✅ **shadcn/ui** - Beautiful, accessible UI components
- ✅ **Supabase** - Complete backend (auth, database, storage)
- ✅ **Bun** - Fast package manager and runtime

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. In your Supabase dashboard, go to **Authentication** → **Providers** → Enable **Email**

### 3. Run the Development Server

```bash
bun dev
```

Visit [http://localhost:3000/example](http://localhost:3000/example) to see the demo!

## 📁 Project Structure

```
lms-platform/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── example/            # Demo page (/example)
│   │   │   └── page.tsx
│   │   └── auth/
│   │       └── callback/       # OAuth callback handler
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── separator.tsx
│   │   │   └── dropdown-menu.tsx
│   │   └── auth/               # Auth components
│   │       ├── LoginForm.tsx   # Sign in/up form
│   │       └── UserProfile.tsx # User info display
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   └── supabase/           # Supabase clients
│   │       ├── client.ts       # Browser client
│   │       └── server.ts       # Server client
│   ├── types/
│   │   └── supabase.ts         # Database types
│   └── middleware.ts           # Auth middleware
├── public/                     # Static assets
├── components.json             # shadcn/ui config
├── tailwind.config.ts          # Tailwind config
└── Documentation files
```

## 📚 Documentation

### Core Guides

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase guide with examples
- **[SHADCN_SETUP.md](./SHADCN_SETUP.md)** - shadcn/ui components guide
- **[README.md](./README.md)** - Project overview

### Reference

- **[SUPABASE_FILES.md](./SUPABASE_FILES.md)** - Overview of Supabase files
- **[SHADCN_FILES.md](./SHADCN_FILES.md)** - Overview of shadcn/ui files

## 🎨 Using Components

### shadcn/ui Components

All UI components are ready to use:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Add More Components

```bash
# Add any component from shadcn/ui
bunx shadcn@latest add dialog toast table

# Interactive selection
bunx shadcn@latest add
```

## 🔐 Authentication

### Client Component Example

```tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function MyComponent() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return <div>{user?.email}</div>;
}
```

### Server Component Example

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <div>{user?.email}</div>;
}
```

### Server Action Example

```tsx
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getData() {
  const supabase = await createClient();
  const { data } = await supabase.from("my_table").select("*");
  return data;
}
```

## 💾 Database Operations

```tsx
const supabase = createClient();

// Insert
await supabase.from("table_name").insert({ name: "John" });

// Select
const { data } = await supabase.from("table_name").select("*");

// Update
await supabase.from("table_name").update({ name: "Jane" }).eq("id", 1);

// Delete
await supabase.from("table_name").delete().eq("id", 1);
```

## 🎯 Next Steps

### 1. Explore the Example Page

Visit [http://localhost:3000/example](http://localhost:3000/example) to see:

- Working authentication flow
- shadcn/ui components in action
- Form handling
- User state management

### 2. Set Up Your Database

1. Go to your Supabase dashboard
2. Click **Table Editor** → **New table**
3. Create your tables
4. Set up Row Level Security (RLS) policies

Example table:

```sql
CREATE TABLE courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own courses
CREATE POLICY "Users can view own courses"
  ON courses FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Generate TypeScript Types

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Generate types
supabase gen types typescript --project-id your-project-ref > src/types/supabase.ts
```

### 4. Add More UI Components

```bash
# Common components for an LMS
bunx shadcn@latest add form dialog toast tabs progress

# Data display
bunx shadcn@latest add table skeleton

# Navigation
bunx shadcn@latest add navigation-menu breadcrumb
```

### 5. Build Your First Feature

Example: Create a courses page

```tsx
// src/app/courses/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## 🛠️ Development Tips

### Hot Reload

The dev server supports hot reload. Just save files and see changes instantly.

### Dark Mode

Add dark mode toggle using `next-themes`:

```bash
bun add next-themes
```

### Form Handling

Use `react-hook-form` with shadcn/ui form components:

```bash
bun add react-hook-form @hookform/resolvers zod
bunx shadcn@latest add form
```

### Icons

Use Lucide icons (already installed):

```tsx
import { User, Settings, LogOut } from "lucide-react";

<User className="h-4 w-4" />;
```

## 🐛 Troubleshooting

### Authentication not working

1. Check `.env.local` has correct Supabase credentials
2. Restart dev server after adding env variables
3. Enable Email auth in Supabase dashboard

### Components not styling correctly

1. Check `tailwind.config.ts` exists
2. Verify `globals.css` has CSS variables
3. Clear `.next` folder: `rm -rf .next`

### TypeScript errors

1. Restart TS server in your editor
2. Check `tsconfig.json` has correct paths
3. Run `bun install` to ensure all types are installed

## 📖 Learning Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

### Video Tutorials

- [Next.js App Router](https://www.youtube.com/results?search_query=nextjs+app+router)
- [Supabase Auth](https://www.youtube.com/results?search_query=supabase+authentication)
- [shadcn/ui Tutorial](https://www.youtube.com/results?search_query=shadcn+ui+tutorial)

## 🎓 Building Your LMS

Key features to consider:

1. **Course Management**

   - Create/edit courses
   - Course categories
   - Course enrollment

2. **User Roles**

   - Students
   - Instructors
   - Admins

3. **Content Delivery**

   - Video lessons (Supabase Storage)
   - PDF documents
   - Quizzes

4. **Progress Tracking**

   - Lesson completion
   - Course progress
   - Certificates

5. **Payment Integration**
   - Stripe
   - Course pricing

## 💡 Pro Tips

1. **Keep it simple** - Start with core features, add complexity later
2. **Use Server Components** - Better performance, use Client Components only when needed
3. **Protect your routes** - Use middleware for authentication
4. **Type everything** - Generate types from your Supabase schema
5. **Test early** - Test authentication and database queries early

## 🤝 Need Help?

- Check the documentation files in this repo
- Read the official docs for each technology
- Search GitHub issues for similar problems
- Check Stack Overflow

## 🚀 Ready to Build!

You now have everything you need to build a modern LMS platform. Start by:

1. ✅ Running the dev server
2. ✅ Checking out `/example`
3. ✅ Creating your first database table
4. ✅ Building your first feature

Happy coding! 🎉
