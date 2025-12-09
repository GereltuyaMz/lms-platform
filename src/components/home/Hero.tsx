import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-[1600px]">
      <Image src="/assets/background.png" alt="bg" width={1200} height={600} />

      <div className="container mx-auto px-4 text-center">
        <h1 className="text-h1 mb-4 max-w-4xl mx-auto">
          Таашаалтайгаар суралцах орчин.
        </h1>

        <p className="text-medium mb-8 max-w-2xl mx-auto font-semibold">
          Хэзээ ч, хаана ч, ойлгомжтой хичээлүүдээр өөрийгөө хөгжүүлээрэй.
        </p>

        <div className="relative inline-block">
          {/* Glow Aura */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[180px] h-[180px] bg-primary/40 rounded-full blur-3xl opacity-70 animate-pulse-slow"></div>
          </div>

          {/* The Button */}
          <Link href="/signup">
            <Button
              className="relative font-bold rounded-3xl bg-primary cursor-pointer text-white text-2xl py-6 px-10
      transition-transform duration-300 hover:-translate-y-1 hover:scale-105 uppercase z-10"
              size="lg"
            >
              Эхлэх
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
