"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { QuizForSelect } from "@/lib/actions/admin/quizzes";

type QuizSelectorProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  quizzes: QuizForSelect[];
  label?: string;
  placeholder?: string;
};

export const QuizSelector = ({
  value,
  onChange,
  quizzes,
  label = "Тест холбох",
  placeholder = "Тест сонгох",
}: QuizSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value || "none"}
        onValueChange={(v) => onChange(v === "none" ? null : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <span className="text-gray-500">Тестгүй</span>
          </SelectItem>
          {quizzes.map((quiz) => (
            <SelectItem key={quiz.id} value={quiz.id}>
              <div className="flex items-center gap-2">
                <span>{quiz.title}</span>
                <span className="text-xs text-gray-400">
                  ({quiz.question_count} асуулт)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        Сонгосон тест хичээлийн тест хэсэгт харагдана
      </p>
    </div>
  );
};
