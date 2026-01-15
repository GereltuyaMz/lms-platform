"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Step3SubjectProps = {
  selectedSubject: string | null;
  onSelectSubject: (subject: string) => void;
};

const subjects = [
  {
    value: "Математик",
    label: "Математик",
    icon: "📚",
  },
  {
    value: "Шинжлэх ухаан",
    label: "Шинжлэх ухаан",
    icon: "⚗️",
  },
  {
    value: "Нийгэм судлал",
    label: "Нийгэм судлал",
    icon: "🌍",
  },
  {
    value: "Гадаад хэл",
    label: "Гадаад хэл",
    icon: "📕",
  },
];

export const Step3Subject = ({
  selectedSubject,
  onSelectSubject,
}: Step3SubjectProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      {/* Mascot with speech bubble */}
      <div className="flex items-start gap-4 px-4">
        {/* Mascot */}
        <div className="shrink-0">
          <Image
            src="/assets/auth/character.svg"
            alt="Character mascot"
            width={100}
            height={100}
            className="drop-shadow-lg"
          />
        </div>

        {/* Speech bubble */}
        <div className="relative mt-2">
          {/* Bubble tail */}
          <div className="absolute -left-2 top-3 w-0 h-0 border-t-6 border-t-transparent border-r-6 border-r-[#cac4d0] border-b-6 border-b-transparent" />
          <div className="absolute -left-[5px] top-3 w-0 h-0 border-t-6 border-t-transparent border-r-6 border-r-white border-b-6 border-b-transparent" />

          {/* Bubble content */}
          <div className="bg-white border border-[#cac4d0] rounded-2xl px-6 py-3 shadow-sm">
            <p className="text-base text-[#333] font-[family-name:var(--font-nunito)]">
              Та эхлээд ямар хичээл сурахыг
              <br />
              хүсэж байна вэ?
            </p>
          </div>
        </div>
      </div>

      {/* Subject options - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4 px-4">
        {subjects.map((subject) => (
          <button
            key={subject.value}
            onClick={() => onSelectSubject(subject.value)}
            className={cn(
              "flex items-center gap-3 pl-4 pr-6 py-4 rounded-2xl border transition-all cursor-pointer",
              selectedSubject === subject.value
                ? "bg-[#e8e4f0] border-[#a594c9]"
                : "bg-white border-[#cac4d0] hover:border-[#a594c9]"
            )}
          >
            <span className="text-2xl w-10 h-10 flex items-center justify-center">
              {subject.icon}
            </span>
            <span className="text-lg font-semibold text-[#333] font-[family-name:var(--font-nunito)]">
              {subject.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
