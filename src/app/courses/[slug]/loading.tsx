import { Skeleton } from "@/components/ui/skeleton";

const CourseDetailLoading = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto py-14 max-w-[1400px]">
          <div className="space-y-6">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 md:w-1/2" />
              <Skeleton className="h-5 w-full max-w-2xl" />
              <Skeleton className="h-5 w-4/5 max-w-xl" />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-14 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-20">
            {/* Course Content Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-4">
                {[1, 2, 3].map((section) => (
                  <div key={section} className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <div className="space-y-2 pl-4">
                      {[1, 2, 3].map((lesson) => (
                        <Skeleton key={lesson} className="h-12 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 border rounded-lg p-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailLoading;
