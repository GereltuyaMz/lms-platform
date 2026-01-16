# EYSH 2017 Seed Data

This directory is reserved for EYSH 2017 exam seed data.

## Structure

Seed files should follow the current schema format:

```sql
INSERT INTO mock_tests (
    id, title, description, time_limit_minutes, total_questions,
    is_published, category
) VALUES (
    'uuid-here',
    'ЭЕШ 2017 Математик Хувилбар X',
    'Description here',
    180, 40, true, 'math'
);
```

See `/supabase/seeds/eysh/2024/` for complete examples.
