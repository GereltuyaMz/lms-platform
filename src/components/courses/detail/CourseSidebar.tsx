import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { EnrollButton } from "./EnrollButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ApplicableCoupon } from "@/types/shop";

type CourseSidebarProps = {
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

export const CourseSidebar = ({
  courseId,
  courseSlug,
  price,
  originalPrice,
  thumbnailUrl,
  continueButtonUrl,
  isEnrolled,
  hasPurchased,
  applicableCoupon,
  title,
  videoDuration,
  lessonCount,
  exerciseCount,
  totalXP,
}: CourseSidebarProps) => {
  const discountPercentage = applicableCoupon?.discount_percentage ?? 0;
  const discountAmount = Math.round((price * discountPercentage) / 100);
  const finalPrice = price - discountAmount;

  return (
    <div>
      <div className="bg-white border border-[rgba(0,0,0,0.2)] rounded-[20px] p-4 sm:p-5 flex flex-col gap-4 sm:gap-5">
        {/* Main Content - Horizontal on mobile/tablet, vertical on desktop */}
        <div className="flex flex-row gap-3 sm:gap-5 lg:flex-col">
          {/* Cover Image */}
          <div className="relative aspect-[309/196] rounded-lg overflow-hidden bg-white w-[120px] shrink-0 sm:w-[200px] lg:w-full">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>

          {/* Title, Price, Stats & CTA - Right side on tablet */}
          <div className="flex flex-col gap-3 sm:flex-1 lg:gap-4">
            {/* Course Title */}
            <p className="font-semibold text-sm sm:text-base leading-5 text-[#1a1a1a] whitespace-pre-wrap line-clamp-2 sm:line-clamp-3">
              {title}
            </p>

            {/* Price & Stats Row - Inline on tablet */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 lg:flex-col lg:items-start gap-2">
              {/* Price */}
              <div className="flex gap-[10px] items-center leading-4">
                {(applicableCoupon || originalPrice) && (
                  <p className="font-normal text-sm text-[#878787] line-through">
                    {applicableCoupon
                      ? price.toLocaleString()
                      : originalPrice?.toLocaleString()}
                    ₮
                  </p>
                )}
                <p className="font-semibold text-base text-[#1a1a1a]">
                  {applicableCoupon
                    ? finalPrice.toLocaleString()
                    : price.toLocaleString()}
                  ₮
                </p>
              </div>

              {/* Stats - Inline on tablet */}
              <div className="hidden sm:flex sm:items-center sm:gap-3 lg:hidden text-xs text-[#878787]">
                <span>{videoDuration}</span>
                <span>•</span>
                <span>{lessonCount} хичээл</span>
                <span>•</span>
                <span>{exerciseCount} дасгал</span>
                <span>•</span>
                <span>{totalXP} XP</span>
              </div>
            </div>

            {/* CTA Button - Only show here on tablet */}
            <div className="hidden sm:block lg:hidden">
              <EnrollButton
                courseId={courseId}
                courseSlug={courseSlug}
                continueButtonUrl={continueButtonUrl}
                isEnrolled={isEnrolled}
                price={price}
                hasPurchased={hasPurchased}
              />
            </div>
          </div>
        </div>

        {/* Coupon Alert */}
        {applicableCoupon && (
          <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle className="text-emerald-900 dark:text-emerald-100">
              Купон идэвхжсэн!
            </AlertTitle>
            <AlertDescription className="text-emerald-800 dark:text-emerald-200">
              {discountPercentage === 100 ? (
                <>
                  Та энэ хичээлийг <strong>100% үнэгүй</strong> авах эрхтэй
                  байна.
                </>
              ) : (
                <>
                  Та <strong>{discountPercentage}% хямдралтай</strong> худалдан
                  авна.
                  <br />
                  Хэмнэлт: <strong>{discountAmount.toLocaleString()}₮</strong>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* CTA Button - Show on mobile and desktop, hidden on tablet */}
        <div className="sm:hidden lg:block">
          <EnrollButton
            courseId={courseId}
            courseSlug={courseSlug}
            continueButtonUrl={continueButtonUrl}
            isEnrolled={isEnrolled}
            price={price}
            hasPurchased={hasPurchased}
          />
        </div>

        {/* Stats Section - Only on mobile and desktop */}
        <div className="flex flex-col gap-[11px] sm:hidden lg:flex">
          <p className="font-semibold text-xs sm:text-sm leading-4 text-black whitespace-pre-wrap">
            Хичээл
          </p>
          <div className="flex flex-col gap-[7px] font-normal text-xs sm:text-sm leading-4 text-black whitespace-pre-wrap">
            <p>{videoDuration} Видео</p>
            <p>{lessonCount} Хичээл</p>
            <p>{exerciseCount} Дасгал</p>
            <p>{totalXP} XP</p>
          </div>
        </div>
      </div>
    </div>
  );
};
