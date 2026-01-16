# EYSH Mock Test Seed Data (2017-2024)

This directory contains historical EYSH (Элсэлтийн Ерөнхий Шалгалт) exam seed data for years 2017-2024.

## Directory Structure

```
eysh/
├── 2017/           # Empty - placeholder for future data
├── 2018/           # 4 variants (A, B, C, D) - Complete
├── 2019/           # 4 variants (A, B, C, D) - Complete
├── 2020/           # 4 variants (A, B, C, D) - Complete
├── 2021/           # 4 variants (A, B, C, D) - Complete
├── 2022/           # 4 variants (A, B, C, D) - Complete
├── 2023/           # 4 variants (A, B, C, D) - Complete
└── 2024/           # 4 variants (A, B, C, D) - Complete
```

## Schema Compatibility

All seed files have been transformed to match the current database schema (as of migration 049).

### Current Schema for `mock_tests` table:

```sql
INSERT INTO mock_tests (
    id,
    title,
    description,
    time_limit_minutes,
    total_questions,
    is_published,
    category
) VALUES (
    'uuid-here',
    'ЭЕШ YYYY Математик Хувилбар X',
    'Description text',
    180,
    40,
    true,
    'math'
);
```

### Removed Columns (Deprecated)

The following columns were removed in migration 049:
- `passing_score_percentage` - Simplified scoring system
- `eysh_threshold_500` - EYSH conversion thresholds removed
- `eysh_threshold_600` - EYSH conversion thresholds removed
- `eysh_threshold_700` - EYSH conversion thresholds removed
- `eysh_threshold_800` - EYSH conversion thresholds removed
- `created_at` - Has database default
- `updated_at` - Has database default

## File Naming Convention

- **Complete files**: `eysh_YYYY_math_X_complete.sql` (X = a, b, c, d)
  - Contains all tables: mock_tests, sections, problems, questions, options
- **Seed files**: `eysh_YYYY_math_X_seed.sql`
  - May contain partial data or specific sections

## Data Structure

Each exam file contains:

1. **Mock Test** - Basic test information
   - ID, title, description, time limit, total questions
   - Category (math, physics, chemistry, english)

2. **Sections** - Test sections by subject
   - Usually 2 sections:
     - Нэгдүгээр хэсэг (Multiple choice - 36 questions, 72 points)
     - Хоёрдугаар хэсэг (Fill in blank - 4 questions, 28 points)

3. **Problems** - Problem groups with shared context
   - 40 problems total per test
   - Contains problem number, title, context

4. **Questions** - Individual questions within problems
   - Question text, explanation, points
   - Linked to parent problem

5. **Options** - Multiple choice options
   - 5 options per question (A, B, C, D, E)
   - One correct answer marked with `is_correct = true`

## Loading Seed Data

### Load all years (2018-2024):

```bash
cd /path/to/supabase/seeds/eysh

for year in 2018 2019 2020 2021 2022 2023 2024; do
  echo "Loading $year..."
  for file in $year/*.sql; do
    if [[ "$file" != *.backup ]]; then
      psql -d your_database -f "$file"
    fi
  done
done
```

### Load specific year:

```bash
# Load all 2024 variants
psql -d your_database -f 2024/eysh_2024_math_a_complete.sql
psql -d your_database -f 2024/eysh_2024_math_b_complete.sql
psql -d your_database -f 2024/eysh_2024_math_c_complete.sql
psql -d your_database -f 2024/eysh_2024_math_d_complete.sql
```

### Load specific test:

```bash
psql -d your_database -f 2024/eysh_2024_math_a_complete.sql
```

## Transformation History

All files were transformed to current schema on 2026-01-16:

- **Transformation scripts**:
  - `transform_all_years.sh` - Bash script (initial attempt)
  - `transform_seeds.py` - Python script v1
  - `transform_seeds_v2.py` - Python script v2 (final, handles all edge cases)

- **Backup files**: All original files saved with `.backup` extension

### To re-run transformation:

```bash
python3 transform_seeds_v2.py
```

### To remove backups (after verification):

```bash
find . -name "*.backup" -delete
```

## Test Statistics

| Year | Variants | Files | Total Problems | Total Questions | Status |
|------|----------|-------|----------------|-----------------|--------|
| 2017 | 0 | 0 | - | - | Empty |
| 2018 | 4 | 4 | 160 | 160 | ✅ Complete |
| 2019 | 4 | 4 | 160 | 160 | ✅ Complete |
| 2020 | 4 | 4 | 160 | 160 | ✅ Complete |
| 2021 | 4 | 4 | 160 | 160 | ✅ Complete |
| 2022 | 4 | 4 | 160 | 160 | ✅ Complete |
| 2023 | 4 | 4 | 160 | 160 | ✅ Complete |
| 2024 | 4 | 4 | 160 | 160 | ✅ Complete |
| **Total** | **28** | **28** | **1,120** | **1,120** | |

## UUID Structure

UUIDs follow a consistent pattern for easy identification:

```
YYYY0000-TTTT-PPPP-QQQQ-OOOOOOOOOOVV
```

- `YYYY` - Year (e.g., 2024, 2023)
- `TTTT` - Entity type (0000=test, 0001=section, 0002=problem, etc.)
- `PPPP` - Parent reference
- `QQQQ` - Sub-entity reference
- `OOOOOOOOOO` - Order/sequence
- `VV` - Variant (0a=A, 0b=B, 0c=C, 0d=D)

Example:
- Test: `20240000-0000-0000-0000-000000000001`
- Section: `20240000-0001-0000-0000-000000000001`
- Problem: `20240000-0002-0001-0000-000000000001`
- Question: `20240000-0003-0002-0001-000000000001`
- Option: `20240000-0004-0003-0002-000000000001`

## Adding New Years

To add seed data for a new year:

1. Create directory: `mkdir YYYY`
2. Create seed files using 2024 as template
3. Update UUIDs to match year
4. Follow current schema (no deprecated columns)
5. Update this README with statistics

## Migration Compatibility

These seed files are compatible with:
- ✅ Migration 023 - Mock test system creation
- ✅ Migration 024 - Category column added
- ✅ Migration 049 - EYSH thresholds removed (transformed)
- ✅ Migration 062 - Image support added (optional image_url fields)
- ✅ Migration 063 - Mock test images storage bucket

## Notes

- All tests are for **Mathematics** subject (`category = 'math'`)
- Standard time limit: **180 minutes** (3 hours)
- Standard question count: **40 questions**
- Scoring: Direct percentage-based (no EYSH conversion)
- All tests are published (`is_published = true`)

## Future Enhancements

- [ ] Add image_url for problems with diagrams
- [ ] Add Physics, Chemistry, English variants
- [ ] Complete 2017 data
- [ ] Add metadata for difficulty levels
- [ ] Add tags for problem categorization
