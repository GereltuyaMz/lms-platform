import { notFound } from "next/navigation";
import { getLesson, getUnitsForSelect } from "@/lib/actions/admin/lessons";
import { getQuizzesForSelect } from "@/lib/actions/admin/quizzes";
import { LessonEditor } from "@/components/admin/lessons/LessonEditor";

type LessonDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ unit?: string }>;
};

export default async function LessonDetailPage({
  params,
  searchParams,
}: LessonDetailPageProps) {
  const { id } = await params;
  const { unit: defaultUnitId } = await searchParams;

  // Handle "new" route - use the same unified editor
  if (id === "new") {
    const [units, quizzes] = await Promise.all([
      getUnitsForSelect(),
      getQuizzesForSelect(),
    ]);
    return <LessonEditor units={units} quizzes={quizzes} defaultUnitId={defaultUnitId} />;
  }

  const [lesson, units, quizzes] = await Promise.all([
    getLesson(id),
    getUnitsForSelect(),
    getQuizzesForSelect(),
  ]);

  if (!lesson) {
    notFound();
  }

  return (
    <LessonEditor
      lesson={lesson}
      units={units}
      quizzes={quizzes}
      initialContent={lesson.content_blocks}
    />
  );
}
