"use client";

import { Edit, Trash2, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SortableCategoryRow } from "./SortableCategoryRow";
import type { Category } from "@/types/database/tables";

type ParentCategoryGroupProps = {
  parent: Category;
  childCategories: Category[];
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChildDragEnd: (event: DragEndEvent) => void;
};

export const ParentCategoryGroup = ({
  parent,
  childCategories,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onChildDragEnd,
}: ParentCategoryGroupProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: parent.id });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div ref={setNodeRef} style={style} className="border-b border-gray-100">
        <div
          className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onEdit(parent.id)}
        >
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {childCategories.length > 0 ? (
            <CollapsibleTrigger asChild>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </CollapsibleTrigger>
          ) : (
            <div className="w-4" />
          )}

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {parent.icon && <span className="text-lg flex-shrink-0">{parent.icon}</span>}
            <p className="font-medium text-gray-900 truncate">
              {parent.name}
            </p>
          </div>

          <Badge variant="default" className="flex-shrink-0">
            Шалгалт
          </Badge>

          <span className="text-sm text-gray-500 w-12 text-center flex-shrink-0">
            {parent.order_index}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(parent.id);
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
                onDelete(parent.id);
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {childCategories.length > 0 && (
          <CollapsibleContent>
            <DndContext
              id={`dnd-children-${parent.id}`}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onChildDragEnd}
            >
              <SortableContext
                items={childCategories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {childCategories.map((child) => (
                  <SortableCategoryRow
                    key={child.id}
                    category={child}
                    isChild
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
};
