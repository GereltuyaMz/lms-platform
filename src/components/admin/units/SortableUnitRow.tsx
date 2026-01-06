"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnitInlineForm } from "./UnitInlineForm";

type UnitData = {
  id: string;
  title: string;
  title_mn: string | null;
  description: string | null;
  lessons_count: number;
  order_index: number;
};

type SortableUnitRowProps = {
  unit: UnitData;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onEditCancel: () => void;
  onEditSuccess: () => void;
  courseId: string;
};

export const SortableUnitRow = ({
  unit,
  index,
  isEditing,
  onEdit,
  onDelete,
  onEditCancel,
  onEditSuccess,
  courseId,
}: SortableUnitRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: unit.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style}>
        <UnitInlineForm
          courseId={courseId}
          unit={unit}
          nextOrderIndex={unit.order_index}
          onSuccess={onEditSuccess}
          onCancel={onEditCancel}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-3 rounded-lg border border-gray-100 transition-colors ${
        isDragging ? "opacity-60 shadow-lg bg-white ring-2 ring-primary/20 z-10" : "hover:bg-gray-50"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 p-1 rounded text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <Link href={`/admin/units/${unit.id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">
            {unit.title_mn || unit.title}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {unit.lessons_count} хичээл
          </p>
        </div>
      </Link>

      <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
