"use client";

import { useState } from "react";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { QuestionCard } from "./QuestionCard";
import { ImageUploadField } from "./ImageUploadField";
import { MathText, hasMath } from "@/components/shared/MathText";
import { useAutoMathConvert } from "@/hooks/useAutoMathConvert";
import type { ProblemFormData, QuestionFormData } from "@/types/admin/mock-tests";
import { getDefaultQuestion } from "@/types/admin/mock-tests";

type ProblemCardProps = {
  problem: ProblemFormData;
  problemIndex: number;
  onUpdate: (field: keyof ProblemFormData, value: string | number | null | QuestionFormData[]) => void;
  onDelete: () => void;
  canDelete: boolean;
  storagePath: string;
};

export const ProblemCard = ({
  problem,
  problemIndex,
  onUpdate,
  onDelete,
  canDelete,
  storagePath,
}: ProblemCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const questionLetters = ["a", "b", "c", "d", "e"];

  // Auto-convert math on blur
  const handleAutoConvertContext = useAutoMathConvert({
    onConvert: (converted) => onUpdate("context", converted),
  });

  const handleQuestionUpdate = (
    questionIndex: number,
    field: keyof QuestionFormData,
    value: unknown
  ) => {
    const updatedQuestions = [...problem.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value as never,
    };
    onUpdate("questions", updatedQuestions);
  };

  const handleAddQuestion = () => {
    const nextLetter =
      questionLetters[problem.questions.length] ||
      String.fromCharCode(97 + problem.questions.length);
    const newQuestion = getDefaultQuestion(problem.questions.length, nextLetter);
    onUpdate("questions", [...problem.questions, newQuestion]);
  };

  const handleDeleteQuestion = (questionIndex: number) => {
    const updatedQuestions = problem.questions.filter(
      (_, idx) => idx !== questionIndex
    );
    // Reindex
    const reindexed = updatedQuestions.map((q, idx) => ({
      ...q,
      order_index: idx,
      question_number: questionLetters[idx] || String.fromCharCode(97 + idx),
    }));
    onUpdate("questions", reindexed);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3 bg-purple-50">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "" : "-rotate-90"
                }`}
              />
              <span className="font-medium">
                Асуулт {problem.problem_number}
                {problem.title && (
                  <span className="text-gray-600 font-normal ml-2">
                    - {problem.title}
                  </span>
                )}
              </span>
            </CollapsibleTrigger>
            {canDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`prob-number-${problemIndex}`}>
                  Дугаар
                </Label>
                <Input
                  id={`prob-number-${problemIndex}`}
                  type="number"
                  value={problem.problem_number}
                  onChange={(e) =>
                    onUpdate("problem_number", parseInt(e.target.value) || 1)
                  }
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor={`prob-title-${problemIndex}`}>
                  Гарчиг (заавал биш)
                </Label>
                <Input
                  id={`prob-title-${problemIndex}`}
                  value={problem.title || ""}
                  onChange={(e) => onUpdate("title", e.target.value || null)}
                  placeholder="Жишээ: Квадрат тэгшитгэл"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`prob-context-${problemIndex}`}>
                Нэгдсэн нөхцөл (заавал биш)
              </Label>
              <Textarea
                id={`prob-context-${problemIndex}`}
                value={problem.context || ""}
                onChange={(e) => onUpdate("context", e.target.value || null)}
                onBlur={(e) => handleAutoConvertContext(e.target.value)}
                placeholder="Бүх дэд асуултад хамааралтай нөхцөл. Жишээ: 1/2 автоматаар хөрвөнө"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Энэ нөхцөл дараах бүх дэд асуултад хамаарна. Математик автоматаар хөрвөнө
              </p>
              {problem.context && hasMath(problem.context) && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs font-medium text-gray-600 mb-1">Урьдчилан харах:</p>
                  <MathText className="text-sm">{problem.context}</MathText>
                </div>
              )}
            </div>

            <ImageUploadField
              label="Нэгдсэн нөхцлийн зураг"
              imageUrl={problem.image_url}
              onChange={(url) => onUpdate("image_url", url)}
              storagePath={`${storagePath}-prob-${problemIndex}`}
            />

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base">Дэд асуултууд</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Дэд асуулт нэмэх
                </Button>
              </div>

              {problem.questions.map((question, idx) => (
                <QuestionCard
                  key={idx}
                  question={question}
                  questionIndex={idx}
                  onUpdate={(field, value) =>
                    handleQuestionUpdate(idx, field, value)
                  }
                  onDelete={() => handleDeleteQuestion(idx)}
                  canDelete={problem.questions.length > 1}
                  storagePath={`${storagePath}-prob-${problemIndex}`}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
