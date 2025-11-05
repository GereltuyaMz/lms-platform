import type { CourseLevel, LessonType } from './enums'

// =====================================================
// CATEGORIES
// =====================================================

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

// =====================================================
// COURSES
// =====================================================

export interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  level: CourseLevel
  price: number
  original_price: number | null
  duration_hours: number | null
  is_published: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// COURSE_CATEGORIES (Many-to-Many)
// =====================================================

export interface CourseCategory {
  course_id: string
  category_id: string
  created_at: string
}

// =====================================================
// LESSONS
// =====================================================

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  description: string | null
  section_title: string | null
  content: string | null
  video_url: string | null
  duration_seconds: number | null
  order_index: number
  lesson_type: LessonType
  is_preview: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// ENROLLMENTS
// =====================================================

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at: string | null
  progress_percentage: number
}

// =====================================================
// LESSON_PROGRESS
// =====================================================

export interface LessonProgress {
  id: string
  enrollment_id: string
  lesson_id: string
  is_completed: boolean
  completed_at: string | null
  last_position_seconds: number
  created_at: string
  updated_at: string
}

// =====================================================
// QUIZ_QUESTIONS
// =====================================================

export interface QuizQuestion {
  id: string
  lesson_id: string
  question: string
  explanation: string
  order_index: number
  points: number
  created_at: string
  updated_at: string
}

// =====================================================
// QUIZ_OPTIONS
// =====================================================

export interface QuizOption {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  order_index: number
  created_at: string
}

// =====================================================
// QUIZ_ATTEMPTS
// =====================================================

export interface QuizAttempt {
  id: string
  enrollment_id: string
  lesson_id: string
  score: number
  total_questions: number
  points_earned: number
  completed_at: string
}

// =====================================================
// QUIZ_ANSWERS
// =====================================================

export interface QuizAnswer {
  id: string
  attempt_id: string
  question_id: string
  selected_option_id: string
  is_correct: boolean
  points_earned: number
  answered_at: string
}
