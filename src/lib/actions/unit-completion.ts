"use server";

import { revalidatePath } from "next/cache";
import {
  getAuthenticatedUser,
  revalidateUserPages,
} from "./helpers";
import { insertXPTransaction, getUnitTitle } from "./xp-helpers";

type ClaimResult = {
  success: boolean;
  xpAwarded?: number;
  message: string;
};

/**
 * Claim unit completion XP reward
 * Called when user clicks the gift icon on a completed unit
 *
 * @param unitId - UUID of the unit
 * @param courseId - UUID of the course
 * @returns Result with XP awarded
 */
export async function claimUnitCompletionXP(
  unitId: string,
  courseId: string
): Promise<ClaimResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return {
        success: false,
        message: "Нэвтэрсэн байх шаардлагатай",
      };
    }

    // Get enrollment with units_completed
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id, units_completed")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return {
        success: false,
        message: "Энэ курсэд бүртгэлгүй байна",
      };
    }

    // Check if already claimed (idempotency)
    const unitsCompleted = (enrollment.units_completed as string[]) || [];
    if (unitsCompleted.includes(unitId)) {
      return {
        success: false,
        message: "Энэ unit-ийн XP аль хэдийн авсан байна",
      };
    }

    // Verify unit is actually complete using RPC
    const { data: isComplete, error: rpcError } = await supabase.rpc(
      "is_unit_complete",
      {
        p_enrollment_id: enrollment.id,
        p_unit_id: unitId,
      }
    );

    if (rpcError) {
      console.error("Error checking unit completion:", rpcError);
      return {
        success: false,
        message: "Алдаа гарлаа",
      };
    }

    if (!isComplete) {
      return {
        success: false,
        message: "Unit дуусаагүй байна",
      };
    }

    // Get unit title for XP description
    const unitTitle = await getUnitTitle(unitId);

    // Award 50 XP
    const xpSuccess = await insertXPTransaction(
      user.id,
      50,
      "unit_complete",
      unitId,
      `Completed unit "${unitTitle}"`,
      { unit_id: unitId, course_id: courseId }
    );

    if (!xpSuccess) {
      return {
        success: false,
        message: "XP олгоход алдаа гарлаа",
      };
    }

    // Mark unit as claimed in enrollment
    const { error: updateError } = await supabase
      .from("enrollments")
      .update({
        units_completed: [...unitsCompleted, unitId],
      })
      .eq("id", enrollment.id);

    if (updateError) {
      console.error("Error updating enrollment:", updateError);
      // XP was already awarded, so still return success
    }

    // Revalidate pages
    revalidateUserPages();

    const { data: courseData } = await supabase
      .from("courses")
      .select("slug")
      .eq("id", courseId)
      .single();

    if (courseData?.slug) {
      revalidatePath(`/courses/${courseData.slug}`, "page");
    }

    return {
      success: true,
      xpAwarded: 50,
      message: `+50 XP - "${unitTitle}" дууслаа!`,
    };
  } catch (error) {
    console.error("Error claiming unit XP:", error);
    return {
      success: false,
      message: "Алдаа гарлаа",
    };
  }
}
