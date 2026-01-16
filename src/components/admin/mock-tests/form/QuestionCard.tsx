"use client";

import { useState } from "react";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { OptionRow } from "./OptionRow";
import { ImageUploadField } from "./ImageUploadField";
import { MathText, hasMath } from "@/components/shared/MathText";
import { MathGuide } from "./MathGuide";
import { useAutoMathConvert } from "@/hooks/useAutoMathConvert";
import type { QuestionFormData, OptionFormData } from "@/types/admin/mock-tests";
import { getDefaultOption } from "@/types/admin/mock-tests";

type QuestionCardProps = {
  question: QuestionFormData;
  questionIndex: number;
  onUpdate: (field: keyof QuestionFormData, value: string | number | null | OptionFormData[]) => void;
  onDelete: () => void;
  canDelete: boolean;
  storagePath: string;
};

export const QuestionCard = ({
  question,
  questionIndex,
  onUpdate,
  onDelete,
  canDelete,
  storagePath,
}: QuestionCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Auto-convert math on blur
  const handleAutoConvertText = useAutoMathConvert({
    onConvert: (converted) => onUpdate("question_text", converted),
  });

  const handleAutoConvertExplanation = useAutoMathConvert({
    onConvert: (converted) => onUpdate("explanation", converted),
  });

  const handleOptionUpdate = (
    optionIndex: number,
    field: keyof OptionFormData,
    value: unknown
  ) => {
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value as never,
    };
    onUpdate("options", updatedOptions);
  };

  const handleSetCorrect = (optionIndex: number) => {
    const updatedOptions = question.options.map((opt, idx) => ({
      ...opt,
      is_correct: idx === optionIndex,
    }));
    onUpdate("options", updatedOptions);
  };

  const handleAddOption = () => {
    const newOption = getDefaultOption(question.options.length);
    onUpdate("options", [...question.options, newOption]);
  };

  const handleDeleteOption = (optionIndex: number) => {
    const updatedOptions = question.options.filter((_, idx) => idx !== optionIndex);
    // Reindex
    const reindexed = updatedOptions.map((opt, idx) => ({
      ...opt,
      order_index: idx,
    }));
    onUpdate("options", reindexed);
  };

  const correctIndex = question.options.findIndex((opt) => opt.is_correct);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "" : "-rotate-90"
                }`}
              />
              <span className="font-medium text-sm">
                Асуулт {question.question_number})
                {question.question_text && (
                  <span className="text-gray-600 font-normal ml-2 line-clamp-1">
                    {question.question_text.substring(0, 50)}...
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
          <CardContent className="space-y-4 pt-0">
            <MathGuide />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`q-number-${questionIndex}`}>
                  Дугаар (a, b, c)
                </Label>
                <Input
                  id={`q-number-${questionIndex}`}
                  value={question.question_number}
                  onChange={(e) => onUpdate("question_number", e.target.value)}
                  placeholder="a"
                />
              </div>
              <div>
                <Label htmlFor={`q-points-${questionIndex}`}>Оноо</Label>
                <Input
                  id={`q-points-${questionIndex}`}
                  type="number"
                  value={question.points}
                  onChange={(e) =>
                    onUpdate("points", parseInt(e.target.value) || 10)
                  }
                  min={1}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`q-text-${questionIndex}`}>
                Асуултын текст <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id={`q-text-${questionIndex}`}
                value={question.question_text}
                onChange={(e) => onUpdate("question_text", e.target.value)}
                onBlur={(e) => handleAutoConvertText(e.target.value)}
                placeholder="Асуултыг энд бичнэ үү. Жишээ: 5/9 автоматаар хөрвөнө"
                rows={3}
              />
              {question.question_text && hasMath(question.question_text) && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs font-medium text-gray-600 mb-1">Урьдчилан харах:</p>
                  <MathText className="text-sm">{question.question_text}</MathText>
                </div>
              )}
            </div>

            <ImageUploadField
              label="Асуултын зураг"
              imageUrl={question.image_url}
              onChange={(url) => onUpdate("image_url", url)}
              storagePath={`${storagePath}-q-${questionIndex}`}
            />

            <div>
              <Label htmlFor={`q-explanation-${questionIndex}`}>
                Тайлбар <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id={`q-explanation-${questionIndex}`}
                value={question.explanation}
                onChange={(e) => onUpdate("explanation", e.target.value)}
                onBlur={(e) => handleAutoConvertExplanation(e.target.value)}
                placeholder="Зөв хариултын тайлбарыг бичнэ үү. Жишээ: x = 5/6"
                rows={3}
              />
              {question.explanation && hasMath(question.explanation) && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs font-medium text-gray-600 mb-1">Урьдчилан харах:</p>
                  <MathText className="text-sm">{question.explanation}</MathText>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>
                  Хариултууд (хамгийн багадаа 2, зөв хариултыг сонгоно уу){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Хариулт нэмэх
                </Button>
              </div>

              <RadioGroup value={correctIndex.toString()}>
                {question.options.map((option, idx) => (
                  <OptionRow
                    key={idx}
                    option={option}
                    isCorrect={option.is_correct}
                    onUpdate={(field, value) =>
                      handleOptionUpdate(idx, field, value)
                    }
                    onSetCorrect={() => handleSetCorrect(idx)}
                    onDelete={() => handleDeleteOption(idx)}
                    canDelete={question.options.length > 2}
                    optionIndex={idx}
                    storagePath={`${storagePath}-q-${questionIndex}`}
                  />
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
