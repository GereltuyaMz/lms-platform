import { Clock, FileText, Info, Trophy } from "lucide-react";
import type { MockTest } from "@/types/mock-test";

type TestInfoCardProps = {
  test: MockTest;
};

export const TestInfoCard = ({ test }: TestInfoCardProps) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Тестийн мэдээлэл</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Нийт асуулт</p>
            <p className="text-gray-600">{test.total_questions} асуулт</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Хугацаа</p>
            <p className="text-gray-600">{test.time_limit_minutes} минут</p>
          </div>
        </div>
      </div>
    </div>
  );
};
