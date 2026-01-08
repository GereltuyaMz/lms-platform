import { Skeleton } from "@/components/ui/skeleton";

const CourseDetailLoading = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="bg-[#faf9f7] border-b relative overflow-hidden">
        <div className="container mx-auto py-14 px-8 lg:px-[120px] max-w-[1510px] relative">
          {/* Decorative background placeholder */}
          <div className="absolute left-0 top-0 lg:w-[356px] lg:h-[238px] z-0 opacity-10">
            <Skeleton className="w-full h-full" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Main content */}
            <div className="flex flex-col gap-2 mt-4">
              {/* Level Badge */}
              <Skeleton className="h-5 w-16 rounded-full" />

              {/* Title */}
              <Skeleton className="h-10 md:h-12 w-3/4 md:w-2/3" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 w-4/5 max-w-xl" />
              </div>

              {/* Teacher info */}
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-14 max-w-[1510px] px-8 lg:px-[120px]">
        <div className="flex gap-6 mt-10">
          {/* Left Content - Course Content & Instructor */}
          <div className="space-y-20 max-w-[944px]">
            {/* Course Content Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="relative">
                <div className="space-y-0">
                  {[1, 2, 3].map((unit, index) => (
                    <div key={unit} className="relative pl-10">
                      {/* Vertical timeline line */}
                      {index !== 2 && (
                        <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      {/* Timeline badge */}
                      <div className="absolute left-0 top-3">
                        <Skeleton className="size-8 rounded-lg" />
                      </div>

                      {/* Unit content */}
                      <div className="pb-8">
                        {/* Unit title with tooltip */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="size-4 rounded-full" />
                          </div>
                        </div>

                        {/* Lesson cards - horizontal scroll */}
                        <div className="flex gap-4 overflow-hidden">
                          {[1, 2, 3].map((lesson) => (
                            <div
                              key={lesson}
                              className="min-w-[280px] border rounded-xl p-4 bg-white"
                            >
                              <div className="space-y-3">
                                {/* Lesson icon and type */}
                                <div className="flex items-center gap-2">
                                  <Skeleton className="size-6 rounded" />
                                  <Skeleton className="h-4 w-16" />
                                </div>

                                {/* Lesson title */}
                                <div className="space-y-2">
                                  <Skeleton className="h-5 w-full" />
                                  <Skeleton className="h-5 w-3/4" />
                                </div>

                                {/* Badge or status */}
                                <Skeleton className="h-5 w-20 rounded-full" />
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
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-4">
                <Skeleton className="size-20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-full max-w-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="w-[300px]">
            <div className="sticky top-6 space-y-[10px] border border-[#d1d5db] rounded-xl p-[14px] bg-white">
              {/* Course thumbnail */}
              <Skeleton className="h-[168px] w-full rounded-lg" />

              {/* Title */}
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />

              {/* Pricing */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>

              {/* Enroll Button */}
              <Skeleton className="h-12 w-full rounded-lg" />

              {/* Stats section */}
              <div className="space-y-[11px] pt-[10px]">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailLoading;
