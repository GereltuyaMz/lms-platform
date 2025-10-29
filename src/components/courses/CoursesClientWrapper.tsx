"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FilterCourses,
  type FilterState,
} from "@/components/courses/FilterCourses";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category, CourseWithCategories } from "@/types/database";

type CoursesClientWrapperProps = {
  categories: Category[];
  initialCourses: CourseWithCategories[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

export const CoursesClientWrapper = ({
  categories,
  initialCourses,
  currentPage,
  totalPages,
  totalCount,
}: CoursesClientWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const topicsParam = searchParams.get("topics");
    const levelParam = searchParams.get("level");

    return {
      topics: topicsParam ? topicsParam.split(",") : [],
      level: levelParam || "All",
    };
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);

    const params = new URLSearchParams();

    if (newFilters.topics.length > 0) {
      params.set("topics", newFilters.topics.join(","));
    }

    if (newFilters.level !== "All") {
      params.set("level", newFilters.level);
    }

    params.set("page", "1");

    const queryString = params.toString();
    const newUrl = queryString ? `/courses?${queryString}` : "/courses";

    router.push(newUrl, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/courses?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <aside className="w-[250px] flex-shrink-0">
        <FilterCourses
          categories={categories}
          onFilterChange={handleFilterChange}
          totalCourses={totalCount}
          filteredCount={initialCourses.length}
          initialFilters={filters}
        />
      </aside>

      {/* Course List */}
      <main className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {filters.topics.length > 0 && (
              <>
                {filters.topics.map((topic) => (
                  <Button
                    key={topic}
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      const newTopics = filters.topics.filter(
                        (t) => t !== topic
                      );
                      handleFilterChange({
                        ...filters,
                        topics: newTopics,
                      });
                    }}
                  >
                    {topic}
                    <span>×</span>
                  </Button>
                ))}
              </>
            )}
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <Button variant="ghost" size="sm" className="gap-1">
              Default
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div> */}
        </div>

        <div className="space-y-4">
          {initialCourses.length > 0 ? (
            initialCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description || ""}
                instructor={{ name: "TBD", avatar: undefined }}
                duration={`${course.duration_hours || 0} hours`}
                lessons={0}
                level={course.level}
                price={course.price}
                originalPrice={course.original_price || undefined}
                thumbnail={course.thumbnail_url || undefined}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No courses found matching your filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              const showEllipsis =
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2);

              if (showEllipsis) {
                return (
                  <span key={page} className="px-2">
                    ...
                  </span>
                );
              }

              if (!showPage) return null;

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
