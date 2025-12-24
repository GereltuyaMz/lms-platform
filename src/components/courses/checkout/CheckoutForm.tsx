"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { simulatePurchase } from "@/lib/actions/purchase";
import { formatDuration, getInitials } from "@/lib/utils";
import { getLevelColor } from "@/lib/course-utils";
import { formatCourseLevel } from "@/lib/utils/formatters";
import type { CourseLevel } from "@/types/database/enums";
import { VideoIcon, DumbbellIcon, BoardIcon, BoltIcon } from "@/icons";

type CheckoutFormProps = {
  course: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    price: number;
    originalPrice: number | null;
    thumbnailUrl: string | null;
    level: CourseLevel;
    lessonCount: number;
    totalDurationSeconds: number;
    exerciseCount: number;
    totalXp: number;
    teacher: {
      name: string;
      avatarUrl: string | null;
    } | null;
  };
  firstLessonId: string | null;
};

type PaymentMethod = "card" | "bank" | "qpay";

export const CheckoutForm = ({ course, firstLessonId }: CheckoutFormProps) => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);

    try {
      const result = await simulatePurchase(course.id, selectedMethod);

      if (result.success) {
        toast.success(result.message);

        // Redirect to first lesson or dashboard after 1.5 seconds
        setTimeout(() => {
          if (firstLessonId) {
            router.push(`/courses/${course.slug}/learn/lesson/${firstLessonId}`);
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        toast.error(result.message);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Төлбөр боловсруулахад алдаа гарлаа");
      setIsProcessing(false);
    }
  };

  const totalDurationMinutes = Math.floor(course.totalDurationSeconds / 60);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Course Information */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Сургалтын мэдээлэл</h2>

          {/* Course Thumbnail */}
          {course.thumbnailUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Course Title & Level */}
          <Badge
            variant="secondary"
            className={`text-sm ${getLevelColor(course.level)} mb-2`}
          >
            {formatCourseLevel(course.level)}
          </Badge>
          <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
          {course.description && (
            <p className="text-muted-foreground mb-6">{course.description}</p>
          )}

          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <BoardIcon width={20} height={20} fill="#8B5CF6" />
              <span className="text-sm">
                <strong className="font-bold">{course.lessonCount}</strong>{" "}
                хичээл
              </span>
            </div>
            <div className="flex items-center gap-2">
              <VideoIcon width={20} height={20} fill="#3B82F6" />
              <span className="text-sm">
                <strong className="font-bold">
                  {formatDuration(totalDurationMinutes)}
                </strong>{" "}
                видео
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DumbbellIcon width={20} height={20} fill="#10B981" />
              <span className="text-sm">
                <strong className="font-bold">{course.exerciseCount}</strong>{" "}
                дасгал
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BoltIcon width={20} height={20} fill="#F59E0B" />
              <span className="text-sm">
                <strong className="font-bold">{course.totalXp}</strong> XP
              </span>
            </div>
          </div>

          {/* Teacher */}
          {course.teacher && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Багш:</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={course.teacher.avatarUrl || ""}
                    alt={course.teacher.name}
                  />
                  <AvatarFallback className="text-xs">
                    {getInitials(course.teacher.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{course.teacher.name}</span>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground mb-2">Элсэх төлбөр:</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {course.price.toLocaleString()}₮
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {course.originalPrice.toLocaleString()}₮
                </span>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              <span>Насан туршийн хандалт</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              <span>Гэрчилгээ олгох</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              <span>Дэмжлэг үзүүлэх</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right: Payment Information */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Төлбөрийн мэдээлэл</h2>

          {/* Payment Method Selection */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium mb-3">Төлбөрийн хэлбэр:</p>

            {/* Card Payment */}
            <button
              type="button"
              onClick={() => setSelectedMethod("card")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all cursor-pointer ${
                selectedMethod === "card"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "card"
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {selectedMethod === "card" && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Картаар төлөх</p>
                  <p className="text-sm text-muted-foreground">
                    Visa, MasterCard
                  </p>
                </div>
              </div>
            </button>

            {/* Bank Transfer */}
            <button
              type="button"
              onClick={() => setSelectedMethod("bank")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all cursor-pointer ${
                selectedMethod === "bank"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "bank"
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {selectedMethod === "bank" && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Дансаар төлөх</p>
                  <p className="text-sm text-muted-foreground">
                    Банкны шилжүүлэг
                  </p>
                </div>
              </div>
            </button>

            {/* QPay */}
            <button
              type="button"
              onClick={() => setSelectedMethod("qpay")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all cursor-pointer ${
                selectedMethod === "qpay"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "qpay"
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {selectedMethod === "qpay" && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">QPay</p>
                  <p className="text-sm text-muted-foreground">QR кодоор</p>
                </div>
              </div>
            </button>
          </div>

          {/* Total */}
          <div className="border-t pt-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">Нийт дүн:</span>
              <span className="text-2xl font-bold">
                {course.price.toLocaleString()}₮
              </span>
            </div>

            {/* Purchase Button */}
            <Button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full h-12 text-base font-semibold cursor-pointer"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Төлбөр боловсруулж байна...
                </>
              ) : (
                "Элсэлтийг баталгаажуулах"
              )}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            Баталгаажуулснаар та манай үйлчилгээний нөхцөлийг хүлээн зөвшөөрч
            байна
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
