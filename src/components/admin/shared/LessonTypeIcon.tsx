import { Video, FileText, HelpCircle, ClipboardList } from "lucide-react";
import type { LessonType } from "@/types/database/enums";

type LessonTypeIconProps = {
  type: LessonType;
  className?: string;
};

export const LessonTypeIcon = ({
  type,
  className = "h-4 w-4",
}: LessonTypeIconProps) => {
  switch (type) {
    case "video":
      return <Video className={className} />;
    case "text":
      return <FileText className={className} />;
    case "quiz":
      return <HelpCircle className={className} />;
    case "assignment":
      return <ClipboardList className={className} />;
    default:
      return <FileText className={className} />;
  }
};
