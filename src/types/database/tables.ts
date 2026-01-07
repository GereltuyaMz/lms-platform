import type {
  CategoryType,
  ContentType,
  CourseLevel,
  LessonType,
} from "./enums";

// =====================================================
// CATEGORIES (with hierarchy support)
// =====================================================

export interface Category {
  id: string;
  name: string;
  name_mn: string | null;
  slug: string;
  description: string | null;
  category_type: CategoryType;
  parent_id: string | null;
  order_index: number;
  icon: string | null;
  created_at: string;
}

// Category with children (for tree structure)
export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

// =====================================================
// UNITS
// =====================================================

export interface Unit {
  id: string;
  course_id: string;
  title: string;
  title_mn: string | null;
  description: string | null;
  slug: string;
  order_index: number;
  difficulty_level: string | null;
  unit_content: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// COURSES
// =====================================================

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  level: CourseLevel;
  price: number;
  original_price: number | null;
  duration_hours: number | null;
  is_published: boolean;
  instructor_id: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// COURSE_CATEGORIES (Many-to-Many)
// =====================================================

export interface CourseCategory {
  course_id: string;
  category_id: string;
  created_at: string;
}

// =====================================================
// LESSONS
// =====================================================

export interface Lesson {
  id: string;
  course_id: string;
  unit_id: string | null; // Foreign key to units table
  title: string;
  slug: string;
  description: string | null;
  section_title: string | null; // Legacy field for backward compat
  content: string | null; // Legacy - use lesson_content table
  video_url: string | null; // Legacy - use lesson_content table
  duration_seconds: number | null; // Legacy - use lesson_content table
  order_index: number;
  order_in_unit: number | null; // Order within unit
  lesson_type: LessonType;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// LESSON_CONTENT
// =====================================================

export interface LessonContent {
  id: string;
  lesson_id: string;
  title: string; // Content title (e.g., "Теори", "Хялбар жишээ")
  content_type: ContentType; // theory, easy_example, hard_example, text, attachment
  video_url: string | null;
  content: string | null;
  description: string | null; // Text explanation shown below video content
  duration_seconds: number | null;
  order_index: number; // Order within lesson (1=theory, 2=easy, 3=hard)
  created_at: string;
  updated_at: string;
}

// =====================================================
// ENROLLMENTS
// =====================================================

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
}

// =====================================================
// LESSON_PROGRESS
// =====================================================

export interface LessonProgress {
  id: string;
  enrollment_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at: string | null;
  last_position_seconds: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// QUIZ_QUESTIONS
// =====================================================

export interface QuizQuestion {
  id: string;
  lesson_id: string | null; // Nullable for unit-level quizzes
  unit_id: string | null; // For unit-level quizzes
  question: string;
  explanation: string;
  order_index: number;
  points: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// QUIZ_OPTIONS
// =====================================================

export interface QuizOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
  created_at: string;
}

// =====================================================
// QUIZ_ATTEMPTS
// =====================================================

export interface QuizAttempt {
  id: string;
  enrollment_id: string;
  lesson_id: string | null; // Nullable for unit-level quizzes
  unit_id: string | null; // For unit-level quizzes
  score: number;
  total_questions: number;
  points_earned: number;
  passed: boolean; // Auto-computed: score >= total_questions * 0.8
  completed_at: string;
}

// =====================================================
// QUIZ_ANSWERS
// =====================================================

export interface QuizAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}

// =====================================================
// BADGES
// =====================================================

export interface Badge {
  id: string;
  name: string;
  name_mn: string;
  description_mn: string;
  category: string;
  rarity: "bronze" | "silver" | "gold" | "platinum";
  xp_bonus: number;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

// =====================================================
// USER_BADGES
// =====================================================

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  progress_current: number;
  progress_target: number;
  unlocked_at: string | null;
  created_at: string;
}

// =====================================================
// TEACHERS
// =====================================================

export interface Teacher {
  id: string;
  full_name: string;
  full_name_mn: string;
  bio_mn: string | null;
  avatar_url: string | null;
  specialization: string[] | null;
  credentials_mn: string | null;
  years_experience: number | null;
  is_active: boolean;
  created_at: string;
}

// =====================================================
// COURSE_PURCHASES
// =====================================================

export interface CoursePurchase {
  id: string;
  user_id: string;
  course_id: string;
  amount_paid: number;
  payment_method: "qpay" | "social_pay" | "card";
  status: "pending" | "completed" | "failed" | "refunded";
  transaction_id: string | null;
  purchased_at: string;
  created_at: string;
}

// =====================================================
// SHOPPING_CART
// =====================================================

export interface ShoppingCart {
  id: string;
  user_id: string;
  course_id: string;
  added_at: string;
}

// =====================================================
// SHOP_SHIPPING_ADDRESSES
// =====================================================

export interface ShopShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  city: string | null;
  district: string | null;
  khoroo: string | null;
  address_line: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
