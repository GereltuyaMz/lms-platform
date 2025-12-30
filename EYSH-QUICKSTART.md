# 🚀 EYSH Mock Test - Quick Start Guide

## ⚡ Getting Started (5 minutes)

### 1. Apply Database Migration

```bash
# Reset local database (applies all migrations + seeds)
bunx supabase db reset

# OR apply specific migration
bunx supabase db push
```

This creates:
- 7 new tables for mock tests
- 1 complete 36-question EYSH mock test
- All database functions and triggers

### 2. Verify Database

Open Supabase Studio:
```bash
bunx supabase studio
```

Check these tables have data:
- `mock_tests` (1 row: "ЭЕШ 2025 Жишээ Шалгалт #1")
- `mock_test_sections` (4 rows: Math, Physics, Chemistry, English)
- `mock_test_problems` (16 rows: 4 per section)
- `mock_test_questions` (36 rows: 9 per section)
- `mock_test_options` (144 rows: 4 per question)

### 3. Start Dev Server

```bash
bun dev
# OR
npm run dev
```

### 4. Test the Flow

1. **Navigate to** http://localhost:3000/mock-test
   - You should see "ЭЕШ 2025 Жишээ Шалгалт #1"

2. **Sign in** (required to take test)
   - Click on test card
   - You'll be redirected to `/signin` if not authenticated

3. **View Test Overview**
   - See test details (36 questions, 180 minutes)
   - Subject breakdown (Math, Physics, Chemistry, English)
   - Click "Тест эхлүүлэх"

4. **Take the Test**
   - Timer starts (3:00:00)
   - Navigate between sections (tabs)
   - Answer questions (radio buttons)
   - Watch progress (e.g., "28/36 асуулт хариулсан")
   - Click "Илгээх" to submit

5. **View Results**
   - See total score (e.g., 28/36)
   - Subject breakdown with color coding
   - XP earned (e.g., +800 XP)
   - Click "Дахин турших" to retry

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Test
```
1. Start test → Timer begins
2. Answer all 36 questions
3. Submit → See results
4. Check XP awarded
✓ Expected: Score + XP shown, attempt saved
```

### Scenario 2: Resume Test
```
1. Start test
2. Answer 10 questions
3. Close browser/refresh page
4. Navigate back to /mock-test/[testId]
5. Click "Үргэлжлүүлэх"
✓ Expected: Answers saved, timer continues from saved time
```

### Scenario 3: Auto-Submit
```
1. Start test
2. Wait for timer to expire (or modify time_limit_minutes to 1)
3. Timer hits 0:00
✓ Expected: Automatic submit, results shown
```

### Scenario 4: Section Navigation
```
1. Start test
2. Answer questions in Math
3. Switch to Physics tab
4. Answer questions in Physics
5. Switch back to Math
✓ Expected: Answers preserved, sections independent
```

### Scenario 5: Best Score Tracking
```
1. Complete test with 20/36 (55%)
2. Retry test
3. Complete with 30/36 (83%)
4. Navigate to /mock-test
✓ Expected: Best score shown (30/36), not first attempt
```

---

## 🐛 Common Issues

### Issue: "Тест олдсонгүй"
**Cause**: Migration not applied or test not published
**Fix**:
```bash
bunx supabase db reset
```
Check `is_published = true` in `mock_tests` table

### Issue: Timer doesn't start
**Cause**: Client-side JavaScript error
**Fix**: Open browser console, check for errors
Verify MockTestTimer component loaded

### Issue: Answers not saving
**Cause**: Auth or RLS policy issue
**Fix**:
1. Ensure user is authenticated
2. Check RLS policies in Supabase Studio
3. Verify `user_id` in attempts table

### Issue: XP not awarded
**Cause**: XP transaction failed
**Fix**:
Check `xp_transactions` table for errors
Verify `insertXPTransaction` in server actions

### Issue: Blank results page
**Cause**: Subject scores calculation error
**Fix**:
Check `submit_mock_test_attempt` function
Verify JSONB subject_scores format

---

## 📊 Database Queries (for debugging)

### Check test structure
```sql
SELECT
  mt.title,
  s.subject,
  COUNT(DISTINCT p.id) as problems,
  COUNT(q.id) as questions
FROM mock_tests mt
JOIN mock_test_sections s ON s.mock_test_id = mt.id
JOIN mock_test_problems p ON p.section_id = s.id
JOIN mock_test_questions q ON q.problem_id = p.id
WHERE mt.id = '00000000-0000-0000-0000-000000000001'
GROUP BY mt.title, s.subject;
```

### Check user attempts
```sql
SELECT
  u.email,
  mt.title,
  a.total_score,
  a.total_questions,
  a.percentage,
  a.xp_awarded,
  a.is_completed,
  a.started_at
FROM mock_test_attempts a
JOIN user_profiles u ON u.id = a.user_id
JOIN mock_tests mt ON mt.id = a.mock_test_id
ORDER BY a.started_at DESC
LIMIT 10;
```

### Check saved answers
```sql
SELECT
  q.question_text,
  o.option_text,
  a.is_correct
FROM mock_test_answers a
JOIN mock_test_questions q ON q.id = a.question_id
JOIN mock_test_options o ON o.id = a.selected_option_id
WHERE a.attempt_id = 'YOUR_ATTEMPT_ID'
ORDER BY q.order_index;
```

---

## 🎯 Feature Verification Checklist

Core Features:
- [ ] Test listing page loads
- [ ] Test overview shows correct info
- [ ] Authentication required
- [ ] Timer starts on test begin
- [ ] Answers save on selection
- [ ] Timer saves every 30s
- [ ] Section navigation works
- [ ] Progress updates in real-time
- [ ] Submit confirmation shows
- [ ] Results display correctly
- [ ] XP awarded and saved
- [ ] Best score tracked
- [ ] Retry creates new attempt
- [ ] Resume loads saved state

UI/UX:
- [ ] Mobile responsive (320px+)
- [ ] Timer warnings (10min, 5min)
- [ ] Toast notifications work
- [ ] Loading states shown
- [ ] Error messages clear
- [ ] Navigation intuitive
- [ ] Colors accessible

Performance:
- [ ] Page loads < 2s
- [ ] Answer saves < 500ms
- [ ] No console errors
- [ ] No memory leaks
- [ ] Timer smooth (no stuttering)

---

## 🔥 Quick Fixes

### Reset all test data
```sql
DELETE FROM mock_test_attempts WHERE mock_test_id = '00000000-0000-0000-0000-000000000001';
```

### Manually complete attempt
```sql
UPDATE mock_test_attempts
SET
  is_completed = true,
  completed_at = NOW(),
  total_score = 30,
  percentage = 83.33
WHERE id = 'YOUR_ATTEMPT_ID';
```

### Change time limit (for testing)
```sql
UPDATE mock_tests
SET time_limit_minutes = 1
WHERE id = '00000000-0000-0000-0000-000000000001';
```

### Publish/unpublish test
```sql
UPDATE mock_tests
SET is_published = true
WHERE id = 'YOUR_TEST_ID';
```

---

## 📞 Next Steps

1. ✅ Complete database setup
2. ✅ Test complete user flow
3. [ ] Add more mock tests (use seed as template)
4. [ ] Implement answer review page
5. [ ] Add performance analytics
6. [ ] Deploy to production

**Estimated Setup Time**: 5 minutes
**First Test Run**: 2 minutes
**Full Feature Test**: 15 minutes

🎉 **You're ready to go!**
