"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QuizFormData } from "@/lib/actions/admin/quizzes";

type QuizMetadataTabProps = {
  formData: QuizFormData;
  onChange: (data: Partial<QuizFormData>) => void;
};

export const QuizMetadataTab = ({ formData, onChange }: QuizMetadataTabProps) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Гарчиг *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Тестийн нэр"
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Тайлбар</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange({ description: e.target.value || null })}
          placeholder="Тестийн товч тайлбар..."
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
};
