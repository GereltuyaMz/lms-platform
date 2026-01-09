"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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
import { deleteQuiz, type QuizWithQuestions } from "@/lib/actions/admin/quizzes";

type QuizTableProps = {
  quizzes: QuizWithQuestions[];
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export const QuizTable = ({ quizzes }: QuizTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(quizzes.length / pageSize);
  const paginatedQuizzes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return quizzes.slice(start, start + pageSize);
  }, [quizzes, currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const result = await deleteQuiz(deleteId);
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
              <TableHead className="font-medium w-[50px]">№</TableHead>
              <TableHead className="font-medium">Нэр</TableHead>
              <TableHead className="font-medium">Асуултын тоо</TableHead>
              <TableHead className="font-medium">Үүсгэсэн</TableHead>
              <TableHead className="font-medium text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedQuizzes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-8"
                >
                  Тест олдсонгүй. Эхний тестээ үүсгэнэ үү.
                </TableCell>
              </TableRow>
            ) : (
              paginatedQuizzes.map((quiz, index) => (
                <TableRow
                  key={quiz.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/admin/quizzes/${quiz.id}`)}
                >
                  <TableCell className="text-gray-500 text-sm">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900 block truncate max-w-[300px]">
                      {quiz.title}
                    </span>
                    {quiz.description && (
                      <p className="text-xs text-gray-500 truncate max-w-[300px]">
                        {quiz.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {quiz.question_count}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(quiz.created_at)}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(quiz.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
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
            <AlertDialogTitle>Тест устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Та энэ тестийг устгахдаа итгэлтэй байна уу? Бүх асуулт болон
              хариултууд устгагдана. Энэ үйлдлийг буцаах боломжгүй.
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
