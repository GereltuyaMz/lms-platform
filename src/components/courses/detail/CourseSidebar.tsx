import Image from "next/image";
import { Play, CheckCircle } from "lucide-react";
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
}: CourseSidebarProps) => {
  const discountPercentage = applicableCoupon?.discount_percentage ?? 0;
  const discountAmount = Math.round((price * discountPercentage) / 100);
  const finalPrice = price - discountAmount;
  return (
    <div className="sticky top-4">
      <div className="border rounded-lg overflow-hidden bg-white">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-gray-700 flex items-center justify-center">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt="Course preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-600 w-full h-full flex items-center justify-center">
              <Play className="h-16 w-16 text-white" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <Play
                className="h-8 w-8 text-gray-700 ml-1"
                fill="currentColor"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="p-6">
          {applicableCoupon && (
            <Alert className="mb-4 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
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
                    Та <strong>{discountPercentage}% хямдралтай</strong>{" "}
                    худалдан авна.
                    <br />
                    Хэмнэлт: <strong>{discountAmount.toLocaleString()}₮</strong>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {applicableCoupon ? finalPrice.toLocaleString() : price.toLocaleString()}₮
              </span>
              {(applicableCoupon || originalPrice) && (
                <span className="text-lg text-muted-foreground line-through">
                  {applicableCoupon
                    ? price.toLocaleString()
                    : originalPrice?.toLocaleString()}
                  ₮
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <EnrollButton
              courseId={courseId}
              courseSlug={courseSlug}
              continueButtonUrl={continueButtonUrl}
              isEnrolled={isEnrolled}
              price={price}
              hasPurchased={hasPurchased}
            />
            {/* <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold"
            >
              Хичээлийг урьдчилан үзэх
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
