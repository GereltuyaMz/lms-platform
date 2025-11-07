export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
};

export type QuizData = {
  totalQuestions: number;
  questions: QuizQuestion[];
};
