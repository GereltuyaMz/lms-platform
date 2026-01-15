"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type CompleteOnboardingParams = {
  goal: string | null;
  subject: string | null;
};

type CompleteOnboardingResult = {
  success: boolean;
  message: string;
};

export const completeOnboarding = async ({
  goal,
  subject,
}: CompleteOnboardingParams): Promise<CompleteOnboardingResult> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Prepare learning goals array
    const learningGoals: string[] = [];
    if (goal) learningGoals.push(goal);
    if (subject) learningGoals.push(subject);

    // Update user profile with onboarding selections
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        learning_goals: learningGoals.length > 0 ? learningGoals : null,
        has_completed_onboarding: true,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return {
        success: false,
        message: "Failed to save onboarding data",
      };
    }

    // Award XP for completing onboarding (25 XP)
    const { error: xpError } = await supabase.from("xp_transactions").insert({
      user_id: user.id,
      xp_amount: 25,
      xp_type: "onboarding_completion",
      description: "Completed onboarding",
    });

    // if (xpError) {
    //   console.error("Error awarding XP:", xpError);
    //   // Don't fail the whole operation if XP fails
    // }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Onboarding completed successfully",
    };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

export const skipOnboarding = async (): Promise<CompleteOnboardingResult> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Just mark that user has seen onboarding (but didn't complete it)
    // We don't set has_completed_onboarding to true
    // This allows dashboard to show completion prompt

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Onboarding skipped",
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};
