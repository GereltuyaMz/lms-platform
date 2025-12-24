"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category } from "@/types/database";

type FilterCoursesProps = {
  examTypes: Category[];
  subjectCategories: Category[];
  onFilterChange?: (filters: FilterState) => void;
  totalCourses?: number;
  filteredCount?: number;
  initialFilters?: FilterState;
};

export type FilterState = {
  examType: string | null;
  subjects: string[];
};

export const FilterCourses = ({
  examTypes,
  subjectCategories,
  onFilterChange,
  totalCourses = 0,
  filteredCount = 0,
  initialFilters,
}: FilterCoursesProps) => {
  const [selectedExam, setSelectedExam] = useState<string | null>(
    initialFilters?.examType || (examTypes[0]?.id ?? null)
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    initialFilters?.subjects || []
  );

  // Filter subjects based on selected exam type
  const filteredSubjects = subjectCategories.filter(
    (cat) => cat.parent_id === selectedExam
  );

  // Sync with parent filters when they change (e.g., from URL)
  useEffect(() => {
    if (initialFilters) {
      setSelectedExam(initialFilters.examType);
      setSelectedSubjects(initialFilters.subjects);
    }
  }, [initialFilters]);

  const handleExamChange = (examId: string) => {
    setSelectedExam(examId);
    // Reset subjects when exam changes
    setSelectedSubjects([]);
    onFilterChange?.({
      examType: examId,
      subjects: [],
    });
  };

  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    const newSubjects = checked
      ? [...selectedSubjects, subjectId]
      : selectedSubjects.filter((id) => id !== subjectId);

    setSelectedSubjects(newSubjects);
    onFilterChange?.({
      examType: selectedExam,
      subjects: newSubjects,
    });
  };

  const handleClearSubjects = () => {
    setSelectedSubjects([]);
    onFilterChange?.({
      examType: selectedExam,
      subjects: [],
    });
  };

  return (
    <div className="w-full space-y-4 md:space-y-6">
      <div className="text-sm text-muted-foreground">
        Нийт {filteredCount}-с {totalCourses} хичээл харагдаж байна
      </div>

      {/* Exam Type Tabs */}
      {examTypes.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-semibold md:text-base">Шалгалтын төрөл</h3>
          <Tabs
            value={selectedExam || undefined}
            onValueChange={handleExamChange}
            className="w-full"
          >
            <TabsList className="w-full flex-wrap h-auto gap-1">
              {examTypes.map((exam) => (
                <TabsTrigger
                  key={exam.id}
                  value={exam.id}
                  className="cursor-pointer text-xs md:text-sm flex-1 min-w-[60px]"
                >
                  {exam.icon && <span className="mr-1">{exam.icon}</span>}
                  {exam.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Subject Categories */}
      <div className="space-y-3 border-t pt-4 md:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold md:text-base">Хичээл</h3>
          {selectedSubjects.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearSubjects}
              className="cursor-pointer text-xs hover:bg-transparent hover:underline p-0 h-auto"
            >
              Цэвэрлэх
            </Button>
          )}
        </div>

        <div className="space-y-2.5 md:space-y-3">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Checkbox
                  id={subject.slug}
                  checked={selectedSubjects.includes(subject.id)}
                  onCheckedChange={(checked) =>
                    handleSubjectChange(subject.id, checked as boolean)
                  }
                  className="cursor-pointer"
                />
                <Label
                  htmlFor={subject.slug}
                  className="cursor-pointer text-regular peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                >
                  {subject.icon && <span>{subject.icon}</span>}
                  {subject.name_mn || subject.name}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Шалгалтын төрөл сонгоно уу
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
