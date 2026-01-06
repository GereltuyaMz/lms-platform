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
        <h1 className="text-2xl font-semibold text-gray-900">Шинэ хичээл</h1>
        <p className="text-gray-500 mt-1">
          Шинэ хичээл үүсгэнэ. Ноорог хэлбэрээр хадгалагдана.
        </p>
      </div>

      <CourseForm categories={categories} teachers={teachers} />
    </div>
  );
}
