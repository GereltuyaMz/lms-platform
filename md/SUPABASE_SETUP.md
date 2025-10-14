# Supabase Setup Guide

This project uses Supabase for backend services including authentication, database, and storage.

## Getting Started

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in your project details:
   - Project name
   - Database password (save this securely)
   - Region (choose closest to your users)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon)
2. Navigate to **API** section
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys")

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project (it's already gitignored):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace `your-project-url` and `your-anon-key` with the values from step 2.

## Project Structure

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts      # Client-side Supabase client (use in Client Components)
│       └── server.ts      # Server-side Supabase client (use in Server Components)
├── middleware.ts          # Handles authentication state across requests
└── types/
    └── supabase.ts        # TypeScript types (generated from your schema)
```

## Usage Examples

### Client Component (Browser)

```tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function ClientComponent() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return <div>User: {user?.email}</div>;
}
```

### Server Component

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function ServerComponent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <div>User: {user?.email}</div>;
}
```

### Server Actions

```tsx
"use server";

import { createClient } from "@/lib/supabase/server";

export async function serverAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("your_table").select("*");

  return { data, error };
}
```

### Route Handlers (API Routes)

```tsx
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("your_table").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

## Generating TypeScript Types

To get full type safety, generate TypeScript types from your Supabase schema:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Generate types (replace with your project ref from dashboard URL)
supabase gen types typescript --project-id your-project-ref > src/types/supabase.ts
```

Then update your client files to use the types:

```typescript
import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

## Middleware

The middleware automatically handles:

- Refreshing authentication tokens
- Managing user sessions across server and client
- Cookie management

You can add route protection in `src/middleware.ts`:

```typescript
// Protect authenticated routes
if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

// Redirect authenticated users away from auth pages
if (user && request.nextUrl.pathname.startsWith("/login")) {
  const url = request.nextUrl.clone();
  url.pathname = "/dashboard";
  return NextResponse.redirect(url);
}
```

## Common Operations

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// Sign out
const { error } = await supabase.auth.signOut();

// OAuth (Google, GitHub, etc.)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
});
```

### Database Operations

```typescript
// Insert
const { data, error } = await supabase
  .from("table_name")
  .insert({ column: "value" });

// Select
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("column", "value");

// Update
const { data, error } = await supabase
  .from("table_name")
  .update({ column: "new_value" })
  .eq("id", 123);

// Delete
const { data, error } = await supabase
  .from("table_name")
  .delete()
  .eq("id", 123);
```

### Storage

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from("bucket_name")
  .upload("path/to/file.jpg", file);

// Download file
const { data, error } = await supabase.storage
  .from("bucket_name")
  .download("path/to/file.jpg");

// Get public URL
const { data } = supabase.storage
  .from("bucket_name")
  .getPublicUrl("path/to/file.jpg");
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

## Troubleshooting

### "Invalid API key" error

- Check that your environment variables are set correctly
- Restart your development server after adding environment variables

### Authentication not persisting

- Make sure middleware is properly configured
- Check that cookies are being set correctly (look in browser DevTools)

### CORS errors

- Ensure you're using the correct client (browser client for client components, server client for server components)
- Check your Supabase project settings for allowed origins
