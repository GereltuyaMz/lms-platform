"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuizQuestion, QuizOption } from "@/types/database/tables";

export type QuestionWithOptions = QuizQuestion & {
  options: QuizOption[];
};

export type QuestionFormData = {
  question: string;
  explanation: string;
  points: number;
  order_index: number;
};

export type OptionFormData = {
  option_text: string;
  is_correct: boolean;
  order_index: number;
};

export async function getQuizQuestions(
  lessonId: string
): Promise<QuestionWithOptions[]> {
  const supabase = await createClient();

  const { data: questions, error } = await supabase
    .from("quiz_questions")
    .select(
      `
      *,
      quiz_options (*)
    `
    )
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);

  return (questions || []).map((q) => ({
    ...q,
    options: ((q.quiz_options as QuizOption[]) || []).sort(
      (a, b) => a.order_index - b.order_index
    ),
  }));
}

export async function createQuestion(
  lessonId: string,
  formData: QuestionFormData
): Promise<{ success: boolean; message: string; data?: QuizQuestion }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_questions")
    .insert({
      lesson_id: lessonId,
      question: formData.question,
      explanation: formData.explanation,
      points: formData.points,
      order_index: formData.order_index,
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath(`/admin/lessons/${lessonId}/quiz`);
  return { success: true, message: "Question created successfully", data };
}

export async function updateQuestion(
  id: string,
  formData: QuestionFormData
): Promise<{ success: boolean; message: string; data?: QuizQuestion }> {
  const supabase = await createClient();

  // Get lesson_id for revalidation
  const { data: existing } = await supabase
    .from("quiz_questions")
    .select("lesson_id")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("quiz_questions")
    .update({
      question: formData.question,
      explanation: formData.explanation,
      points: formData.points,
      order_index: formData.order_index,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  if (existing?.lesson_id) {
    revalidatePath(`/admin/lessons/${existing.lesson_id}/quiz`);
  }
  return { success: true, message: "Question updated successfully", data };
}

export async function deleteQuestion(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Get lesson_id for revalidation
  const { data: existing } = await supabase
    .from("quiz_questions")
    .select("lesson_id")
    .eq("id", id)
    .single();

  // Delete options first
  await supabase.from("quiz_options").delete().eq("question_id", id);

  // Delete question
  const { error } = await supabase.from("quiz_questions").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  if (existing?.lesson_id) {
    revalidatePath(`/admin/lessons/${existing.lesson_id}/quiz`);
  }
  return { success: true, message: "Question deleted successfully" };
}

export async function createOption(
  questionId: string,
  formData: OptionFormData
): Promise<{ success: boolean; message: string; data?: QuizOption }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_options")
    .insert({
      question_id: questionId,
      option_text: formData.option_text,
      is_correct: formData.is_correct,
      order_index: formData.order_index,
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  // Get lesson_id for revalidation
  const { data: question } = await supabase
    .from("quiz_questions")
    .select("lesson_id")
    .eq("id", questionId)
    .single();

  if (question?.lesson_id) {
    revalidatePath(`/admin/lessons/${question.lesson_id}/quiz`);
  }
  return { success: true, message: "Option created successfully", data };
}

export async function updateOption(
  id: string,
  formData: OptionFormData
): Promise<{ success: boolean; message: string; data?: QuizOption }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_options")
    .update({
      option_text: formData.option_text,
      is_correct: formData.is_correct,
      order_index: formData.order_index,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  // Get lesson_id for revalidation through question
  const { data: option } = await supabase
    .from("quiz_options")
    .select("quiz_questions(lesson_id)")
    .eq("id", id)
    .single();

  const lessonId = (option?.quiz_questions as unknown as { lesson_id: string } | null)
    ?.lesson_id;
  if (lessonId) {
    revalidatePath(`/admin/lessons/${lessonId}/quiz`);
  }

  return { success: true, message: "Option updated successfully", data };
}

export async function deleteOption(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Get lesson_id for revalidation
  const { data: option } = await supabase
    .from("quiz_options")
    .select("question_id, quiz_questions(lesson_id)")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("quiz_options").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  const lessonId = (option?.quiz_questions as unknown as { lesson_id: string } | null)
    ?.lesson_id;
  if (lessonId) {
    revalidatePath(`/admin/lessons/${lessonId}/quiz`);
  }

  return { success: true, message: "Option deleted successfully" };
}

export async function reorderQuestions(
  lessonId: string,
  orderedIds: string[]
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("quiz_questions").update({ order_index: index }).eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath(`/admin/lessons/${lessonId}/quiz`);
  return { success: true, message: "Questions reordered successfully" };
}

export async function setCorrectOption(
  questionId: string,
  optionId: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Set all options for this question to incorrect
  await supabase
    .from("quiz_options")
    .update({ is_correct: false })
    .eq("question_id", questionId);

  // Set the selected option to correct
  const { error } = await supabase
    .from("quiz_options")
    .update({ is_correct: true })
    .eq("id", optionId);

  if (error) {
    return { success: false, message: error.message };
  }

  // Get lesson_id for revalidation
  const { data: question } = await supabase
    .from("quiz_questions")
    .select("lesson_id")
    .eq("id", questionId)
    .single();

  if (question?.lesson_id) {
    revalidatePath(`/admin/lessons/${question.lesson_id}/quiz`);
  }

  return { success: true, message: "Correct answer updated" };
}
