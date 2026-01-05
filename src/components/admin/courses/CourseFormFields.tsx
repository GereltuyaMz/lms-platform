"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { CourseFormData } from "@/lib/actions/admin/courses";
import type { Category, Teacher } from "@/types/database/tables";

type CourseDetailsCardProps = {
  formData: CourseFormData;
  teachers: Teacher[];
  onChange: (field: keyof CourseFormData, value: string | number | null) => void;
};

export const CourseDetailsCard = ({ formData, teachers, onChange }: CourseDetailsCardProps) => (
  <Card className="border-gray-200">
    <CardHeader>
      <CardTitle className="text-lg">Course Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g., Complete Mathematics Course"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value || null)}
          placeholder="Describe what students will learn..."
          rows={4}
        />
      </div>
      <ThumbnailField url={formData.thumbnail_url} onChange={onChange} />
      <PricingFields formData={formData} onChange={onChange} />
      <InstructorField instructorId={formData.instructor_id} teachers={teachers} onChange={onChange} />
    </CardContent>
  </Card>
);

const ThumbnailField = ({
  url,
  onChange,
}: {
  url: string | null;
  onChange: (field: "thumbnail_url", value: string | null) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
    <Input
      id="thumbnail_url"
      value={url || ""}
      onChange={(e) => onChange("thumbnail_url", e.target.value || null)}
      placeholder="https://..."
    />
    {url && (
      <div className="relative mt-2 h-32 w-48 rounded-lg overflow-hidden bg-gray-100">
        <Image src={url} alt="Thumbnail preview" fill className="object-cover" unoptimized />
      </div>
    )}
  </div>
);

const PricingFields = ({
  formData,
  onChange,
}: {
  formData: CourseFormData;
  onChange: (field: keyof CourseFormData, value: string | number | null) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="space-y-2">
      <Label htmlFor="level">Level</Label>
      <Select
        value={formData.level}
        onValueChange={(v: "Beginner" | "Intermediate" | "Advanced") => onChange("level", v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Beginner">Beginner</SelectItem>
          <SelectItem value="Intermediate">Intermediate</SelectItem>
          <SelectItem value="Advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="price">Price (₮)</Label>
      <Input
        id="price"
        type="number"
        min={0}
        value={formData.price}
        onChange={(e) => onChange("price", parseInt(e.target.value) || 0)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="original_price">Original Price (₮)</Label>
      <Input
        id="original_price"
        type="number"
        min={0}
        value={formData.original_price || ""}
        onChange={(e) => onChange("original_price", e.target.value ? parseInt(e.target.value) : null)}
        placeholder="For showing discounts"
      />
    </div>
  </div>
);

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
    <Label htmlFor="instructor_id">Instructor</Label>
    <Select
      value={instructorId || "none"}
      onValueChange={(v) => onChange("instructor_id", v === "none" ? null : v)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select instructor" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No instructor</SelectItem>
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
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {examCategories.length > 0 && (
          <CategoryGroup label="Exam Types" categories={examCategories} selectedIds={selectedIds} onToggle={onToggle} />
        )}
        {subjectCategories.length > 0 && (
          <CategoryGroup label="Subjects" categories={subjectCategories} selectedIds={selectedIds} onToggle={onToggle} />
        )}
        {categories.length === 0 && (
          <p className="text-sm text-gray-500">No categories available. Create categories first.</p>
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
          <span className="text-sm">{cat.icon && `${cat.icon} `}{cat.name_mn || cat.name}</span>
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
      <CardTitle className="text-lg">Publishing</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">Publish Course</p>
          <p className="text-sm text-gray-500">Make this course visible to students</p>
        </div>
        <Switch checked={isPublished} onCheckedChange={onChange} />
      </div>
    </CardContent>
  </Card>
);
