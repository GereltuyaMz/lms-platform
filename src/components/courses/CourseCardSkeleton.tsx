import { Skeleton } from "@/components/ui/skeleton";

export const CourseCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl bg-[#f8f1f6] h-full flex flex-col">
      {/* Thumbnail skeleton */}
      <div className="relative h-[200px] w-full p-4">
        <Skeleton className="h-full w-full rounded-3xl" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5">
        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        {/* Title and description */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
};
