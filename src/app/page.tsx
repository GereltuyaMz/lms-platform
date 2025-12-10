import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Hero,
  WhyChooseUs,
  PersonalizedLearning,
  Motivated,
  Feature,
  LearnAnytime,
} from "@/components/home";

export default async function Page() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // Otherwise, show landing page for non-authenticated users
  return (
    <div className="min-h-screen">
      <Hero />
      <WhyChooseUs />
      <PersonalizedLearning />
      <Motivated />
      <Feature />
      <LearnAnytime />
    </div>
  );
}
