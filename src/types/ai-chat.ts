export type MessageRole = "user" | "assistant";
export type MessageType = "solve" | "explain" | "generate_problem" | "general";
export type LessonStep = "theory" | "example" | "test" | "unit-quiz";

export type GeneratedProblem = {
  question: string;
  correctAnswer: string;
  options?: string[];
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  message_type?: MessageType | null;
  generated_problem?: GeneratedProblem | null;
  user_answer?: string | null;
  is_correct?: boolean | null;
  created_at: string;
};

export type ChatSession = {
  id: string;
  user_id: string;
  lesson_id: string;
  lesson_step: LessonStep;
  created_at: string;
  updated_at: string;
};

export type SendMessageParams = {
  lessonId: string;
  lessonStep: LessonStep;
  message: string;
  messageType: MessageType;
  lessonContext?: {
    title: string;
    content?: string;
    quizQuestions?: string;
  };
};

export type ValidateAnswerParams = {
  sessionId: string;
  messageId: string;
  userAnswer: string;
};
