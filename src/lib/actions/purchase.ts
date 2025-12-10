"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "./helpers";
import { createEnrollment } from "./enrollment";
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
  paymentMethod: "qpay" | "bank" | "card"
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
    if (!["qpay", "bank", "card"].includes(paymentMethod)) {
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
 * Simulate single course purchase and auto-enroll user
 * Used in the direct enrollment flow (no cart)
 */
export async function simulatePurchase(
  courseId: string,
  paymentMethod: "card" | "bank" | "qpay" = "card"
): Promise<PurchaseResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    // 1. Get course details
    const { data: course } = await supabase
      .from("courses")
      .select("id, title, price")
      .eq("id", courseId)
      .single();

    if (!course) {
      return { success: false, message: "Сургалт олдсонгүй" };
    }

    // 2. Check if already purchased
    const alreadyPurchased = await hasCourseAccess(courseId);
    if (alreadyPurchased) {
      return {
        success: false,
        message: "Та энэ сургалтыг аль хэдийн худалдаж авсан байна",
      };
    }

    // 3. Simulate payment processing (2 second delay)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 4. Create purchase record
    const { error: purchaseError } = await supabase
      .from("course_purchases")
      .insert({
        user_id: user.id,
        course_id: courseId,
        amount_paid: course.price,
        payment_method: paymentMethod,
        status: "completed",
        purchased_at: new Date().toISOString(),
      });

    if (purchaseError) {
      console.error("Purchase creation error:", purchaseError);
      return { success: false, message: "Төлбөр боловсруулахад алдаа гарлаа" };
    }

    // 5. Auto-enroll user
    const enrollmentResult = await createEnrollment(courseId);

    if (!enrollmentResult.success) {
      return {
        success: false,
        message: "Элсэлт үүсгэхэд алдаа гарлаа",
      };
    }

    // 6. Revalidate pages
    revalidateUserPages();

    return {
      success: true,
      message: `Амжилттай! Та одоо ${course.title} сургалтад элссэн байна 🎉`,
    };
  } catch (error) {
    return handleActionError(error) as PurchaseResult;
  }
}

/**
 * Check if user can access course (free OR purchased)
 */
export async function canAccessCourse(courseId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Check if course is free
    const { data: course } = await supabase
      .from("courses")
      .select("price")
      .eq("id", courseId)
      .single();

    if (!course) return false;

    // Free courses are always accessible
    if (course.price === 0) {
      return true;
    }

    // Paid courses require purchase
    return await hasCourseAccess(courseId);
  } catch (error) {
    console.error("Error checking course access:", error);
    return false;
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
