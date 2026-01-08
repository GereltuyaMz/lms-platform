import { CourseBreadcrumb } from "@/components/courses/CourseBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCourseLevel } from "@/lib/utils/formatters";
import type { Course } from "@/types/database";
import { CourseBackground } from "@/icons";

type CourseHeroProps = {
  course: Course;
  teacher?: {
    id: string;
    full_name_mn: string;
    avatar_url: string | null;
  } | null;
};

export const CourseHero = ({ course, teacher }: CourseHeroProps) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-[#faf9f7] border-b relative overflow-hidden">
      <div className="container mx-auto py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-[120px] max-w-[1510px] relative">
        {/* Decorative background graphic - positioned behind content */}
        <div className="absolute left-0 top-0 w-[200px] h-[134px] sm:w-[280px] sm:h-[187px] lg:w-[356px] lg:h-[238px] z-0 pointer-events-none opacity-30 sm:opacity-50 lg:opacity-100">
          <CourseBackground />
        </div>

        <div className="relative z-10">
          <CourseBreadcrumb courseTitle={course.title} />

          {/* Main content - vertical stack */}
          <div className="flex flex-col gap-2 mt-4">
            {/* Level Badge */}
            <Badge
              className={`text-xs text-white bg-[#2563eb] rounded-full px-2 py-0.5 w-fit`}
            >
              {formatCourseLevel(course.level)}
            </Badge>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-semibold leading-[1.2] tracking-[-0.4px] text-[#1a1a1a]">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-[14px] leading-[1.4] tracking-[-0.14px] text-[#333]">
              {course.description}
            </p>

            {/* Teacher info (if exists) */}
            {teacher && (
              <a
                href="#instructor"
                className="flex items-center gap-2 mt-2 cursor-pointer hover:opacity-80 transition-opacity w-fit"
              >
                <Avatar className="size-8 sm:size-9 md:size-10 border border-black">
                  {teacher.avatar_url && (
                    <AvatarImage
                      src={teacher.avatar_url}
                      alt={teacher.full_name_mn}
                    />
                  )}
                  <AvatarFallback className="bg-gray-200 text-black text-sm">
                    {getInitials(teacher.full_name_mn)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-[#0d0d0d]">
                  {teacher.full_name_mn}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
