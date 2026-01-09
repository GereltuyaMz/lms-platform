"use client";

import { Button } from "@/components/ui/button";

type QuizEditorFooterProps = {
  hasChanges: boolean;
  isSubmitting: boolean;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export const QuizEditorFooter = ({
  hasChanges,
  isSubmitting,
  isEditing,
  onSave,
  onCancel,
}: QuizEditorFooterProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
      <div className="flex items-center justify-end gap-4 max-w-screen-xl mx-auto">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Цуцлах
        </Button>
        <Button
          onClick={onSave}
          disabled={isSubmitting || (!hasChanges && isEditing)}
        >
          {isSubmitting
            ? "Хадгалж байна..."
            : isEditing
            ? "Шинэчлэх"
            : "Үүсгэх"}
        </Button>
      </div>
    </div>
  );
};
