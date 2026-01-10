import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-14">
          {/* Left Sidebar - Navigation Skeleton */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border p-5 space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1 min-w-0 lg:max-w-[518px] space-y-8">
            {/* Profile Card Skeleton */}
            <div className="bg-[#E2E0F9] rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="w-10 h-10 rounded-lg" />
              </div>
            </div>

            {/* Statistics Section Skeleton */}
            <div>
              <Skeleton className="h-7 w-24 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-8 h-8 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrolled Courses Section Skeleton */}
            <div>
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#F8F1F6] rounded-3xl overflow-hidden"
                  >
                    <div className="flex">
                      {/* Thumbnail Skeleton */}
                      <Skeleton
                        className="flex-shrink-0 rounded-3xl"
                        style={{ width: 200, height: 200 }}
                      />
                      {/* Content Skeleton */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div className="flex gap-2 mb-3">
                          <Skeleton className="h-7 w-16 rounded-full" />
                          <Skeleton className="h-7 w-20 rounded-full" />
                        </div>
                        <div className="space-y-2 mb-4">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-8" />
                          </div>
                          <Skeleton className="h-2.5 w-full rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Achievements Skeleton */}
          <aside className="hidden lg:block flex-shrink-0" style={{ width: 362 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-10" />
            </div>

            {/* Achievement Cards */}
            <div className="bg-white rounded-2xl border overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`p-4 flex items-start gap-3 ${i < 4 ? "border-b" : ""}`}
                >
                  <Skeleton className="w-14 h-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
