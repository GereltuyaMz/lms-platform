"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { Category } from "@/types/database";

type FilterCoursesProps = {
  examTypes: Category[];
  subjectCategories: Category[];
  onFilterChange?: (filters: FilterState) => void;
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
  initialFilters,
}: FilterCoursesProps) => {
  const [selectedExam, setSelectedExam] = useState<string | null>(
    initialFilters?.examType ?? null
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
    // Toggle: if clicking the same exam, deselect it
    const newExamId = selectedExam === examId ? null : examId;

    setSelectedExam(newExamId);
    setSelectedSubjects([]);
    onFilterChange?.({
      examType: newExamId,
      subjects: [],
    });
  };

  const handleSubjectToggle = (subjectId: string) => {
    const newSubjects = selectedSubjects.includes(subjectId)
      ? selectedSubjects.filter((id) => id !== subjectId)
      : [...selectedSubjects, subjectId];

    setSelectedSubjects(newSubjects);
    onFilterChange?.({
      examType: selectedExam,
      subjects: newSubjects,
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl py-6 space-y-6">
      {/* Exam Type Filter */}
      {examTypes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-medium tracking-tight text-black">
            Шалгалтын төрөл
          </h3>
          <div className="flex flex-wrap gap-3">
            {examTypes.map((exam) => {
              const isSelected = selectedExam === exam.id;
              return (
                <button
                  key={exam.id}
                  onClick={() => handleExamChange(exam.id)}
                  className={`flex items-center gap-2 px-4 h-8 rounded border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#f7f2fa] border-[#cac4d0]"
                      : "bg-white border-[#cac4d0]"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-[#1a1a1a]" />}
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    {exam.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Subject Categories */}
      <div className="space-y-4">
        <h3 className="text-base font-medium tracking-tight text-black">
          Хичээлийн төрөл
        </h3>
        <div className="flex flex-wrap gap-3">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => {
              const isSelected = selectedSubjects.includes(subject.id);
              return (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectToggle(subject.id)}
                  className={`flex items-center gap-2 px-4 h-8 rounded border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#f7f2fa] border-[#cac4d0]"
                      : "bg-white border-[#cac4d0]"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-[#1a1a1a]" />}
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    {subject.name}
                  </span>
                </button>
              );
            })
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
