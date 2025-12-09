import Image from "next/image";
import { Button } from "../ui/button";

export const LearnAnytime = () => {
  return (
    <section className="relative py-16 md:py-24 md:px-16 h-[850px] overflow-hidden">
      {/* Background */}
      <div className="bg-secondary h-full flex flex-col justify-center items-center gap-6 text-center relative">
        {/* Floating colorful blur orbs */}
        <div className="absolute w-60 h-60 bg-[#4ade80]/40 blur-2xl rounded-full -top-10 left-10 animate-float-fast"></div>
        <div className="absolute w-60 h-60 bg-[#F79A19]/40 blur-2xl rounded-full bottom-20 right-5 animate-float-medium"></div>
        <div className="absolute w-60 h-60 bg-[#c084fc]/40 blur-2xl rounded-full bottom-10 left-[470px] -translate-x-1/2 animate-float-fast"></div>

        {/* Text */}
        <h1 className="text-h1 text-white drop-shadow-lg leading-tight max-w-4xl">
          Хэзээ ч, хаанаас ч хүссэнээрээ суралцаарай
        </h1>

        {/* BIG Highlight CTA */}
        <Button
          size="lg"
          className="
            relative text-3xl px-12 py-8 rounded-3xl font-extrabold 
            bg-gradient-to-r from-primary to-green-500 
            text-white shadow-xl cursor-pointer 
            hover:scale-105 hover:shadow-2xl 
            transition-all duration-300
            overflow-hidden
          "
        >
          <span className="relative z-10 uppercase">Эхлэх</span>
        </Button>
      </div>

      {/* Bottom Illustration Images */}
      <div className="absolute -top-10">
        <Image
          src="/assets/frame-5.png"
          alt="Learning"
          width={400}
          height={400}
        />
      </div>
      <div className="absolute bottom-20 left-[20%]">
        <Image
          src="/assets/frame-6.png"
          alt="Learning"
          width={400}
          height={400}
        />
      </div>
      <div className="absolute bottom-20 right-0">
        <Image
          src="/assets/frame-7.png"
          alt="Learning"
          width={400}
          height={400}
        />
      </div>
    </section>
  );
};
