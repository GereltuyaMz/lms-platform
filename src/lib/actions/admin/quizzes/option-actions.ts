"use server";

import { createClient } from "@/lib/supabase/server";
import type { QuizOption } from "@/types/database/tables";
import type { QuizOptionFormData } from "./types";

export async function createQuizOption(
  questionId: string,
  formData: QuizOptionFormData
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

  return { success: true, message: "Хариулт нэмэгдлээ", data };
}

export async function updateQuizOption(
  id: string,
  formData: Partial<QuizOptionFormData>
): Promise<{ success: boolean; message: string; data?: QuizOption }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_options")
    .update(formData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Хариулт шинэчлэгдлээ", data };
}

export async function deleteQuizOption(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("quiz_options").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Хариулт устгагдлаа" };
}

export async function setQuizCorrectOption(
  questionId: string,
  optionId: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Set all options to incorrect
  await supabase
    .from("quiz_options")
    .update({ is_correct: false })
    .eq("question_id", questionId);

  // Set selected option to correct
  const { error } = await supabase
    .from("quiz_options")
    .update({ is_correct: true })
    .eq("id", optionId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Зөв хариулт тохируулагдлаа" };
}
