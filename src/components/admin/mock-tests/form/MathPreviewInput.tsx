"use client";

import { useState } from "react";
import { Eye, Copy, Check, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MathText } from "@/components/shared/MathText";
import { useMathPreview } from "@/hooks/useMathPreview";
import { cn } from "@/lib/utils";

type MathPreviewInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
};

/**
 * Math input with live LaTeX preview
 * Users type in AsciiMath syntax and see real-time rendering
 *
 * @example
 * ```tsx
 * <MathPreviewInput
 *   value={question}
 *   onChange={setQuestion}
 *   label="Асуулт"
 *   placeholder="x/2 + sqrt(y) = 10"
 * />
 * ```
 */
export const MathPreviewInput = ({
  value,
  onChange,
  label = "Математик томъёо",
  placeholder = "x/y, sqrt(x), x^2, sum_(i=1)^n x_i",
  className,
}: MathPreviewInputProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const { latex, error, isConverting } = useMathPreview(value);

  const handleCopy = async () => {
    if (latex) {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <div className="space-y-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-sm min-h-[100px]"
          rows={4}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            <Eye className="h-3.5 w-3.5" />
            {showPreview ? "Нуух" : "Харуулах"}
          </Button>

          {latex && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  Хуулсан
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  LaTeX хуулах
                </>
              )}
            </Button>
          )}

          {isConverting && (
            <span className="text-xs text-gray-500">Хөрвүүлж байна...</span>
          )}
        </div>

        {showPreview && (
          <div className="border rounded-lg p-4 bg-gray-50">
            {error ? (
              <div className="flex items-start gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Алдаа гарлаа</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              </div>
            ) : latex ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Үр дүн:</p>
                <div className="p-3 bg-white rounded border">
                  <MathText>{latex}</MathText>
                </div>
                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-1">LaTeX код:</p>
                  <code className="block p-2 bg-gray-100 rounded text-xs font-mono break-all">
                    {latex}
                  </code>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                AsciiMath томъёо оруулна уу...
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">Жишээ:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li><code className="bg-gray-100 px-1 rounded">x/y</code> → хуваарь</li>
            <li><code className="bg-gray-100 px-1 rounded">sqrt(x)</code> → язгуур</li>
            <li><code className="bg-gray-100 px-1 rounded">x^2</code> → зэрэг</li>
            <li><code className="bg-gray-100 px-1 rounded">sum_(i=1)^n x_i</code> → нийлбэр</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
