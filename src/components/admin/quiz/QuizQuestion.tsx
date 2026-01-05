"use client";

import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { QuestionWithOptions } from "@/lib/actions/admin/quiz";

type QuizQuestionProps = {
  question: QuestionWithOptions;
  index: number;
  onUpdate: (id: string, data: { question: string; explanation: string; points: number }) => void;
  onDelete: (id: string) => void;
  onAddOption: (questionId: string, text: string) => void;
  onDeleteOption: (questionId: string, optionId: string) => void;
  onSetCorrect: (questionId: string, optionId: string) => void;
  isSubmitting: boolean;
};

export const QuizQuestion = ({
  question,
  index,
  onUpdate,
  onDelete,
  onAddOption,
  onDeleteOption,
  onSetCorrect,
  isSubmitting,
}: QuizQuestionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");
  const [showOptionInput, setShowOptionInput] = useState(false);

  return (
    <Card className="border-gray-200">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-medium">
            {index + 1}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <QuestionEditForm
                question={question}
                onSave={(data) => { onUpdate(question.id, data); setIsEditing(false); }}
                onCancel={() => setIsEditing(false)}
                isSubmitting={isSubmitting}
              />
            ) : (
              <>
                <p className="font-medium text-gray-900">{question.question}</p>
                {question.explanation && (
                  <p className="text-sm text-gray-500 mt-1">Explanation: {question.explanation}</p>
                )}
                <Badge variant="secondary" className="mt-2">{question.points} points</Badge>
              </>
            )}
          </div>
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(question.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mt-4">
          <Label className="text-sm text-gray-600">Options</Label>
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                option.is_correct ? "border-green-200 bg-green-50" : "border-gray-100 bg-gray-50"
              }`}
            >
              <button
                onClick={() => onSetCorrect(question.id, option.id)}
                disabled={isSubmitting}
                className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${
                  option.is_correct
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 hover:border-green-400"
                } cursor-pointer transition-colors`}
              >
                {option.is_correct && <Check className="h-3 w-3" />}
              </button>
              <span className="flex-1 text-sm">{option.option_text}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteOption(question.id, option.id)}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {showOptionInput ? (
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                placeholder="Option text..."
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (newOptionText.trim()) {
                    onAddOption(question.id, newOptionText);
                    setNewOptionText("");
                    setShowOptionInput(false);
                  }
                }}
                disabled={isSubmitting}
              >
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowOptionInput(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptionInput(true)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const QuestionEditForm = ({
  question,
  onSave,
  onCancel,
  isSubmitting,
}: {
  question: QuestionWithOptions;
  onSave: (data: { question: string; explanation: string; points: number }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = useState({
    question: question.question,
    explanation: question.explanation,
    points: question.points,
  });

  return (
    <div className="space-y-4">
      <Textarea
        value={formData.question}
        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
        rows={2}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          placeholder="Explanation..."
        />
        <Input
          type="number"
          min={1}
          value={formData.points}
          onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(formData)} disabled={isSubmitting}>Save</Button>
        <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};
