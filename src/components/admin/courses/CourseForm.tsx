"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createCourse,
  updateCourse,
  type CourseFormData,
  type CourseWithRelations,
} from "@/lib/actions/admin/courses";
import type { Category, Teacher } from "@/types/database/tables";
import { CourseDetailsCard, CategoryCard, PublishCard } from "./CourseFormFields";

type CourseFormProps = {
  course?: CourseWithRelations | null;
  categories: Category[];
  teachers: Teacher[];
};

export const CourseForm = ({ course, categories, teachers }: CourseFormProps) => {
  const router = useRouter();
  const isEditing = !!course;

  const [formData, setFormData] = useState<CourseFormData>({
    title: course?.title || "",
    description: course?.description || "",
    thumbnail_url: course?.thumbnail_url || null,
    price: course?.price || 0,
    original_price: course?.original_price || null,
    instructor_id: course?.instructor_id || null,
    category_ids: course?.categories.map((c) => c.id) || [],
    is_published: course?.is_published || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Гарчиг оруулна уу");
      return;
    }
    setIsSubmitting(true);
    const result = isEditing
      ? await updateCourse(course.id, formData)
      : await createCourse(formData);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/courses");
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleChange = (
    field: keyof CourseFormData,
    value: string | number | boolean | string[] | null
  ) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter((id) => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CourseDetailsCard formData={formData} teachers={teachers} courseId={course?.id} onChange={handleChange} />
      <CategoryCard
        categories={categories}
        selectedIds={formData.category_ids}
        onToggle={handleCategoryToggle}
      />
      {isEditing && (
        <PublishCard
          isPublished={formData.is_published}
          onChange={(checked) => handleChange("is_published", checked)}
        />
      )}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Хадгалж байна..." : isEditing ? "Хадгалах" : "Үүсгэх"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/courses")}>
          Болих
        </Button>
      </div>
    </form>
  );
};
