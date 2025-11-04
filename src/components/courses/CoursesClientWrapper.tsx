"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FilterCourses,
  type FilterState,
} from "@/components/courses/FilterCourses";
import { CoursesList } from "@/components/courses/CoursesList";
import { CoursesPagination } from "@/components/courses/CoursesPagination";
import { Button } from "@/components/ui/button";
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
        <CoursesList courses={initialCourses} />
        <CoursesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};
