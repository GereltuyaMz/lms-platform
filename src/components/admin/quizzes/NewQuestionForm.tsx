"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NewQuestionFormState = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type NewQuestionFormProps = {
  onSubmit: (data: NewQuestionFormState) => Promise<boolean>;
  isSubmitting: boolean;
};

const DEFAULT_STATE: NewQuestionFormState = {
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
};

export const NewQuestionForm = ({
  onSubmit,
  isSubmitting,
}: NewQuestionFormProps) => {
  const [formData, setFormData] = useState<NewQuestionFormState>(DEFAULT_STATE);

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async () => {
    const success = await onSubmit(formData);
    if (success) {
      setFormData(DEFAULT_STATE);
    }
  };

  return (
    <Card className="border-gray-200 border-dashed">
      <CardHeader>
        <CardTitle className="text-lg">Шинэ асуулт нэмэх</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question text */}
        <div className="space-y-2">
          <Label htmlFor="new-question">Асуулт</Label>
          <Textarea
            id="new-question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            placeholder="Асуултаа оруулна уу..."
            rows={2}
          />
        </div>

        {/* Options with radio buttons */}
        <div className="space-y-2">
          <Label>Хариултууд</Label>
          <div className="space-y-2">
            {["A", "B", "C", "D"].map((letter, index) => (
              <div
                key={letter}
                className={cn(
                  "flex items-center gap-3 rounded-lg border transition-all",
                  formData.correctIndex === index
                    ? "border-green-400 bg-green-50 ring-1 ring-green-400"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, correctIndex: index })
                  }
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-l-lg border-r transition-colors shrink-0 cursor-pointer",
                    formData.correctIndex === index
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  )}
                >
                  {formData.correctIndex === index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{letter}</span>
                  )}
                </button>
                <Input
                  value={formData.options[index]}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Хариулт ${letter} оруулах...`}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Үсэг дээр дарж зөв хариултыг тэмдэглэнэ үү
          </p>
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <Label htmlFor="new-explanation">Тайлбар (заавал биш)</Label>
          <Input
            id="new-explanation"
            value={formData.explanation}
            onChange={(e) =>
              setFormData({
                ...formData,
                explanation: e.target.value,
              })
            }
            placeholder="Яагаад энэ хариулт зөв болохыг тайлбарлана уу..."
          />
        </div>

        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Plus className="h-4 w-4 mr-2" />
          Асуулт нэмэх
        </Button>
      </CardContent>
    </Card>
  );
};
