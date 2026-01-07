"use client";

import { useState, useId } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteUnit, reorderUnits } from "@/lib/actions/admin/units";
import { SortableUnitRow } from "./SortableUnitRow";
import { UnitInlineForm } from "./UnitInlineForm";

type UnitData = {
  id: string;
  title: string;
  title_mn: string | null;
  description: string | null;
  order_index: number;
  lessons_count: number;
  unit_content: string | null;
};

type UnitListProps = {
  courseId: string;
  initialUnits: UnitData[];
  suggestions: string[];
};

type UnitGroup = {
  content: string | null;
  units: UnitData[];
};

const groupUnitsByContent = (units: UnitData[]): UnitGroup[] => {
  const groups: UnitGroup[] = [];
  let currentGroup: UnitGroup | null = null;

  for (const unit of units) {
    if (!currentGroup || currentGroup.content !== unit.unit_content) {
      currentGroup = { content: unit.unit_content, units: [] };
      groups.push(currentGroup);
    }
    currentGroup.units.push(unit);
  }

  return groups;
};

export const UnitList = ({ courseId, initialUnits, suggestions }: UnitListProps) => {
  const dndId = useId();
  const [localUnits, setLocalUnits] = useState<UnitData[]>(initialUnits);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localUnits.findIndex((u) => u.id === active.id);
    const newIndex = localUnits.findIndex((u) => u.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(localUnits, oldIndex, newIndex);
    setLocalUnits(reordered);

    const orderedIds = reordered.map((u) => u.id);
    const result = await reorderUnits(courseId, orderedIds);

    if (result.success) {
      toast.success("Эрэмбэ өөрчлөгдлөө");
    } else {
      toast.error(result.message);
      setLocalUnits(initialUnits);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const result = await deleteUnit(deleteId);

    if (result.success) {
      toast.success("Бүлэг устгагдлаа");
      setLocalUnits((prev) => prev.filter((u) => u.id !== deleteId));
    } else {
      toast.error(result.message);
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleCreateSuccess = () => {
    setEditingId(null);
    window.location.reload();
  };

  const handleEditSuccess = () => {
    setEditingId(null);
    window.location.reload();
  };

  const isCreating = editingId === "new";
  const nextOrderIndex = localUnits.length;

  return (
    <>
      <Card id="units" className="border-gray-200 scroll-mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Хичээлийн бүлэг</CardTitle>
          <Button size="sm" onClick={() => setEditingId("new")} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-1" />
            Нэмэх
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isCreating && (
            <UnitInlineForm
              courseId={courseId}
              nextOrderIndex={nextOrderIndex}
              suggestions={suggestions}
              onSuccess={handleCreateSuccess}
              onCancel={() => setEditingId(null)}
            />
          )}

          {localUnits.length === 0 && !isCreating ? (
            <p className="text-sm text-gray-500 py-4 text-center px-4">
              Бүлэг байхгүй байна. Эхний бүлгээ нэмнэ үү.
            </p>
          ) : (
            <div className="max-h-[500px] overflow-y-auto">
              <div className="p-4 space-y-4">
                <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={localUnits.map((u) => u.id)} strategy={verticalListSortingStrategy}>
                    {groupUnitsByContent(localUnits).map((group, groupIndex) => (
                      <div key={`group-${groupIndex}`} className="space-y-2">
                        {group.content && (
                          <div className="flex items-center gap-2 py-2 px-1">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                              {group.content}
                            </span>
                            <div className="h-px flex-1 bg-gray-200" />
                          </div>
                        )}
                        {group.units.map((unit) => {
                          const globalIndex = localUnits.findIndex((u) => u.id === unit.id);
                          return (
                            <SortableUnitRow
                              key={unit.id}
                              unit={unit}
                              index={globalIndex}
                              isEditing={editingId === unit.id}
                              onEdit={() => setEditingId(unit.id)}
                              onDelete={() => setDeleteId(unit.id)}
                              onEditCancel={() => setEditingId(null)}
                              onEditSuccess={handleEditSuccess}
                              courseId={courseId}
                              suggestions={suggestions}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Бүлэг устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Та энэ бүлгийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Цуцлах</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Устгаж байна..." : "Устгах"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
