import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCourse, getTeachers } from "@/lib/actions/admin/courses";
import { getCategories } from "@/lib/actions/admin/categories";
import { getUnitContentSuggestions } from "@/lib/actions/admin/units";
import { CourseForm } from "@/components/admin/courses/CourseForm";
import { UnitList } from "@/components/admin/units";
import { createClient } from "@/lib/supabase/server";

type CourseDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function getCourseUnits(courseId: string) {
  const supabase = await createClient();

  const { data: units } = await supabase
    .from("units")
    .select(
      `
      *,
      lessons:lessons(count)
    `
    )
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  return units || [];
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;

  // Handle "new" route
  if (id === "new") {
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

  const [course, categories, teachers, units, suggestions] = await Promise.all([
    getCourse(id),
    getCategories(),
    getTeachers(),
    getCourseUnits(id),
    getUnitContentSuggestions(id),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Form - 2 columns */}
        <div className="lg:col-span-2">
          <CourseForm
            course={course}
            categories={categories}
            teachers={teachers}
          />
        </div>

        {/* Units Sidebar - 1 column */}
        <div className="space-y-6">
          <UnitList
            courseId={id}
            initialUnits={units.map((u) => ({
              id: u.id,
              title: u.title,
              title_mn: u.title_mn,
              description: u.description,
              order_index: u.order_index,
              lessons_count: u.lessons?.[0]?.count || 0,
              unit_content: u.unit_content,
            }))}
            suggestions={suggestions}
          />

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Хичээлийн мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Төлөв</span>
                <Badge
                  variant={course.is_published ? "default" : "secondary"}
                  className={
                    course.is_published
                      ? "bg-green-100 text-green-700"
                      : ""
                  }
                >
                  {course.is_published ? "Нийтлэгдсэн" : "Ноорог"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Бүлэг</span>
                <span className="font-medium">{course.units_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Хичээл</span>
                <span className="font-medium">{course.lessons_count}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
