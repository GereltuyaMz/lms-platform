# EYSH Mock Test Implementation Progress

## ✅ Completed (Phase 1-2)

### 1. Database Schema ✓
- **File**: `supabase/migrations/023_create_mock_test_system.sql`
- **Tables Created** (7 total):
  - `mock_tests` - Test definitions
  - `mock_test_sections` - Sections (Math, Physics, Chemistry, English)
  - `mock_test_problems` - Big problems with context
  - `mock_test_questions` - Individual sub-questions
  - `mock_test_options` - Multiple choice options
  - `mock_test_attempts` - User attempts with timer tracking
  - `mock_test_answers` - Individual answers
- **Database Functions**:
  - `get_mock_test_data()` - Fetch complete test structure
  - `create_mock_test_attempt()` - Create or resume attempt
  - `save_mock_test_answer()` - Save individual answer
  - `submit_mock_test_attempt()` - Calculate scores
  - `get_best_mock_test_attempt()` - Best attempt
  - `update_timer_state()` - Save timer progress
- **RLS Policies**: Public read for published tests, user-scoped write for attempts

### 2. Seed Data ✓
- **File**: `supabase/seeds/012_seed_eysh_mock_test.sql`
- **Content**: Complete 36-question mock test
  - **Math**: 9 questions (Quadratic equations, Functions, Geometry, Number systems)
  - **Physics**: 9 questions (Kinematics, Forces, Energy, Electricity)
  - **Chemistry**: 9 questions (Atomic structure, Chemical equations, Molecules, pH)
  - **English**: 9 questions (Grammar, Vocabulary, Reading, Prepositions)
- All content in Mongolian Cyrillic
- Realistic EYSH-style questions with detailed explanations

### 3. Type Definitions ✓
- **File**: `src/types/mock-test.ts`
- **Types Defined**:
  - `MockTestOption`, `MockTestQuestion`, `MockTestProblem`
  - `MockTestSection`, `MockTest`
  - `MockTestAttempt`, `MockTestAnswer`
  - `SubjectScore`, `SubjectScores`
  - `UserAnswers`, `MockTestResults`, `BestAttemptData`

### 4. Server Actions ✓
- **File**: `src/lib/actions/mock-test-actions.ts`
- **Functions Implemented**:
  - `getPublishedMockTests()` - List all tests
  - `getMockTestData()` - Fetch test with all data
  - `createMockTestAttempt()` - Start/resume test
  - `saveMockTestAnswer()` - Save answer
  - `updateTimerState()` - Auto-save timer
  - `submitMockTestAttempt()` - Submit and score
  - `getBestMockTestAttempt()` - Best score
  - `getSavedAnswers()` - Resume answers
  - `awardMockTestXP()` - XP calculation (20/question + bonuses)

### 5. Components Started ✓
- **MockTestTimer** ✓ - Countdown with auto-save and visual warnings
- **MockTestProblemGroup** 🔴 - **TODO(human)** - Render problem with sub-questions

---

## 🚧 Remaining Work

### Phase 3: Core Components (Need to Create)

#### 1. MockTestSectionNav.tsx
**Purpose**: Tab navigation between subjects
**Props**: `sections`, `currentSection`, `onSectionChange`, `answeredCounts`
**Features**:
- Horizontal tab bar (Математик | Физик | Хими | Англи хэл)
- Show completion count per section (e.g., "7/9")
- Highlight active section
- Mobile: Dropdown or scrollable tabs

#### 2. MockTestProgress.tsx
**Purpose**: Overall progress indicator
**Props**: `answeredCount`, `totalQuestions`
**Features**:
- "28/36 асуулт хариулсан"
- Progress bar (shadcn Progress component)
- Percentage display

#### 3. MockTestResults.tsx
**Purpose**: Results screen after submission
**Props**: `results` (score, percentage, subject breakdown), `xpAwarded`
**Features**:
- Total score and percentage
- Subject-wise breakdown (Math: 8/9, Physics: 7/9, etc.)
- XP earned with gradient background
- "Дахин турших" button
- "Үр дүн харах" button to detailed review

#### 4. MockTestPlayer.tsx (Main Container)
**Purpose**: Orchestrates entire test-taking experience
**State**:
- `currentSection` (0-3)
- `userAnswers` (Record<questionId, optionId>)
- `timeRemaining` (seconds)
- `attemptId`
**Features**:
- Timer component
- Section navigation
- Progress indicator
- Problem groups for current section
- Auto-save answers every 30s
- Auto-save timer every 30s
- Submit button with confirmation
- Auto-submit on timer expiration

### Phase 4: Routes & Pages

#### 1. /mock-test/page.tsx (Landing)
- List of available mock tests
- Show user's best score if attempted
- "Эхлэх" button per test

#### 2. /mock-test/[testId]/page.tsx (Overview)
- Test description
- Time limit info
- Total questions
- Subject breakdown
- "Start Test" or "Resume" button

#### 3. /mock-test/[testId]/take/page.tsx (Active Test)
- Server component: Fetch test data, create/resume attempt
- Client wrapper: MockTestPlayer

#### 4. /mock-test/[testId]/results/[attemptId]/page.tsx (Results)
- Display final results
- Subject breakdown
- Review answers (show correct/incorrect)

### Phase 5: Polish

#### 1. Header Navigation
- **File**: `src/components/layout/ClientHeader.tsx`
- Add "ЭЕШ Тест" link between "Сургалтууд" and "Заавар" (line 69)

#### 2. Loading States
- Skeleton loaders for test data
- Loading spinners for submit action

#### 3. Error Handling
- Toast notifications for save failures
- Retry logic for network errors

#### 4. Mobile Responsiveness
- Test layout on mobile (320px+)
- Section nav: Dropdown on mobile
- Problem groups: Stack vertically on small screens

---

## 📊 XP System

**Formula**:
```
Base XP = correct_answers × 20
Mastery Bonus:
  - 80-89%: +200 XP
  - 90-94%: +400 XP
  - 95-99%: +600 XP
  - 100%: +1000 XP
First Attempt Bonus: +500 XP
```

**Examples**:
- 28/36 (78%): 560 XP (no bonus)
- 30/36 (83%): 600 + 200 = 800 XP
- 34/36 (94%): 680 + 400 = 1,080 XP
- 36/36 (100%, first): 720 + 1000 + 500 = 2,220 XP

---

## 🚀 Next Steps (Priority Order)

1. **Complete MockTestProblemGroup** (TODO(human) marked)
2. Create MockTestPlayer (main orchestrator)
3. Create MockTestSectionNav
4. Create MockTestProgress
5. Create MockTestResults
6. Create /mock-test landing page
7. Create /mock-test/[testId] overview page
8. Create /mock-test/[testId]/take page
9. Create /mock-test/[testId]/results/[attemptId] page
10. Add header navigation link
11. Test complete flow end-to-end
12. Polish UI and mobile responsiveness

---

## 🔧 Testing Checklist

- [ ] Run migration: `bunx supabase db reset` (applies migration + seed)
- [ ] Verify test data in Supabase Studio
- [ ] Test timer countdown and auto-save
- [ ] Test answer selection and persistence
- [ ] Test auto-submit on timer expiration
- [ ] Test manual submit
- [ ] Test XP calculation
- [ ] Test resume functionality
- [ ] Test mobile layout
- [ ] Test with real questions data

---

## 📝 Implementation Notes

### Timer Auto-Save
- Triggers every 30 seconds via `updateTimerState()`
- Saves to `mock_test_attempts.time_remaining_seconds`
- Resume: Load `time_remaining_seconds` from DB

### Answer Auto-Save
- Triggers every 30 seconds via `saveMockTestAnswer()`
- Uses UPSERT pattern (ON CONFLICT UPDATE)
- Resume: Load from `mock_test_answers` table

### Section Navigation
- Each section has 9 questions (4 problems × 2-3 sub-questions)
- Problems displayed in order (1, 2, 3, 4)
- Sub-questions displayed together (a, b, c)

### Mobile Considerations
- Timer: Always visible (sticky top)
- Section nav: Horizontal scroll or dropdown
- Problem groups: Full width, stack vertically
- Radio buttons: Touch-friendly sizing (min 44px)

---

## 🎨 UI Design Patterns

### Color Coding
- Selected answer: Blue border (`border-blue-500`)
- Unanswered: Gray (`border-gray-300`)
- Timer warning (< 10 min): Orange (`text-orange-600`)
- Timer critical (< 5 min): Red + pulse (`text-red-600 animate-pulse`)

### Typography
- Problem title: `text-xl font-bold`
- Question text: `text-base`
- Context: `text-sm` in blue background box
- Timer: `font-mono text-lg font-bold`

### Spacing
- Problem groups: `mb-6`
- Sub-questions: `space-y-4`
- Padding: `p-4 md:p-6` (responsive)
