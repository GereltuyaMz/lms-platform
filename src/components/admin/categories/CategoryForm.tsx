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

export const CategoryForm = ({ category, parentCategories }: CategoryFormProps) => {
  const router = useRouter();
  const isEditing = !!category;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
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
      toast.error("Нэр оруулна уу");
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
            {isEditing ? "Ангилал засах" : "Шинэ ангилал"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Нэр</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="жишээ нь: Mathematics"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Тайлбар</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value || null)}
              placeholder="Ангилалын товч тайлбар..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category_type">Төрөл</Label>
              <Select
                value={formData.category_type}
                onValueChange={(value: "exam" | "subject") =>
                  handleChange("category_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Төрөл сонгох" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Шалгалтын төрөл</SelectItem>
                  <SelectItem value="subject">Хичээл</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Шалгалтын төрөл нь дээд түвшин, хичээл нь дотор байрлана
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Эцэг ангилал</Label>
              <Select
                value={formData.parent_id || "none"}
                onValueChange={(value) =>
                  handleChange("parent_id", value === "none" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Эцэг ангилал сонгох" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Байхгүй (Дээд түвшин)</SelectItem>
                  {parentCategories.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.icon && `${parent.icon} `}
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_index">Эрэмбэ</Label>
              <Input
                id="order_index"
                type="number"
                inputMode="numeric"
                min={0}
                value={formData.order_index}
                onChange={(e) =>
                  handleChange("order_index", parseInt(e.target.value) || 0)
                }
              />
              <p className="text-xs text-gray-500">Бага тоо эхэнд харагдана</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Дүрс (Emoji)</Label>
            <Input
              id="icon"
              value={formData.icon || ""}
              onChange={(e) => handleChange("icon", e.target.value || null)}
              placeholder="жишээ нь: 📐"
              className="w-32"
            />
            <p className="text-xs text-gray-500">
              Emoji ашиглан ангилалын дүрсийг тодорхойлно
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Хадгалж байна..."
                : isEditing
                ? "Ангилал шинэчлэх"
                : "Ангилал үүсгэх"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories")}
            >
              Цуцлах
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
