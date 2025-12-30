import { Loader2 } from "lucide-react";

export const LessonContentLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Ачааллаж байна...</p>
      </div>
    </div>
  );
};
