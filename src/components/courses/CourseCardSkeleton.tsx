import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const CourseCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4">
        {/* Thumbnail skeleton */}
        <Skeleton className="h-[180px] w-full flex-shrink-0 rounded-lg sm:h-[120px] sm:w-[160px]" />

        <CardContent className="flex flex-1 items-start justify-between gap-4 p-0">
          {/* Left side: Course info skeleton */}
          <div className="flex flex-1 flex-col gap-2 sm:gap-7">
            <div className="space-y-2">
              {/* Title */}
              <Skeleton className="h-5 w-3/4 sm:h-6" />

              {/* Description lines */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />

              {/* Instructor */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full sm:h-6 sm:w-6" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-xl" />
              <Skeleton className="h-6 w-24 rounded-xl" />
              <Skeleton className="h-6 w-20 rounded-xl" />
            </div>
          </div>

          {/* Right side: Pricing skeleton */}
          <div className="flex flex-col items-end gap-0.5 sm:gap-1">
            <Skeleton className="h-6 w-20 sm:h-7" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
