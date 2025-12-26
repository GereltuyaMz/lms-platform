export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type LessonType = 'video' | 'text' | 'quiz' | 'assignment' | 'theory' | 'example' | 'unit-quiz'
export type CategoryType = 'exam' | 'subject'

// Content types for lesson_content table
export type ContentType = 'theory' | 'example' | 'text' | 'attachment'

// Unit-specific lesson types (subset of LessonType for type safety)
export type UnitLessonType = 'theory' | 'example'
