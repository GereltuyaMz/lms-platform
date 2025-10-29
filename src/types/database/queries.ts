import type {
  Category,
  Course,
  Lesson,
  Enrollment,
  LessonProgress,
} from './tables'

// =====================================================
// COURSE QUERIES
// =====================================================

export interface CourseWithCategories extends Course {
  course_categories: {
    category_id: string
    categories: Category | null
  }[]
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

// Group lessons by section for UI display
export interface LessonsBySection {
  section_title: string | null
  lessons: Lesson[]
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
// FUNCTION RETURN TYPES
// =====================================================

export interface CourseStatsResult {
  lesson_count: number
  total_duration_minutes: number
}
