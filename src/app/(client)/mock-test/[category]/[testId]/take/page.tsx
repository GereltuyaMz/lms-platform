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

  // Fetch test data
  const testResult = await getMockTestData(testId);

  if (!testResult.success || !testResult.data) {
    redirect("/mock-test");
  }

  const testData = testResult.data;

  // Check if user has a recent completed attempt (防止 double attempt creation)
  // If there's a completed attempt in the last 2 minutes, redirect to results
  const { data: recentCompletedAttempt } = await supabase
    .from("mock_test_attempts")
    .select("id, completed_at")
    .eq("user_id", user.id)
    .eq("mock_test_id", testId)
    .eq("is_completed", true)
    .gte("completed_at", new Date(Date.now() - 2 * 60 * 1000).toISOString())
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (recentCompletedAttempt) {
    // User just completed this test, redirect to results
    redirect(`/mock-test/results/${recentCompletedAttempt.id}`);
  }

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
