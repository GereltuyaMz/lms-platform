"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff } from "lucide-react";
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
import { LessonTypeIcon } from "@/components/admin/shared/LessonTypeIcon";

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

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium w-[300px]">Lesson</TableHead>
              <TableHead className="font-medium">Course / Unit</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Duration</TableHead>
              <TableHead className="font-medium">Preview</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-8"
                >
                  No lessons found. Create your first lesson.
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
                        {lesson.unit?.course?.title || "No course"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {lesson.unit?.title_mn || lesson.unit?.title || "No unit"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <LessonTypeIcon
                        type={lesson.lesson_type}
                        className="h-4 w-4 text-gray-500"
                      />
                      <span className="capitalize text-sm">
                        {lesson.lesson_type}
                      </span>
                      {lesson.lesson_type === "quiz" && lesson.quiz_count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {lesson.quiz_count} Q
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDuration(lesson.duration_seconds)}
                  </TableCell>
                  <TableCell>
                    {lesson.is_preview ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200 bg-green-50"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Free
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
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
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {lesson.lesson_type === "quiz" && (
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/lessons/${lesson.id}/quiz`}>
                              Quiz Builder
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(lesson.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lesson? This will also delete
              all content blocks and quiz questions. This action cannot be
              undone.
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
