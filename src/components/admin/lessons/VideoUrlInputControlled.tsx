"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Video } from "lucide-react";
import { isValidVideoUrl } from "@/lib/utils";

type VideoUrlInputControlledProps = {
  value: string;
  onChange: (url: string | null) => void;
  label: string;
};

export const VideoUrlInputControlled = ({
  value,
  onChange,
  label,
}: VideoUrlInputControlledProps) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!value.trim()) {
      setIsValid(null);
      return;
    }
    setIsValid(isValidVideoUrl(value.trim()));
  }, [value]);

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Video className="h-4 w-4 text-gray-500" />
        {label}
      </Label>
      <div className="relative">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://youtube.com/watch?v=... эсвэл https://vimeo.com/..."
          className="pr-10"
        />
        {isValid !== null && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">Url оруулна уу</p>
    </div>
  );
};
