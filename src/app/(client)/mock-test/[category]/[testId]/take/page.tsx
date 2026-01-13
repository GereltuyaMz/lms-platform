import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MockTestPlayer } from "@/components/mock-test/MockTestPlayer";
import {
  getMockTestData,
  createMockTestAttempt,
  getSavedAnswers,
} from "@/lib/actions";

type PageProps = {
  params: Promise<{ testId: string }>;
};

export default async function MockTestTakePage({ params }: PageProps) {
  const { testId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?redirect=/mock-test/" + testId + "/take");
  }

  // Check if user has a recently completed attempt (within last 30 seconds)
  // This prevents creating a new attempt when the page is re-rendered after submission
  const { data: recentlyCompleted } = await supabase
    .from("mock_test_attempts")
    .select("id")
    .eq("user_id", user.id)
    .eq("mock_test_id", testId)
    .eq("is_completed", true)
    .gte("completed_at", new Date(Date.now() - 30000).toISOString())
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (recentlyCompleted) {
    redirect(`/mock-test/results/${recentlyCompleted.id}`);
  }

  // Fetch test data
  const testResult = await getMockTestData(testId);

  if (!testResult.success || !testResult.data) {
    redirect("/mock-test");
  }

  const testData = testResult.data;

  // Create or resume attempt
  const attemptResult = await createMockTestAttempt(testId);

  if (!attemptResult.success || !attemptResult.data) {
    redirect("/mock-test/" + testId);
  }

  const { attemptId, endTime } = attemptResult.data;

  // Check if attempt already expired (defense-in-depth)
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();

  if (end <= now) {
    // Attempt expired, redirect to results page with expired flag
    redirect(`/mock-test/results/${attemptId}?expired=true`);
  }

  // Get saved answers
  const answersResult = await getSavedAnswers(attemptId);
  const savedAnswers = answersResult.data || {};

  return (
    <MockTestPlayer
      testData={testData}
      attemptId={attemptId}
      endTime={endTime}
      savedAnswers={savedAnswers}
    />
  );
}
