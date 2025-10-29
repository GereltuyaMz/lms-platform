import type {
  Category,
  Course,
  CourseCategory,
  Lesson,
  Enrollment,
  LessonProgress,
  CategoryInsert,
  CourseInsert,
  CourseCategoryInsert,
  LessonInsert,
  EnrollmentInsert,
  LessonProgressInsert,
  CategoryUpdate,
  CourseUpdate,
  CourseCategoryUpdate,
  LessonUpdate,
  EnrollmentUpdate,
  LessonProgressUpdate,
  CourseStatsResult,
  CourseLevel,
  LessonType,
} from './database'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: CategoryInsert
        Update: CategoryUpdate
      }
      courses: {
        Row: Course
        Insert: CourseInsert
        Update: CourseUpdate
      }
      course_categories: {
        Row: CourseCategory
        Insert: CourseCategoryInsert
        Update: CourseCategoryUpdate
      }
      lessons: {
        Row: Lesson
        Insert: LessonInsert
        Update: LessonUpdate
      }
      enrollments: {
        Row: Enrollment
        Insert: EnrollmentInsert
        Update: EnrollmentUpdate
      }
      lesson_progress: {
        Row: LessonProgress
        Insert: LessonProgressInsert
        Update: LessonProgressUpdate
      }
    }
    Functions: {
      calculate_course_stats: {
        Args: { course_uuid: string }
        Returns: CourseStatsResult[]
      }
    }
    Enums: {
      course_level: CourseLevel
      lesson_type: LessonType
    }
  }
}
