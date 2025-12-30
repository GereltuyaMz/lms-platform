import { AlertCircle } from "lucide-react";

type IncompleteAttemptWarningProps = {
  timeRemainingSeconds: number;
};

export const IncompleteAttemptWarning = ({ timeRemainingSeconds }: IncompleteAttemptWarningProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="font-bold text-yellow-900 mb-1">Дуусаагүй тест</h3>
          <p className="text-yellow-800">
            Та өмнө эхлүүлсэн тестээ үргэлжлүүлэх боломжтой. Үлдсэн хугацаа:{" "}
            {Math.floor(timeRemainingSeconds / 60)} минут
          </p>
        </div>
      </div>
    </div>
  );
};
