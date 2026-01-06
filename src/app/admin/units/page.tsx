import Link from "next/link";
import { ArrowRight, Layers, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getUnits } from "@/lib/actions/admin/units";

export default async function UnitsPage() {
  const units = await getUnits();

  // Group by course
  const unitsByCourse = units.reduce(
    (acc, unit) => {
      const courseId = unit.course_id;
      if (!acc[courseId]) {
        acc[courseId] = {
          course: unit.course,
          units: [],
        };
      }
      acc[courseId].units.push(unit);
      return acc;
    },
    {} as Record<string, { course: typeof units[0]["course"]; units: typeof units }>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Units</h1>
        <p className="text-gray-500 mt-1">
          Browse all units across courses. Select a course to manage its units.
        </p>
      </div>

      {Object.keys(unitsByCourse).length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No units found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Create units from a course detail page.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(unitsByCourse).map(({ course, units: courseUnits }) => (
            <div
              key={course?.id || "unknown"}
              className="rounded-lg border border-gray-200 bg-white"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {course?.title || "Unknown Course"}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({courseUnits.length} units)
                  </span>
                </div>
                {course && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/courses/${course.id}`}>
                      View Course
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Lessons</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseUnits.map((unit, index) => (
                    <TableRow key={unit.id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-500">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/units/${unit.id}`}
                          className="font-medium text-gray-900 hover:text-primary"
                        >
                          {unit.title_mn || unit.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-gray-600">
                          <FileText className="h-4 w-4" />
                          {unit.lessons_count}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/units/${unit.id}`}>
                            Edit
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
