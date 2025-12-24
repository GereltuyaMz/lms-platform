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
  price: number;
  hasPurchased: boolean;
};

export const EnrollButton = ({
  courseId,
  courseSlug,
  firstLessonId,
  isEnrolled,
  price,
  hasPurchased,
}: EnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isFree = price === 0;
  const isPaid = price > 0;

  const handleClick = async () => {
    // If already enrolled, just navigate to first lesson
    if (isEnrolled && firstLessonId) {
      router.push(`/courses/${courseSlug}/learn/lesson/${firstLessonId}`);
      return;
    }

    // If paid course and not purchased, redirect to checkout
    if (isPaid && !hasPurchased) {
      router.push(`/courses/${courseSlug}/checkout`);
      return;
    }

    // Otherwise, create enrollment (for free courses or purchased courses)
    setIsLoading(true);
    try {
      const result = await createEnrollment(courseId);

      if (result.success) {
        // Navigate to first lesson after successful enrollment
        if (firstLessonId) {
          router.push(`/courses/${courseSlug}/learn/lesson/${firstLessonId}`);
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

  // Determine button text
  const getButtonText = () => {
    if (isLoading) return "Бүртгэж байна...";
    if (isEnrolled) return "Үргэлжлүүлэх";
    if (isFree) return "Үнэгүй элсэх";
    return "Элсэх"; // Paid course, not purchased yet
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="w-full bg-primary text-white h-12 text-base font-bold cursor-pointer"
        disabled={isLoading || (!firstLessonId && isFree && !isEnrolled)}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {getButtonText()}
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
