import { Loader2 } from "lucide-react";

export default function LessonRedirectLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="text-lg font-medium text-gray-700">Ачааллаж байна...</p>
        <p className="text-sm text-muted-foreground">Хичээлийг нээж байна</p>
      </div>
    </div>
  );
}
