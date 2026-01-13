"use client";

import type { MockTestSection, UserAnswers } from "@/types/mock-test";
import { Button } from "@/components/ui/button";

type MockTestSectionNavProps = {
  sections: MockTestSection[];
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
  userAnswers: UserAnswers;
  testTitle: string;
};

export const MockTestSectionNav = ({
  sections,
  currentSectionIndex,
  onSectionChange,
  userAnswers,
  testTitle,
}: MockTestSectionNavProps) => {
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
    <div className="bg-white border-b shadow-sm sticky top-20 z-20">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-4">
        {/* Title */}
        <h1 className="text-base md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
          {testTitle}
        </h1>

        {/* Section Navigation Buttons - Fit to viewport */}
        {sections.length > 1 && (
          <div className="flex gap-2">
            {sections.map((section, index) => {
              const answered = getAnsweredCount(section);
              const total = getTotalQuestions(section);
              const isActive = index === currentSectionIndex;

              return (
                <Button
                  key={section.id}
                  variant={isActive ? "landing" : "landingOutline"}
                  onClick={() => onSectionChange(index)}
                  className="flex-1 flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 md:py-2 md:px-4 text-xs md:text-base"
                >
                  <span className="font-bold truncate max-w-full text-[11px] md:text-sm">
                    {section.title}
                  </span>
                  <span className="text-[10px] md:text-xs opacity-90">
                    {answered}/{total}
                  </span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
