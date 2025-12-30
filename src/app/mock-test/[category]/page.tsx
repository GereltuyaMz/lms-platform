import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Trophy, ChevronLeft } from "lucide-react";
import { getMockTestsByCategory, getBestMockTestAttempt } from "@/lib/actions";

type PageProps = {
  params: Promise<{ category: string }>;
};

const categoryTitles: Record<string, string> = {
  math: "Математик",
  physics: "Физик",
  chemistry: "Хими",
  english: "Англи хэл",
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  // Validate category
  if (!["math", "physics", "chemistry", "english"].includes(category)) {
    redirect("/mock-test");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const testsResult = await getMockTestsByCategory(category);
  const tests = testsResult.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/mock-test"
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Буцах
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {categoryTitles[category]} - ЭЕШ Тестүүд
          </h1>
          <p className="text-gray-600">
            {categoryTitles[category]} хичээлийн жишээ шалгалтууд
          </p>
        </div>

        {/* Test List */}
        <div className="grid gap-6">
          {tests.map(async (test) => {
            let bestAttempt = null;

            if (user) {
              const result = await getBestMockTestAttempt(test.id);
              bestAttempt = result.data;
            }

            return (
              <div
                key={test.id}
                className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Test Info */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {test.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{test.description}</p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{test.total_questions} асуулт</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{test.time_limit_minutes} минут</span>
                        </div>
                      </div>

                      {/* Best Score */}
                      {bestAttempt && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">
                              Таны хамгийн сайн үр дүн:{" "}
                              {bestAttempt.total_score}/100 оноо
                            </span>
                          </div>
                          {bestAttempt.xp_awarded > 0 && (
                            <p className="text-sm text-green-700 mt-1">
                              {bestAttempt.xp_awarded} XP авсан
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      <Link href={`/mock-test/${category}/${test.id}`}>
                        <Button size="lg" className="w-full md:w-auto">
                          {bestAttempt ? "Дахин турших" : "Эхлэх"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {tests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Одоогоор {categoryTitles[category]} тест байхгүй байна
              </p>
              <Link href="/mock-test" className="mt-4 inline-block">
                <Button variant="outline">Буцах</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
