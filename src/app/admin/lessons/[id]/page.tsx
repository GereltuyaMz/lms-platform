import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLesson, getUnitsForSelect } from "@/lib/actions/admin/lessons";
import { LessonForm } from "@/components/admin/lessons/LessonForm";

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
          <h1 className="text-2xl font-semibold text-gray-900">Шинэ хичээл</h1>
          <p className="text-gray-500 mt-1">Шинэ хичээл үүсгэх</p>
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

  const getTotalDuration = () => {
    const totalSeconds = lesson.content_blocks.reduce(
      (acc, block) => acc + (block.duration_seconds || 0),
      0
    );
    if (!totalSeconds) return "Тодорхойгүй";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
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
            Буцах
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
              <CardTitle className="text-lg">Хичээлийн мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Контент</span>
                <div className="flex items-center gap-2">
                  {lesson.content_blocks.length > 0 ? (
                    <>
                      <Video className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {lesson.content_blocks.length} блок
                      </span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Хоосон</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Үргэлжлэх хугацаа</span>
                <span className="font-medium">{getTotalDuration()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Эрэмбэ</span>
                <span className="font-medium">{lesson.order_in_unit ?? 0}</span>
              </div>
              {lesson.quiz_count > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Асуултууд</span>
                  <Badge variant="secondary">{lesson.quiz_count} асуулт</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {lesson.unit && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Байршил</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Хичээл:</span>
                  <p className="font-medium">
                    {lesson.unit.course?.title || "Тодорхойгүй"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Бүлэг:</span>
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
