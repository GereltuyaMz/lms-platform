"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Quiz, QuizQuestion, QuizOption } from "@/types/database/tables";
import type { QuizFormData, QuizWithQuestions, QuizForSelect } from "./types";

export async function getQuizzes(): Promise<QuizWithQuestions[]> {
  const supabase = await createClient();

  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select(
      `
      *,
      quiz_questions (
        *,
        quiz_options (*)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) return [];

  return (quizzes || []).map((quiz) => {
    const questions = ((quiz.quiz_questions as QuizQuestion[]) || [])
      .filter((q) => q.quiz_id === quiz.id)
      .map((q) => ({
        ...q,
        options: (
          ((q as unknown as { quiz_options: QuizOption[] }).quiz_options) || []
        ).sort((a, b) => a.order_index - b.order_index),
      }))
      .sort((a, b) => a.order_index - b.order_index);

    return {
      ...quiz,
      questions,
      question_count: questions.length,
    };
  });
}

export async function getQuiz(id: string): Promise<QuizWithQuestions | null> {
  const supabase = await createClient();

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select(
      `
      *,
      quiz_questions (
        *,
        quiz_options (*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) return null;

  const questions = ((quiz.quiz_questions as QuizQuestion[]) || [])
    .filter((q) => q.quiz_id === quiz.id)
    .map((q) => ({
      ...q,
      options: (
        ((q as unknown as { quiz_options: QuizOption[] }).quiz_options) || []
      ).sort((a, b) => a.order_index - b.order_index),
    }))
    .sort((a, b) => a.order_index - b.order_index);

  return {
    ...quiz,
    questions,
    question_count: questions.length,
  };
}

export async function getQuizzesForSelect(): Promise<QuizForSelect[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quizzes")
    .select(
      `
      id,
      title,
      quiz_questions (count)
    `
    )
    .order("title", { ascending: true });

  if (error) throw new Error(error.message);

  return (data || []).map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    question_count:
      (quiz.quiz_questions as { count: number }[])?.[0]?.count || 0,
  }));
}

export async function createQuiz(
  formData: QuizFormData
): Promise<{ success: boolean; message: string; data?: Quiz }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quizzes")
    .insert({
      title: formData.title,
      description: formData.description,
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/quizzes");
  return { success: true, message: "Тест амжилттай үүсгэгдлээ", data };
}

export async function updateQuiz(
  id: string,
  formData: QuizFormData
): Promise<{ success: boolean; message: string; data?: Quiz }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quizzes")
    .update({
      title: formData.title,
      description: formData.description,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/quizzes");
  revalidatePath(`/admin/quizzes/${id}`);
  return { success: true, message: "Тест амжилттай шинэчлэгдлээ", data };
}

export async function deleteQuiz(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Check if quiz is attached to any lessons
  const { data: attachedLessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("quiz_id", id);

  // Check if quiz is attached to any units
  const { data: attachedUnits } = await supabase
    .from("units")
    .select("id")
    .eq("quiz_id", id);

  const lessonCount = attachedLessons?.length || 0;
  const unitCount = attachedUnits?.length || 0;

  if (lessonCount > 0 || unitCount > 0) {
    return {
      success: false,
      message: `Устгах боломжгүй: ${lessonCount} хичээл, ${unitCount} бүлэгт холбогдсон байна`,
    };
  }

  // Delete questions (cascade will delete options)
  await supabase.from("quiz_questions").delete().eq("quiz_id", id);

  // Delete quiz
  const { error } = await supabase.from("quizzes").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/quizzes");
  return { success: true, message: "Тест амжилттай устгагдлаа" };
}
