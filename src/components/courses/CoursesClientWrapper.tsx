"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  FilterCourses,
  type FilterState,
} from "@/components/courses/FilterCourses";
import { CoursesList } from "@/components/courses/CoursesList";
import { CoursesPagination } from "@/components/courses/CoursesPagination";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  userCoupons,
}: CoursesClientWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(() => {
    const examSlug = searchParams.get("exam");
    const subjectSlugs = searchParams.get("subjects");

    const examId = examTypes.find((e) => e.slug === examSlug)?.id || null;
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

  const activeFilterCount =
    (filters.examType ? 1 : 0) + filters.subjects.length;

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);

    const params = new URLSearchParams();

    if (newFilters.examType) {
      const examSlug = examTypes.find(
        (e) => e.id === newFilters.examType
      )?.slug;
      if (examSlug) params.set("exam", examSlug);
    }

    if (newFilters.subjects.length > 0) {
      const subjectSlugs = newFilters.subjects
        .map((id) => subjectCategories.find((s) => s.id === id)?.slug)
        .filter(Boolean)
        .join(",");
      if (subjectSlugs) params.set("subjects", subjectSlugs);
    }

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

    startTransition(() => {
      router.push(`/courses?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Mobile Filter Dropdown */}
      <div className="lg:hidden w-full">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between rounded-xl h-12"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Шүүлтүүр
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 rounded-xl border bg-white p-4">
            <FilterCourses
              examTypes={examTypes}
              subjectCategories={subjectCategories}
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
        <FilterCourses
          examTypes={examTypes}
          subjectCategories={subjectCategories}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      </aside>

      {/* Course List */}
      <main className="flex-1 w-full">
        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <CoursesList courses={initialCourses} userCoupons={userCoupons} />
        )}

        <div className="mt-8">
          <CoursesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
};
