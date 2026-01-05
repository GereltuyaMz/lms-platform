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
  createCategory,
  updateCategory,
  type CategoryFormData,
} from "@/lib/actions/admin/categories";
import type { Category } from "@/types/database/tables";

type CategoryFormProps = {
  category?: Category | null;
  parentCategories: Category[];
};

export const CategoryForm = ({
  category,
  parentCategories,
}: CategoryFormProps) => {
  const router = useRouter();
  const isEditing = !!category;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    name_mn: category?.name_mn || "",
    description: category?.description || "",
    category_type: category?.category_type || "subject",
    parent_id: category?.parent_id || null,
    icon: category?.icon || "",
    order_index: category?.order_index || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);

    const result = isEditing
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/categories");
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  const handleChange = (field: keyof CategoryFormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">
            {isEditing ? "Edit Category" : "New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name (English)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Mathematics"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_mn">Name (Mongolian)</Label>
              <Input
                id="name_mn"
                value={formData.name_mn || ""}
                onChange={(e) => handleChange("name_mn", e.target.value || null)}
                placeholder="e.g., Математик"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value || null)}
              placeholder="Brief description of this category..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category_type">Type</Label>
              <Select
                value={formData.category_type}
                onValueChange={(value: "exam" | "subject") =>
                  handleChange("category_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Exam Type</SelectItem>
                  <SelectItem value="subject">Subject</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Exam types are top-level, subjects can be nested
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent Category</Label>
              <Select
                value={formData.parent_id || "none"}
                onValueChange={(value) =>
                  handleChange("parent_id", value === "none" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {parentCategories.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.icon && `${parent.icon} `}
                      {parent.name_mn || parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              />
              <p className="text-xs text-gray-500">Lower numbers appear first</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input
              id="icon"
              value={formData.icon || ""}
              onChange={(e) => handleChange("icon", e.target.value || null)}
              placeholder="e.g., 📐"
              className="w-32"
            />
            <p className="text-xs text-gray-500">
              Use an emoji as the category icon
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Category"
                : "Create Category"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
