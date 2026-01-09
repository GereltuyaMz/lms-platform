// Re-export everything from the quizzes module
// This maintains backward compatibility with existing imports

export type {
  QuestionWithOptions,
  QuizWithQuestions,
  QuizFormData,
  QuizQuestionFormData,
  QuizOptionFormData,
  QuizForSelect,
  CreateQuestionWithOptionsData,
} from "./quizzes/index";

export {
  getQuizzes,
  getQuiz,
  getQuizzesForSelect,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createQuizQuestion,
  createQuizQuestionWithOptions,
  updateQuizQuestion,
  deleteQuizQuestion,
  reorderQuizQuestions,
  createQuizOption,
  updateQuizOption,
  deleteQuizOption,
  setQuizCorrectOption,
} from "./quizzes/index";
