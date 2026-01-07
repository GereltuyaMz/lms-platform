"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, MoreHorizontal, FileText, Video } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type LessonTableProps = {
  lessons: LessonWithRelations[];
};

export const LessonTable = ({ lessons }: LessonTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const getTotalDuration = (lesson: LessonWithRelations) => {
    const totalSeconds = lesson.content_blocks.reduce(
      (acc, block) => acc + (block.duration_seconds || 0),
      0
    );
    if (!totalSeconds) return "—";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium w-[300px]">Хичээл</TableHead>
              <TableHead className="font-medium">Хичээл / Бүлэг</TableHead>
              <TableHead className="font-medium">Контент</TableHead>
              <TableHead className="font-medium">Үргэлжлэх хугацаа</TableHead>
              <TableHead className="font-medium text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-8"
                >
                  Хичээл олдсонгүй. Эхний хичээлээ үүсгэнэ үү.
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson) => (
                <TableRow key={lesson.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Link
                      href={`/admin/lessons/${lesson.id}`}
                      className="font-medium text-gray-900 hover:text-primary"
                    >
                      {lesson.title}
                    </Link>
                    {lesson.description && (
                      <p className="text-xs text-gray-500 truncate max-w-[250px]">
                        {lesson.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900">
                        {lesson.unit?.course?.title || "Хичээл байхгүй"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {lesson.unit?.title_mn || lesson.unit?.title || "Бүлэг байхгүй"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {lesson.content_blocks.length > 0 ? (
                        <>
                          <Video className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {lesson.content_blocks.length} контент
                          </span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Хоосон</span>
                        </>
                      )}
                      {lesson.quiz_count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {lesson.quiz_count} асуулт
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {getTotalDuration(lesson)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/lessons/${lesson.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Засах
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(lesson.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Устгах
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
