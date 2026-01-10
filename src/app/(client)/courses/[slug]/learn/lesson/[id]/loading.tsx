const PurpleSkeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-[#606099]/10 ${className}`} />
);

export default function LessonLoading() {
  return (
    <div className="bg-[#faf9f6] rounded-lg p-6 md:p-10 flex flex-col gap-5">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <PurpleSkeleton className="h-4 w-24" />
        <PurpleSkeleton className="h-4 w-3" />
        <PurpleSkeleton className="h-4 w-32" />
        <PurpleSkeleton className="h-4 w-3" />
        <PurpleSkeleton className="h-4 w-20" />
      </div>

      {/* Divider */}
      <div className="border-b border-[#e5e5e5]" />

      {/* Step Title + Navigation Row */}
      <div className="flex items-center justify-between">
        <PurpleSkeleton className="h-8 w-24" />

        {/* Navigation buttons skeleton */}
        <div className="flex items-center gap-2">
          <PurpleSkeleton className="size-10 rounded-full" />
          <PurpleSkeleton className="size-10 rounded-full" />
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="flex-1 space-y-4">
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <PurpleSkeleton className="h-6 w-3/4" />
          <PurpleSkeleton className="h-4 w-full" />
          <PurpleSkeleton className="h-4 w-full" />
          <PurpleSkeleton className="h-4 w-2/3" />
          <PurpleSkeleton className="h-40 w-full rounded-lg" />
          <PurpleSkeleton className="h-4 w-full" />
          <PurpleSkeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* Mark Complete Button Skeleton */}
      <div className="flex justify-start">
        <PurpleSkeleton className="h-10 w-36 rounded-lg" />
      </div>
    </div>
  );
}
