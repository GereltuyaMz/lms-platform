"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createEnrollment } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

type EnrollButtonProps = {
  courseId: string;
  courseSlug: string;
  firstLessonId: string | null;
  isEnrolled: boolean;
};

export const EnrollButton = ({
  courseId,
  courseSlug,
  firstLessonId,
  isEnrolled,
}: EnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleEnroll = async () => {
    if (isEnrolled && firstLessonId) {
      // Already enrolled, navigate to first lesson
      router.push(`/courses/${courseSlug}/learn/${firstLessonId}`);
      return;
    }

    // Create enrollment
    setIsLoading(true);
    try {
      const result = await createEnrollment(courseId);

      if (result.success) {
        // Navigate to first lesson after successful enrollment
        if (firstLessonId) {
          router.push(`/courses/${courseSlug}/learn/${firstLessonId}`);
        } else {
          // Refresh page to show updated enrollment status
          router.refresh();
        }
      } else {
        // Show error message
        setShowLoginModal(true);
      }
    } catch {
      alert("Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleEnroll}
        className="w-full bg-primary text-white h-12 text-base font-bold"
        disabled={isLoading || !firstLessonId}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Бүртгэж байна...
          </>
        ) : isEnrolled ? (
          "Үргэлжлүүлэх"
        ) : (
          "Хичээлд элсэх"
        )}
      </Button>
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="text-lg font-bold">
            Сургалтанд элсэхийн тулд нэвтрэх шаардлагатай
          </DialogTitle>

          <DialogFooter className="mt-4 flex justify-center gap-3">
            <Link href="/signin">
              <Button className="bg-primary text-white font-semibold rounded-lg px-4 cursor-pointer">
                Нэвтрэх
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
