"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Save, Plus } from "lucide-react";

type LessonEditorFooterProps = {
  hasChanges: boolean;
  isSubmitting: boolean;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export const LessonEditorFooter = ({
  hasChanges,
  isSubmitting,
  isEditing,
  onSave,
  onCancel,
}: LessonEditorFooterProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Хадгалаагүй өөрчлөлт байна
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>
            Цуцлах
          </Button>
          <Button
            onClick={onSave}
            disabled={isSubmitting || !hasChanges}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {isEditing ? "Хадгалж байна..." : "Үүсгэж байна..."}
              </>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Хадгалах
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Үүсгэх
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
