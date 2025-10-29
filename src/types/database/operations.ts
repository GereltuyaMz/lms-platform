import type {
  Category,
  Course,
  CourseCategory,
  Lesson,
  Enrollment,
  LessonProgress,
} from './tables'

// =====================================================
// INSERT TYPES (for creating new records)
// =====================================================

// Slug is auto-generated from name if not provided
export type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'slug'> & {
  slug?: string
}

// Slug is auto-generated from title if not provided
export type CourseInsert = Omit<Course, 'id' | 'created_at' | 'updated_at' | 'slug'> & {
  slug?: string
}

export type CourseCategoryInsert = Omit<CourseCategory, 'created_at'>

// Slug is auto-generated from title if not provided
export type LessonInsert = Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'slug'> & {
  slug?: string
}

export type EnrollmentInsert = Omit<
  Enrollment,
  'id' | 'enrolled_at' | 'completed_at' | 'progress_percentage'
>

export type LessonProgressInsert = Omit<
  LessonProgress,
  'id' | 'created_at' | 'updated_at'
>

// =====================================================
// UPDATE TYPES (for updating records)
// =====================================================

export type CategoryUpdate = Partial<Omit<Category, 'id' | 'created_at'>>

export type CourseUpdate = Partial<
  Omit<Course, 'id' | 'created_at' | 'updated_at'>
>

export type CourseCategoryUpdate = Partial<CourseCategory>

export type LessonUpdate = Partial<
  Omit<Lesson, 'id' | 'created_at' | 'updated_at'>
>

export type EnrollmentUpdate = Partial<Omit<Enrollment, 'id' | 'enrolled_at'>>

export type LessonProgressUpdate = Partial<
  Omit<LessonProgress, 'id' | 'enrollment_id' | 'lesson_id' | 'created_at'>
>
