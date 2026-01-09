import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/actions/admin/quizzes";
import { QuizEditor } from "@/components/admin/quizzes/QuizEditor";

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  // Handle "new" route
  if (id === "new") {
    return <QuizEditor />;
  }

  const quiz = await getQuiz(id);

  if (!quiz) {
    notFound();
  }

  return <QuizEditor quiz={quiz} />;
}
