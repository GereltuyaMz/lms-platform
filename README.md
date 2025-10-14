This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

- **Framework**: Next.js 15.5.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Backend**: Supabase (Authentication, Database, Storage)
- **Package Manager**: Bun

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

#### 2. Set Up Environment Variables

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create `.env.local` in the project root
3. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 3. Run the Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
lms-platform/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   └── page.tsx      # Example page with Supabase + shadcn/uss
│   ├── components/
│   │   ├── auth/         # Authentication components
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utility functions and configurations
│   │   ├── supabase/     # Supabase client configurations
│   │   └── utils.ts      # Utility functions (cn helper)
│   ├── types/            # TypeScript type definitions
│   └── middleware.ts     # Next.js middleware for auth handling
├── public/               # Static assets
└── ...config files
```

## Features

✅ **Authentication** - Complete auth system with Supabase (sign up, sign in, sign out)  
✅ **Beautiful UI** - Pre-built components with shadcn/ui  
✅ **Dark Mode Ready** - Full dark mode support with CSS variables  
✅ **Type Safe** - Full TypeScript support throughout  
✅ **Responsive** - Mobile-first responsive design  

## Learn More

### Documentation

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
