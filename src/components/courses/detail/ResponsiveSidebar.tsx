import { CourseSidebar } from "./CourseSidebar";
import type { ApplicableCoupon } from "@/types/shop";

type ResponsiveSidebarProps = {
  courseId: string;
  courseSlug: string;
  price: number;
  originalPrice: number | null;
  thumbnailUrl: string | null;
  continueButtonUrl: string | null;
  isEnrolled: boolean;
  hasPurchased: boolean;
  applicableCoupon?: ApplicableCoupon | null;
  title: string;
  videoDuration: string;
  lessonCount: number;
  exerciseCount: number;
  totalXP: number;
};

export const ResponsiveSidebar = (props: ResponsiveSidebarProps) => {
  return (
    <div className="w-full lg:w-[300px] lg:sticky lg:top-24 lg:self-start">
      <CourseSidebar {...props} />
    </div>
  );
};
