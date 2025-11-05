# Database Migrations Guide

## Overview

This directory contains SQL migration files for the LMS database schema.

## Migration Files

### Initial Setup (Fresh Database)

If you're setting up the database for the first time, run these in order:

1. **001_create_user_profiles.sql** - Creates user profiles table
2. **001_create_courses_schema.sql** - Creates courses, lessons, and related tables (already includes `duration_seconds`)

### Migration (Existing Database)

If you already have a database with `duration_minutes` and need to migrate:

1. **002_migrate_duration_to_seconds.sql** - Converts `duration_minutes` to `duration_seconds`
   - Adds `duration_seconds` column
   - Converts existing data (minutes × 60 = seconds)
   - Removes `duration_minutes` column
   - Updates `calculate_course_stats` function

### Rollback (If Needed)

If you need to revert the duration changes:

1. **002_migrate_duration_to_seconds_rollback.sql** - Reverts back to `duration_minutes`
   - ⚠️ **WARNING**: This loses precision! (e.g., 8:10 becomes 8min)

## How to Run Migrations

### Using Supabase CLI

```bash
# Run a specific migration
supabase db push

# Or run manually
psql $DATABASE_URL -f supabase/migrations/002_migrate_duration_to_seconds.sql
```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration file contents
4. Click "Run"

## Seed Data

After running migrations, seed the database:

```bash
# Using Supabase CLI
supabase db reset

# Or run manually in SQL Editor
-- First: supabase/seeds/001_seed_courses.sql
-- Then: supabase/seeds/002_seed_lessons.sql
```

## Important Notes

- **Fresh Install**: Use the updated `001_create_courses_schema.sql` which already has `duration_seconds`
- **Existing Database**: Use `002_migrate_duration_to_seconds.sql` to migrate
- Always backup your database before running migrations
- Test migrations in development before running in production
