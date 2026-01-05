"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
    title_mn: unit?.title_mn || "",
    description: unit?.description || "",
    order_index: unit?.order_index || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.course_id) {
      toast.error("Please select a course");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
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
            {isEditing ? "Edit Unit" : "New Unit"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="course_id">Course</Label>
            <Select
              value={formData.course_id}
              onValueChange={(value) => handleChange("course_id", value)}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title (English)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Introduction to Algebra"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title_mn">Title (Mongolian)</Label>
              <Input
                id="title_mn"
                value={formData.title_mn || ""}
                onChange={(e) =>
                  handleChange("title_mn", e.target.value || null)
                }
                placeholder="e.g., Алгебрын үндэс"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                handleChange("description", e.target.value || null)
              }
              placeholder="Brief description of this unit..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Sort Order</Label>
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
            <p className="text-xs text-gray-500">Lower numbers appear first</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Unit"
                : "Create Unit"}
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
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
