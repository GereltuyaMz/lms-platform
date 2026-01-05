"use client";

import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Eye, EyeOff, Layers, FileText, MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "Beginner": return "secondary";
      case "Intermediate": return "default";
      case "Advanced": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
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
            <Link
              href={`/admin/courses/${course.id}`}
              className="font-medium text-gray-900 hover:text-primary"
            >
              {course.title}
            </Link>
            {course.teacher && (
              <p className="text-xs text-gray-500">{course.teacher.full_name_mn}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {course.categories.slice(0, 2).map((cat) => (
            <Badge key={cat.id} variant="outline" className="text-xs">
              {cat.name_mn || cat.name}
            </Badge>
          ))}
          {course.categories.length > 2 && (
            <Badge variant="outline" className="text-xs">+{course.categories.length - 2}</Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getLevelBadgeVariant(course.level)}>{course.level}</Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={course.is_published ? "default" : "secondary"}
          className={course.is_published ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
        >
          {course.is_published ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {course.units_count}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {course.lessons_count}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-gray-900 font-medium">
        {course.price === 0 ? (
          <span className="text-green-600">Free</span>
        ) : (
          `₮${course.price.toLocaleString()}`
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
              <Link href={`/admin/courses/${course.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTogglePublish(course.id)} disabled={isToggling}>
              {course.is_published ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(course.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
