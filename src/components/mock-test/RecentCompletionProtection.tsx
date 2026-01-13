"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecentCompletionProtectionProps = {
  remainingSeconds: number;
  attemptId: string;
};

export const RecentCompletionProtection = ({
  remainingSeconds: initialSeconds,
  attemptId,
}: RecentCompletionProtectionProps) => {
  const [countdown, setCountdown] = useState(initialSeconds);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // When countdown reaches 0, reload page to refresh server data
  useEffect(() => {
    if (countdown === 0) {
      window.location.reload();
    }
  }, [countdown]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-blue-900 mb-1">
            Тест амжилттай илгээгдлээ!
          </h3>
          <p className="text-blue-800 text-sm mb-3">
            Давтан оролдлого үүсэхээс сэргийлж байна. Үр дүнгээ харах эсвэл дахин
            эхлүүлэхийн өмнө түр хүлээнэ үү.
          </p>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">
                {countdown}s
              </span>
            </div>
            <span className="text-sm text-blue-700">хамгаалалт идэвхтэй</span>
          </div>

          <Link href={`/mock-test/results/${attemptId}`}>
            <Button variant="landingOutline" size="sm" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Үр дүн харах
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
