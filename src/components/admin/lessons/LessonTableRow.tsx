"use client";

import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { LessonWithRelations } from "@/lib/actions/admin/lessons";

type LessonTableRowProps = {
  lesson: LessonWithRelations;
  onRowClick: (id: string) => void;
  onDelete: (id: string) => void;
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

export const LessonTableRow = ({
  lesson,
  onRowClick,
  onDelete,
}: LessonTableRowProps) => (
  <TableRow
    className="hover:bg-gray-50 cursor-pointer"
    onClick={() => onRowClick(lesson.id)}
  >
    <TableCell>
      <span className="font-medium text-gray-900">{lesson.title}</span>
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
    <TableCell className="text-gray-600">{getTotalDuration(lesson)}</TableCell>
    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/lessons/${lesson.id}`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(lesson.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);
