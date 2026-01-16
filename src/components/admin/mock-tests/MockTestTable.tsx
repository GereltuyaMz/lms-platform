"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  deleteMockTest,
  toggleMockTestPublish,
} from "@/lib/actions/admin/mock-tests";
import type { MockTestWithStats } from "@/types/admin/mock-tests";

type MockTestTableProps = {
  tests: MockTestWithStats[];
};

export const MockTestTable = ({ tests }: MockTestTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteMockTest(deleteId);

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
    const result = await toggleMockTestPublish(id);

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
              <TableHead className="font-medium w-[300px]">Нэр</TableHead>
              <TableHead className="font-medium">Төлөв</TableHead>
              <TableHead className="font-medium">Асуулт</TableHead>
              <TableHead className="font-medium">Хэсэг</TableHead>
              <TableHead className="font-medium">Хугацаа</TableHead>
              <TableHead className="font-medium">Оролдлого</TableHead>
              <TableHead className="font-medium">Огноо</TableHead>
              <TableHead className="font-medium text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  Элсэлтийн шалгалт олдсонгүй. Эхний шалгалтаа үүсгэнэ үү.
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{test.title}</p>
                      {test.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {test.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {test.is_published ? (
                      <Badge variant="default" className="bg-green-600">
                        Нийтэлсэн
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Ноорог</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {test.total_questions}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {test.sections_count}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {test.time_limit_minutes} мин
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {test.attempts_count}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(test.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-3">
                      <Switch
                        checked={test.is_published}
                        onCheckedChange={() => handleTogglePublish(test.id)}
                        disabled={togglingId === test.id}
                        className="cursor-pointer"
                        title={test.is_published ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        title="Засах"
                      >
                        <Link href={`/admin/mock-tests/${test.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(test.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Устгах"
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
            <AlertDialogTitle>Шалгалт устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Та энэ шалгалтыг устгахдаа итгэлтэй байна уу? Бүх хэсэг,
              асуулт, хариулт устах болно. Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болих</AlertDialogCancel>
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
