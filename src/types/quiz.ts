export type QuizOptionUI = {
  id: string;
  text: string;
  orderIndex: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOptionUI[];
  correctAnswer: number;
  explanation: string;
  points: number;
};

export type QuizData = {
  totalQuestions: number;
  questions: QuizQuestion[];
};
