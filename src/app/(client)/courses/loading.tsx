import { Skeleton } from "@/components/ui/skeleton";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";

const FiltersSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Topics filter */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-20" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Level filter */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-16" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CoursesLoading() {
  return (
    <div className="container mx-auto px-4 py-20">
      {/* Hero section skeleton */}
      <section className="py-5 md:py-10">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <Skeleton className="w-full h-[300px] md:h-[460px] rounded-lg" />
            <div>
              <Skeleton className="h-12 w-3/4 mb-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Title skeleton */}
      <Skeleton className="h-10 w-48 mb-8" />

      {/* Main content */}
      <div className="flex gap-8">
        {/* Filters Sidebar skeleton */}
        <aside className="w-[250px] flex-shrink-0">
          <FiltersSkeleton />
        </aside>

        {/* Course List skeleton */}
        <main className="flex-1">
          <div className="mb-6">
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="flex flex-col gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="mt-8 flex justify-center gap-2">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
          </div>
        </main>
      </div>
    </div>
  );
}
