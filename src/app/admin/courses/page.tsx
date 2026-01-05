import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/lib/actions/admin/courses";
import { CourseTable } from "@/components/admin/courses/CourseTable";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          <p className="text-gray-500 mt-1">
            Manage your course catalog ({courses.length} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Link>
        </Button>
      </div>

      <CourseTable courses={courses} />
    </div>
  );
}
