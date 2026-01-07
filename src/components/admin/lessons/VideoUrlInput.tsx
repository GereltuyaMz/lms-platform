"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { isValidVideoUrl } from "@/lib/utils";

type VideoUrlInputProps = {
  initialUrl?: string | null;
  onSave: (url: string | null) => void;
  label: string;
};

// Debounce utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export const VideoUrlInput = ({
  initialUrl = null,
  onSave,
  label,
}: VideoUrlInputProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Debounced save function
  const debouncedSave = useMemo(
    () =>
      debounce((value: string) => {
        onSave(value.trim() || null);
      }, 500),
    [onSave]
  );

  // Update validation state when URL changes
  useEffect(() => {
    if (!url.trim()) {
      setIsValid(null);
      return;
    }

    const valid = isValidVideoUrl(url.trim());
    setIsValid(valid);
  }, [url]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    debouncedSave(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="video-url">{label}</Label>
      <div className="relative">
        <Input
          id="video-url"
          type="url"
          value={url}
          onChange={handleChange}
          placeholder="https://youtube.com/watch?v=... эсвэл https://vimeo.com/..."
          className="pr-10"
        />
        {isValid !== null && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Url оруулна уу
      </p>
    </div>
  );
};
