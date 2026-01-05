import { getCategories } from "@/lib/actions/admin/categories";
import { getTeachers } from "@/lib/actions/admin/courses";
import { CourseForm } from "@/components/admin/courses/CourseForm";

export default async function NewCoursePage() {
  const [categories, teachers] = await Promise.all([
    getCategories(),
    getTeachers(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Course</h1>
        <p className="text-gray-500 mt-1">
          Create a new course. It will be saved as draft.
        </p>
      </div>

      <CourseForm categories={categories} teachers={teachers} />
    </div>
  );
}
