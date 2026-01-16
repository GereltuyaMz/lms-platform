"use client";

import { useState } from "react";
import { Wand2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MathText } from "@/components/shared/MathText";
import { hasConvertibleMath, previewConversion } from "@/lib/utils/math-converter";

type MathConverterProps = {
  text: string;
  onConvert: (converted: string) => void;
};

export const MathConverter = ({ text, onConvert }: MathConverterProps) => {
  const [showPreview, setShowPreview] = useState(false);

  // Don't show if no convertible patterns found
  if (!hasConvertibleMath(text)) {
    return null;
  }

  const preview = previewConversion(text);

  const handleConvert = () => {
    onConvert(preview.converted);
    setShowPreview(false);
  };

  return (
    <Popover open={showPreview} onOpenChange={setShowPreview}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Математик болгох
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-900 mb-1">
                Математик томъёо илрүүллээ
              </h4>
              <p className="text-xs text-gray-600">
                {preview.patterns.length} төрлийн томъёо олдлоо
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Одоо:</p>
              <div className="p-2 bg-gray-50 rounded border text-sm">
                {preview.original}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">
                Хөрвүүлсний дараа:
              </p>
              <div className="p-2 bg-blue-50 rounded border text-sm">
                <MathText>{preview.converted}</MathText>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleConvert}
              className="flex-1"
            >
              Хөрвүүлэх
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(false)}
            >
              Болих
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">Илрүүлсэн томъёо:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {preview.patterns.map((pattern, idx) => (
                <li key={idx}>{pattern}</li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
