"use client";

import Image from "next/image";

type Step1WelcomeProps = {
  userName: string;
};

export const Step1Welcome = ({ userName }: Step1WelcomeProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center pt-16">
      {/* Mascot with Speech Bubble */}
      <div className="flex items-start gap-4">
        {/* Mascot */}
        <div className="relative shrink-0">
          <Image
            src="/assets/auth/character.svg"
            alt="Character mascot"
            width={160}
            height={160}
            className="drop-shadow-lg"
          />
        </div>

        {/* Speech Bubble */}
        <div className="relative mt-4">
          {/* Bubble tail */}
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#cac4d0] border-b-8 border-b-transparent" />
          <div className="absolute -left-[6px] top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />

          {/* Bubble content */}
          <div className="bg-white border border-[#cac4d0] rounded-2xl px-6 py-4 shadow-sm">
            <p className="text-lg font-semibold text-[#333] font-[family-name:var(--font-nunito)]">
              Сайн уу? {userName}
            </p>
            <p className="text-base text-[#333] mt-1 font-[family-name:var(--font-nunito)]">
              Таны хувийн суралцах замыг
              <br />
              хамтдаа бүтээцгэе
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
