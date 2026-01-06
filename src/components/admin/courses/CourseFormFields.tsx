"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { uploadCourseThumbnail } from "@/lib/storage/course-thumbnail";
import type { CourseFormData } from "@/lib/actions/admin/courses";
import type { Category, Teacher } from "@/types/database/tables";

type CourseDetailsCardProps = {
  formData: CourseFormData;
  teachers: Teacher[];
  courseId?: string;
  onChange: (field: keyof CourseFormData, value: string | number | null) => void;
};

export const CourseDetailsCard = ({ formData, teachers, courseId, onChange }: CourseDetailsCardProps) => (
  <Card className="border-gray-200">
    <CardHeader>
      <CardTitle className="text-lg">Хичээлийн дэлгэрэнгүй</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Гарчиг</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Жишээ: Математикийн бүрэн хичээл"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Тайлбар</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value || null)}
          placeholder="Суралцагчид юу сурахыг тайлбарлана уу..."
          rows={4}
        />
      </div>
      <ThumbnailUploadField url={formData.thumbnail_url} courseId={courseId} onChange={onChange} />
      <PriceFields formData={formData} onChange={onChange} />
      <InstructorField instructorId={formData.instructor_id} teachers={teachers} onChange={onChange} />
    </CardContent>
  </Card>
);

const ThumbnailUploadField = ({
  url,
  courseId,
  onChange,
}: {
  url: string | null;
  courseId?: string;
  onChange: (field: "thumbnail_url", value: string | null) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use courseId or generate a temporary one for new courses
    const id = courseId || `temp-${Date.now()}`;

    setIsUploading(true);
    const result = await uploadCourseThumbnail(file, id);

    if (result.success && result.thumbnailUrl) {
      onChange("thumbnail_url", result.thumbnailUrl);
      toast.success("Зураг амжилттай байршлаа");
    } else {
      toast.error(result.error || "Зураг байршуулахад алдаа гарлаа");
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("thumbnail_url", null);
  };

  return (
    <div className="space-y-2">
      <Label>Хичээлийн зураг</Label>
      {url ? (
        <div className="relative">
          <div className="relative h-40 w-64 rounded-lg overflow-hidden bg-gray-100">
            <Image src={url} alt="Хичээлийн зураг" fill className="object-cover" unoptimized />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-500">Байршуулж байна...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">Зураг оруулах</p>
              <p className="text-xs text-gray-400">JPG, PNG, GIF, WEBP (5MB хүртэл)</p>
            </div>
          )}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
    </div>
  );
};

const formatPrice = (value: number): string => {
  return value.toLocaleString("en-US");
};

const PriceFields = ({
  formData,
  onChange,
}: {
  formData: CourseFormData;
  onChange: (field: keyof CourseFormData, value: string | number | null) => void;
}) => {
  const [priceDisplay, setPriceDisplay] = useState(formatPrice(formData.price));
  const [originalPriceDisplay, setOriginalPriceDisplay] = useState(
    formData.original_price ? formatPrice(formData.original_price) : ""
  );

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numValue = parseInt(rawValue) || 0;
    setPriceDisplay(rawValue ? formatPrice(numValue) : "");
    onChange("price", numValue);
  };

  const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (!rawValue) {
      setOriginalPriceDisplay("");
      onChange("original_price", null);
      return;
    }
    const numValue = parseInt(rawValue) || 0;
    setOriginalPriceDisplay(formatPrice(numValue));
    onChange("original_price", numValue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="price">Үнэ (₮)</Label>
        <Input
          id="price"
          type="text"
          inputMode="numeric"
          value={priceDisplay}
          onChange={handlePriceChange}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="original_price">Анхны үнэ (₮)</Label>
        <Input
          id="original_price"
          type="text"
          inputMode="numeric"
          value={originalPriceDisplay}
          onChange={handleOriginalPriceChange}
          placeholder="Хөнгөлөлт харуулахад ашиглана"
        />
      </div>
    </div>
  );
};

const InstructorField = ({
  instructorId,
  teachers,
  onChange,
}: {
  instructorId: string | null;
  teachers: Teacher[];
  onChange: (field: "instructor_id", value: string | null) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="instructor_id">Багш</Label>
    <Select
      value={instructorId || "none"}
      onValueChange={(v) => onChange("instructor_id", v === "none" ? null : v)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Багш сонгох" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Багш сонгоогүй</SelectItem>
        {teachers.map((t) => (
          <SelectItem key={t.id} value={t.id}>{t.full_name_mn}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

type CategoryCardProps = {
  categories: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export const CategoryCard = ({ categories, selectedIds, onToggle }: CategoryCardProps) => {
  const examCategories = categories.filter((c) => c.category_type === "exam");
  const subjectCategories = categories.filter((c) => c.category_type === "subject");

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Ангилал</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {examCategories.length > 0 && (
          <CategoryGroup label="Шалгалтын төрөл" categories={examCategories} selectedIds={selectedIds} onToggle={onToggle} />
        )}
        {subjectCategories.length > 0 && (
          <CategoryGroup label="Хичээлүүд" categories={subjectCategories} selectedIds={selectedIds} onToggle={onToggle} />
        )}
        {categories.length === 0 && (
          <p className="text-sm text-gray-500">Ангилал байхгүй байна. Эхлээд ангилал үүсгэнэ үү.</p>
        )}
      </CardContent>
    </Card>
  );
};

const CategoryGroup = ({
  label,
  categories,
  selectedIds,
  onToggle,
}: {
  label: string;
  categories: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
    <div className="flex flex-wrap gap-4">
      {categories.map((cat) => (
        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={selectedIds.includes(cat.id)} onCheckedChange={() => onToggle(cat.id)} />
          <span className="text-sm">{cat.icon && `${cat.icon} `}{cat.name}</span>
        </label>
      ))}
    </div>
  </div>
);

export const PublishCard = ({
  isPublished,
  onChange,
}: {
  isPublished: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <Card className="border-gray-200">
    <CardHeader>
      <CardTitle className="text-lg">Нийтлэх</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">Хичээл нийтлэх</p>
          <p className="text-sm text-gray-500">Суралцагчдад харагдахаар болгох</p>
        </div>
        <Switch checked={isPublished} onCheckedChange={onChange} />
      </div>
    </CardContent>
  </Card>
);
