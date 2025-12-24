export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type LessonType = 'video' | 'text' | 'quiz' | 'assignment' | 'theory' | 'easy_example' | 'hard_example'
export type CategoryType = 'exam' | 'subject'

// Content types for lesson_content table
export type ContentType = 'theory' | 'easy_example' | 'hard_example' | 'text' | 'attachment'

// Unit-specific lesson types (subset of LessonType for type safety)
export type UnitLessonType = 'theory' | 'easy_example' | 'hard_example'
