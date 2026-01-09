import { getCoursesForSelect } from "@/lib/actions/admin/units";
import { getQuizzesForSelect } from "@/lib/actions/admin/quizzes";
import { UnitForm } from "@/components/admin/units/UnitForm";

type NewUnitPageProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function NewUnitPage({ searchParams }: NewUnitPageProps) {
  const { course: courseId } = await searchParams;
  const [courses, quizzes] = await Promise.all([
    getCoursesForSelect(),
    getQuizzesForSelect(),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Шинэ бүлэг</h1>
        <p className="text-gray-500 mt-1">Хичээлд шинэ бүлэг үүсгэх</p>
      </div>

      <UnitForm courses={courses} quizzes={quizzes} defaultCourseId={courseId} />
    </div>
  );
}
