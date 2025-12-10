"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FilterCourses,
  type FilterState,
} from "@/components/courses/FilterCourses";
import { CoursesList } from "@/components/courses/CoursesList";
import { CoursesPagination } from "@/components/courses/CoursesPagination";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";
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
  const [isPending, startTransition] = useTransition();
  const coursesHeadingRef = useRef<HTMLHeadingElement>(null);

  const [filters, setFilters] = useState<FilterState>(() => {
    const topicsParam = searchParams.get("topics");
    const levelParam = searchParams.get("level");

    return {
      topics: topicsParam ? topicsParam.split(",") : [],
      level: levelParam || "Бүгд",
    };
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);

    const params = new URLSearchParams();

    // Add topic filters if any
    if (newFilters.topics.length > 0) {
      params.set("topics", newFilters.topics.join(","));
    }

    // Add level filter only if it's not "Бүгд" (All)
    if (newFilters.level && newFilters.level !== "Бүгд") {
      params.set("level", newFilters.level);
    }

    // Only add page param if we have filters, otherwise clean URL
    if (params.toString()) {
      params.set("page", "1");
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/courses?${queryString}` : "/courses";

    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    // Scroll to "All courses" heading for better UX when changing pages
    coursesHeadingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });

    startTransition(() => {
      router.push(`/courses?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <>
      <h1
        ref={coursesHeadingRef}
        className="mt-8 mb-8 text-4xl font-bold scroll-mt-24"
      >
        Бүх хичээлүүд
      </h1>

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
          </div>

          {isPending ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <CoursesList courses={initialCourses} />
          )}

          <CoursesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </>
  );
};
