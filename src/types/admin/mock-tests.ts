// ================================================
// Mock Test Admin Type Definitions
// ================================================
// Form data structures for creating/editing mock tests in admin panel

import type { MockTest, MockTestSection, MockTestProblem, MockTestQuestion, MockTestOption } from "@/types/mock-test";

// ===== FORM DATA TYPES =====
// These mirror database types but include UI-specific fields

export type OptionFormData = {
  id?: string; // Optional: set during edit
  option_text: string;
  is_correct: boolean;
  image_url: string | null;
  order_index: number;
};

export type QuestionFormData = {
  id?: string;
  question_number: string; // "a", "b", "c"
  question_text: string;
  image_url: string | null;
  explanation: string;
  points: number;
  order_index: number;
  options: OptionFormData[];
};

export type ProblemFormData = {
  id?: string;
  problem_number: number; // 1, 2, 3, 4
  title: string | null;
  context: string | null;
  image_url: string | null;
  order_index: number;
  questions: QuestionFormData[];
};

export type SectionFormData = {
  id?: string;
  subject: "math" | "physics" | "chemistry" | "english";
  title: string;
  order_index: number;
  problems: ProblemFormData[];
};

export type MockTestFormData = {
  id?: string;
  title: string;
  description: string | null;
  time_limit_minutes: number;
  total_questions: number; // Auto-calculated
  passing_score_percentage: number;
  is_published: boolean;
  sections: SectionFormData[];
};

// ===== LIST PAGE TYPES =====

export type MockTestWithStats = {
  id: string;
  title: string;
  description: string | null;
  time_limit_minutes: number;
  total_questions: number;
  is_published: boolean;
  created_at: string;
  sections_count: number;
  total_problems: number;
  attempts_count: number;
};

// ===== SERVER ACTION RESPONSE TYPES =====

export type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export type ValidationResult = {
  valid: boolean;
  message: string;
  path?: string; // e.g., "Section 1, Problem 2, Question a"
};

// ===== DEFAULT VALUE HELPERS =====

export function getDefaultOption(orderIndex: number): OptionFormData {
  return {
    option_text: "",
    is_correct: false,
    image_url: null,
    order_index: orderIndex,
  };
}

export function getDefaultQuestion(orderIndex: number, questionNumber: string): QuestionFormData {
  return {
    question_number: questionNumber,
    question_text: "",
    image_url: null,
    explanation: "",
    points: 10,
    order_index: orderIndex,
    options: [
      getDefaultOption(0),
      getDefaultOption(1),
      getDefaultOption(2),
      getDefaultOption(3),
    ],
  };
}

export function getDefaultProblem(orderIndex: number, problemNumber: number): ProblemFormData {
  return {
    problem_number: problemNumber,
    title: null,
    context: null,
    image_url: null,
    order_index: orderIndex,
    questions: [getDefaultQuestion(0, "a")],
  };
}

export function getDefaultSection(orderIndex: number, subject: "math" | "physics" | "chemistry" | "english"): SectionFormData {
  const titles: Record<string, string> = {
    math: "Математик",
    physics: "Физик",
    chemistry: "Хими",
    english: "Англи хэл",
  };

  return {
    subject,
    title: titles[subject],
    order_index: orderIndex,
    problems: [getDefaultProblem(0, 1)],
  };
}

export function getDefaultMockTest(): MockTestFormData {
  return {
    title: "",
    description: null,
    time_limit_minutes: 180, // 3 hours default
    total_questions: 0,
    passing_score_percentage: 60,
    is_published: false,
    sections: [getDefaultSection(0, "math")],
  };
}

// ===== TRANSFORMATION HELPERS =====
// Convert between database structure and form structure

export function transformDatabaseToForm(mockTest: MockTest & { is_published?: boolean }): MockTestFormData {
  return {
    id: mockTest.id,
    title: mockTest.title,
    description: mockTest.description,
    time_limit_minutes: mockTest.time_limit_minutes,
    total_questions: mockTest.total_questions,
    passing_score_percentage: 60, // Default if not in DB
    is_published: mockTest.is_published ?? false,
    sections: (mockTest.sections ?? []).map((section) => ({
      id: section.id,
      subject: section.subject,
      title: section.title,
      order_index: section.order_index,
      problems: (section.problems ?? []).map((problem) => ({
        id: problem.id,
        problem_number: problem.problem_number,
        title: problem.title,
        context: problem.context,
        image_url: problem.image_url ?? null,
        order_index: problem.order_index,
        questions: (problem.questions ?? []).map((question) => {
          const options = question.options ?? [];
          // Ensure at least 4 default options for editing (handles incomplete seed data)
          const normalizedOptions = options.length > 0
            ? options.map((option) => ({
                id: option.id,
                option_text: option.option_text,
                is_correct: option.is_correct ?? false,
                image_url: option.image_url ?? null,
                order_index: option.order_index,
              }))
            : [
                getDefaultOption(0),
                getDefaultOption(1),
                getDefaultOption(2),
                getDefaultOption(3),
              ];

          return {
            id: question.id,
            question_number: question.question_number,
            question_text: question.question_text,
            image_url: question.image_url ?? null,
            explanation: question.explanation,
            points: question.points,
            order_index: question.order_index,
            options: normalizedOptions,
          };
        }),
      })),
    })),
  };
}

// Calculate total questions from nested structure
export function calculateTotalQuestions(formData: MockTestFormData): number {
  return formData.sections.reduce(
    (total, section) =>
      total +
      section.problems.reduce((pTotal, problem) => pTotal + problem.questions.length, 0),
    0
  );
}

// Validate nested structure
export function validateFormData(formData: MockTestFormData): ValidationResult {
  // Test-level validation
  if (!formData.title.trim()) {
    return { valid: false, message: "Test title is required" };
  }

  if (formData.sections.length === 0) {
    return { valid: false, message: "At least one section is required" };
  }

  // Section-level validation
  for (const [sIdx, section] of formData.sections.entries()) {
    if (!section.title.trim()) {
      return {
        valid: false,
        message: `Section ${sIdx + 1} title is required`,
        path: `Section ${sIdx + 1}`,
      };
    }

    if (section.problems.length === 0) {
      return {
        valid: false,
        message: `Section ${sIdx + 1} needs at least one problem`,
        path: `Section ${sIdx + 1}`,
      };
    }

    // Problem-level validation
    for (const [pIdx, problem] of section.problems.entries()) {
      if (problem.questions.length === 0) {
        return {
          valid: false,
          message: `Section ${sIdx + 1}, Problem ${pIdx + 1} needs at least one question`,
          path: `Section ${sIdx + 1}, Problem ${pIdx + 1}`,
        };
      }

      // Question-level validation
      for (const [qIdx, question] of problem.questions.entries()) {
        if (!question.question_text.trim()) {
          return {
            valid: false,
            message: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number} text is required`,
            path: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number}`,
          };
        }

        if (!question.explanation.trim()) {
          return {
            valid: false,
            message: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number} explanation is required`,
            path: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number}`,
          };
        }

        if (question.options.length < 2) {
          return {
            valid: false,
            message: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number} needs at least 2 options (currently has ${question.options.length})`,
            path: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number}`,
          };
        }

        // Option validation
        const correctCount = question.options.filter((o) => o.is_correct).length;
        if (correctCount !== 1) {
          return {
            valid: false,
            message: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number} needs exactly one correct answer (currently has ${correctCount})`,
            path: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number}`,
          };
        }

        for (const option of question.options) {
          if (!option.option_text.trim() && !option.image_url) {
            return {
              valid: false,
              message: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number}: All options must have text or an image`,
              path: `Section ${sIdx + 1}, Problem ${pIdx + 1}, Question ${question.question_number}`,
            };
          }
        }
      }
    }
  }

  return { valid: true, message: "Validation passed" };
}
