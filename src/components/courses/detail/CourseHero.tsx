import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { VideoIcon, DumbbellIcon, BoardIcon, BoltIcon } from "@/icons";
import { getLevelColor } from "@/lib/course-utils";
import type { Course } from "@/types/database";

type CourseHeroProps = {
  course: Course;
  lessonCount: number;
  totalDurationMinutes: number;
};

export const CourseHero = ({
  course,
  lessonCount,
  totalDurationMinutes,
}: CourseHeroProps) => {
  return (
    <div className="bg-gray-50 border-b">
      <div className="container mx-auto   px-4 py-14 max-w-[1400px]">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/courses">Courses</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold">
                {course.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Course Info Card */}
        <div className="bg-white rounded-2xl border p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Course Icon */}
            <div className="flex-shrink-0">
              {course.thumbnail_url ? (
                <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-2xl overflow-hidden">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <Image
                  src="/assets/courses/tangent.png"
                  alt="Course"
                  width={190}
                  height={190}
                />
              )}
            </div>

            {/* Right: Course Details */}
            <div className="flex-1">
              {/* Level Badge */}
              <Badge
                variant="secondary"
                className={`text-sm ${getLevelColor(course.level)} mb-2`}
              >
                {course.level}
              </Badge>
              <h1 className="text-h3 md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <VideoIcon width={24} height={24} fill="#3B82F6" />
                  <span className="text-base">
                    <strong className="font-bold">
                      {totalDurationMinutes}
                    </strong>
                    min video
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <DumbbellIcon width={24} height={24} fill="#10B981" />
                  <span className="text-base">
                    <strong className="font-bold">10</strong> exercises
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <BoardIcon width={24} height={24} fill="#8B5CF6" />
                  <span className="text-base">
                    <strong className="font-bold">{lessonCount}</strong> lessons
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <BoltIcon width={24} height={24} fill="#F59E0B" />
                  <span className="text-base">
                    Total <strong className="font-bold">150</strong> XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
