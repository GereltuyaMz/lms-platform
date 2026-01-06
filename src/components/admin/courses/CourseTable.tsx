"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { deleteCourse, toggleCoursePublish, type CourseWithRelations } from "@/lib/actions/admin/courses";
import { CourseTableRow } from "./CourseTableRow";

type CourseTableProps = {
  courses: CourseWithRelations[];
};

export const CourseTable = ({ courses }: CourseTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const result = await deleteCourse(deleteId);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleTogglePublish = async (id: string) => {
    setTogglingId(id);
    const result = await toggleCoursePublish(id);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setTogglingId(null);
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium w-[300px]">Хичээл</TableHead>
              <TableHead className="font-medium">Ангилал</TableHead>
              <TableHead className="font-medium">Төлөв</TableHead>
              <TableHead className="font-medium">Бүлэг/Хичээл</TableHead>
              <TableHead className="font-medium">Үнэ</TableHead>
              <TableHead className="font-medium">Огноо</TableHead>
              <TableHead className="font-medium text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  Хичээл олдсонгүй. Эхний хичээлээ үүсгэнэ үү.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <CourseTableRow
                  key={course.id}
                  course={course}
                  onTogglePublish={handleTogglePublish}
                  onDelete={setDeleteId}
                  isToggling={togglingId === course.id}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хичээл устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Та энэ хичээлийг устгахдаа итгэлтэй байна уу? Бүх бүлэг, хичээл, шалгалтууд устах болно. Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Болих</AlertDialogCancel>
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
