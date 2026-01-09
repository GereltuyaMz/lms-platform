"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Unit, Lesson, Course } from "@/types/database/tables";

export type UnitWithRelations = Unit & {
  course: Course | null;
  lessons: Lesson[];
  lessons_count: number;
};

export type UnitFormData = {
  course_id: string;
  title: string;
  title_mn: string | null;
  description: string | null;
  order_index: number;
  unit_content: string | null;
  quiz_id: string | null;
};

export async function getUnits(): Promise<UnitWithRelations[]> {
  const supabase = await createClient();

  const { data: units, error } = await supabase
    .from("units")
    .select(
      `
      *,
      courses!course_id (*),
      lessons (*)
    `
    )
    .order("course_id", { ascending: true })
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);

  return (units || []).map((unit) => ({
    ...unit,
    course: unit.courses as unknown as Course | null,
    lessons: unit.lessons as Lesson[],
    lessons_count: (unit.lessons as Lesson[])?.length || 0,
  }));
}

export async function getUnit(id: string): Promise<UnitWithRelations | null> {
  const supabase = await createClient();

  const { data: unit, error } = await supabase
    .from("units")
    .select(
      `
      *,
      courses!course_id (*),
      lessons (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) return null;

  // Sort lessons by order_in_unit in JavaScript (PostgREST doesn't support ordering on one-to-many relations)
  const lessons = ((unit.lessons as Lesson[]) || []).sort(
    (a, b) => (a.order_in_unit || 0) - (b.order_in_unit || 0)
  );

  return {
    ...unit,
    course: unit.courses as unknown as Course | null,
    lessons,
    lessons_count: lessons.length,
  };
}

export async function getUnitsByCourse(
  courseId: string
): Promise<UnitWithRelations[]> {
  const supabase = await createClient();

  const { data: units, error } = await supabase
    .from("units")
    .select(
      `
      *,
      courses!course_id (*),
      lessons (*)
    `
    )
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);

  return (units || []).map((unit) => ({
    ...unit,
    course: unit.courses as unknown as Course | null,
    lessons: (unit.lessons as Lesson[]) || [],
    lessons_count: (unit.lessons as Lesson[])?.length || 0,
  }));
}

export async function getCoursesForSelect(): Promise<
  Pick<Course, "id" | "title">[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("id, title")
    .order("title", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createUnit(
  formData: UnitFormData
): Promise<{ success: boolean; message: string; data?: Unit }> {
  const supabase = await createClient();

  const slug = generateSlug(formData.title);

  const { data, error } = await supabase
    .from("units")
    .insert({
      course_id: formData.course_id,
      title: formData.title,
      title_mn: formData.title_mn,
      description: formData.description,
      slug,
      order_index: formData.order_index,
      unit_content: formData.unit_content,
      quiz_id: formData.quiz_id,
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/units");
  revalidatePath(`/admin/courses/${formData.course_id}`);
  return { success: true, message: "Unit created successfully", data };
}

export async function updateUnit(
  id: string,
  formData: UnitFormData
): Promise<{ success: boolean; message: string; data?: Unit }> {
  const supabase = await createClient();

  const slug = generateSlug(formData.title);

  const { data, error } = await supabase
    .from("units")
    .update({
      course_id: formData.course_id,
      title: formData.title,
      title_mn: formData.title_mn,
      description: formData.description,
      slug,
      order_index: formData.order_index,
      unit_content: formData.unit_content,
      quiz_id: formData.quiz_id,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/units");
  revalidatePath(`/admin/units/${id}`);
  revalidatePath(`/admin/courses/${formData.course_id}`);
  return { success: true, message: "Unit updated successfully", data };
}

export async function deleteUnit(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Get unit to know course_id
  const { data: unit } = await supabase
    .from("units")
    .select("course_id")
    .eq("id", id)
    .single();

  // Check if unit has lessons
  const { count: lessonCount } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("unit_id", id);

  if (lessonCount && lessonCount > 0) {
    return {
      success: false,
      message: `Cannot delete: ${lessonCount} lesson(s) exist in this unit`,
    };
  }

  const { error } = await supabase.from("units").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/units");
  if (unit) {
    revalidatePath(`/admin/courses/${unit.course_id}`);
  }
  return { success: true, message: "Unit deleted successfully" };
}

export async function reorderUnits(
  courseId: string,
  orderedIds: string[]
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Update each unit's order_index
  const updates = orderedIds.map((id, index) =>
    supabase.from("units").update({ order_index: index }).eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath("/admin/units");
  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true, message: "Units reordered successfully" };
}

export async function getUnitContentSuggestions(
  courseId: string
): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("units")
    .select("unit_content")
    .eq("course_id", courseId)
    .not("unit_content", "is", null)
    .order("order_index", { ascending: true });

  if (error) return [];

  const seen = new Set<string>();
  return (data || [])
    .map((u) => u.unit_content)
    .filter((content): content is string => {
      if (content && !seen.has(content)) {
        seen.add(content);
        return true;
      }
      return false;
    });
}

// Types for accordion table view
export type CourseWithUnitSummary = {
  id: string;
  title: string;
  units_count: number;
  lessons_count: number;
  units: Array<{
    id: string;
    order_index: number;
    title: string;
    title_mn: string | null;
    unit_content: string | null;
    lessons_count: number;
  }>;
};

export async function getCoursesWithUnitSummary(): Promise<{
  courses: CourseWithUnitSummary[];
}> {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      units (
        id,
        title,
        title_mn,
        order_index,
        unit_content,
        lessons (id)
      )
    `
    )
    .order("title", { ascending: true });

  if (error) throw new Error(error.message);

  const transformedCourses: CourseWithUnitSummary[] = (courses || []).map(
    (course) => {
      const units = (course.units || []) as Array<{
        id: string;
        title: string;
        title_mn: string | null;
        order_index: number;
        unit_content: string | null;
        lessons: Array<{ id: string }>;
      }>;

      const sortedUnits = [...units].sort(
        (a, b) => a.order_index - b.order_index
      );

      return {
        id: course.id,
        title: course.title,
        units_count: units.length,
        lessons_count: units.reduce(
          (acc, unit) => acc + (unit.lessons?.length || 0),
          0
        ),
        units: sortedUnits.map((unit) => ({
          id: unit.id,
          order_index: unit.order_index,
          title: unit.title,
          title_mn: unit.title_mn,
          unit_content: unit.unit_content,
          lessons_count: unit.lessons?.length || 0,
        })),
      };
    }
  );

  return { courses: transformedCourses };
}
