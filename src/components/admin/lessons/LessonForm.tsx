"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  createLesson,
  updateLesson,
  type LessonFormData,
  type LessonWithRelations,
} from "@/lib/actions/admin/lessons";
import { UnitSelector, BasicFields, VideoFields, TextFields, PreviewToggle } from "./LessonFormFields";

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
    lesson_type: lesson?.lesson_type || "video",
    video_url: lesson?.video_url || "",
    content: lesson?.content || "",
    duration_seconds: lesson?.duration_seconds || null,
    is_preview: lesson?.is_preview || false,
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

  const handleChange = (field: keyof LessonFormData, value: string | number | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUnitChange = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    if (unit) {
      setFormData((prev) => ({ ...prev, unit_id: unitId, course_id: unit.course_id }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UnitSelector unitId={formData.unit_id} units={units} onUnitChange={handleUnitChange} />
          <BasicFields formData={formData} onChange={handleChange} />
          {formData.lesson_type === "video" && (
            <VideoFields
              videoUrl={formData.video_url}
              durationSeconds={formData.duration_seconds}
              onChange={handleChange}
            />
          )}
          {formData.lesson_type === "text" && (
            <TextFields content={formData.content} onChange={handleChange} />
          )}
          <PreviewToggle
            isPreview={formData.is_preview}
            onChange={(checked) => handleChange("is_preview", checked)}
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Lesson" : "Create Lesson"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(formData.unit_id ? `/admin/units/${formData.unit_id}` : "/admin/lessons")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
