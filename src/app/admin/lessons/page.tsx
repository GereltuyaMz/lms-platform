import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLessons } from "@/lib/actions/admin/lessons";
import { LessonTable } from "@/components/admin/lessons/LessonTable";

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Lessons</h1>
          <p className="text-gray-500 mt-1">
            Manage all lessons ({lessons.length} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/lessons/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Link>
        </Button>
      </div>

      <LessonTable lessons={lessons} />
    </div>
  );
}
