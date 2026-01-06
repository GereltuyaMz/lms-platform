"use client";

import { Edit, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/database/tables";

type SortableCategoryRowProps = {
  category: Category;
  isChild?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const SortableCategoryRow = ({
  category,
  isChild,
  onEdit,
  onDelete,
}: SortableCategoryRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        isChild ? "pl-12" : ""
      }`}
      onClick={() => onEdit(category.id)}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        {category.icon && <span className="text-lg flex-shrink-0">{category.icon}</span>}
        <p className="font-medium text-gray-900 truncate">
          {category.name}
        </p>
      </div>

      <Badge
        variant={category.category_type === "exam" ? "default" : "secondary"}
        className="flex-shrink-0"
      >
        {category.category_type === "exam" ? "Шалгалт" : "Хичээл"}
      </Badge>

      <span className="text-sm text-gray-500 w-12 text-center flex-shrink-0">
        {category.order_index}
      </span>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category.id);
          }}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category.id);
          }}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
