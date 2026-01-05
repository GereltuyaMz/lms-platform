"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Category } from "@/types/database/tables";

export type CategoryFormData = {
  name: string;
  name_mn: string | null;
  description: string | null;
  category_type: "exam" | "subject";
  parent_id: string | null;
  icon: string | null;
  order_index: number;
};

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCategoriesWithHierarchy(): Promise<Category[]> {
  const supabase = await createClient();

  // Get all categories sorted by hierarchy
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("parent_id", { ascending: true, nullsFirst: true })
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCategory(id: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getParentCategories(): Promise<Category[]> {
  const supabase = await createClient();

  // Get only exam-type categories (can be parents)
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("category_type", "exam")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCategory(
  formData: CategoryFormData
): Promise<{ success: boolean; message: string; data?: Category }> {
  const supabase = await createClient();

  const slug = generateSlug(formData.name);

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: formData.name,
      name_mn: formData.name_mn,
      slug,
      description: formData.description,
      category_type: formData.category_type,
      parent_id: formData.parent_id,
      icon: formData.icon,
      order_index: formData.order_index,
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true, message: "Category created successfully", data };
}

export async function updateCategory(
  id: string,
  formData: CategoryFormData
): Promise<{ success: boolean; message: string; data?: Category }> {
  const supabase = await createClient();

  const slug = generateSlug(formData.name);

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: formData.name,
      name_mn: formData.name_mn,
      slug,
      description: formData.description,
      category_type: formData.category_type,
      parent_id: formData.parent_id,
      icon: formData.icon,
      order_index: formData.order_index,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true, message: "Category updated successfully", data };
}

export async function deleteCategory(
  id: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Check if category has courses
  const { count: courseCount } = await supabase
    .from("course_categories")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (courseCount && courseCount > 0) {
    return {
      success: false,
      message: `Cannot delete: ${courseCount} course(s) are using this category`,
    };
  }

  // Check if category has children
  const { count: childCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", id);

  if (childCount && childCount > 0) {
    return {
      success: false,
      message: `Cannot delete: ${childCount} child category(s) exist`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true, message: "Category deleted successfully" };
}
