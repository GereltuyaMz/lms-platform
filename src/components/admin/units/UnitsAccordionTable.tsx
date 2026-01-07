"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronDown, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { CourseWithUnitSummary } from "@/lib/actions/admin/units";

type UnitsAccordionTableProps = {
  courses: CourseWithUnitSummary[];
  currentPage: number;
  totalPages: number;
};

type UnitItem = CourseWithUnitSummary["units"][number];

const groupUnitsByContent = (units: UnitItem[]) => {
  const groups: Record<string, UnitItem[]> = {};
  const order: string[] = [];

  units.forEach((unit) => {
    const key = unit.unit_content || "__ungrouped__";
    if (!groups[key]) {
      groups[key] = [];
      order.push(key);
    }
    groups[key].push(unit);
  });

  return { groups, order };
};

const UnitContentGroup = ({
  contentName,
  units,
  startIndex,
  onUnitClick,
}: {
  contentName: string;
  units: UnitItem[];
  startIndex: number;
  onUnitClick: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const displayName = contentName === "__ungrouped__" ? "Бусад" : contentName;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100/50 transition-colors text-left">
        {isOpen ? (
          <ChevronDown className="h-3 w-3 text-gray-400" />
        ) : (
          <ChevronRight className="h-3 w-3 text-gray-400" />
        )}
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {displayName}
        </span>
        <span className="text-xs text-gray-400">({units.length})</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="divide-y divide-gray-100/80">
          {units.map((unit, index) => (
            <div
              key={unit.id}
              onClick={() => onUnitClick(unit.id)}
              className="grid grid-cols-12 gap-4 px-4 py-2.5 items-center text-sm hover:bg-gray-100/50 transition-colors cursor-pointer"
            >
              <div className="col-span-5 flex items-center gap-3 pl-10">
                <span className="flex items-center justify-center h-5 w-5 rounded bg-gray-200/80 text-[10px] font-semibold text-gray-500">
                  {startIndex + index + 1}
                </span>
                <span className="text-gray-700 truncate">
                  {unit.title_mn || unit.title}
                </span>
              </div>
              <div className="col-span-2" />
              <div className="col-span-2 text-center">
                <span className="text-gray-500 text-xs">
                  {unit.lessons_count} хичээл
                </span>
              </div>
              <div className="col-span-3 text-right">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                  Засах
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const UnitsAccordionTable = ({
  courses,
  currentPage,
  totalPages,
}: UnitsAccordionTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/units?${params.toString()}`);
  };

  const handleUnitClick = (unitId: string) => {
    router.push(`/admin/units/${unitId}`);
  };

  if (courses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">Хичээл олдсонгүй</p>
          <p className="text-sm text-gray-400 mt-1">
            Эхлээд хичээл үүсгэнэ үү
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div className="col-span-5">Хичээл</div>
          <div className="col-span-2 text-center">Бүлэг</div>
          <div className="col-span-2 text-center">Хичээл тоо</div>
          <div className="col-span-3 text-right">Үйлдэл</div>
        </div>

        {/* Accordion Rows */}
        <Accordion type="multiple" className="divide-y divide-gray-100">
          {courses.map((course) => {
            const { groups, order } = groupUnitsByContent(course.units);
            const hasMultipleGroups = order.length > 1 || (order.length === 1 && order[0] !== "__ungrouped__");

            return (
              <AccordionItem
                key={course.id}
                value={course.id}
                className="border-none"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50/80 hover:no-underline transition-colors group [&>svg]:hidden">
                  <div className="grid grid-cols-12 gap-4 w-full items-center text-sm">
                    <div className="col-span-5 flex items-center gap-3">
                      <ChevronRight className="h-4 w-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      <span className="font-medium text-gray-900 text-left">
                        {course.title}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {course.units_count}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-gray-600">{course.lessons_count}</span>
                    </div>
                    <div className="col-span-3 text-right">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Хичээл харах
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-0">
                  <div className="bg-gray-50/50 border-t border-gray-100">
                    {course.units.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <Layers className="h-5 w-5 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Бүлэг байхгүй</p>
                      </div>
                    ) : hasMultipleGroups ? (
                      // Render grouped by unit_content
                      <div className="divide-y divide-gray-100">
                        {order.map((contentKey) => {
                          const groupUnits = groups[contentKey];
                          const startIndex = course.units.findIndex(
                            (u) => u.id === groupUnits[0].id
                          );
                          return (
                            <UnitContentGroup
                              key={contentKey}
                              contentName={contentKey}
                              units={groupUnits}
                              startIndex={startIndex}
                              onUnitClick={handleUnitClick}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      // Render flat list (no grouping)
                      <div className="divide-y divide-gray-100/80">
                        {course.units.map((unit, index) => (
                          <div
                            key={unit.id}
                            onClick={() => handleUnitClick(unit.id)}
                            className="grid grid-cols-12 gap-4 px-4 py-2.5 items-center text-sm hover:bg-gray-100/50 transition-colors cursor-pointer"
                          >
                            <div className="col-span-5 flex items-center gap-3 pl-7">
                              <span className="flex items-center justify-center h-5 w-5 rounded bg-gray-200/80 text-[10px] font-semibold text-gray-500">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 truncate">
                                {unit.title_mn || unit.title}
                              </span>
                            </div>
                            <div className="col-span-2" />
                            <div className="col-span-2 text-center">
                              <span className="text-gray-500 text-xs">
                                {unit.lessons_count} хичээл
                              </span>
                            </div>
                            <div className="col-span-3 text-right">
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                                Засах
                                <ChevronRight className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="text-xs"
          >
            Өмнөх
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  page === currentPage && "pointer-events-none"
                )}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="text-xs"
          >
            Дараах
          </Button>
        </div>
      )}
    </div>
  );
};
