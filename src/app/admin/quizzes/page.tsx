import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuizzes } from "@/lib/actions/admin/quizzes";
import { QuizTable } from "@/components/admin/quizzes/QuizTable";

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Тестүүд</h1>
          <p className="text-gray-500 mt-1">Нийт {quizzes.length} тест</p>
        </div>
        <Button asChild>
          <Link href="/admin/quizzes/new">
            <Plus className="h-4 w-4 mr-2" />
            Шинэ тест
          </Link>
        </Button>
      </div>

      <QuizTable quizzes={quizzes} />
    </div>
  );
}
