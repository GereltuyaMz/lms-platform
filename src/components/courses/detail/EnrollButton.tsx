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
  continueButtonUrl: string | null;
  isEnrolled: boolean;
  price: number;
  hasPurchased: boolean;
};

export const EnrollButton = ({
  courseId,
  courseSlug,
  continueButtonUrl,
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
    // If already enrolled, navigate to next uncompleted lesson
    if (isEnrolled && continueButtonUrl) {
      router.push(continueButtonUrl);
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
        // Navigate to next uncompleted lesson after successful enrollment
        if (continueButtonUrl) {
          router.push(continueButtonUrl);
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
        className="w-full bg-[#29cc57] hover:bg-[#24b34d] text-white h-9 text-[15px] leading-[1.4] tracking-[-0.075px] font-bold rounded-lg shadow-[0px_4px_0px_0px_#1f9941] cursor-pointer px-6 py-0"
        disabled={isLoading || (!continueButtonUrl && isFree && !isEnrolled)}
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
