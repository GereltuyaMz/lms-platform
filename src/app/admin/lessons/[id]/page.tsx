import { notFound } from "next/navigation";
import { getLesson, getUnitsForSelect } from "@/lib/actions/admin/lessons";
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
    const units = await getUnitsForSelect();
    return <LessonEditor units={units} defaultUnitId={defaultUnitId} />;
  }

  const [lesson, units] = await Promise.all([
    getLesson(id),
    getUnitsForSelect(),
  ]);

  if (!lesson) {
    notFound();
  }

  return (
    <LessonEditor
      lesson={lesson}
      units={units}
      initialContent={lesson.content_blocks}
    />
  );
}
