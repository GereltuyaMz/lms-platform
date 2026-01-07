"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LessonFormData } from "@/lib/actions/admin/lessons";

type UnitOption = {
  id: string;
  title: string;
  title_mn: string | null;
  course_id: string;
  course_title: string;
};

type LessonInfoTabProps = {
  formData: LessonFormData;
  onChange: (data: Partial<LessonFormData>) => void;
  units: UnitOption[];
};

export const LessonInfoTab = ({
  formData,
  onChange,
  units,
}: LessonInfoTabProps) => {
  const groupedUnits = units.reduce((acc, unit) => {
    const courseName = unit.course_title || "No Course";
    if (!acc[courseName]) acc[courseName] = [];
    acc[courseName].push(unit);
    return acc;
  }, {} as Record<string, UnitOption[]>);

  const handleUnitChange = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    if (unit) {
      onChange({ unit_id: unitId, course_id: unit.course_id });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Гарчиг *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Хичээлийн нэр"
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Тайлбар</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange({ description: e.target.value || null })}
          placeholder="Хичээлийн товч тайлбар..."
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="unit_id">Бүлэг *</Label>
          <Select
            value={formData.unit_id || ""}
            onValueChange={handleUnitChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Бүлэг сонгох" />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              {Object.entries(groupedUnits).map(([courseName, courseUnits]) => (
                <div key={courseName}>
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                    {courseName}
                  </div>
                  {courseUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.title_mn || unit.title}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_in_unit">Эрэмбэ</Label>
          <Input
            id="order_in_unit"
            type="number"
            min={0}
            value={formData.order_in_unit}
            onChange={(e) =>
              onChange({ order_in_unit: parseInt(e.target.value) || 0 })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500">Бүлэг доторх дараалал</p>
        </div>
      </div>
    </div>
  );
};
