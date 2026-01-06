import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMockTestAttemptResults } from "@/lib/actions";
import { MockTestResultsPage } from "@/components/mock-test";

type PageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function ResultsPage({ params }: PageProps) {
  // Unwrap params (Next.js 15)
  const { attemptId } = await params;

  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?redirect=/mock-test/results/" + attemptId);
  }

  // Fetch results data
  const result = await getMockTestAttemptResults(attemptId);

  if (!result.success || !result.data) {
    redirect("/mock-test?error=results-not-found");
  }

  const { attempt, test, answers } = result.data;

  return <MockTestResultsPage attempt={attempt} test={test} answers={answers} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { attemptId } = await params;
  const result = await getMockTestAttemptResults(attemptId);

  return {
    title:
      result.success && result.data
        ? `${result.data.test.title} - Үр дүн`
        : "Тестийн үр дүн",
  };
}
