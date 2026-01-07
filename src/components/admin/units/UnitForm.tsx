"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  createUnit,
  updateUnit,
  type UnitFormData,
  type UnitWithRelations,
} from "@/lib/actions/admin/units";
import type { Course } from "@/types/database/tables";

type UnitFormProps = {
  unit?: UnitWithRelations | null;
  courses: Pick<Course, "id" | "title">[];
  defaultCourseId?: string;
};

export const UnitForm = ({ unit, courses, defaultCourseId }: UnitFormProps) => {
  const router = useRouter();
  const isEditing = !!unit;

  const [formData, setFormData] = useState<UnitFormData>({
    course_id: unit?.course_id || defaultCourseId || "",
    title: unit?.title || "",
    title_mn: unit?.title_mn || null,
    description: unit?.description || null,
    order_index: unit?.order_index || 0,
    unit_content: unit?.unit_content || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.course_id) {
      toast.error("Хичээл сонгоно уу");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Гарчиг оруулна уу");
      return;
    }

    setIsSubmitting(true);

    const result = isEditing
      ? await updateUnit(unit.id, formData)
      : await createUnit(formData);

    if (result.success) {
      toast.success(result.message);
      router.push(`/admin/courses/${formData.course_id}`);
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  const handleChange = (
    field: keyof UnitFormData,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">
            {isEditing ? "Бүлэг засах" : "Шинэ бүлэг"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="course_id">Хичээл</Label>
            <Select
              value={formData.course_id}
              onValueChange={(value) => handleChange("course_id", value)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Хичээл сонгох" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Гарчиг</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Бүлгийн нэр"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_content">Агуулга</Label>
            <Input
              id="unit_content"
              value={formData.unit_content || ""}
              onChange={(e) =>
                handleChange("unit_content", e.target.value || null)
              }
              placeholder="жишээ нь: ТОО ТООЛОЛ, АЛГЕБР"
            />
            <p className="text-xs text-gray-500">
              Бүлгийг агуулгын хэсэгт бүлэглэх
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Эрэмбэ</Label>
            <Input
              id="order_index"
              type="number"
              min={0}
              value={formData.order_index}
              onChange={(e) =>
                handleChange("order_index", parseInt(e.target.value) || 0)
              }
              className="w-32"
            />
            <p className="text-xs text-gray-500">Бага тоо эхэнд харагдана</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Хадгалж байна..."
                : isEditing
                ? "Шинэчлэх"
                : "Үүсгэх"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  formData.course_id
                    ? `/admin/courses/${formData.course_id}`
                    : "/admin/units"
                )
              }
            >
              Цуцлах
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
