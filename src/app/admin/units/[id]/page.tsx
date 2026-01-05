import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUnit, getCoursesForSelect } from "@/lib/actions/admin/units";
import { UnitForm } from "@/components/admin/units/UnitForm";
import { LessonTypeIcon } from "@/components/admin/shared/LessonTypeIcon";

type UnitDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { id } = await params;
  // Handle "new" route
  if (id === "new") {
    const courses = await getCoursesForSelect();
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">New Unit</h1>
          <p className="text-gray-500 mt-1">Create a new unit for a course</p>
        </div>
        <UnitForm courses={courses} />
      </div>
    );
  }

  const [unit, courses] = await Promise.all([
    getUnit(id),
    getCoursesForSelect(),
  ]);

  if (!unit) {
    notFound();
  }

  // Sort lessons by order_in_unit
  const sortedLessons = [...unit.lessons].sort(
    (a, b) => (a.order_in_unit || 0) - (b.order_in_unit || 0)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/courses/${unit.course_id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unit Form - 2 columns */}
        <div className="lg:col-span-2">
          <UnitForm unit={unit} courses={courses} />
        </div>

        {/* Lessons Sidebar - 1 column */}
        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Lessons</CardTitle>
              <Button size="sm" asChild>
                <Link href={`/admin/lessons/new?unit=${id}`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {sortedLessons.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No lessons yet. Add your first lesson.
                </p>
              ) : (
                <div className="space-y-2">
                  {sortedLessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/admin/lessons/${lesson.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <LessonTypeIcon type={lesson.lesson_type} />
                            <span className="capitalize">
                              {lesson.lesson_type}
                            </span>
                          </div>
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
              <CardTitle className="text-lg">Unit Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Course</span>
                <span className="font-medium text-sm">
                  {unit.course?.title || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lessons</span>
                <span className="font-medium">{unit.lessons_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order</span>
                <span className="font-medium">{unit.order_index}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
