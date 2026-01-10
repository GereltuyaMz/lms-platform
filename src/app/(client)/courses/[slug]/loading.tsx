import { Skeleton } from "@/components/ui/skeleton";

const CourseDetailLoading = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="bg-[#faf9f7] border-b relative overflow-hidden">
        <div className="container mx-auto py-8 md:py-14 px-4 sm:px-6 md:px-8 lg:px-[120px] max-w-[1510px] relative">
          {/* Decorative background placeholder - hidden on mobile */}
          <div className="hidden lg:block absolute left-0 top-0 w-[356px] h-[238px] z-0 opacity-10">
            <Skeleton className="w-full h-full" />
          </div>

          <div className="relative z-10 space-y-4 md:space-y-6">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2 items-center flex-wrap">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-3 hidden sm:block" />
              <Skeleton className="h-4 w-24 hidden sm:block" />
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Main content */}
            <div className="flex flex-col gap-2 mt-2 md:mt-4">
              {/* Level Badge */}
              <Skeleton className="h-5 w-16 rounded-full" />

              {/* Title */}
              <Skeleton className="h-8 md:h-10 lg:h-12 w-full sm:w-3/4 md:w-2/3" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 w-4/5 max-w-xl hidden sm:block" />
              </div>

              {/* Teacher info */}
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="size-8 md:size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-2 pb-10 md:pb-16 lg:pb-20 max-w-[1510px] px-4 sm:px-6 md:px-8 lg:px-[120px]">
        <div className="flex flex-col lg:flex-row gap-6 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
          {/* Left Content */}
          <div className="w-full lg:max-w-[70%]">
            {/* Mobile/Tablet Sidebar - shown above content on small screens */}
            <div className="pb-10 sm:pb-12 md:pb-14 lg:hidden">
              <SidebarSkeleton />
            </div>

            {/* Course Content Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-6 md:h-8 w-40 md:w-48" />
              <div className="relative">
                <div className="space-y-0">
                  {[1, 2, 3].map((unit, index) => (
                    <div key={unit} className="relative pl-8 md:pl-10">
                      {/* Vertical timeline line */}
                      {index !== 2 && (
                        <div className="absolute left-3 md:left-4 top-10 md:top-12 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      {/* Timeline badge */}
                      <div className="absolute left-0 top-2 md:top-3">
                        <Skeleton className="size-6 md:size-8 rounded-lg" />
                      </div>

                      {/* Unit content */}
                      <div className="pb-6 md:pb-8">
                        {/* Unit title */}
                        <div className="mb-3 md:mb-4">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 md:h-6 w-28 md:w-32" />
                            <Skeleton className="size-4 rounded-full" />
                          </div>
                        </div>

                        {/* Lesson cards - horizontal scroll */}
                        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                          {[1, 2, 3].map((lesson) => (
                            <div
                              key={lesson}
                              className="min-w-[220px] sm:min-w-[240px] md:min-w-[280px] border rounded-xl p-3 md:p-4 bg-white shrink-0"
                            >
                              <div className="space-y-3">
                                {/* Lesson icon and type */}
                                <div className="flex items-center gap-2">
                                  <Skeleton className="size-5 md:size-6 rounded" />
                                  <Skeleton className="h-4 w-14 md:w-16" />
                                </div>

                                {/* Lesson title */}
                                <div className="space-y-2">
                                  <Skeleton className="h-4 md:h-5 w-full" />
                                  <Skeleton className="h-4 md:h-5 w-3/4" />
                                </div>

                                {/* Badge or status */}
                                <Skeleton className="h-5 w-16 md:w-20 rounded-full" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructor Skeleton */}
            <div className="mt-12 sm:mt-14 md:mt-16 lg:mt-20 space-y-4 md:space-y-6">
              <Skeleton className="h-6 md:h-8 w-28 md:w-32" />
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="size-14 sm:size-16 md:size-20 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 md:h-6 w-36 md:w-40" />
                  <Skeleton className="h-4 w-28 md:w-32" />
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-full max-w-lg hidden sm:block" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Skeleton - Desktop only */}
          <div className="hidden lg:block">
            <SidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted Sidebar Skeleton component for reuse
const SidebarSkeleton = () => (
  <div className="w-full lg:w-[300px] lg:sticky lg:top-6">
    <div className="space-y-[10px] border border-[#d1d5db] rounded-xl p-3 md:p-[14px] bg-white">
      {/* Course thumbnail */}
      <Skeleton className="h-[140px] sm:h-[160px] md:h-[168px] w-full rounded-lg" />

      {/* Title */}
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />

      {/* Pricing */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 md:h-7 w-20 md:w-24" />
        <Skeleton className="h-5 w-14 md:w-16" />
      </div>

      {/* Enroll Button */}
      <Skeleton className="h-10 md:h-12 w-full rounded-lg" />

      {/* Stats section */}
      <div className="space-y-2 md:space-y-[11px] pt-2 md:pt-[10px]">
        {[1, 2, 3, 4].map((stat) => (
          <div key={stat} className="flex items-center justify-between">
            <Skeleton className="h-4 w-16 md:w-20" />
            <Skeleton className="h-4 w-12 md:w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CourseDetailLoading;
