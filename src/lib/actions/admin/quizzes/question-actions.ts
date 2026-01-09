"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuizQuestion } from "@/types/database/tables";
import type {
  QuizQuestionFormData,
  QuestionWithOptions,
  CreateQuestionWithOptionsData,
} from "./types";

export async function createQuizQuestion(
  quizId: string,
  formData: QuizQuestionFormData
): Promise<{ success: boolean; message: string; data?: QuizQuestion }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_questions")
    .insert({
      quiz_id: quizId,
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

  revalidatePath(`/admin/quizzes/${quizId}`);
  return { success: true, message: "Асуулт нэмэгдлээ", data };
}

export async function createQuizQuestionWithOptions(
  quizId: string,
  formData: CreateQuestionWithOptionsData
): Promise<{ success: boolean; message: string; data?: QuestionWithOptions }> {
  const supabase = await createClient();

  // Create question
  const { data: question, error: questionError } = await supabase
    .from("quiz_questions")
    .insert({
      quiz_id: quizId,
      question: formData.question,
      explanation: formData.explanation,
      points: 10,
      order_index: formData.order_index,
    })
    .select()
    .single();

  if (questionError || !question) {
    return {
      success: false,
      message: questionError?.message || "Асуулт үүсгэхэд алдаа гарлаа",
    };
  }

  // Create options
  const optionRecords = formData.options
    .filter((text) => text.trim())
    .map((text, index) => ({
      question_id: question.id,
      option_text: text.trim(),
      is_correct: index === formData.correctIndex,
      order_index: index,
    }));

  if (optionRecords.length === 0) {
    await supabase.from("quiz_questions").delete().eq("id", question.id);
    return { success: false, message: "Хариултууд оруулна уу" };
  }

  const { data: options, error: optionsError } = await supabase
    .from("quiz_options")
    .insert(optionRecords)
    .select();

  if (optionsError) {
    await supabase.from("quiz_questions").delete().eq("id", question.id);
    return { success: false, message: optionsError.message };
  }

  revalidatePath(`/admin/quizzes/${quizId}`);
  return {
    success: true,
    message: "Асуулт нэмэгдлээ",
    data: { ...question, options: options || [] },
  };
}

export async function updateQuizQuestion(
  id: string,
  formData: QuizQuestionFormData
): Promise<{ success: boolean; message: string; data?: QuizQuestion }> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("quiz_questions")
    .select("quiz_id")
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

  if (existing?.quiz_id) {
    revalidatePath(`/admin/quizzes/${existing.quiz_id}`);
  }
  return { success: true, message: "Асуулт шинэчлэгдлээ", data };
}

export async function deleteQuizQuestion(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("quiz_questions")
    .select("quiz_id")
    .eq("id", id)
    .single();

  // Delete options first
  await supabase.from("quiz_options").delete().eq("question_id", id);

  // Delete question
  const { error } = await supabase.from("quiz_questions").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  if (existing?.quiz_id) {
    revalidatePath(`/admin/quizzes/${existing.quiz_id}`);
  }
  return { success: true, message: "Асуулт устгагдлаа" };
}

export async function reorderQuizQuestions(
  quizId: string,
  orderedIds: string[]
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("quiz_questions").update({ order_index: index }).eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath(`/admin/quizzes/${quizId}`);
  return { success: true, message: "Асуултууд дахин эрэмблэгдлээ" };
}
