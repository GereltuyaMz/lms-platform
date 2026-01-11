"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { cn } from "@/lib/utils";

type Step4CompleteProps = {
  goal: string | null;
  subject: string | null;
};

export const Step4Complete = ({ goal, subject }: Step4CompleteProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProfile = async () => {
    setIsLoading(true);
    try {
      const result = await completeOnboarding({ goal, subject });
      if (result.success) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-8 pt-8">
      {/* Mascots with sparkles */}
      <div className="flex justify-center relative">
        {/* Sparkle decorations */}
        <div className="absolute -top-4 left-1/4 text-2xl animate-pulse">
          ✨
        </div>
        <div className="absolute -top-2 right-1/4 text-xl animate-pulse delay-100">
          ✨
        </div>
        <div className="absolute top-0 right-1/3 text-lg animate-pulse delay-200">
          ✨
        </div>

        <Image
          src="/assets/auth/character.svg"
          alt="Character mascots celebrating"
          width={300}
          height={150}
          className="drop-shadow-lg"
        />
      </div>

      {/* Success message */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#333] font-[family-name:var(--font-nunito)]">
          Таны хувийн суралцах зам бэлэн боллоо!
        </h1>
        <p className="text-lg text-[#333] font-[family-name:var(--font-nunito)]">
          Өөрийн профайлаа үүсгээд аяллаа эхлүүлээрэй.
        </p>
      </div>

      {/* Create Profile Button - Fixed Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleCreateProfile}
          disabled={isLoading}
          className={cn(
            "px-6 py-3 rounded-lg font-bold text-base text-white font-[family-name:var(--font-nunito)]",
            "bg-[#29cc57] shadow-[0px_4px_0px_0px_#1f9941]",
            "hover:shadow-[0px_2px_0px_0px_#1f9941] hover:translate-y-[2px]",
            "active:shadow-none active:translate-y-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all cursor-pointer"
          )}
        >
          {isLoading ? "Үүсгэж байна..." : "Үргэлжлүүлэх"}
        </button>
      </div>
    </div>
  );
};
