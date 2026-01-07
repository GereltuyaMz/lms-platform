import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CoursesPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const CoursesPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CoursesPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:bg-[#DCDAF5] disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-[#F8F1F6] hover:bg-[#DCDAF5] disabled:opacity-50 disabled:hover:bg-[#F8F1F6]"
      >
        Өмнөх
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const showPage =
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1);

        const showEllipsis =
          (page === currentPage - 2 && currentPage > 3) ||
          (page === currentPage + 2 && currentPage < totalPages - 2);

        if (showEllipsis) {
          return (
            <span key={page} className="px-2 text-[#1a1a1a]">
              ...
            </span>
          );
        }

        if (!showPage) return null;

        return (
          <Button
            key={page}
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? "bg-[#DCDAF5] hover:bg-[#DCDAF5] text-[#1a1a1a] font-semibold"
                : "bg-[#F8F1F6] hover:bg-[#DCDAF5] text-[#1a1a1a]"
            }
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-[#F8F1F6] hover:bg-[#DCDAF5] disabled:opacity-50 disabled:hover:bg-[#F8F1F6]"
      >
        Дараах
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hover:bg-[#DCDAF5] disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
