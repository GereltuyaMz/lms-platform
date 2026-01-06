import { getUnitsForSelect } from "@/lib/actions/admin/lessons";
import { LessonForm } from "@/components/admin/lessons/LessonForm";

type NewLessonPageProps = {
  searchParams: Promise<{ unit?: string }>;
};

export default async function NewLessonPage({
  searchParams,
}: NewLessonPageProps) {
  const { unit: unitId } = await searchParams;
  const units = await getUnitsForSelect();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Lesson</h1>
        <p className="text-gray-500 mt-1">Create a new lesson for a unit</p>
      </div>

      <LessonForm units={units} defaultUnitId={unitId} />
    </div>
  );
}
