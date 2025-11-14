import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding";
import { getUserProfile, checkProfileCompletion } from "@/lib/actions";

export default async function OnboardingPage() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If no user, redirect to sign in
  if (error || !user) {
    redirect("/signin");
  }

  // Check if profile is already complete
  const profileCompletionResult = await checkProfileCompletion();
  if (profileCompletionResult.isComplete) {
    // Profile already complete, redirect to dashboard
    redirect("/dashboard");
  }

  // Get user profile data
  const { data: userProfile } = await getUserProfile();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <OnboardingForm
          initialData={{
            fullName: userProfile?.full_name || "",
            email: user.email || "",
            avatarUrl: userProfile?.avatar_url || "",
          }}
        />
      </div>
    </div>
  );
}
