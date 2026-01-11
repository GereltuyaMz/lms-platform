"use client";

import { Video, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  error: string;
  label: string;
  onRetry: () => void;
};

export const VideoErrorState = ({ error, label, onRetry }: Props) => (
  <div className="space-y-2">
    <label className="text-sm font-medium flex items-center gap-2">
      <Video className="h-4 w-4 text-gray-500" />
      {label}
    </label>
    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
      <div className="flex items-center gap-2 text-red-600 mb-2">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Алдаа</span>
      </div>
      <p className="text-sm text-red-700 mb-3">{error}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Дахин оролдох
      </Button>
    </div>
  </div>
);
