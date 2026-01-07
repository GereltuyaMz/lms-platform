"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  createLesson,
  updateLesson,
  type LessonFormData,
  type LessonWithRelations,
} from "@/lib/actions/admin/lessons";

type UnitOption = {
  id: string;
  title: string;
  title_mn: string | null;
  course_id: string;
  course_title: string;
};

type LessonFormProps = {
  lesson?: LessonWithRelations | null;
  units: UnitOption[];
  defaultUnitId?: string;
};

export const LessonForm = ({ lesson, units, defaultUnitId }: LessonFormProps) => {
  const router = useRouter();
  const isEditing = !!lesson;

  const defaultUnit = defaultUnitId
    ? units.find((u) => u.id === defaultUnitId)
    : lesson?.unit
    ? units.find((u) => u.id === lesson.unit_id)
    : null;

  const [formData, setFormData] = useState<LessonFormData>({
    course_id: lesson?.course_id || defaultUnit?.course_id || "",
    unit_id: lesson?.unit_id || defaultUnitId || null,
    title: lesson?.title || "",
    description: lesson?.description || "",
    order_in_unit: lesson?.order_in_unit || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.course_id) {
      toast.error("Please select a unit");
      return;
    }
    setIsSubmitting(true);
    const result = isEditing ? await updateLesson(lesson.id, formData) : await createLesson(formData);

    if (result.success) {
      toast.success(result.message);
      router.push(formData.unit_id ? `/admin/units/${formData.unit_id}` : "/admin/lessons");
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleUnitChange = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    if (unit) {
      setFormData((prev) => ({ ...prev, unit_id: unitId, course_id: unit.course_id }));
    }
  };

  const groupedUnits = units.reduce(
    (acc, unit) => {
      const courseName = unit.course_title || "No Course";
      if (!acc[courseName]) acc[courseName] = [];
      acc[courseName].push(unit);
      return acc;
    },
    {} as Record<string, UnitOption[]>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Хичээлийн мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="unit_id">Бүлэг</Label>
            <Select value={formData.unit_id || ""} onValueChange={handleUnitChange}>
              <SelectTrigger>
                <SelectValue placeholder="Бүлэг сонгох" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedUnits).map(([courseName, courseUnits]) => (
                  <div key={courseName}>
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500">{courseName}</div>
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
            <Label htmlFor="title">Гарчиг</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Хичээлийн нэр"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Тайлбар</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value || null }))}
              placeholder="Хичээлийн товч тайлбар..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_in_unit">Эрэмбэ</Label>
            <Input
              id="order_in_unit"
              type="number"
              min={0}
              value={formData.order_in_unit}
              onChange={(e) => setFormData((prev) => ({ ...prev, order_in_unit: parseInt(e.target.value) || 0 }))}
              className="w-32"
            />
            <p className="text-xs text-gray-500">Бүлэг доторх дараалал</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Хадгалж байна..." : isEditing ? "Шинэчлэх" : "Үүсгэх"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(formData.unit_id ? `/admin/units/${formData.unit_id}` : "/admin/lessons")}
        >
          Цуцлах
        </Button>
      </div>
    </form>
  );
};
