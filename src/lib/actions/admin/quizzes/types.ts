import type { Quiz, QuizQuestion, QuizOption } from "@/types/database/tables";

export type QuestionWithOptions = QuizQuestion & {
  options: QuizOption[];
};

export type QuizWithQuestions = Quiz & {
  questions: QuestionWithOptions[];
  question_count: number;
};

export type QuizFormData = {
  title: string;
  description: string | null;
};

export type QuizQuestionFormData = {
  question: string;
  explanation: string;
  points: number;
  order_index: number;
};

export type QuizOptionFormData = {
  option_text: string;
  is_correct: boolean;
  order_index: number;
};

export type QuizForSelect = {
  id: string;
  title: string;
  question_count: number;
};

export type CreateQuestionWithOptionsData = {
  question: string;
  explanation: string;
  options: string[];
  correctIndex: number;
  order_index: number;
};
