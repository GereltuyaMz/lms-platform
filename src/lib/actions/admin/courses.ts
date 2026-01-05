"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Course, Category, Teacher } from "@/types/database/tables";

export type CourseWithRelations = Course & {
  categories: Category[];
  teacher: Teacher | null;
  units_count: number;
  lessons_count: number;
};

export type CourseFormData = {
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  original_price: number | null;
  instructor_id: string | null;
  category_ids: string[];
  is_published: boolean;
};

export async function getCourses(): Promise<CourseWithRelations[]> {
  const supabase = await createClient();

  // Get courses with teacher
  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      teachers!instructor_id (*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Get course categories
  const { data: courseCategories } = await supabase
    .from("course_categories")
    .select("course_id, category_id, categories (*)");

  // Get unit counts
  const { data: units } = await supabase
    .from("units")
    .select("course_id");

  // Get lesson counts
  const { data: lessons } = await supabase
    .from("lessons")
    .select("course_id");

  // Map data
  return (courses || []).map((course) => {
    const categories = (courseCategories || [])
      .filter((cc) => cc.course_id === course.id)
      .map((cc) => cc.categories as unknown as Category)
      .filter(Boolean);

    const unitsCount = (units || []).filter(
      (u) => u.course_id === course.id
    ).length;

    const lessonsCount = (lessons || []).filter(
      (l) => l.course_id === course.id
    ).length;

    return {
      ...course,
      categories,
      teacher: course.teachers as unknown as Teacher | null,
      units_count: unitsCount,
      lessons_count: lessonsCount,
    };
  });
}

export async function getCourse(
  id: string
): Promise<CourseWithRelations | null> {
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      teachers!instructor_id (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) return null;

  // Get categories for this course
  const { data: courseCategories } = await supabase
    .from("course_categories")
    .select("category_id, categories (*)")
    .eq("course_id", id);

  // Get counts
  const [unitsResult, lessonsResult] = await Promise.all([
    supabase
      .from("units")
      .select("id", { count: "exact" })
      .eq("course_id", id),
    supabase
      .from("lessons")
      .select("id", { count: "exact" })
      .eq("course_id", id),
  ]);

  const categories = (courseCategories || [])
    .map((cc) => cc.categories as unknown as Category)
    .filter(Boolean);

  return {
    ...course,
    categories,
    teacher: course.teachers as unknown as Teacher | null,
    units_count: unitsResult.count || 0,
    lessons_count: lessonsResult.count || 0,
  };
}

export async function getTeachers(): Promise<Teacher[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("is_active", true)
    .order("full_name_mn", { ascending: true });

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

export async function createCourse(
  formData: CourseFormData
): Promise<{ success: boolean; message: string; data?: Course }> {
  const supabase = await createClient();

  const slug = generateSlug(formData.title);

  // Create course (draft by default)
  const { data: course, error } = await supabase
    .from("courses")
    .insert({
      title: formData.title,
      slug,
      description: formData.description,
      thumbnail_url: formData.thumbnail_url,
      level: formData.level,
      price: formData.price,
      original_price: formData.original_price,
      instructor_id: formData.instructor_id,
      is_published: false, // Draft by default
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  // Add category associations
  if (formData.category_ids.length > 0) {
    const categoryInserts = formData.category_ids.map((categoryId) => ({
      course_id: course.id,
      category_id: categoryId,
    }));

    await supabase.from("course_categories").insert(categoryInserts);
  }

  revalidatePath("/admin/courses");
  return { success: true, message: "Course created successfully", data: course };
}

export async function updateCourse(
  id: string,
  formData: CourseFormData
): Promise<{ success: boolean; message: string; data?: Course }> {
  const supabase = await createClient();

  const slug = generateSlug(formData.title);

  const { data: course, error } = await supabase
    .from("courses")
    .update({
      title: formData.title,
      slug,
      description: formData.description,
      thumbnail_url: formData.thumbnail_url,
      level: formData.level,
      price: formData.price,
      original_price: formData.original_price,
      instructor_id: formData.instructor_id,
      is_published: formData.is_published,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  // Update category associations
  await supabase.from("course_categories").delete().eq("course_id", id);

  if (formData.category_ids.length > 0) {
    const categoryInserts = formData.category_ids.map((categoryId) => ({
      course_id: id,
      category_id: categoryId,
    }));

    await supabase.from("course_categories").insert(categoryInserts);
  }

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
  return { success: true, message: "Course updated successfully", data: course };
}

export async function toggleCoursePublish(
  id: string
): Promise<{ success: boolean; message: string; isPublished?: boolean }> {
  const supabase = await createClient();

  // Get current status
  const { data: course } = await supabase
    .from("courses")
    .select("is_published")
    .eq("id", id)
    .single();

  if (!course) {
    return { success: false, message: "Course not found" };
  }

  const newStatus = !course.is_published;

  const { error } = await supabase
    .from("courses")
    .update({ is_published: newStatus })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);

  return {
    success: true,
    message: newStatus ? "Course published" : "Course unpublished",
    isPublished: newStatus,
  };
}

export async function deleteCourse(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Check for enrollments
  const { count: enrollmentCount } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("course_id", id);

  if (enrollmentCount && enrollmentCount > 0) {
    return {
      success: false,
      message: `Cannot delete: ${enrollmentCount} student(s) enrolled`,
    };
  }

  // Delete category associations first
  await supabase.from("course_categories").delete().eq("course_id", id);

  // Delete course
  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/courses");
  return { success: true, message: "Course deleted successfully" };
}
