"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Sparkles } from "lucide-react";

type ProfileCompletionBannerProps = {
  isProfileComplete: boolean;
};

export const ProfileCompletionBanner = ({
  isProfileComplete,
}: ProfileCompletionBannerProps) => {
  const router = useRouter();

  if (isProfileComplete) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-4 md:p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
            Профайлаа бөглөнө үү
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Профайл зураг, төрсөн огноо, суралцах зорилгоо нэмж{" "}
            <span className="font-bold text-primary">150 XP</span> олж авна уу!
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard?tab=profile")}
              className="cursor-pointer"
            >
              Одоо бөглөх
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer"
            >
              Дараа бөглөнө
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
