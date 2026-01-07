"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createUnit, updateUnit, type UnitFormData } from "@/lib/actions/admin/units";
import { UnitContentInput } from "./UnitContentInput";

type UnitInlineFormProps = {
  courseId: string;
  unit?: {
    id: string;
    title: string;
    description: string | null;
    order_index: number;
    unit_content: string | null;
  } | null;
  nextOrderIndex: number;
  suggestions: string[];
  onSuccess: () => void;
  onCancel: () => void;
};

export const UnitInlineForm = ({
  courseId,
  unit,
  nextOrderIndex,
  suggestions,
  onSuccess,
  onCancel,
}: UnitInlineFormProps) => {
  const isEditing = !!unit;
  const inputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: unit?.title || "",
    unit_content: unit?.unit_content || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Гарчиг оруулна уу");
      return;
    }

    setIsSubmitting(true);

    const data: UnitFormData = {
      course_id: courseId,
      title: formData.title.trim(),
      title_mn: null,
      description: null,
      order_index: isEditing ? unit.order_index : nextOrderIndex,
      unit_content: formData.unit_content.trim() || null,
    };

    const result = isEditing
      ? await updateUnit(unit.id, data)
      : await createUnit(data);

    if (result.success) {
      toast.success(isEditing ? "Бүлэг шинэчлэгдлээ" : "Бүлэг үүсгэгдлээ");
      onSuccess();
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="space-y-3">
        <Input
          ref={inputRef}
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Бүлгийн нэр"
          className="h-9"
          disabled={isSubmitting}
        />
        <UnitContentInput
          value={formData.unit_content}
          onChange={(value) => setFormData((prev) => ({ ...prev, unit_content: value }))}
          suggestions={suggestions}
          disabled={isSubmitting}
        />
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" className="h-8" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5 mr-1" />
            )}
            {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Болих
          </Button>
        </div>
      </div>
    </form>
  );
};
