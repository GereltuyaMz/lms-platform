"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Lesson, Unit, Course, LessonContent } from "@/types/database/tables";

export type LessonWithRelations = Lesson & {
  unit: (Unit & { course: Course | null }) | null;
  content_blocks: LessonContent[];
  quiz_count: number;
};

export type LessonFormData = {
  course_id: string;
  unit_id: string | null;
  title: string;
  description: string | null;
  order_in_unit: number;
};

export async function getLessons(): Promise<LessonWithRelations[]> {
  const supabase = await createClient();

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select(
      `
      *,
      units!unit_id (
        *,
        courses!course_id (*)
      ),
      lesson_content (*),
      quiz_questions (count)
    `
    )
    .order("course_id", { ascending: true })
    .order("order_in_unit", { ascending: true });

  if (error) throw new Error(error.message);

  return (lessons || []).map((lesson) => ({
    ...lesson,
    unit: lesson.units
      ? {
          ...(lesson.units as unknown as Unit),
          course: (lesson.units as { courses: Course }).courses || null,
        }
      : null,
    content_blocks: (lesson.lesson_content as LessonContent[]) || [],
    quiz_count: (lesson.quiz_questions as { count: number }[])?.[0]?.count || 0,
  }));
}

export async function getLesson(
  id: string
): Promise<LessonWithRelations | null> {
  const supabase = await createClient();

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select(
      `
      *,
      units!unit_id (
        *,
        courses!course_id (*)
      ),
      lesson_content (*),
      quiz_questions (count)
    `
    )
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    ...lesson,
    unit: lesson.units
      ? {
          ...(lesson.units as unknown as Unit),
          course: (lesson.units as { courses: Course }).courses || null,
        }
      : null,
    content_blocks: (lesson.lesson_content as LessonContent[]) || [],
    quiz_count: (lesson.quiz_questions as { count: number }[])?.[0]?.count || 0,
  };
}

export async function getLessonsByUnit(
  unitId: string
): Promise<LessonWithRelations[]> {
  const supabase = await createClient();

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select(
      `
      *,
      units!unit_id (
        *,
        courses!course_id (*)
      ),
      lesson_content (*),
      quiz_questions (count)
    `
    )
    .eq("unit_id", unitId)
    .order("order_in_unit", { ascending: true });

  if (error) throw new Error(error.message);

  return (lessons || []).map((lesson) => ({
    ...lesson,
    unit: lesson.units
      ? {
          ...(lesson.units as unknown as Unit),
          course: (lesson.units as { courses: Course }).courses || null,
        }
      : null,
    content_blocks: (lesson.lesson_content as LessonContent[]) || [],
    quiz_count: (lesson.quiz_questions as { count: number }[])?.[0]?.count || 0,
  }));
}

export async function getUnitsForSelect(courseId?: string): Promise<
  Array<{
    id: string;
    title: string;
    title_mn: string | null;
    course_id: string;
    course_title: string;
  }>
> {
  const supabase = await createClient();

  let query = supabase
    .from("units")
    .select("id, title, title_mn, course_id, courses!course_id(title)")
    .order("course_id", { ascending: true })
    .order("order_index", { ascending: true });

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return (data || []).map((unit) => ({
    id: unit.id,
    title: unit.title,
    title_mn: unit.title_mn,
    course_id: unit.course_id,
    course_title: (unit.courses as unknown as { title: string } | null)?.title || "",
  }));
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createLesson(
  formData: LessonFormData
): Promise<{ success: boolean; message: string; data?: Lesson }> {
  const supabase = await createClient();

  const slug = generateSlug(formData.title);

  const { data, error} = await supabase
    .from("lessons")
    .insert({
      course_id: formData.course_id,
      unit_id: formData.unit_id,
      title: formData.title,
      slug,
      description: formData.description,
      order_in_unit: formData.order_in_unit,
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/lessons");
  if (formData.unit_id) {
    revalidatePath(`/admin/units/${formData.unit_id}`);
  }
  return { success: true, message: "Lesson created successfully", data };
}

export async function updateLesson(
  id: string,
  formData: LessonFormData
): Promise<{ success: boolean; message: string; data?: Lesson }> {
  const supabase = await createClient();

  const slug = generateSlug(formData.title);

  const { data, error } = await supabase
    .from("lessons")
    .update({
      course_id: formData.course_id,
      unit_id: formData.unit_id,
      title: formData.title,
      slug,
      description: formData.description,
      order_in_unit: formData.order_in_unit,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/lessons");
  revalidatePath(`/admin/lessons/${id}`);
  if (formData.unit_id) {
    revalidatePath(`/admin/units/${formData.unit_id}`);
  }
  return { success: true, message: "Lesson updated successfully", data };
}

export async function deleteLesson(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Get lesson to know unit_id
  const { data: lesson } = await supabase
    .from("lessons")
    .select("unit_id")
    .eq("id", id)
    .single();

  // Check for lesson progress (students who have started this lesson)
  const { count: progressCount } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", id);

  if (progressCount && progressCount > 0) {
    return {
      success: false,
      message: `Cannot delete: ${progressCount} student(s) have progress on this lesson`,
    };
  }

  // Delete associated content blocks first
  await supabase.from("lesson_content").delete().eq("lesson_id", id);

  // Delete quiz questions and their options
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id")
    .eq("lesson_id", id);

  if (questions && questions.length > 0) {
    const questionIds = questions.map((q) => q.id);
    await supabase.from("quiz_options").delete().in("question_id", questionIds);
    await supabase.from("quiz_questions").delete().eq("lesson_id", id);
  }

  // Delete the lesson
  const { error } = await supabase.from("lessons").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/lessons");
  if (lesson?.unit_id) {
    revalidatePath(`/admin/units/${lesson.unit_id}`);
  }
  return { success: true, message: "Lesson deleted successfully" };
}

export async function reorderLessons(
  unitId: string,
  orderedIds: string[]
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("lessons")
      .update({ order_in_unit: index })
      .eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath("/admin/lessons");
  revalidatePath(`/admin/units/${unitId}`);
  return { success: true, message: "Lessons reordered successfully" };
}
