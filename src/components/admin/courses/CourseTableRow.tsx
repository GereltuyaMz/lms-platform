"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Layers, FileText } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateSimple } from "@/lib/utils/formatters";
import type { CourseWithRelations } from "@/lib/actions/admin/courses";

type CourseTableRowProps = {
  course: CourseWithRelations;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
  isToggling: boolean;
};

export const CourseTableRow = ({
  course,
  onTogglePublish,
  onDelete,
  isToggling,
}: CourseTableRowProps) => {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/admin/courses/${course.id}`);
  };

  const handleStatusChange = (value: string) => {
    const shouldPublish = value === "published";
    if (shouldPublish !== course.is_published) {
      onTogglePublish(course.id);
    }
  };

  return (
    <TableRow
      className={`hover:bg-gray-50 cursor-pointer ${!course.is_published ? "opacity-60" : ""}`}
      onClick={handleRowClick}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          {course.thumbnail_url ? (
            <div className="relative h-10 w-16 rounded overflow-hidden bg-gray-100">
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-10 w-16 rounded bg-gray-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <div>
            <span className="font-medium text-gray-900 hover:text-primary">
              {course.title}
            </span>
            {course.teacher && (
              <p className="text-xs text-gray-500">{course.teacher.full_name_mn}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap gap-1">
          {course.categories.slice(0, 2).map((cat) => (
            <Badge key={cat.id} variant="outline" className="text-xs">
              {cat.name}
            </Badge>
          ))}
          {course.categories.length > 2 && (
            <Badge variant="outline" className="text-xs">+{course.categories.length - 2}</Badge>
          )}
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Select
          value={course.is_published ? "published" : "draft"}
          onValueChange={handleStatusChange}
          disabled={isToggling}
        >
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Ноорог</SelectItem>
            <SelectItem value="published">Нийтлэх</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Link
            href={`/admin/courses/${course.id}#units`}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Layers className="h-3.5 w-3.5" />
            {course.units_count}
          </Link>
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {course.lessons_count}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-gray-900 font-medium">
        {course.price === 0 ? (
          <span className="text-green-600">Үнэгүй</span>
        ) : (
          `₮${course.price.toLocaleString()}`
        )}
      </TableCell>
      <TableCell>
        <div className="text-xs text-gray-500 space-y-0.5">
          <p>Үүсгэсэн: {formatDateSimple(course.created_at)}</p>
          <p>Засварласан: {formatDateSimple(course.updated_at)}</p>
        </div>
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/courses/${course.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(course.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
