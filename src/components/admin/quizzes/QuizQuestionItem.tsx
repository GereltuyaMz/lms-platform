"use client";

import { useState } from "react";
import { Check, Pencil, Trash2, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { QuestionWithOptions } from "@/lib/actions/admin/quizzes";

type QuizQuestionItemProps = {
  question: QuestionWithOptions;
  index: number;
  onUpdate: (
    id: string,
    data: { question: string; explanation: string; points: number }
  ) => Promise<void>;
  onDelete: (id: string) => void;
  onAddOption: (questionId: string, text: string) => Promise<void>;
  onDeleteOption: (questionId: string, optionId: string) => Promise<void>;
  onSetCorrect: (questionId: string, optionId: string) => Promise<void>;
  isSubmitting: boolean;
};

export const QuizQuestionItem = ({
  question,
  index,
  onUpdate,
  onDelete,
  onAddOption,
  onDeleteOption,
  onSetCorrect,
  isSubmitting,
}: QuizQuestionItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    question: question.question,
    explanation: question.explanation,
  });
  const [newOptionText, setNewOptionText] = useState("");

  const handleSave = async () => {
    await onUpdate(question.id, { ...editData, points: 10 });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      question: question.question,
      explanation: question.explanation,
    });
    setIsEditing(false);
  };

  const handleAddOption = async () => {
    if (!newOptionText.trim()) return;
    await onAddOption(question.id, newOptionText.trim());
    setNewOptionText("");
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-medium text-sm shrink-0">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editData.question}
                  onChange={(e) =>
                    setEditData({ ...editData, question: e.target.value })
                  }
                  placeholder="Асуултаа оруулна уу..."
                  rows={2}
                  className="resize-none"
                />
                <Input
                  value={editData.explanation}
                  onChange={(e) =>
                    setEditData({ ...editData, explanation: e.target.value })
                  }
                  placeholder="Тайлбар"
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSubmitting}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Хадгалах
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Болих
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="font-medium text-gray-900">{question.question}</p>
                {question.explanation && (
                  <p className="text-sm text-gray-500 mt-1">
                    Тайлбар: {question.explanation}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isSubmitting}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(question.id)}
              disabled={isSubmitting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 mt-2">
          {question.options.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                option.is_correct
                  ? "border-green-200 bg-green-50"
                  : "border-gray-100 bg-gray-50 hover:bg-gray-100"
              )}
            >
              <button
                type="button"
                onClick={() => onSetCorrect(question.id, option.id)}
                disabled={isSubmitting}
                className={cn(
                  "flex items-center justify-center h-5 w-5 rounded-full border-2 transition-colors shrink-0",
                  option.is_correct
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 hover:border-green-400"
                )}
              >
                {option.is_correct && <Check className="h-3 w-3" />}
              </button>
              <span className="flex-1 text-sm">{option.option_text}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteOption(question.id, option.id)}
                disabled={isSubmitting}
                className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Input
            value={newOptionText}
            onChange={(e) => setNewOptionText(e.target.value)}
            placeholder="Хариулт нэмэх..."
            className="h-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddOption();
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            disabled={isSubmitting || !newOptionText.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
