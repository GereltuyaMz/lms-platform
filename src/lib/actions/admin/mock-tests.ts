"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  MockTestFormData,
  MockTestWithStats,
  ActionResult,
} from "@/types/admin/mock-tests";
import { calculateTotalQuestions, validateFormData, transformDatabaseToForm } from "@/types/admin/mock-tests";
import type { MockTest } from "@/types/mock-test";

// ===== LIST OPERATIONS =====

export async function getMockTests(): Promise<MockTestWithStats[]> {
  const supabase = await createClient();

  // Fetch all tests with stats
  const { data: tests, error } = await supabase
    .from("mock_tests")
    .select(`
      id,
      title,
      description,
      time_limit_minutes,
      total_questions,
      is_published,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mock tests:", error);
    return [];
  }

  // Fetch stats for each test (sections count, problems count, attempts count)
  const testsWithStats: MockTestWithStats[] = await Promise.all(
    tests.map(async (test) => {
      const [sectionsResult, problemsResult, attemptsResult] = await Promise.all([
        supabase
          .from("mock_test_sections")
          .select("id", { count: "exact", head: true })
          .eq("mock_test_id", test.id),
        supabase
          .from("mock_test_problems")
          .select("id", { count: "exact", head: true })
          .in("section_id",
            await supabase
              .from("mock_test_sections")
              .select("id")
              .eq("mock_test_id", test.id)
              .then(({ data }) => data?.map((s) => s.id) || [])
          ),
        supabase
          .from("mock_test_attempts")
          .select("id", { count: "exact", head: true })
          .eq("mock_test_id", test.id),
      ]);

      return {
        ...test,
        sections_count: sectionsResult.count || 0,
        total_problems: problemsResult.count || 0,
        attempts_count: attemptsResult.count || 0,
      };
    })
  );

  return testsWithStats;
}

// ===== READ OPERATIONS =====

export async function getMockTest(id: string): Promise<ActionResult<MockTestFormData>> {
  const supabase = await createClient();

  // Use admin RPC function to get complete nested data with is_correct field
  const { data, error } = await supabase.rpc("get_mock_test_admin", {
    test_id: id,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return { success: false, message: "Mock test not found" };
  }

  // Transform database structure to form structure
  const formData = transformDatabaseToForm(data as MockTest);

  return { success: true, message: "Mock test loaded", data: formData };
}

// ===== CREATE OPERATIONS =====

export async function createMockTest(
  formData: MockTestFormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  // Validate form data
  const validation = validateFormData(formData);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }

  // Calculate total questions
  const totalQuestions = calculateTotalQuestions(formData);

  try {
    // 1. Insert mock_tests
    const { data: test, error: testError } = await supabase
      .from("mock_tests")
      .insert({
        title: formData.title,
        description: formData.description,
        time_limit_minutes: formData.time_limit_minutes,
        total_questions: totalQuestions,
        is_published: false, // Always draft initially
      })
      .select()
      .single();

    if (testError) throw testError;

    // 2. Bulk insert sections
    const sectionsToInsert = formData.sections.map((section, idx) => ({
      mock_test_id: test.id,
      subject: section.subject,
      title: section.title,
      order_index: idx,
    }));

    const { data: sections, error: sectionsError } = await supabase
      .from("mock_test_sections")
      .insert(sectionsToInsert)
      .select();

    if (sectionsError) throw sectionsError;

    // 3. Bulk insert problems
    type ProblemInsert = {
      section_id: string;
      problem_number: number;
      title: string | null;
      context: string | null;
      image_url: string | null;
      order_index: number;
    };
    const problemsToInsert: ProblemInsert[] = [];
    formData.sections.forEach((section, sIdx) => {
      section.problems.forEach((problem, pIdx) => {
        problemsToInsert.push({
          section_id: sections[sIdx].id,
          problem_number: problem.problem_number,
          title: problem.title,
          context: problem.context,
          image_url: problem.image_url,
          order_index: pIdx,
        });
      });
    });

    const { data: problems, error: problemsError } = await supabase
      .from("mock_test_problems")
      .insert(problemsToInsert)
      .select();

    if (problemsError) throw problemsError;

    // 4. Bulk insert questions
    let problemCounter = 0;
    type QuestionInsert = {
      problem_id: string;
      question_number: string;
      question_text: string;
      image_url: string | null;
      explanation: string;
      points: number;
      order_index: number;
    };
    const questionsToInsert: QuestionInsert[] = [];

    formData.sections.forEach((section) => {
      section.problems.forEach((problem) => {
        problem.questions.forEach((question, qIdx) => {
          questionsToInsert.push({
            problem_id: problems[problemCounter].id,
            question_number: question.question_number,
            question_text: question.question_text,
            image_url: question.image_url,
            explanation: question.explanation,
            points: question.points,
            order_index: qIdx,
          });
        });
        problemCounter++;
      });
    });

    const { data: questions, error: questionsError } = await supabase
      .from("mock_test_questions")
      .insert(questionsToInsert)
      .select();

    if (questionsError) throw questionsError;

    // 5. Bulk insert options
    let questionCounter = 0;
    type OptionInsert = {
      question_id: string;
      option_text: string;
      is_correct: boolean;
      image_url: string | null;
      order_index: number;
    };
    const optionsToInsert: OptionInsert[] = [];

    formData.sections.forEach((section) => {
      section.problems.forEach((problem) => {
        problem.questions.forEach((question) => {
          question.options.forEach((option, oIdx) => {
            optionsToInsert.push({
              question_id: questions[questionCounter].id,
              option_text: option.option_text,
              is_correct: option.is_correct,
              image_url: option.image_url,
              order_index: oIdx,
            });
          });
          questionCounter++;
        });
      });
    });

    const { error: optionsError } = await supabase
      .from("mock_test_options")
      .insert(optionsToInsert);

    if (optionsError) throw optionsError;

    revalidatePath("/admin/mock-tests");
    return {
      success: true,
      message: "Mock test created successfully",
      data: { id: test.id },
    };
  } catch (error) {
    console.error("Create mock test error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create mock test",
    };
  }
}

// ===== UPDATE OPERATIONS =====

export async function updateMockTest(
  id: string,
  formData: MockTestFormData
): Promise<ActionResult> {
  const supabase = await createClient();

  // Validate form data
  const validation = validateFormData(formData);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }

  // Calculate total questions
  const totalQuestions = calculateTotalQuestions(formData);

  try {
    // 1. Update test metadata
    const { error: testError } = await supabase
      .from("mock_tests")
      .update({
        title: formData.title,
        description: formData.description,
        time_limit_minutes: formData.time_limit_minutes,
        total_questions: totalQuestions,
      })
      .eq("id", id);

    if (testError) throw testError;

    // 2. Delete all nested data (CASCADE will handle children)
    const { error: deleteError } = await supabase
      .from("mock_test_sections")
      .delete()
      .eq("mock_test_id", id);

    if (deleteError) throw deleteError;

    // 3. Recreate all sections/problems/questions/options (same as create)
    // Bulk insert sections
    const sectionsToInsert = formData.sections.map((section, idx) => ({
      mock_test_id: id,
      subject: section.subject,
      title: section.title,
      order_index: idx,
    }));

    const { data: sections, error: sectionsError } = await supabase
      .from("mock_test_sections")
      .insert(sectionsToInsert)
      .select();

    if (sectionsError) throw sectionsError;

    // Bulk insert problems
    type ProblemInsert = {
      section_id: string;
      problem_number: number;
      title: string | null;
      context: string | null;
      image_url: string | null;
      order_index: number;
    };
    const problemsToInsert: ProblemInsert[] = [];
    formData.sections.forEach((section, sIdx) => {
      section.problems.forEach((problem, pIdx) => {
        problemsToInsert.push({
          section_id: sections[sIdx].id,
          problem_number: problem.problem_number,
          title: problem.title,
          context: problem.context,
          image_url: problem.image_url,
          order_index: pIdx,
        });
      });
    });

    const { data: problems, error: problemsError } = await supabase
      .from("mock_test_problems")
      .insert(problemsToInsert)
      .select();

    if (problemsError) throw problemsError;

    // Bulk insert questions
    let problemCounter = 0;
    type QuestionInsert = {
      problem_id: string;
      question_number: string;
      question_text: string;
      image_url: string | null;
      explanation: string;
      points: number;
      order_index: number;
    };
    const questionsToInsert: QuestionInsert[] = [];

    formData.sections.forEach((section) => {
      section.problems.forEach((problem) => {
        problem.questions.forEach((question, qIdx) => {
          questionsToInsert.push({
            problem_id: problems[problemCounter].id,
            question_number: question.question_number,
            question_text: question.question_text,
            image_url: question.image_url,
            explanation: question.explanation,
            points: question.points,
            order_index: qIdx,
          });
        });
        problemCounter++;
      });
    });

    const { data: questions, error: questionsError } = await supabase
      .from("mock_test_questions")
      .insert(questionsToInsert)
      .select();

    if (questionsError) throw questionsError;

    // Bulk insert options
    let questionCounter = 0;
    type OptionInsert = {
      question_id: string;
      option_text: string;
      is_correct: boolean;
      image_url: string | null;
      order_index: number;
    };
    const optionsToInsert: OptionInsert[] = [];

    formData.sections.forEach((section) => {
      section.problems.forEach((problem) => {
        problem.questions.forEach((question) => {
          question.options.forEach((option, oIdx) => {
            optionsToInsert.push({
              question_id: questions[questionCounter].id,
              option_text: option.option_text,
              is_correct: option.is_correct,
              image_url: option.image_url,
              order_index: oIdx,
            });
          });
          questionCounter++;
        });
      });
    });

    const { error: optionsError } = await supabase
      .from("mock_test_options")
      .insert(optionsToInsert);

    if (optionsError) throw optionsError;

    revalidatePath("/admin/mock-tests");
    revalidatePath(`/admin/mock-tests/${id}`);
    return { success: true, message: "Mock test updated successfully" };
  } catch (error) {
    console.error("Update mock test error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update mock test",
    };
  }
}

// ===== DELETE OPERATIONS =====

export async function deleteMockTest(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Check for existing attempts
    const { count, error: countError } = await supabase
      .from("mock_test_attempts")
      .select("id", { count: "exact", head: true })
      .eq("mock_test_id", id);

    if (countError) throw countError;

    if (count && count > 0) {
      return {
        success: false,
        message: `Cannot delete test with ${count} student attempt(s). Unpublish instead.`,
      };
    }

    // Delete test (CASCADE will handle all children)
    const { error: deleteError } = await supabase
      .from("mock_tests")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    revalidatePath("/admin/mock-tests");
    return { success: true, message: "Mock test deleted successfully" };
  } catch (error) {
    console.error("Delete mock test error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete mock test",
    };
  }
}

// ===== PUBLISH OPERATIONS =====

export async function toggleMockTestPublish(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Debug: Check current user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("Current user:", user?.id, user?.email);

    if (authError || !user) {
      return { success: false, message: "Authentication required" };
    }

    // Debug: Check user role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("User profile role:", profile?.role);

    // Get current publish status
    const { data: test, error: fetchError } = await supabase
      .from("mock_tests")
      .select("is_published")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle publish status
    const { error: updateError } = await supabase
      .from("mock_tests")
      .update({ is_published: !test.is_published })
      .eq("id", id);

    if (updateError) {
      console.log("Update error details:", updateError);
      throw updateError;
    }

    revalidatePath("/admin/mock-tests");
    revalidatePath(`/admin/mock-tests/${id}`);

    return {
      success: true,
      message: test.is_published
        ? "Mock test unpublished"
        : "Mock test published",
    };
  } catch (error) {
    console.error("Toggle publish error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to toggle publish status",
    };
  }
}
