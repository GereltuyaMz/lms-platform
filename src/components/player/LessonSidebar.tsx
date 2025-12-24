"use client";

import { CheckCircle2, Circle, Lock, PlayCircle, BookCheck, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import type { LessonType } from "@/types/database";
import type { Unit } from "@/types/database/tables";

// Legacy type for section-based display
type LessonItem = {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  completed: boolean;
  current?: boolean;
  locked?: boolean;
};

// Legacy type
type LessonSection = {
  section: string;
  items: LessonItem[];
};

// New type for unit-based display
type UnitSection = {
  unit: Unit;
  items: LessonItem[];
  hasUnitQuiz: boolean;
};

type LessonSidebarProps = {
  courseTitle: string;
  courseSlug: string;
  // Support both legacy sections and new units
  lessons?: LessonSection[];
  units?: UnitSection[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
    streak?: number;
    totalXp: number;
  };
};

export const LessonSidebar = ({
  courseTitle,
  courseSlug,
  lessons,
  units,
  progress,
}: LessonSidebarProps) => {
  // Determine which data source to use
  const hasUnits = units && units.length > 0;
  const sections = hasUnits
    ? units.map((u) => ({ section: u.unit.title, items: u.items, hasUnitQuiz: u.hasUnitQuiz, unitId: u.unit.id }))
    : (lessons || []).map((l) => ({ section: l.section, items: l.items, hasUnitQuiz: false, unitId: null }));

  return (
    <aside className="w-[340px] bg-white border-r h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <div className="p-6">
        {/* Course Progress Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border">
          <h3 className="font-semibold text-sm mb-3">{courseTitle}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Явц</span>
                <span>
                  {progress.completed} -c {progress.total} сургалт
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-semibold">
                  {progress.streak} өдөр стрик
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-semibold">
                  {progress.totalXp} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <Accordion
          type="multiple"
          defaultValue={sections.map((_, i) => `section-${i}`)}
        >
          {sections.map((section, index) => (
            <AccordionItem
              key={section.unitId || index}
              value={`section-${index}`}
              className="border-b"
            >
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>{section.section}</span>
                  {section.hasUnitQuiz && (
                    <BookCheck className="w-4 h-4 text-purple-500" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const lessonUrl = `/courses/${courseSlug}/learn/lesson/${item.id}`;

                    if (item.locked) {
                      return (
                        <div
                          key={item.id}
                          className="w-full text-left p-3 rounded-lg transition-colors opacity-50 cursor-not-allowed"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium mb-1 text-gray-700">
                                {item.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{getLessonEmoji(item.type)}</span>
                                <span>{item.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.id}
                        href={lessonUrl}
                        className={`
                          block w-full text-left p-3 rounded-lg transition-colors cursor-pointer
                          ${
                            item.current
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 " />
                            ) : item.current ? (
                              <PlayCircle className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium mb-1 ${
                                item.current
                                  ? "text-blue-700"
                                  : item.completed
                                  ? "text-gray-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{getLessonEmoji(item.type)}</span>
                              <span>{item.duration}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {/* Unit Quiz Button */}
                  {section.hasUnitQuiz && section.unitId && (
                    <Link
                      href={`/courses/${courseSlug}/learn/unit-quiz/${section.unitId}`}
                      className="block w-full mt-3 p-3 rounded-lg bg-purple-50 border border-purple-200
                                 hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          <BookCheck className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-purple-700">
                            Бүлгийн тест
                          </p>
                          <p className="text-xs text-purple-500">
                            Бүлгийн шалгалтыг өгөх
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                      </div>
                    </Link>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};

// Helper function to get emoji for lesson type
const getLessonEmoji = (type: LessonType): string => {
  const emojiMap: Record<LessonType, string> = {
    video: "📹",
    text: "📝",
    quiz: "✏️",
    assignment: "📋",
    theory: "📖",
    easy_example: "💡",
    hard_example: "🧠",
  };
  return emojiMap[type] || "📹";
};

// Export types for use in other components
export type { LessonItem, LessonSection, UnitSection };
