# EYSH 2024 Seed Data Transformation

## Overview
Transformed all 4 math test seed files (A, B, C, D) to match the current database schema after migrations 049 removed EYSH scoring thresholds and passing score logic.

## Changes Made

### Schema Changes
The `mock_tests` table INSERT statement was updated to remove deprecated columns:

**Before:**
```sql
INSERT INTO mock_tests (
    id, title, description, time_limit_minutes, total_questions,
    passing_score_percentage, is_published, category,
    eysh_threshold_500, eysh_threshold_600, eysh_threshold_700, eysh_threshold_800
) VALUES (
    '...uuid...', 'Title', 'Description',
    180, 40, 60, true, 'math', 60, 70, 80, 90
);
```

**After:**
```sql
INSERT INTO mock_tests (
    id, title, description, time_limit_minutes, total_questions,
    is_published, category
) VALUES (
    '...uuid...', 'Title', 'Description',
    180, 40, true, 'math'
);
```

### Columns Removed
1. **`passing_score_percentage`** - Removed in migration 049
2. **`eysh_threshold_500`** - Removed in migration 049
3. **`eysh_threshold_600`** - Removed in migration 049
4. **`eysh_threshold_700`** - Removed in migration 049
5. **`eysh_threshold_800`** - Removed in migration 049

### Columns Retained
- `id` - Unique identifier for the test
- `title` - Test title (e.g., "ЭЕШ 2024 Математик Хувилбар А")
- `description` - Test description
- `time_limit_minutes` - Time limit (180 minutes)
- `total_questions` - Total number of questions (40)
- `is_published` - Publication status (true)
- `category` - Subject category ('math', 'physics', 'chemistry', 'english')

## Files Transformed
1. ✅ `eysh_2024_math_a_complete.sql`
2. ✅ `eysh_2024_math_b_complete.sql`
3. ✅ `eysh_2024_math_c_complete.sql`
4. ✅ `eysh_2024_math_d_complete.sql`

## Backup Files
Original files were backed up with `.backup` extension:
- `eysh_2024_math_a_complete.sql.backup`
- `eysh_2024_math_b_complete.sql.backup`
- `eysh_2024_math_c_complete.sql.backup`
- `eysh_2024_math_d_complete.sql.backup`

## Data Integrity Verification
All data structures remain intact:
- Sections: 1 per file
- Problems: 40 per test (complete structure in file A)
- Questions: 40 per test
- Options: 5 options per question (multiple choice)

## Migration Context
This transformation aligns with:
- **Migration 049**: Consolidated mock test logic, removed EYSH and passing score columns
- **Migration 024**: Added category column
- **Migration 062**: Added image_url support (no changes needed in seeds)
- **Migration 063**: Created mock test images storage bucket

## Next Steps
1. ✅ Files are ready to be loaded into the database
2. Test with: `psql -d your_db -f eysh_2024_math_a_complete.sql`
3. If successful, backup files can be removed
4. Consider adding image_url values for problems/questions with diagrams (optional)

## Notes
- The transformation is backwards-compatible with the current schema
- No data was lost, only obsolete column references were removed
- The scoring system now uses raw scores and percentages instead of EYSH thresholds
- Category field supports: 'math', 'physics', 'chemistry', 'english'
