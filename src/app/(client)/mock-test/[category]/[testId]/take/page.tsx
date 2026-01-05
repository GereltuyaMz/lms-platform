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

  // Create or resume attempt
  const attemptResult = await createMockTestAttempt(testId);

  if (!attemptResult.success || !attemptResult.data) {
    redirect("/mock-test/" + testId);
  }

  const { attemptId, endTime } = attemptResult.data;

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
