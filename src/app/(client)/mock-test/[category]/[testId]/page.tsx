import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMockTestData, getBestMockTestAttempt } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  TestInfoCard,
  BestScoreCard,
  IncompleteAttemptWarning,
  TestInstructions,
  RecentCompletionProtection,
} from "@/components/mock-test";

// Disable caching to ensure fresh incomplete attempt check
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ category: string; testId: string }>;
};

export default async function MockTestOverviewPage({ params }: PageProps) {
  const { category, testId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signin?redirect=/mock-test/${category}/${testId}`);
  }

  const testResult = await getMockTestData(testId);

  if (!testResult.success || !testResult.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Тест олдсонгүй</h2>
          <p className="text-gray-600 mb-4">{testResult.message}</p>
          <Link href="/mock-test">
            <Button variant="landing">Буцах</Button>
          </Link>
        </div>
      </div>
    );
  }

  const test = testResult.data;

  const bestAttemptResult = await getBestMockTestAttempt(testId);
  const bestAttempt = bestAttemptResult.data || null;

  const { data: incompleteAttempt } = await supabase
    .from("mock_test_attempts")
    .select("id, end_time")
    .eq("user_id", user.id)
    .eq("mock_test_id", testId)
    .eq("is_completed", false)
    .gt("end_time", new Date().toISOString())
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  // Check for recently completed attempt (within 30 seconds)
  const { data: recentlyCompleted } = await supabase
    .from("mock_test_attempts")
    .select("id, completed_at")
    .eq("user_id", user.id)
    .eq("mock_test_id", testId)
    .eq("is_completed", true)
    .gte("completed_at", new Date(Date.now() - 30000).toISOString())
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  // Calculate protection remaining time (30 seconds from completion)
  const protectionRemainingSeconds = recentlyCompleted?.completed_at
    ? Math.max(
        0,
        Math.ceil(
          30 -
            (Date.now() - new Date(recentlyCompleted.completed_at).getTime()) /
              1000
        )
      )
    : 0;

  // Calculate remaining time from end_time
  const timeRemainingSeconds = incompleteAttempt?.end_time
    ? Math.max(
        0,
        Math.floor(
          (new Date(incompleteAttempt.end_time).getTime() - Date.now()) / 1000
        )
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href={`/mock-test/${category}`}
            className="text-primary hover:underline mb-2 inline-block"
          >
            ← Буцах
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {test.title}
          </h1>
          <p className="text-gray-600">{test.description}</p>
        </div>

        <TestInfoCard test={test} />

        {test.sections.length > 1 && (
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Хэсэг бүрээр
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {test.sections.map((section) => {
                const questionCount = section.problems.reduce(
                  (sum, p) => sum + p.questions.length,
                  0
                );

                return (
                  <div key={section.id} className="p-4 border rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {questionCount} асуулт
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <BestScoreCard bestAttempt={bestAttempt} />

        {incompleteAttempt && timeRemainingSeconds > 0 && (
          <IncompleteAttemptWarning
            timeRemainingSeconds={timeRemainingSeconds}
          />
        )}

        {protectionRemainingSeconds > 0 && (
          <RecentCompletionProtection
            remainingSeconds={protectionRemainingSeconds}
            attemptId={recentlyCompleted!.id}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {protectionRemainingSeconds > 0 ? (
            <Button variant="landing" size="lg" className="flex-1" disabled>
              Хүлээнэ үү
            </Button>
          ) : (
            <Link
              href={`/mock-test/${category}/${testId}/take`}
              className="flex-1"
            >
              <Button variant="landing" size="lg" className="w-full">
                {incompleteAttempt ? "Үргэлжлүүлэх" : "Тест эхлүүлэх"}
              </Button>
            </Link>
          )}
          <Link href={`/mock-test/${category}`}>
            <Button
              variant="landingOutline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Буцах
            </Button>
          </Link>
        </div>

        <TestInstructions
          timeLimit={test.time_limit_minutes}
          passingScore={60}
        />
      </div>
    </div>
  );
}
