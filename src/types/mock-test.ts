// ================================================
// Mock Test Type Definitions
// ================================================

export type MockTestOption = {
  id: string;
  option_text: string;
  // Note: is_correct is NOT included in initial test data for security
  // However, it MAY be included in detailed results after submission
  is_correct?: boolean;
  order_index: number;
};

export type MockTestQuestion = {
  id: string;
  question_number: string; // "a", "b", "c"
  question_text: string;
  explanation: string;
  points: number;
  order_index: number;
  options: MockTestOption[];
};

export type MockTestProblem = {
  id: string;
  problem_number: number; // 1, 2, 3, 4
  title: string | null;
  context: string | null; // Shared context for sub-questions
  order_index: number;
  questions: MockTestQuestion[];
};

export type MockTestSection = {
  id: string;
  subject: "math" | "physics" | "chemistry" | "english";
  title: string; // "Математик", "Физик", etc.
  order_index: number;
  problems: MockTestProblem[];
};

export type MockTest = {
  id: string;
  title: string;
  description: string | null;
  time_limit_minutes: number;
  total_questions: number;
  sections: MockTestSection[];
};

export type MockTestAttempt = {
  id: string;
  user_id: string;
  mock_test_id: string;
  started_at: string;
  completed_at: string | null;
  end_time: string | null;
  is_completed: boolean;
  total_score: number | null;
  max_score: number | null;
  total_questions: number | null;
  percentage: number | null;
  xp_awarded: number;
  subject_scores: SubjectScores | null;
};

export type SubjectScore = {
  score: number;
  total: number;
  percentage: number;
};

export type SubjectScores = {
  math?: SubjectScore;
  physics?: SubjectScore;
  chemistry?: SubjectScore;
  english?: SubjectScore;
};

export type MockTestAnswer = {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean | null;
  points_earned: number;
  answered_at: string;
};

// User answers state (client-side)
export type UserAnswers = Record<string, string>; // questionId -> optionId

// Quiz results returned from submit
export type MockTestResults = {
  total_score: number;
  max_score: number;
  total_questions: number;
  percentage: number;
};

// For best attempt display
export type BestAttemptData = {
  id: string;
  total_score: number;
  max_score: number;
  total_questions: number;
  percentage: number;
  xp_awarded: number;
  completed_at: string;
} | null;

// Category types for organizing mock tests
export type MockTestCategory = "math" | "physics" | "chemistry" | "english";

export type CategoryInfo = {
  id: MockTestCategory;
  title: string;
  description: string;
  color: string;
};

// Detailed results types
export type DetailedAnswer = {
  selected_option_id: string;
  is_correct: boolean;
  points_earned: number;
};

export type DetailedResultsData = {
  problems: MockTestProblem[];
  answers: Record<string, DetailedAnswer>;
};
