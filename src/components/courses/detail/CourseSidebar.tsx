import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type CourseSidebarProps = {
  courseSlug: string;
  price: number;
  originalPrice: number | null;
  thumbnailUrl: string | null;
  firstLessonId: string | null;
};

export const CourseSidebar = ({
  courseSlug,
  price,
  originalPrice,
  thumbnailUrl,
  firstLessonId,
}: CourseSidebarProps) => {
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
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {price.toLocaleString()}₮
              </span>
              {originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {originalPrice.toLocaleString()}₮
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-primary text-white h-12 text-base font-semibold"
              disabled={!firstLessonId}
            >
              <Link href={firstLessonId ? `/courses/${courseSlug}/learn/${firstLessonId}` : "#"}>
                Enroll now
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold"
            >
              Preview course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
