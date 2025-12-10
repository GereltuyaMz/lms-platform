"use client";

import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

type LessonItem = {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz" | "text" | "assignment";
  completed: boolean;
  current?: boolean;
  locked?: boolean;
};

type LessonSection = {
  section: string;
  items: LessonItem[];
};

type LessonSidebarProps = {
  courseTitle: string;
  courseSlug: string;
  lessons: LessonSection[];
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
  progress,
}: LessonSidebarProps) => {
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
          defaultValue={lessons.map((_, i) => `section-${i}`)}
        >
          {lessons.map((section, index) => (
            <AccordionItem
              key={index}
              value={`section-${index}`}
              className="border-b"
            >
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                {section.section}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const lessonUrl = `/courses/${courseSlug}/learn/${item.id}`;

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
                                <span>
                                  {item.type === "video" ? "📹" : "📝"}
                                </span>
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
                              <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-100" />
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
                              <span>{item.type === "video" ? "📹" : "📝"}</span>
                              <span>{item.duration}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};
