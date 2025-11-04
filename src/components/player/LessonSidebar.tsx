"use client";

import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type LessonItem = {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz";
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
  lessons: LessonSection[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
    streak: number;
    totalXp: number;
  };
};

export const LessonSidebar = ({
  courseTitle,
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
                <span>Progress</span>
                <span>
                  {progress.completed} of {progress.total} lessons
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-semibold">{progress.streak} day streak</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-semibold">{progress.totalXp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <Accordion type="multiple" defaultValue={lessons.map((_, i) => `section-${i}`)}>
          {lessons.map((section, index) => (
            <AccordionItem key={index} value={`section-${index}`} className="border-b">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                {section.section}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      disabled={item.locked}
                      className={`
                        w-full text-left p-3 rounded-lg transition-colors
                        ${item.current
                          ? "bg-blue-50 border border-blue-200"
                          : item.locked
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {item.locked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : item.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : item.current ? (
                            <PlayCircle className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300" />
                          )}
                        </div>

                        {/* Content */}
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
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};
