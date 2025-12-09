"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "./helpers";
import type { CoursePurchase, Course } from "@/types/database/tables";

type PurchaseResult = {
  success: boolean;
  message: string;
  purchases?: Array<{
    purchase_id: string;
    course_id: string;
    amount_paid: number;
    status: string;
  }>;
};

export type PurchaseWithCourse = CoursePurchase & {
  course: Course;
};

/**
 * Simulate course purchase (no actual payment processing)
 * Creates purchase records and enrollments for courses in cart
 */
export async function processPurchase(
  courseIds: string[],
  paymentMethod: "qpay" | "social_pay" | "card"
): Promise<PurchaseResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    if (courseIds.length === 0) {
      return { success: false, message: "Худалдан авах хичээл сонгоогүй байна" };
    }

    // Validate payment method
    if (!["qpay", "social_pay", "card"].includes(paymentMethod)) {
      return { success: false, message: "Буруу төлбөрийн арга" };
    }

    // Call database function to simulate purchase
    const { data: purchases, error: purchaseError } = await supabase.rpc(
      "simulate_purchase",
      {
        p_user_id: user.id,
        p_course_ids: courseIds,
        p_payment_method: paymentMethod,
      }
    );

    if (purchaseError) {
      console.error("Purchase error:", purchaseError);
      return { success: false, message: "Худалдан авалтад алдаа гарлаа" };
    }

    // Clear cart after successful purchase
    const { clearCart } = await import("./cart");
    await clearCart();

    revalidateUserPages();

    return {
      success: true,
      message: `${courseIds.length} хичээл амжилттай худалдан авлаа`,
      purchases: purchases || [],
    };
  } catch (error) {
    return handleActionError(error) as PurchaseResult;
  }
}

/**
 * Check if user has purchased (and thus has access to) a course
 */
export async function hasCourseAccess(courseId: string): Promise<boolean> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return false;
    }

    // Check if user has completed purchase
    const { data: purchase } = await supabase
      .from("course_purchases")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("status", "completed")
      .single();

    if (purchase) {
      return true;
    }

    // Also check enrollment (in case they were manually enrolled)
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    return !!enrollment;
  } catch (error) {
    return false;
  }
}

/**
 * Get user's purchase history
 */
export async function getPurchaseHistory(): Promise<PurchaseWithCourse[]> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return [];
    }

    const { data: purchases } = await supabase
      .from("course_purchases")
      .select(`
        id,
        user_id,
        course_id,
        amount_paid,
        payment_method,
        status,
        transaction_id,
        purchased_at,
        created_at,
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
      .order("purchased_at", { ascending: false });

    if (!purchases) {
      return [];
    }

    // Filter out purchases where course is null (deleted courses) and flatten single course object
    return purchases
      .filter((p) => p.course !== null)
      .map((p) => ({
        ...p,
        course: Array.isArray(p.course) ? p.course[0] : p.course,
      }))
      .filter((p) => p.course !== null) as PurchaseWithCourse[];
  } catch {
    return [];
  }
}

/**
 * Get total amount spent by user
 */
export async function getTotalSpent(): Promise<number> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return 0;
    }

    const { data: purchases } = await supabase
      .from("course_purchases")
      .select("amount_paid")
      .eq("user_id", user.id)
      .eq("status", "completed");

    if (!purchases) {
      return 0;
    }

    return purchases.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  } catch (error) {
    console.error("Error calculating total spent:", error);
    return 0;
  }
}

/**
 * Get purchase details for a specific course
 */
export async function getCoursePurchase(
  courseId: string
): Promise<PurchaseWithCourse | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return null;
    }

    const { data: purchase } = await supabase
      .from("course_purchases")
      .select(`
        id,
        user_id,
        course_id,
        amount_paid,
        payment_method,
        status,
        transaction_id,
        purchased_at,
        created_at,
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
      .eq("course_id", courseId)
      .single();

    if (!purchase || !purchase.course) {
      return null;
    }

    // Flatten course if it's an array
    const flattenedPurchase = {
      ...purchase,
      course: Array.isArray(purchase.course)
        ? purchase.course[0]
        : purchase.course,
    };

    if (!flattenedPurchase.course) {
      return null;
    }

    return flattenedPurchase as PurchaseWithCourse;
  } catch (error) {
    console.error("Error fetching course purchase:", error);
    return null;
  }
}

/**
 * Get count of completed purchases
 */
export async function getPurchaseCount(): Promise<number> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return 0;
    }

    const { count } = await supabase
      .from("course_purchases")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed");

    return count || 0;
  } catch (error) {
    console.error("Error fetching purchase count:", error);
    return 0;
  }
}

/**
 * Refund a purchase (admin function - simulation only)
 */
export async function refundPurchase(purchaseId: string): Promise<PurchaseResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    // Update purchase status to refunded
    const { error: updateError } = await supabase
      .from("course_purchases")
      .update({ status: "refunded" })
      .eq("id", purchaseId)
      .eq("user_id", user.id);

    if (updateError) {
      return { success: false, message: "Буцаалтад алдаа гарлаа" };
    }

    // Note: In a real system, we would also:
    // 1. Process actual refund through payment gateway
    // 2. Optionally remove enrollment
    // 3. Send email notification

    revalidateUserPages();

    return { success: true, message: "Худалдан авалт буцаагдлаа" };
  } catch (error) {
    return handleActionError(error) as PurchaseResult;
  }
}
