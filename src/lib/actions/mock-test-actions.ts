"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  MockTest,
  MockTestAttempt,
  MockTestResults,
  BestAttemptData,
  DetailedAnswer,
} from "@/types/mock-test";
import { insertXPTransaction } from "./xp-helpers";

type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

/**
 * Get all published mock tests
 */
export async function getPublishedMockTests(): Promise<
  ActionResult<MockTest[]>
> {
  try {
    const supabase = await createClient();

    const { data: tests, error } = await supabase
      .from("mock_tests")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Тестүүдийг татаж чадсангүй",
      };
    }

    return {
      success: true,
      message: "Амжилттай",
      data: tests as unknown as MockTest[],
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Get all published mock tests for a specific category
 */
export async function getMockTestsByCategory(
  category: string
): Promise<ActionResult<MockTest[]>> {
  try {
    const supabase = await createClient();

    const { data: tests, error } = await supabase
      .from("mock_tests")
      .select(
        "id, title, description, time_limit_minutes, total_questions, passing_score_percentage, created_at, category"
      )
      .eq("category", category)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Тестүүдийг татаж чадсангүй",
      };
    }

    return {
      success: true,
      message: "Амжилттай",
      data: tests as unknown as MockTest[],
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Get complete mock test data with all sections, problems, questions
 */
export async function getMockTestData(
  testId: string
): Promise<ActionResult<MockTest>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_mock_test_data", {
      test_id: testId,
    });

    if (error || !data) {
      return {
        success: false,
        message: "Тестийн өгөгдөл олдсонгүй",
      };
    }

    return {
      success: true,
      message: "Амжилттай",
      data: data as MockTest,
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Create new attempt or resume existing incomplete attempt
 */
export async function createMockTestAttempt(
  testId: string
): Promise<ActionResult<{ attemptId: string; endTime: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Нэвтрэх шаардлагатай",
      };
    }

    const { data: attemptId, error } = await supabase.rpc(
      "create_mock_test_attempt",
      {
        p_user_id: user.id,
        p_test_id: testId,
      }
    );

    if (error || !attemptId) {
      return {
        success: false,
        message: "Шалгалт эхлүүлж чадсангүй",
      };
    }

    // Get attempt details including end_time
    const { data: attempt } = await supabase
      .from("mock_test_attempts")
      .select("end_time")
      .eq("id", attemptId)
      .single();

    if (!attempt?.end_time) {
      return {
        success: false,
        message: "Тестийн дуусах хугацаа олдсонгүй",
      };
    }

    return {
      success: true,
      message: "Амжилттай",
      data: {
        attemptId: attemptId as string,
        endTime: attempt.end_time,
      },
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Save individual answer
 */
export async function saveMockTestAnswer(
  attemptId: string,
  questionId: string,
  optionId: string
): Promise<ActionResult<{ isCorrect: boolean }>> {
  try {
    const supabase = await createClient();

    const { data: isCorrect, error } = await supabase.rpc(
      "save_mock_test_answer",
      {
        p_attempt_id: attemptId,
        p_question_id: questionId,
        p_option_id: optionId,
      }
    );

    if (error) {
      return {
        success: false,
        message: "Хариулт хадгалагдсангүй",
      };
    }

    return {
      success: true,
      message: "Амжилттай",
      data: { isCorrect: isCorrect as boolean },
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * @deprecated No longer needed with end_time approach. Kept for backward compatibility.
 * Timer now calculates remaining time from end_time, eliminating need for periodic updates.
 */
export async function updateTimerState(
  _attemptId: string,
  _timeRemainingSeconds: number
): Promise<ActionResult> {
  // No-op function kept for backward compatibility
  // Can be removed in future versions
  return {
    success: true,
    message: "Амжилттай (deprecated)",
  };
}

/**
 * Submit mock test attempt and calculate scores
 */
export async function submitMockTestAttempt(
  attemptId: string
): Promise<ActionResult<MockTestResults & { xpAwarded: number }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Нэвтрэх шаардлагатай",
      };
    }

    // Submit and calculate scores
    const { data: results, error } = await supabase.rpc(
      "submit_mock_test_attempt",
      {
        p_attempt_id: attemptId,
      }
    );

    if (error || !results) {
      console.error("Submit error:", error);
      return {
        success: false,
        message: error?.message || "Тест илгээж чадсангүй",
      };
    }

    const mockTestResults = results as MockTestResults;

    // Calculate and award XP
    const xpAwarded = await awardMockTestXP(
      attemptId,
      mockTestResults.total_score,
      mockTestResults.total_questions
    );

    // Update attempt with XP
    await supabase
      .from("mock_test_attempts")
      .update({ xp_awarded: xpAwarded })
      .eq("id", attemptId);

    // Revalidate pages
    revalidatePath("/mock-test");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Амжилттай",
      data: {
        ...mockTestResults,
        xpAwarded,
      },
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Submit mock test with all answers in one batch (localStorage-first approach)
 * Replaces individual answer saves with atomic batch submission
 */
export async function submitMockTestWithAnswers(
  attemptId: string,
  answers: Record<string, string>
): Promise<ActionResult<MockTestResults & { xpAwarded: number }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Нэвтрэх шаардлагатай",
      };
    }

    // Call new RPC that does batch insert + calculate
    const { data: results, error } = await supabase.rpc(
      "submit_mock_test_with_answers",
      {
        p_attempt_id: attemptId,
        p_answers: answers,
      }
    );

    if (error || !results) {
      console.error("Submit error:", error);
      return {
        success: false,
        message: error?.message || "Тест илгээж чадсангүй",
      };
    }

    const mockTestResults = results as MockTestResults;

    // Award XP
    const xpAwarded = await awardMockTestXP(
      attemptId,
      mockTestResults.total_score,
      mockTestResults.total_questions
    );

    // Update XP in attempt
    await supabase
      .from("mock_test_attempts")
      .update({ xp_awarded: xpAwarded })
      .eq("id", attemptId);

    revalidatePath("/mock-test");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Амжилттай",
      data: {
        ...mockTestResults,
        xpAwarded,
      },
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Award XP for mock test completion
 */
async function awardMockTestXP(
  attemptId: string,
  score: number,
  totalQuestions: number
): Promise<number> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;

    // Check if this is first attempt
    const { data: attempt } = await supabase
      .from("mock_test_attempts")
      .select("mock_test_id")
      .eq("id", attemptId)
      .single();

    if (!attempt) return 0;

    const { count } = await supabase
      .from("mock_test_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("mock_test_id", attempt.mock_test_id)
      .eq("is_completed", true);

    const isFirstAttempt = (count || 0) === 0;
    const percentage = (score / totalQuestions) * 100;

    // Calculate XP
    const baseXP = score * 20; // 20 XP per correct answer
    let bonusXP = 0;

    // Mastery bonus
    if (percentage >= 80 && percentage < 90) bonusXP = 200;
    if (percentage >= 90 && percentage < 95) bonusXP = 400;
    if (percentage >= 95 && percentage < 100) bonusXP = 600;
    if (percentage === 100) bonusXP = 1000;

    // First attempt bonus
    const firstAttemptBonus = isFirstAttempt ? 500 : 0;

    const totalXP = baseXP + bonusXP + firstAttemptBonus;

    // Award XP using existing system
    await insertXPTransaction(
      user.id,
      totalXP,
      "mock_test_complete",
      attemptId,
      `ЭЕШ тест: ${score}/${totalQuestions} оноо`,
      {
        score,
        total_questions: totalQuestions,
        percentage,
        is_first_attempt: isFirstAttempt,
      }
    );

    return totalXP;
  } catch {
    return 0;
  }
}

/**
 * Get user's best attempt for a test
 */
export async function getBestMockTestAttempt(
  testId: string
): Promise<ActionResult<BestAttemptData>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Нэвтрэх шаардлагатай",
      };
    }

    const { data, error } = await supabase.rpc("get_best_mock_test_attempt", {
      p_user_id: user.id,
      p_test_id: testId,
    });

    if (error) {
      return {
        success: false,
        message: "Өгөгдөл татаж чадсангүй",
      };
    }

    return {
      success: true,
      message: "Амжилттай",
      data: data as BestAttemptData,
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Get user's saved answers for an attempt
 */
export async function getSavedAnswers(
  attemptId: string
): Promise<ActionResult<Record<string, string>>> {
  try {
    const supabase = await createClient();

    const { data: answers, error } = await supabase
      .from("mock_test_answers")
      .select("question_id, selected_option_id")
      .eq("attempt_id", attemptId);

    if (error) {
      return {
        success: false,
        message: "Хариултууд татаж чадсангүй",
      };
    }

    // Convert to Record format
    const savedAnswers: Record<string, string> = {};
    answers?.forEach((answer) => {
      if (answer.selected_option_id) {
        savedAnswers[answer.question_id] = answer.selected_option_id;
      }
    });

    return {
      success: true,
      message: "Амжилттай",
      data: savedAnswers,
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Validates that all questions in an attempt have saved answers in DB
 * Called before submission to catch any missing saves
 */
export async function validateMockTestAnswers(
  attemptId: string,
  expectedQuestionIds: string[]
): Promise<
  ActionResult<{ valid: boolean; missingQuestions: string[] }>
> {
  try {
    const supabase = await createClient();

    const { data: savedAnswers, error } = await supabase
      .from("mock_test_answers")
      .select("question_id")
      .eq("attempt_id", attemptId);

    if (error) {
      return {
        success: false,
        message: "Хариултыг шалгаж чадсангүй",
      };
    }

    const savedQuestionIds = new Set(
      savedAnswers?.map((a) => a.question_id) || []
    );
    const missingQuestions = expectedQuestionIds.filter(
      (qId) => !savedQuestionIds.has(qId)
    );

    return {
      success: true,
      message: "Амжилттай",
      data: {
        valid: missingQuestions.length === 0,
        missingQuestions,
      },
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Get complete attempt results with test structure and all answers
 * Used by: /mock-test/results/[attemptId] page
 */
export async function getMockTestAttemptResults(
  attemptId: string
): Promise<
  ActionResult<{
    attempt: MockTestAttempt;
    test: MockTest;
    answers: Record<string, DetailedAnswer>;
  }>
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    // 1. Fetch attempt (RLS enforces user ownership)
    const { data: attempt, error: attemptError } = await supabase
      .from("mock_test_attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (attemptError || !attempt) {
      return { success: false, message: "Оролдлого олдсонгүй" };
    }

    // 2. Check if completed
    if (!attempt.is_completed) {
      return {
        success: false,
        message: "Тест хараахан дуусаагүй байна",
      };
    }

    // 2.1. Validate completed attempt has required fields
    if (
      attempt.total_score === null ||
      attempt.total_questions === null ||
      attempt.percentage === null ||
      !attempt.completed_at
    ) {
      return {
        success: false,
        message: "Тест дуусаагүй эсвэл үр дүн олдсонгүй",
      };
    }

    // 3. Fetch test structure via existing function
    const testData = await getMockTestData(attempt.mock_test_id);
    if (!testData.success || !testData.data) {
      return { success: false, message: "Тестийн өгөгдөл олдсонгүй" };
    }

    // 4. Fetch all answers
    const { data: answers } = await supabase
      .from("mock_test_answers")
      .select("question_id, selected_option_id, is_correct, points_earned")
      .eq("attempt_id", attemptId);

    // 5. Convert answers array to Record<questionId, DetailedAnswer>
    const answersMap: Record<string, DetailedAnswer> = {};
    answers?.forEach((ans) => {
      answersMap[ans.question_id] = {
        selected_option_id: ans.selected_option_id,
        is_correct: ans.is_correct,
        points_earned: ans.points_earned,
      };
    });

    return {
      success: true,
      message: "Амжилттай",
      data: {
        attempt,
        test: testData.data,
        answers: answersMap,
      },
    };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}

/**
 * Fetch all completed mock test attempts for current user
 * Used by: Dashboard TestResultsTab
 */
export async function getUserMockTestAttempts(): Promise<
  ActionResult<
    Array<{
      id: string;
      mock_test_id: string;
      test_title: string;
      test_category: string | null;
      total_score: number | null;
      total_questions: number | null;
      percentage: number | null;
      xp_awarded: number;
      completed_at: string;
      eysh_converted_score: number | null;
    }>
  >
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    // Query attempts with joined test data
    const { data, error } = await supabase
      .from("mock_test_attempts")
      .select(
        `
      id,
      mock_test_id,
      total_score,
      total_questions,
      percentage,
      xp_awarded,
      completed_at,
      eysh_converted_score,
      mock_test:mock_tests (
        title,
        category
      )
    `
      )
      .eq("user_id", user.id)
      .eq("is_completed", true)
      .order("completed_at", { ascending: false });

    if (error) {
      return { success: false, message: error.message };
    }

    // Define type for raw query result (Supabase foreign key select returns array)
    type RawMockTestAttempt = {
      id: string;
      mock_test_id: string;
      total_score: number | null;
      total_questions: number | null;
      percentage: number | null;
      xp_awarded: number;
      completed_at: string;
      eysh_converted_score: number | null;
      mock_test: {
        title: string;
        category: string | null;
      }[];
    };

    // Transform data to include test info at top level
    const attempts = data.map((attempt: RawMockTestAttempt) => ({
      id: attempt.id,
      mock_test_id: attempt.mock_test_id,
      test_title: attempt.mock_test[0]?.title || "Unknown",
      test_category: attempt.mock_test[0]?.category || null,
      total_score: attempt.total_score,
      total_questions: attempt.total_questions,
      percentage: attempt.percentage,
      xp_awarded: attempt.xp_awarded,
      completed_at: attempt.completed_at,
      eysh_converted_score: attempt.eysh_converted_score,
    }));

    return { success: true, message: "Амжилттай", data: attempts };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}
