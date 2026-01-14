import { Skeleton } from "@/components/ui/skeleton";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";

const FiltersSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-3xl px-3 py-6 space-y-6">
      {/* Exam Type Filter */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded" />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Subject Categories */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CoursesLoading() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#efefef] py-12">
        <div className="max-w-[1512px] mx-auto flex justify-between items-center px-8 lg:px-[120px] py-3">
          <Skeleton className="h-12 w-64" />
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col gap-[120px] items-center">
        <div className="container mx-auto px-4 max-w-[1512px] py-12 lg:px-[120px]">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Mobile Filter Skeleton */}
            <div className="lg:hidden w-full">
              <Skeleton className="w-full h-12 rounded-xl" />
            </div>

            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
              <FiltersSkeleton />
            </aside>

            {/* Course List */}
            <main className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>

              {/* Pagination skeleton */}
              <div className="mt-8 flex justify-center gap-2">
                <Skeleton className="h-10 w-10 rounded" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded" />
                ))}
                <Skeleton className="h-10 w-10 rounded" />
              </div>
            </main>
          </div>
        </div>

        {/* Call to Action Skeleton */}
        <div className="w-full">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </>
  );
}
