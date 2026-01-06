import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCourse, getTeachers } from "@/lib/actions/admin/courses";
import { getCategories } from "@/lib/actions/admin/categories";
import { CourseForm } from "@/components/admin/courses/CourseForm";
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
          <h1 className="text-2xl font-semibold text-gray-900">New Course</h1>
          <p className="text-gray-500 mt-1">
            Create a new course. It will be saved as draft.
          </p>
        </div>
        <CourseForm categories={categories} teachers={teachers} />
      </div>
    );
  }

  const [course, categories, teachers, units] = await Promise.all([
    getCourse(id),
    getCategories(),
    getTeachers(),
    getCourseUnits(id),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

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
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Units</CardTitle>
              <Button size="sm" asChild>
                <Link href={`/admin/units/new?course=${id}`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {units.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No units yet. Add your first unit.
                </p>
              ) : (
                <div className="space-y-2">
                  {units.map((unit, index) => (
                    <Link
                      key={unit.id}
                      href={`/admin/units/${unit.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {unit.title_mn || unit.title}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {unit.lessons?.[0]?.count || 0} lessons
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge
                  variant={course.is_published ? "default" : "secondary"}
                  className={
                    course.is_published
                      ? "bg-green-100 text-green-700"
                      : ""
                  }
                >
                  {course.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Units</span>
                <span className="font-medium">{course.units_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lessons</span>
                <span className="font-medium">{course.lessons_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Level</span>
                <span className="font-medium">{course.level}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
