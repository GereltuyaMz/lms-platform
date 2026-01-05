"use server";

import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "./helpers";
import type { Course } from "@/types/database/tables";

type CartResult = {
  success: boolean;
  message: string;
};

export type CartItem = {
  id: string;
  course_id: string;
  added_at: string;
  course: Course;
};

export type CartSummary = {
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
};

/**
 * Add a course to the shopping cart
 */
export async function addToCart(courseId: string): Promise<CartResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    // Check if course exists
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, price")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      return { success: false, message: "Хичээл олдсонгүй" };
    }

    // Check if user already owns this course
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (existingEnrollment) {
      return { success: false, message: "Та энэ хичээлд бүртгэлтэй байна" };
    }

    // Check if already in cart
    const { data: existingCartItem } = await supabase
      .from("shopping_cart")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (existingCartItem) {
      return { success: false, message: "Сагсанд аль хэдийн нэмэгдсэн байна" };
    }

    // Add to cart
    const { error: insertError } = await supabase
      .from("shopping_cart")
      .insert({
        user_id: user.id,
        course_id: courseId,
      });

    if (insertError) {
      return { success: false, message: "Сагсанд нэмэхэд алдаа гарлаа" };
    }

    revalidateUserPages();

    return { success: true, message: "Сагсанд амжилттай нэмэгдлээ" };
  } catch (error) {
    return handleActionError(error) as CartResult;
  }
}

/**
 * Remove a course from the shopping cart
 */
export async function removeFromCart(courseId: string): Promise<CartResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    const { error: deleteError } = await supabase
      .from("shopping_cart")
      .delete()
      .eq("user_id", user.id)
      .eq("course_id", courseId);

    if (deleteError) {
      return { success: false, message: "Сагснаас хасахад алдаа гарлаа" };
    }

    revalidateUserPages();

    return { success: true, message: "Сагснаас хасагдлаа" };
  } catch (error) {
    return handleActionError(error) as CartResult;
  }
}

/**
 * Clear all items from the shopping cart
 */
export async function clearCart(): Promise<CartResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    const { error: deleteError } = await supabase
      .from("shopping_cart")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      return { success: false, message: "Сагс хоослохд алдаа гарлаа" };
    }

    revalidateUserPages();

    return { success: true, message: "Сагс хоослогдлоо" };
  } catch (error) {
    return handleActionError(error) as CartResult;
  }
}

/**
 * Get all items in the user's shopping cart
 */
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return [];
    }

    const { data: cartItems } = await supabase
      .from("shopping_cart")
      .select(`
        id,
        course_id,
        added_at,
        course:courses!course_id (
          id,
          title,
          slug,
          description,
          thumbnail_url,
          level,
          price,
          original_price,
          duration_hours,
          is_published,
          created_at,
          updated_at
        )
      `)
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (!cartItems) {
      return [];
    }

    // Filter out items where course is null (deleted courses) and flatten single course object
    return cartItems
      .filter((item) => item.course !== null)
      .map((item) => ({
        ...item,
        course: Array.isArray(item.course) ? item.course[0] : item.course,
      }))
      .filter((item) => item.course !== null) as CartItem[];
  } catch {
    return [];
  }
}

/**
 * Get cart summary with total price and item count
 */
export async function getCartSummary(): Promise<CartSummary> {
  try {
    const items = await getCartItems();

    const totalPrice = items.reduce((sum, item) => {
      return sum + (item.course.price || 0);
    }, 0);

    return {
      items,
      totalPrice,
      itemCount: items.length,
    };
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    return {
      items: [],
      totalPrice: 0,
      itemCount: 0,
    };
  }
}

/**
 * Get cart item count for a user
 */
export async function getCartItemCount(): Promise<number> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return 0;
    }

    const { count } = await supabase
      .from("shopping_cart")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return count || 0;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return 0;
  }
}

/**
 * Check if a course is in the user's cart
 */
export async function isInCart(courseId: string): Promise<boolean> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return false;
    }

    const { data } = await supabase
      .from("shopping_cart")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    return !!data;
  } catch {
    return false;
  }
}
