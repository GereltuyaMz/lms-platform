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
import { insertXPTransaction, hasXPBeenAwarded } from "./xp-helpers";

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
        "id, title, description, time_limit_minutes, total_questions, created_at, category"
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _attemptId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      mockTestResults.percentage,
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

    // Call RPC to submit test and calculate scores
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

    // Award XP - wrapped to not fail the submission
    // The submission is already complete in DB at this point
    let xpAwarded = 0;
    try {
      xpAwarded = await awardMockTestXP(
        attemptId,
        mockTestResults.percentage,
        mockTestResults.total_score,
        mockTestResults.total_questions
      );

      // Update XP in attempt
      await supabase
        .from("mock_test_attempts")
        .update({ xp_awarded: xpAwarded })
        .eq("id", attemptId);
    } catch (xpError) {
      console.error("XP award failed (non-critical):", xpError);
      // Submission still succeeded, XP will be 0
    }

    // Revalidate specific pages that show attempt/results data
    // IMPORTANT: Do NOT revalidate "/mock-test" broadly - it would cause /take page
    // to re-run its server component and create a new attempt!
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Амжилттай",
      data: {
        ...mockTestResults,
        xpAwarded,
      },
    };
  } catch (error) {
    console.error("Unexpected error in submitMockTestWithAnswers:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Алдаа гарлаа",
    };
  }
}

/**
 * Award XP for mock test completion (first attempt only)
 * - Pass (≥80%): 80 XP
 * - Fail (<80%): 10 XP
 * - Retry: 0 XP
 */
async function awardMockTestXP(
  attemptId: string,
  percentage: number,
  score: number,
  totalQuestions: number
): Promise<number> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;

    // Get mock test ID from attempt
    const { data: attempt } = await supabase
      .from("mock_test_attempts")
      .select("mock_test_id")
      .eq("id", attemptId)
      .single();

    if (!attempt) return 0;

    const mockTestId = attempt.mock_test_id;

    // Idempotency check: prevent duplicate XP awards for same mock test
    if (await hasXPBeenAwarded(user.id, "mock_test_complete", mockTestId)) {
      return 0;
    }

    // Check if this is a retry (other completed attempts exist for this test)
    const { count } = await supabase
      .from("mock_test_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("mock_test_id", mockTestId)
      .eq("is_completed", true)
      .neq("id", attemptId);

    const isRetry = (count || 0) > 0;

    // Calculate XP: 80 XP for pass (≥80%), 10 XP for fail, 0 XP for retry
    let xpAmount = 0;
    if (isRetry) {
      xpAmount = 0;
    } else if (percentage >= 80) {
      xpAmount = 80;
    } else {
      xpAmount = 10;
    }

    if (xpAmount === 0) return 0;

    // Insert XP transaction
    const success = await insertXPTransaction(
      user.id,
      xpAmount,
      "mock_test_complete",
      mockTestId,
      `ЭЕШ тест: ${Math.round(percentage)}% (${score}/${totalQuestions})`,
      {
        attempt_id: attemptId,
        score,
        total_questions: totalQuestions,
        percentage,
        is_retry: isRetry,
      }
    );

    return success ? xpAmount : 0;
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
): Promise<ActionResult<{ valid: boolean; missingQuestions: string[] }>> {
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
export async function getMockTestAttemptResults(attemptId: string): Promise<
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

    // 3.1 Fetch correct options to reveal answers (since test is completed)
    // Collect all question IDs
    const questionIds: string[] = [];
    testData.data.sections.forEach((section) => {
      section.problems.forEach((problem) => {
        problem.questions.forEach((question) => {
          questionIds.push(question.id);
        });
      });
    });

    // Fetch correct options for these questions
    const { data: correctOptions } = await supabase
      .from("mock_test_options")
      .select("id, question_id")
      .eq("is_correct", true)
      .in("question_id", questionIds);

    // Create a set of correct option IDs for fast lookup
    const correctOptionIds = new Set(correctOptions?.map((o) => o.id) || []);

    // Inject is_correct flag into the test structure
    testData.data.sections.forEach((section) => {
      section.problems.forEach((problem) => {
        problem.questions.forEach((question) => {
          question.options.forEach((option) => {
            if (correctOptionIds.has(option.id)) {
              option.is_correct = true;
            }
          });
        });
      });
    });

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
      mock_tests (
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

    // Define type for raw query result (Supabase forward FK returns single object)
    type RawMockTestAttempt = {
      id: string;
      mock_test_id: string;
      total_score: number | null;
      total_questions: number | null;
      percentage: number | null;
      xp_awarded: number;
      completed_at: string;
      mock_tests: {
        title: string;
        category: string | null;
      } | null;
    };

    // Transform data to include test info at top level
    // Filter out attempts where the test no longer exists (orphaned data)
    const attempts = (data as unknown as RawMockTestAttempt[])
      .filter((attempt) => {
        // Check if the foreign key join returned test data
        return attempt.mock_tests !== null;
      })
      .map((attempt) => ({
        id: attempt.id,
        mock_test_id: attempt.mock_test_id,
        test_title: attempt.mock_tests!.title,
        test_category: attempt.mock_tests!.category,
        total_score: attempt.total_score,
        total_questions: attempt.total_questions,
        percentage: attempt.percentage,
        xp_awarded: attempt.xp_awarded,
        completed_at: attempt.completed_at,
      }));

    return { success: true, message: "Амжилттай", data: attempts };
  } catch {
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}
