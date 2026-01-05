import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/signin")
  }

  // Get user profile to check if onboarding is already complete
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("full_name, has_completed_onboarding")
    .eq("id", user.id)
    .single()

  // If onboarding already complete, redirect to dashboard
  if (userProfile?.has_completed_onboarding) {
    redirect("/dashboard")
  }

  const userName = userProfile?.full_name || "there"

  return <OnboardingWizard userName={userName} />
}
