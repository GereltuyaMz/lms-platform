"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CourseLevel } from "@/types/database";
import { BadgeCheck } from "@/icons";

type CourseCardProps = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: CourseLevel;
  xpReward?: number;
  thumbnail?: string;
};

export const CourseCard = ({
  slug,
  title,
  description,
  duration,
  lessons,
  level,
  xpReward = 1500,
  thumbnail,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${slug}`} className="group">
      <div className="overflow-hidden rounded-3xl transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer h-full flex flex-col bg-[#F8F1F6] hover:bg-[#DCDAF5] hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative h-[213px] w-full overflow-hidden rounded-b-3xl">
          {thumbnail ? (
            <Image src={thumbnail} alt={title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
              <GraduationCap className="h-16 w-16 text-white/80" />
            </div>
          )}
          {/* XP Badge */}
          <Badge className="absolute top-4 left-4 bg-white border border-[#d4d4d4] text-black hover:bg-white rounded-full px-2 py-0.5 text-xs font-normal flex items-center gap-1">
            <BadgeCheck className="stroke-1 h-3 w-3" />
            {xpReward} XP
          </Badge>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5">
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white border border-[#d4d4d4] text-black hover:bg-white rounded-full px-2 py-0.5 text-xs font-normal flex items-center gap-1">
              <BadgeCheck className="stroke-1 h-3 w-3" />
              {duration}
            </Badge>
            <Badge className="bg-white border border-[#d4d4d4] text-black hover:bg-white rounded-full px-2 py-0.5 text-xs font-normal flex items-center gap-1">
              <BadgeCheck className="stroke-1 h-3 w-3" />
              {lessons} хичээл
            </Badge>
          </div>

          {/* Title and description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold leading-tight text-[#1a1a1a]">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-[#1a1a1a] line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
