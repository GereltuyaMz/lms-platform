import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLesson, getUnitsForSelect } from "@/lib/actions/admin/lessons";
import { LessonForm } from "@/components/admin/lessons/LessonForm";
import { LessonTypeIcon } from "@/components/admin/shared/LessonTypeIcon";

type LessonDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LessonDetailPage({
  params,
}: LessonDetailPageProps) {
  const { id } = await params;

  // Handle "new" route
  if (id === "new") {
    const units = await getUnitsForSelect();
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">New Lesson</h1>
          <p className="text-gray-500 mt-1">Create a new lesson</p>
        </div>
        <LessonForm units={units} />
      </div>
    );
  }

  const [lesson, units] = await Promise.all([
    getLesson(id),
    getUnitsForSelect(),
  ]);

  if (!lesson) {
    notFound();
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Not set";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={
              lesson.unit_id
                ? `/admin/units/${lesson.unit_id}`
                : "/admin/lessons"
            }
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Form - 2 columns */}
        <div className="lg:col-span-2">
          <LessonForm lesson={lesson} units={units} />
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Lesson Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <div className="flex items-center gap-2">
                  <LessonTypeIcon type={lesson.lesson_type} />
                  <span className="font-medium capitalize">
                    {lesson.lesson_type}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="font-medium">
                  {formatDuration(lesson.duration_seconds)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Preview</span>
                <Badge variant={lesson.is_preview ? "default" : "secondary"}>
                  {lesson.is_preview ? "Free" : "Locked"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order</span>
                <span className="font-medium">{lesson.order_in_unit}</span>
              </div>
            </CardContent>
          </Card>

          {lesson.lesson_type === "quiz" && (
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Quiz</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/admin/lessons/${id}/quiz`}>
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Edit Quiz
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <span className="font-medium">{lesson.quiz_count}</span>
                </div>
                {lesson.quiz_count === 0 && (
                  <p className="text-sm text-gray-500 mt-3">
                    No questions yet. Click Edit Quiz to add questions.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {lesson.unit && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Course:</span>
                  <p className="font-medium">
                    {lesson.unit.course?.title || "Unknown"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Unit:</span>
                  <p className="font-medium">
                    {lesson.unit.title_mn || lesson.unit.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
