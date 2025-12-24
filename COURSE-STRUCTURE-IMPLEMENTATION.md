# Course Structure & Unit Quiz Implementation

This document covers migrations 016-021 and the frontend implementation for the unit-based course structure with comprehensive quizzes.

## Table of Contents
- [Migration 016: Category Hierarchy](#migration-016-category-hierarchy)
- [Migration 017: Units Table](#migration-017-units-table)
- [Migration 018: Unit-Lesson Relationship](#migration-018-unit-lesson-relationship)
- [Migration 019: Unit Quizzes](#migration-019-unit-quizzes)
- [Migration 020: Lesson Content Table](#migration-020-lesson-content-table)
- [Migration 021: Content Description Field](#migration-021-content-description-field)
- [Frontend Implementation](#frontend-implementation)

---

## Architecture Overview

The new course structure follows this hierarchy:

```
Category (Exam Type)
└── Category (Subject)
    └── Course
        └── Unit
            ├── Lesson
            │   ├── Content Item (Theory Video)
            │   ├── Content Item (Easy Example)
            │   ├── Content Item (Hard Example)
            │   └── Lesson Quiz (3-5 questions)
            └── Unit Quiz (5-10+ questions)
```

---

## Migration 016: Category Hierarchy

**File:** `supabase/migrations/016_add_category_hierarchy.sql`

### Purpose
Adds hierarchical category support for organizing courses by exam type and subject.

### Schema Changes

```sql
ALTER TABLE categories
  ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  ADD COLUMN category_type TEXT NOT NULL DEFAULT 'subject'
    CHECK (category_type IN ('exam', 'subject')),
  ADD COLUMN order_index INTEGER DEFAULT 0,
  ADD COLUMN name_mn TEXT,
  ADD COLUMN icon TEXT;
```

| Column | Type | Description |
|--------|------|-------------|
| `parent_id` | UUID | Self-referencing FK for nested categories |
| `category_type` | TEXT | `'exam'` (ЭЕШ, SAT) or `'subject'` (Math, Physics) |
| `order_index` | INTEGER | Sort order within same parent |
| `name_mn` | TEXT | Mongolian display name |
| `icon` | TEXT | Emoji or icon class name |

### Helper Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `get_category_path(category_id)` | TEXT | Full path like "ЭЕШ > Математик" |
| `get_category_descendants(category_id)` | TABLE | All child category IDs recursively |
| `get_category_tree(parent_id)` | JSONB | Nested JSON tree of categories |
| `get_exam_types()` | TABLE | Top-level exam type categories |
| `get_subjects_by_exam(exam_id)` | TABLE | Subject categories under an exam |

### Example Usage

```sql
-- Get category path
SELECT get_category_path('uuid-here');
-- Returns: "ЭЕШ > Математик"

-- Get full category tree as JSON
SELECT get_category_tree();
-- Returns nested JSON with all categories and children
```

---

## Migration 017: Units Table

**File:** `supabase/migrations/017_create_units_table.sql`

### Purpose
Creates the `units` table to group lessons within a course.

### Schema

```sql
CREATE TABLE units (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  title_mn TEXT,
  description TEXT,
  slug TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(course_id, slug),
  UNIQUE(course_id, order_index)
);
```

| Column | Type | Description |
|--------|------|-------------|
| `course_id` | UUID | Parent course |
| `title` | TEXT | Unit title (English) |
| `title_mn` | TEXT | Unit title (Mongolian) |
| `description` | TEXT | Unit description |
| `slug` | TEXT | URL-friendly identifier |
| `order_index` | INTEGER | Display order in course |

### Triggers
- `update_units_updated_at` - Auto-updates `updated_at` timestamp
- `generate_unit_slug` - Auto-generates slug from title

### Helper Function

```sql
-- Returns all units for a course with lesson stats
SELECT * FROM get_course_units('course-uuid');
-- Returns: unit_id, title, lesson_count, total_duration, has_quiz
```

---

## Migration 018: Unit-Lesson Relationship

**File:** `supabase/migrations/018_add_unit_to_lessons.sql`

### Purpose
Links lessons to units and adds new lesson types for content categorization.

### Schema Changes

```sql
-- New lesson types
ALTER TYPE lesson_type ADD VALUE 'theory';
ALTER TYPE lesson_type ADD VALUE 'easy_example';
ALTER TYPE lesson_type ADD VALUE 'hard_example';

-- New columns on lessons table
ALTER TABLE lessons
  ADD COLUMN unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  ADD COLUMN order_in_unit INTEGER;
```

| Column | Type | Description |
|--------|------|-------------|
| `unit_id` | UUID | Parent unit (nullable for legacy lessons) |
| `order_in_unit` | INTEGER | Order within unit (1=theory, 2=easy, 3=hard) |

### Lesson Types

| Type | Description |
|------|-------------|
| `video` | Legacy video lesson |
| `text` | Text/reading content |
| `quiz` | Quiz lesson |
| `assignment` | Assignment |
| `theory` | Theory video (new) |
| `easy_example` | Easy example video (new) |
| `hard_example` | Hard example video (new) |

### Helper Function

```sql
SELECT * FROM get_unit_lessons('unit-uuid');
-- Returns lessons ordered by order_in_unit
```

---

## Migration 019: Unit Quizzes

**File:** `supabase/migrations/019_add_unit_to_quizzes.sql`

### Purpose
Enables quizzes at both lesson and unit levels.

### Schema Changes

```sql
-- quiz_questions table
ALTER TABLE quiz_questions
  ADD COLUMN unit_id UUID REFERENCES units(id) ON DELETE CASCADE;
ALTER TABLE quiz_questions
  ALTER COLUMN lesson_id DROP NOT NULL;
ALTER TABLE quiz_questions
  ADD CONSTRAINT quiz_question_parent_required
  CHECK (lesson_id IS NOT NULL OR unit_id IS NOT NULL);

-- quiz_attempts table
ALTER TABLE quiz_attempts
  ADD COLUMN unit_id UUID REFERENCES units(id) ON DELETE CASCADE;
ALTER TABLE quiz_attempts
  ALTER COLUMN lesson_id DROP NOT NULL;
ALTER TABLE quiz_attempts
  ADD CONSTRAINT quiz_attempt_parent_required
  CHECK (lesson_id IS NOT NULL OR unit_id IS NOT NULL);
```

### Quiz Structure

| Quiz Type | Location | Typical Questions |
|-----------|----------|-------------------|
| Lesson Quiz | `lesson_id` set, `unit_id` NULL | 3-5 questions |
| Unit Quiz | `unit_id` set, `lesson_id` NULL | 5-10+ questions |

### Helper Functions

| Function | Description |
|----------|-------------|
| `get_unit_quiz_questions(unit_id)` | All questions and options for unit quiz |
| `get_best_unit_quiz_attempt(enrollment_id, unit_id)` | User's best attempt |
| `unit_has_quiz(unit_id)` | Boolean check |
| `get_unit_quiz_stats(unit_id)` | Question count and total points |

---

## Migration 020: Lesson Content Table

**File:** `supabase/migrations/020_create_lesson_content.sql`

### Purpose
Separates video/text content from lesson metadata, allowing multiple content items per lesson.

### Schema

```sql
CREATE TYPE content_type AS ENUM (
  'theory', 'easy_example', 'hard_example', 'text', 'attachment'
);

CREATE TABLE lesson_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type content_type NOT NULL,
  video_url TEXT,
  content TEXT,
  duration_seconds INTEGER,
  order_index INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(lesson_id, order_index),
  CONSTRAINT duration_positive CHECK (duration_seconds IS NULL OR duration_seconds > 0)
);
```

| Column | Type | Description |
|--------|------|-------------|
| `lesson_id` | UUID | Parent lesson |
| `title` | TEXT | Content title (e.g., "Теори") |
| `content_type` | ENUM | theory, easy_example, hard_example, text, attachment |
| `video_url` | TEXT | Video URL for video content |
| `content` | TEXT | Text/markdown for text content |
| `duration_seconds` | INTEGER | Video duration |
| `order_index` | INTEGER | Order within lesson (1=theory, 2=easy, 3=hard) |

### Content Types

| Type | Icon | Description |
|------|------|-------------|
| `theory` | 📖 BookOpen | Theory/concept explanation video |
| `easy_example` | 💡 Lightbulb | Simple example video |
| `hard_example` | 🧠 Brain | Complex example video |
| `text` | 📝 FileText | Text/markdown content |
| `attachment` | 📎 Paperclip | Downloadable file |

### Helper Functions

```sql
-- Get all content for a lesson
SELECT * FROM get_lesson_content('lesson-uuid');

-- Get total duration
SELECT get_lesson_total_duration('lesson-uuid');
```

---

## Migration 021: Content Description Field

**File:** `supabase/migrations/021_add_description_to_lesson_content.sql`

### Purpose
Adds a description field for explanatory text shown below videos.

### Schema Change

```sql
ALTER TABLE lesson_content
ADD COLUMN description TEXT;

COMMENT ON COLUMN lesson_content.description IS
  'Text description/explanation shown below video content';
```

### Use Case
Display additional context or key points below a video:

```tsx
{/* Video */}
<VideoPlayer videoUrl={content.video_url} />

{/* Description below video */}
{content.description && (
  <div className="bg-blue-50 rounded-lg p-4 mt-3">
    <p className="text-sm text-gray-700">{content.description}</p>
  </div>
)}
```

---

## Frontend Implementation

### TypeScript Types

**File:** `src/types/database/enums.ts`
```typescript
export type ContentType = 'theory' | 'easy_example' | 'hard_example' | 'text' | 'attachment'
```

**File:** `src/types/database/tables.ts`
```typescript
export interface LessonContent {
  id: string
  lesson_id: string
  title: string
  content_type: ContentType
  video_url: string | null
  content: string | null
  description: string | null
  duration_seconds: number | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  course_id: string
  title: string
  title_mn: string | null
  description: string | null
  slug: string
  order_index: number
  created_at: string
  updated_at: string
}
```

**File:** `src/types/database/queries.ts`
```typescript
export interface UnitWithLessons extends Unit {
  lessons: Lesson[]
}

export interface LessonWithContent extends Lesson {
  lesson_content: LessonContent[]
}

export interface LessonComplete extends Lesson {
  lesson_content: LessonContent[]
  quiz_questions: QuizQuestion[]
  hasQuiz: boolean
}
```

### Server Actions

**File:** `src/lib/actions/unit-actions.ts`

| Function | Description |
|----------|-------------|
| `getCourseUnits(courseId)` | Fetch all units with lessons |
| `getUnitWithQuiz(unitId)` | Fetch unit with quiz info |
| `getUnitQuizQuestions(unitId)` | Fetch quiz questions for unit |
| `getLessonWithContent(lessonId)` | Fetch lesson with content items |
| `getLessonComplete(lessonId)` | Fetch lesson with content and quiz |
| `getUnitProgress(enrollmentId, unitId)` | Get completion status |

### New Components

| Component | File | Description |
|-----------|------|-------------|
| `ContentItemRenderer` | `src/components/player/ContentItemRenderer.tsx` | Renders theory/example content items |
| `UnitQuizPlayer` | `src/components/player/quiz/UnitQuizPlayer.tsx` | Quiz player for unit quizzes |

### New Routes

| Route | File | Description |
|-------|------|-------------|
| `/courses/[slug]/units/[unitId]/quiz` | `src/app/courses/[slug]/units/[unitId]/quiz/page.tsx` | Unit quiz page |

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/lesson-utils.ts` | Added `fetchUnitsWithQuiz()`, updated `transformUnitsForSidebar()` |
| `src/lib/actions/xp-helpers.ts` | Added `isUnitQuizRetry()`, `getUnitTitle()` |
| `src/lib/actions/xp-actions.ts` | Added `awardUnitQuizCompletionXP()` |
| `src/components/player/LessonSidebar.tsx` | Added unit quiz button |
| `src/app/courses/[slug]/learn/[lessonId]/page.tsx` | Fetches unitQuizMap for sidebar |

---

## XP System Integration

### Source Types

| Source Type | Description |
|-------------|-------------|
| `lesson_complete` | Video lesson completion |
| `quiz_complete` | Lesson quiz completion |
| `unit_quiz_complete` | Unit quiz completion (NEW) |
| `milestone` | Course progress milestones |

### XP Functions

```typescript
// Award XP for unit quiz
await awardUnitQuizCompletionXP(
  attemptId,
  unitId,
  courseId,
  score,
  totalQuestions
);

// Check for retry (no XP for retries)
const isRetry = await isUnitQuizRetry(userId, unitId, attemptId);
```

---

## Data Flow

```
1. User visits lesson page
   ↓
2. Page fetches:
   - Course data
   - Units with getCourseUnits()
   - Lesson with getLessonWithContent()
   - Quiz map with fetchUnitsWithQuiz()
   ↓
3. LessonSidebar renders:
   - Unit sections
   - Lesson items
   - "Бүлгийн тест" button (if hasUnitQuiz)
   ↓
4. User clicks unit quiz button
   ↓
5. Navigate to /courses/[slug]/units/[unitId]/quiz
   ↓
6. Page fetches:
   - Unit data
   - Quiz questions with getUnitQuizQuestions()
   ↓
7. UnitQuizPlayer renders quiz
   ↓
8. On completion:
   - saveUnitQuizAttempt()
   - awardUnitQuizCompletionXP()
   - Update streak
   - Check badges
```

---

## Database ER Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ categories  │     │   courses   │     │    units    │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │◄────│ course_id   │
│ name        │     │ title       │     │ title       │
│ parent_id   │──┐  │ slug        │     │ order_index │
│ category_   │  │  └─────────────┘     └──────┬──────┘
│  type       │  │                             │
└─────────────┘  └─────────────────────────────┘
                                               │
┌─────────────────────────────────────────────┼────────────────────┐
│                                             │                    │
▼                                             ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   lessons   │     │lesson_content│     │quiz_questions│     │quiz_attempts│
├─────────────┤     ├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │◄────│ lesson_id   │     │ lesson_id   │     │ lesson_id   │
│ unit_id     │     │ content_type│     │ unit_id     │     │ unit_id     │
│ course_id   │     │ video_url   │     │ question    │     │ score       │
│ lesson_type │     │ description │     │ explanation │     │ enrollment_ │
│ order_in_   │     │ order_index │     │ points      │     │  id         │
│  unit       │     └─────────────┘     └─────────────┘     └─────────────┘
└─────────────┘
```

---

## Migration Order

Run migrations in this order:

```bash
1. 016_add_category_hierarchy.sql     # Category nesting
2. 017_create_units_table.sql         # Units table
3. 018_add_unit_to_lessons.sql        # Link lessons to units
4. 019_add_unit_to_quizzes.sql        # Unit-level quizzes
5. 020_create_lesson_content.sql      # Lesson content table
6. 021_add_description_to_lesson_content.sql  # Description field
```

---

## Backward Compatibility

All migrations maintain backward compatibility:

- `unit_id` on lessons is nullable (legacy lessons work without units)
- `lesson_id` on quiz_questions is nullable (supports unit quizzes)
- `lesson_content` table is optional (lessons can still use legacy `video_url`)
- Frontend checks for units before using unit-based rendering

```typescript
const hasUnits = units.length > 0;
const sidebarUnits = hasUnits
  ? transformUnitsForSidebar(units, lessonId, completedIds, unitQuizMap)
  : undefined;
```
