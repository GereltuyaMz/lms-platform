"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
import { deleteCategory, updateCategoryOrder } from "@/lib/actions/admin/categories";
import { ParentCategoryGroup } from "./ParentCategoryGroup";
import { SortableCategoryRow } from "./SortableCategoryRow";
import type { Category } from "@/types/database/tables";

type CategoryTableProps = {
  categories: Category[];
};

export const CategoryTable = ({ categories }: CategoryTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Group categories by parent
  const { parents, childrenByParent, orphans } = useMemo(() => {
    const parentCats = localCategories
      .filter((c) => !c.parent_id && c.category_type === "exam")
      .sort((a, b) => a.order_index - b.order_index);

    const childMap = new Map<string, Category[]>();
    const orphanCats: Category[] = [];

    localCategories.forEach((cat) => {
      if (cat.parent_id) {
        const existing = childMap.get(cat.parent_id) || [];
        childMap.set(cat.parent_id, [...existing, cat].sort((a, b) => a.order_index - b.order_index));
      } else if (cat.category_type === "subject") {
        orphanCats.push(cat);
      }
    });

    return {
      parents: parentCats,
      childrenByParent: childMap,
      orphans: orphanCats.sort((a, b) => a.order_index - b.order_index),
    };
  }, [localCategories]);

  const toggleExpand = (parentId: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  const handleEdit = (id: string) => router.push(`/admin/categories/${id}`);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteCategory(deleteId);

    if (result.success) {
      toast.success(result.message);
      setLocalCategories((prev) => prev.filter((c) => c.id !== deleteId));
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleDragEnd = async (items: Category[], event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((c) => c.id === active.id);
    const newIndex = items.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    const updates = reordered.map((cat, index) => ({ id: cat.id, order_index: index }));

    // Optimistic update
    setLocalCategories((prev) => {
      const updated = [...prev];
      updates.forEach((u) => {
        const idx = updated.findIndex((c) => c.id === u.id);
        if (idx !== -1) updated[idx] = { ...updated[idx], order_index: u.order_index };
      });
      return updated;
    });

    const result = await updateCategoryOrder(updates);
    if (!result.success) {
      toast.error(result.message);
      setLocalCategories(categories);
    }
  };

  if (localCategories.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Ангилал олдсонгүй. Эхний ангилалаа үүсгэнэ үү.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div className="w-4" />
          <div className="w-4" />
          <div className="flex-1">Нэр</div>
          <div className="w-20">Төрөл</div>
          <div className="w-12 text-center">Эрэмбэ</div>
          <div className="w-20 text-right">Үйлдэл</div>
        </div>

        {/* Parent categories */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEnd(parents, e)}
        >
          <SortableContext items={parents.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {parents.map((parent) => (
              <ParentCategoryGroup
                key={parent.id}
                parent={parent}
                childCategories={childrenByParent.get(parent.id) || []}
                isExpanded={expandedParents.has(parent.id)}
                onToggle={() => toggleExpand(parent.id)}
                onEdit={handleEdit}
                onDelete={setDeleteId}
                onChildDragEnd={(e) => handleDragEnd(childrenByParent.get(parent.id) || [], e)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Orphan categories */}
        {orphans.length > 0 && (
          <>
            <div className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-600 border-b border-gray-200">
              Бусад (Эцэг ангилалгүй)
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(orphans, e)}
            >
              <SortableContext items={orphans.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                {orphans.map((orphan) => (
                  <SortableCategoryRow
                    key={orphan.id}
                    category={orphan}
                    onEdit={handleEdit}
                    onDelete={setDeleteId}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ангилал устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Та энэ ангилалыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Цуцлах</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Устгаж байна..." : "Устгах"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
