"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "./ImageUploadField";
import { MathText, hasMath } from "@/components/shared/MathText";
import { useAutoMathConvert } from "@/hooks/useAutoMathConvert";
import type { OptionFormData } from "@/types/admin/mock-tests";

type OptionRowProps = {
  option: OptionFormData;
  isCorrect: boolean;
  onUpdate: (field: keyof OptionFormData, value: string | boolean | null) => void;
  onSetCorrect: () => void;
  onDelete: () => void;
  canDelete: boolean;
  optionIndex: number;
  storagePath: string;
};

export const OptionRow = ({
  option,
  isCorrect,
  onUpdate,
  onSetCorrect,
  onDelete,
  canDelete,
  optionIndex,
  storagePath,
}: OptionRowProps) => {
  const optionLabels = ["A", "B", "C", "D", "E"];

  // Auto-convert math on blur
  const handleAutoConvert = useAutoMathConvert({
    onConvert: (converted) => onUpdate("option_text", converted),
  });

  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg bg-white">
      <RadioGroupItem
        value={optionIndex.toString()}
        id={`option-${optionIndex}`}
        checked={isCorrect}
        onClick={onSetCorrect}
        className="mt-3 cursor-pointer"
      />

      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`option-text-${optionIndex}`}
              className="text-sm font-medium w-8"
            >
              {optionLabels[optionIndex]})
            </Label>
            <Input
              id={`option-text-${optionIndex}`}
              value={option.option_text}
              onChange={(e) => onUpdate("option_text", e.target.value)}
              onBlur={(e) => handleAutoConvert(e.target.value)}
              placeholder="Хариултын текст. Жишээ: 5/9"
              className="flex-1"
            />
          </div>
          {option.option_text && hasMath(option.option_text) && (
            <div className="ml-10 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <MathText>{option.option_text}</MathText>
            </div>
          )}
        </div>

        <ImageUploadField
          label="Хариултын зураг"
          imageUrl={option.image_url}
          onChange={(url) => onUpdate("image_url", url)}
          storagePath={`${storagePath}-opt-${optionIndex}`}
        />
      </div>

      {canDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
