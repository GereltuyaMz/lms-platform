"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { getLevelColor } from "@/lib/course-utils";
import type { CourseLevel } from "@/types/database";
import { StopwatchIcon, NotebookIcon } from "@/icons";

type CourseCardProps = {
  slug: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  duration: string;
  lessons: number;
  level: CourseLevel;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  applicableCoupon?: { discount_percentage: number };
};

export const CourseCard = ({
  slug,
  title,
  description,
  instructor,
  duration,
  lessons,
  level,
  price,
  originalPrice,
  thumbnail,
  applicableCoupon,
}: CourseCardProps) => {
  const discountPercentage = applicableCoupon?.discount_percentage ?? 0;
  const discountAmount = Math.round((price * discountPercentage) / 100);
  const finalPrice = price - discountAmount;
  return (
    <Link href={`/courses/${slug}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer">
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4">
          <div className="relative h-[180px] w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-[120px] sm:w-[160px]">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <GraduationCap className="h-12 w-12 text-gray-400 sm:h-10 sm:w-10" />
              </div>
            )}
          </div>

          <CardContent className="flex flex-1 items-start justify-between gap-4 p-0">
            {/* Left side: Course info */}
            <div className="flex flex-1 flex-col gap-2 sm:gap-7">
              <div className="space-y-2">
                <h3 className="text-base font-semibold leading-tight sm:text-h6">
                  {title}
                </h3>

                <p className="line-clamp-2 text-sm text-muted-foreground sm:text-regular">
                  {description}
                </p>

                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                    <AvatarImage
                      src={instructor.avatar}
                      alt={instructor.name}
                    />
                    <AvatarFallback className="text-[10px] sm:text-xs">
                      {getInitials(instructor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium sm:text-sm">
                    {instructor.name}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs rounded-xl bg-muted text-black hover:text-white"
                >
                  <StopwatchIcon width={20} height={20} fill="#10B981" />
                  {duration}
                </Badge>
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs rounded-xl bg-muted text-black hover:text-white"
                >
                  <NotebookIcon fill="#3B82F6" width={20} height={20} />
                  {lessons} Хичээл
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-xs ${getLevelColor(level)}`}
                >
                  {level}
                </Badge>
              </div>
            </div>

            {/* Right side: Pricing */}
            <div className="flex flex-col items-end gap-0.5 sm:gap-1">
              {applicableCoupon && (
                <div className="mb-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                  <span className="font-semibold">{discountPercentage}% хямдрал</span> ·{" "}
                  {discountAmount.toLocaleString()}₮ хэмнэнэ
                </div>
              )}
              <span className="text-lg font-bold sm:text-xl">
                {applicableCoupon ? finalPrice.toLocaleString() : price.toLocaleString()}₮
              </span>
              {(applicableCoupon || originalPrice) && (
                <span className="text-xs text-muted-foreground line-through sm:text-sm">
                  {applicableCoupon
                    ? price.toLocaleString()
                    : originalPrice?.toLocaleString()}
                  ₮
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
