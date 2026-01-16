"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { MockTestFormData } from "@/types/admin/mock-tests";

type TestDetailsCardProps = {
  formData: MockTestFormData;
  onChange: (path: string[], value: unknown) => void;
};

export const TestDetailsCard = ({
  formData,
  onChange,
}: TestDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Шалгалтын мэдээлэл</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="test-title">
            Гарчиг <span className="text-red-500">*</span>
          </Label>
          <Input
            id="test-title"
            value={formData.title}
            onChange={(e) => onChange(["title"], e.target.value)}
            placeholder="Элсэлтийн шалгалт 2024"
            required
          />
        </div>

        <div>
          <Label htmlFor="test-description">Тайлбар</Label>
          <Textarea
            id="test-description"
            value={formData.description || ""}
            onChange={(e) => onChange(["description"], e.target.value || null)}
            placeholder="Шалгалтын тухай товч тайлбар"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="test-time-limit">
              Хугацаа (минут) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="test-time-limit"
              type="number"
              value={formData.time_limit_minutes}
              onChange={(e) =>
                onChange(["time_limit_minutes"], parseInt(e.target.value) || 180)
              }
              min={1}
              required
            />
          </div>

          <div>
            <Label htmlFor="test-passing-score">
              Тэнцэх оноо (%) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="test-passing-score"
              type="number"
              value={formData.passing_score_percentage}
              onChange={(e) =>
                onChange(
                  ["passing_score_percentage"],
                  parseInt(e.target.value) || 60
                )
              }
              min={0}
              max={100}
              required
            />
          </div>

          <div>
            <Label htmlFor="test-total-questions">
              Нийт асуулт <span className="text-gray-500">(автомат)</span>
            </Label>
            <Input
              id="test-total-questions"
              type="number"
              value={formData.total_questions}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Анхааруулга:</span> Шалгалт үүсгэсний
            дараа &quot;Ноорог&quot; төлөвтэй байна. Нийтлэхийн өмнө бүх мэдээлэл зөв
            эсэхийг шалгана уу.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
