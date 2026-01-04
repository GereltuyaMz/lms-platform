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
  examTypes: Category[];
  subjectCategories: Category[];
  initialCourses: CourseWithCategories[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  userCoupons?: Record<string, { discount_percentage: number }>;
};

export const CoursesClientWrapper = ({
  examTypes,
  subjectCategories,
  initialCourses,
  currentPage,
  totalPages,
  totalCount,
  userCoupons,
}: CoursesClientWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const coursesHeadingRef = useRef<HTMLHeadingElement>(null);

  const [filters, setFilters] = useState<FilterState>(() => {
    const examSlug = searchParams.get("exam");
    const subjectSlugs = searchParams.get("subjects");

    // Convert slugs to IDs for internal state
    const examId = examTypes.find((e) => e.slug === examSlug)?.id || examTypes[0]?.id || null;
    const subjectIds = subjectSlugs
      ? subjectCategories
          .filter((s) => subjectSlugs.split(",").includes(s.slug))
          .map((s) => s.id)
      : [];

    return {
      examType: examId,
      subjects: subjectIds,
    };
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);

    const params = new URLSearchParams();

    // Add exam type filter (using slug)
    if (newFilters.examType) {
      const examSlug = examTypes.find((e) => e.id === newFilters.examType)?.slug;
      if (examSlug) params.set("exam", examSlug);
    }

    // Add subject filters if any (using slugs)
    if (newFilters.subjects.length > 0) {
      const subjectSlugs = newFilters.subjects
        .map((id) => subjectCategories.find((s) => s.id === id)?.slug)
        .filter(Boolean)
        .join(",");
      if (subjectSlugs) params.set("subjects", subjectSlugs);
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

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

  // Get display names for active filters
  const getSubjectName = (id: string) => {
    const subject = subjectCategories.find((s) => s.id === id);
    return subject?.name_mn || subject?.name || id;
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
        <aside className="w-[250px] shrink-0">
          <FilterCourses
            examTypes={examTypes}
            subjectCategories={subjectCategories}
            onFilterChange={handleFilterChange}
            totalCourses={totalCount}
            filteredCount={initialCourses.length}
            initialFilters={filters}
          />
        </aside>

        {/* Course List */}
        <main className="flex-1">
          {/* Active filter tags */}
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            {filters.subjects.length > 0 && (
              <>
                {filters.subjects.map((subjectId) => (
                  <Button
                    key={subjectId}
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      const newSubjects = filters.subjects.filter(
                        (id) => id !== subjectId
                      );
                      handleFilterChange({
                        ...filters,
                        subjects: newSubjects,
                      });
                    }}
                  >
                    {getSubjectName(subjectId)}
                    <span>×</span>
                  </Button>
                ))}
              </>
            )}

          </div>

          {isPending ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <CoursesList courses={initialCourses} userCoupons={userCoupons} />
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
