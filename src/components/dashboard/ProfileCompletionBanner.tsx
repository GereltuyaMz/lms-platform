"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ProfileCompletionBannerProps = {
  isProfileComplete: boolean;
  onDismiss?: () => void;
};

export const ProfileCompletionBanner = ({
  isProfileComplete,
  onDismiss,
}: ProfileCompletionBannerProps) => {
  const router = useRouter();

  if (isProfileComplete) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border p-5" style={{ width: 362 }}>
      <h3 className="font-semibold text-lg mb-2">Профайлаа бөглөнө үү</h3>
      <p className="text-sm text-gray-600 mb-4">
        Профайл зураг, төрсөн огноо, суралцах зорилгоо нэмж{" "}
        <span className="font-bold">150 XP</span> цуглуулрай!
      </p>
      <div className="space-y-2">
        <Button
          className="w-full font-semibold rounded-lg bg-[#29CC57] hover:bg-[#16A34A] shadow-[0_4px_0_0_#16A34A]"
          onClick={() => router.push("/onboarding")}
        >
          Одоо бөглөх
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-lg"
          onClick={onDismiss}
        >
          Дараа нь
        </Button>
      </div>
    </div>
  );
};
