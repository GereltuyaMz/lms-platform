import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Skeleton */}
            <Skeleton className="w-24 h-24 rounded-full" />

            {/* User Info Skeleton */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
            </div>

            {/* Stats Skeleton */}
            <div className="flex gap-6">
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        {/* Profile Completion Banner Skeleton */}
        <Skeleton className="h-24 w-full rounded-xl mb-8" />

        {/* Tabs Skeleton */}
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <Skeleton className="h-40 w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-2 w-full mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
