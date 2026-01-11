import type {
  Category,
  Course,
  Lesson,
  LessonContent,
  Unit,
  Enrollment,
  LessonProgress,
  QuizQuestion,
  QuizOption,
  QuizAttempt,
  QuizAnswer,
} from './tables'
import type { CourseLevel } from './enums'

// =====================================================
// COURSE QUERIES
// =====================================================

export interface CourseWithCategories extends Course {
  course_categories: {
    category_id: string
    categories: Category | null
  }[]
  lesson_count?: number
  total_duration_seconds?: number
  teacher?: {
    id: string
    full_name: string
    full_name_mn: string | null
    avatar_url: string | null
  } | null
}

export interface CourseWithStats extends Course {
  lesson_count?: number
  total_duration_minutes?: number
}

// =====================================================
// LESSON QUERIES
// =====================================================

export interface LessonWithCourse extends Lesson {
  course: Course
}

// Group lessons by section for UI display (legacy)
export interface LessonsBySection {
  section_title: string | null
  lessons: Lesson[]
}

// =====================================================
// UNIT QUERIES
// =====================================================

// Unit with its lessons
export interface UnitWithLessons extends Unit {
  lessons: Lesson[]
}

// Unit with lessons and quiz info
export interface UnitWithQuiz extends Unit {
  lessons: Lesson[]
  hasQuiz: boolean
  quizQuestionCount?: number
}

// Course with units (new structure)
export interface CourseWithUnits extends Course {
  units: UnitWithLessons[]
}

// Group lessons by unit for UI display
export interface LessonsByUnit {
  unit: Unit
  lessons: Lesson[]
  hasQuiz: boolean
}

// =====================================================
// LESSON CONTENT QUERIES
// =====================================================

// Lesson with its content items (theory, examples)
export interface LessonWithContent extends Lesson {
  lesson_content: LessonContent[]
}

// Lesson with content and quiz questions
export interface LessonComplete extends Lesson {
  lesson_content: LessonContent[]
  quiz_questions: QuizQuestion[]
  hasQuiz: boolean
}

// Unit with lessons that have content
export interface UnitComplete extends Unit {
  lessons: LessonWithContent[]
  quiz_questions: QuizQuestion[]  // Unit-level quiz
  hasUnitQuiz: boolean
}

// =====================================================
// ENROLLMENT QUERIES
// =====================================================

export interface EnrollmentWithCourse extends Enrollment {
  course: Course
}

export interface EnrollmentWithDetails extends Enrollment {
  course: Course
  lesson_progress: LessonProgress[]
}

// Dashboard-specific enrollment with last lesson
export interface DashboardEnrollment {
  id: string
  enrolled_at: string
  progress_percentage: number
  completed_at: string | null
  lastLessonId: string | null
  courses: {
    id: string
    title: string
    slug: string
    description: string | null
    thumbnail_url: string | null
    level: CourseLevel
    duration_hours: number | null
    lessons: { count: number }[]
  } | null
}

// Recommended course (simplified Course type)
export type RecommendedCourse = Pick<
  Course,
  'id' | 'title' | 'slug' | 'description' | 'thumbnail_url' | 'level'
>

// =====================================================
// LESSON PROGRESS QUERIES
// =====================================================

export interface LessonProgressWithDetails extends LessonProgress {
  lesson: Lesson
  enrollment: {
    course: Course
  }
}

// =====================================================
// QUIZ QUERIES
// =====================================================

// Quiz question with all options
export interface QuizQuestionWithOptions extends QuizQuestion {
  options: QuizOption[]
}

// Quiz attempt with all answers
export interface QuizAttemptWithAnswers extends QuizAttempt {
  answers: QuizAnswer[]
}

// Quiz answer with question and option details
export interface QuizAnswerWithDetails extends QuizAnswer {
  question: QuizQuestion
  selected_option: QuizOption
}

// Complete quiz data for a lesson (for taking quiz)
export interface QuizData {
  lesson_id: string | null
  unit_id: string | null
  questions: QuizQuestionWithOptions[]
}

// Unit quiz data
export interface UnitQuizData {
  unit_id: string
  unit_title: string
  questions: QuizQuestionWithOptions[]
}

// =====================================================
// FUNCTION RETURN TYPES
// =====================================================

export interface CourseStatsResult {
  lesson_count: number
  total_duration_seconds: number
}

// Return type for get_quiz_questions function
export interface GetQuizQuestionsResult {
  question_id: string
  question: string
  explanation: string
  order_index: number
  points: number
  option_id: string
  option_text: string
  option_order: number
}

// Return type for calculate_quiz_stats function
export interface QuizStatsResult {
  score: number
  total_questions: number
  points_earned: number
  percentage: number
}

// Return type for get_best_quiz_attempt function
export interface BestQuizAttemptResult {
  attempt_id: string
  score: number
  total_questions: number
  points_earned: number
  completed_at: string
}
