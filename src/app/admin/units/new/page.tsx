import { getCoursesForSelect } from "@/lib/actions/admin/units";
import { UnitForm } from "@/components/admin/units/UnitForm";

type NewUnitPageProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function NewUnitPage({ searchParams }: NewUnitPageProps) {
  const { course: courseId } = await searchParams;
  const courses = await getCoursesForSelect();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Unit</h1>
        <p className="text-gray-500 mt-1">Create a new unit for a course</p>
      </div>

      <UnitForm courses={courses} defaultCourseId={courseId} />
    </div>
  );
}
