import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLesson } from "@/lib/actions/admin/lessons";
import { getQuizQuestions } from "@/lib/actions/admin/quiz";
import { QuizBuilder } from "@/components/admin/quiz/QuizBuilder";

type QuizBuilderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizBuilderPage({
  params,
}: QuizBuilderPageProps) {
  const { id: lessonId } = await params;

  const [lesson, questions] = await Promise.all([
    getLesson(lessonId),
    getQuizQuestions(lessonId),
  ]);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/lessons/${lessonId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Буцах
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Асуулт бүтээгч
            </h1>
            <p className="text-gray-500 mt-1">{lesson.title}</p>
          </div>
        </div>
      </div>

      <QuizBuilder lessonId={lessonId} initialQuestions={questions} />
    </div>
  );
}
