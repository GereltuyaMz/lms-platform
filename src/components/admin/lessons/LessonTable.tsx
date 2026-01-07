"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { deleteLesson, type LessonWithRelations } from "@/lib/actions/admin/lessons";
import { LessonTableRow } from "./LessonTableRow";

type LessonTableProps = {
  lessons: LessonWithRelations[];
};

export const LessonTable = ({ lessons }: LessonTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<"course" | "unit" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSort = (field: "course" | "unit") => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const sortedLessons = useMemo(() => {
    if (!sortField) return lessons;
    return [...lessons].sort((a, b) => {
      const aVal =
        sortField === "course"
          ? a.unit?.course?.title || ""
          : a.unit?.title_mn || a.unit?.title || "";
      const bVal =
        sortField === "course"
          ? b.unit?.course?.title || ""
          : b.unit?.title_mn || b.unit?.title || "";
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [lessons, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedLessons.length / pageSize);
  const paginatedLessons = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLessons.slice(start, start + pageSize);
  }, [sortedLessons, currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const result = await deleteLesson(deleteId);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium w-[300px]">Хичээл</TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center gap-2">
                  <span>Хичээл / Бүлэг</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleSort("course")}
                  >
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
              </TableHead>
              <TableHead className="font-medium">Нийт хугацаа</TableHead>
              <TableHead className="font-medium text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  Хичээл олдсонгүй. Эхний хичээлээ үүсгэнэ үү.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLessons.map((lesson) => (
                <LessonTableRow
                  key={lesson.id}
                  lesson={lesson}
                  onRowClick={(id) => router.push(`/admin/lessons/${id}`)}
                  onDelete={setDeleteId}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage <= 1}
          >
            Өмнөх
          </Button>
          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= totalPages}
          >
            Дараах
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хичээл устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Та энэ хичээлийг устгахдаа итгэлтэй байна уу? Энэ нь бүх контент
              блок болон асуултуудыг устгах болно. Энэ үйлдлийг буцаах боломжгүй.
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
