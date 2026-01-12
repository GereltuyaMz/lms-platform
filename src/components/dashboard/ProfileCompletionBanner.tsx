"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <div className="bg-white rounded-2xl border p-5" style={{ width: 362 }}>
      <h3 className="font-semibold text-lg mb-2">Профайлаа бөглөнө үү</h3>
      <p className="text-sm text-gray-600 mb-4">
        Профайл зураг, төрсөн огноо, утасны дугаар, суралцах зорилгоо нэмж{" "}
        <span className="font-bold">150 XP</span> цуглуулрай!
      </p>
      <Button
        className="w-full font-semibold rounded-lg bg-[#29CC57] hover:bg-[#16A34A] shadow-[0_4px_0_0_#16A34A]"
        onClick={() => router.push("/dashboard?tab=settings")}
      >
        Одоо бөглөх
      </Button>
    </div>
  );
};
