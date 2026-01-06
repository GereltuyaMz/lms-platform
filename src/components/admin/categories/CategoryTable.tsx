"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { deleteCategory } from "@/lib/actions/admin/categories";
import type { Category } from "@/types/database/tables";

type CategoryTableProps = {
  categories: Category[];
};

export const CategoryTable = ({ categories }: CategoryTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Build hierarchy map
  const parentMap = new Map<string, Category>();
  categories.forEach((cat) => {
    if (!cat.parent_id) parentMap.set(cat.id, cat);
  });

  // Sort: parents first, then children under their parents
  const sortedCategories = [...categories].sort((a, b) => {
    // If one is a parent and one is a child
    if (!a.parent_id && b.parent_id) return -1;
    if (a.parent_id && !b.parent_id) return 1;

    // If both are children, group by parent
    if (a.parent_id && b.parent_id) {
      if (a.parent_id !== b.parent_id) {
        return a.parent_id.localeCompare(b.parent_id);
      }
    }

    // Same level, sort by order_index then name
    if (a.order_index !== b.order_index) {
      return a.order_index - b.order_index;
    }
    return a.name.localeCompare(b.name);
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteCategory(deleteId);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    const parent = parentMap.get(parentId);
    return parent?.name_mn || parent?.name || null;
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Parent</TableHead>
              <TableHead className="font-medium">Order</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-8"
                >
                  No categories found. Create your first category.
                </TableCell>
              </TableRow>
            ) : (
              sortedCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {category.parent_id && (
                        <ChevronRight className="h-4 w-4 text-gray-400 ml-4" />
                      )}
                      {category.icon && (
                        <span className="text-lg">{category.icon}</span>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {category.name_mn || category.name}
                        </p>
                        {category.name_mn && (
                          <p className="text-sm text-gray-500">{category.name}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        category.category_type === "exam"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {category.category_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {getParentName(category.parent_id) || "—"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {category.order_index}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/categories/${category.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(category.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
