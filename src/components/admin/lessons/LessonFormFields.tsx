"use client";

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
import type { LessonFormData } from "@/lib/actions/admin/lessons";
import type { LessonType } from "@/types/database/enums";

type UnitOption = {
  id: string;
  title: string;
  title_mn: string | null;
  course_id: string;
  course_title: string;
};

type UnitSelectorProps = {
  unitId: string | null;
  units: UnitOption[];
  onUnitChange: (unitId: string) => void;
};

export const UnitSelector = ({ unitId, units, onUnitChange }: UnitSelectorProps) => {
  const unitsByCourse = units.reduce(
    (acc, unit) => {
      if (!acc[unit.course_title]) acc[unit.course_title] = [];
      acc[unit.course_title].push(unit);
      return acc;
    },
    {} as Record<string, UnitOption[]>
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="unit_id">Unit</Label>
      <Select value={unitId || ""} onValueChange={onUnitChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select unit" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(unitsByCourse).map(([courseName, courseUnits]) => (
            <div key={courseName}>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">{courseName}</div>
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
  );
};

type BasicFieldsProps = {
  formData: LessonFormData;
  onChange: (field: keyof LessonFormData, value: string | number | null) => void;
};

export const BasicFields = ({ formData, onChange }: BasicFieldsProps) => {
  const lessonTypes: { value: LessonType; label: string }[] = [
    { value: "video", label: "Video" },
    { value: "text", label: "Text" },
    { value: "quiz", label: "Quiz" },
    { value: "assignment", label: "Assignment" },
  ];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g., Introduction to Algebra"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value || null)}
          placeholder="Brief description of this lesson..."
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="lesson_type">Type</Label>
          <Select
            value={formData.lesson_type}
            onValueChange={(value: LessonType) => onChange("lesson_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {lessonTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order_in_unit">Sort Order</Label>
          <Input
            id="order_in_unit"
            type="number"
            min={0}
            value={formData.order_in_unit}
            onChange={(e) => onChange("order_in_unit", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </>
  );
};

type VideoFieldsProps = {
  videoUrl: string | null;
  durationSeconds: number | null;
  onChange: (field: "video_url" | "duration_seconds", value: string | number | null) => void;
};

export const VideoFields = ({ videoUrl, durationSeconds, onChange }: VideoFieldsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label htmlFor="video_url">Video URL</Label>
      <Input
        id="video_url"
        value={videoUrl || ""}
        onChange={(e) => onChange("video_url", e.target.value || null)}
        placeholder="https://..."
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="duration_seconds">Duration (seconds)</Label>
      <Input
        id="duration_seconds"
        type="number"
        min={0}
        value={durationSeconds || ""}
        onChange={(e) => onChange("duration_seconds", e.target.value ? parseInt(e.target.value) : null)}
        placeholder="e.g., 600"
      />
    </div>
  </div>
);

type TextFieldsProps = {
  content: string | null;
  onChange: (field: "content", value: string | null) => void;
};

export const TextFields = ({ content, onChange }: TextFieldsProps) => (
  <div className="space-y-2">
    <Label htmlFor="content">Content</Label>
    <Textarea
      id="content"
      value={content || ""}
      onChange={(e) => onChange("content", e.target.value || null)}
      placeholder="Lesson content (supports markdown)..."
      rows={10}
    />
  </div>
);

type PreviewToggleProps = {
  isPreview: boolean;
  onChange: (checked: boolean) => void;
};

export const PreviewToggle = ({ isPreview, onChange }: PreviewToggleProps) => (
  <div className="flex items-center justify-between pt-4 border-t">
    <div className="flex items-center gap-3">
      <Switch id="is_preview" checked={isPreview} onCheckedChange={onChange} />
      <Label htmlFor="is_preview" className="cursor-pointer">Free Preview</Label>
    </div>
    <p className="text-xs text-gray-500">Free preview lessons are accessible without enrollment</p>
  </div>
);
