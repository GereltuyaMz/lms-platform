import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Hero,
  FeatureCards,
  FeaturedCourse,
  GamificationSection,
  CallToAction,
} from "@/components/home";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col gap-20 lg:gap-[120px]">
      <Hero />
      <FeatureCards />
      <FeaturedCourse />
      <GamificationSection />
      <CallToAction />
    </div>
  );
}
