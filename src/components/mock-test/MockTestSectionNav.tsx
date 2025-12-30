"use client";

import type { MockTestSection, UserAnswers } from "@/types/mock-test";
import { Button } from "@/components/ui/button";

type MockTestSectionNavProps = {
  sections: MockTestSection[];
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
  userAnswers: UserAnswers;
};

export const MockTestSectionNav = ({
  sections,
  currentSectionIndex,
  onSectionChange,
  userAnswers,
}: MockTestSectionNavProps) => {
  // Hide navigation for single-section tests
  if (sections.length === 1) {
    return null;
  }

  // Count answered questions per section
  const getAnsweredCount = (section: MockTestSection): number => {
    let count = 0;
    section.problems.forEach((problem) => {
      problem.questions.forEach((question) => {
        if (userAnswers[question.id]) {
          count++;
        }
      });
    });
    return count;
  };

  const getTotalQuestions = (section: MockTestSection): number => {
    return section.problems.reduce(
      (total, problem) => total + problem.questions.length,
      0
    );
  };

  return (
    <div className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop: Horizontal tabs */}
        <div className="hidden md:flex gap-2 overflow-x-auto py-2">
          {sections.map((section, index) => {
            const answered = getAnsweredCount(section);
            const total = getTotalQuestions(section);
            const isActive = index === currentSectionIndex;

            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => onSectionChange(index)}
                className="flex-shrink-0 min-w-[120px] flex flex-col items-center gap-1 h-auto py-2"
              >
                <span className="font-bold">{section.title}</span>
                <span className="text-xs">
                  {answered}/{total}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Mobile: Dropdown */}
        <div className="md:hidden py-2">
          <select
            value={currentSectionIndex}
            onChange={(e) => onSectionChange(Number(e.target.value))}
            className="w-full p-2 border rounded-lg bg-white font-medium"
          >
            {sections.map((section, index) => {
              const answered = getAnsweredCount(section);
              const total = getTotalQuestions(section);

              return (
                <option key={section.id} value={index}>
                  {section.title} ({answered}/{total})
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};
