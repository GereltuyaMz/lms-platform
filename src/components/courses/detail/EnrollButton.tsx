"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createEnrollment } from "@/lib/actions";
import { Loader2 } from "lucide-react";

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
        alert(result.message);
      }
    } catch (error) {
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      className="w-full bg-primary text-white h-12 text-base font-semibold"
      disabled={isLoading || !firstLessonId}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Enrolling...
        </>
      ) : isEnrolled ? (
        "Continue Learning"
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
};
