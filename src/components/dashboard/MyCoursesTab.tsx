import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

type EnrollmentWithCourse = {
  id: string;
  enrolled_at: string;
  progress_percentage: number;
  completed_at: string | null;
  lastLessonId: string | null;
  courses: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    level: string;
  } | null;
};

type MyCoursesTabProps = {
  enrollments: EnrollmentWithCourse[];
};

export const MyCoursesTab = ({ enrollments }: MyCoursesTabProps) => {
  // Helper to format enrollment date
  const formatEnrolledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Enrolled today";
    if (diffInDays === 1) return "Enrolled yesterday";
    if (diffInDays < 7) return `Enrolled ${diffInDays} days ago`;
    return `Enrolled on ${date.toLocaleDateString()}`;
  };

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          You haven&apos;t enrolled in any courses yet
        </p>
        <Link href="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">My Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrollments.map((enrollment) => {
          const course = enrollment.courses;
          if (!course) return null;

          return (
            <Card
              key={enrollment.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                {/* Course Thumbnail */}
                <div className="relative w-full h-48 bg-gray-200">
                  {course.thumbnail_url ? (
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* Progress indicator on thumbnail */}
                  {enrollment.progress_percentage > 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>

                  {/* Progress Info */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {enrollment.progress_percentage}%
                      </span>
                    </div>
                    <Progress
                      value={enrollment.progress_percentage}
                      className="h-2"
                    />
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{formatEnrolledDate(enrollment.enrolled_at)}</span>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={
                      enrollment.lastLessonId
                        ? `/courses/${course.slug}/learn/${enrollment.lastLessonId}`
                        : `/courses/${course.slug}`
                    }
                  >
                    <Button
                      className="w-full"
                      variant={
                        enrollment.progress_percentage > 0 ? "default" : "outline"
                      }
                    >
                      {enrollment.progress_percentage > 0
                        ? "Continue course"
                        : "Start course"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
