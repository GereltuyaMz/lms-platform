import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const CallToAction = () => {
  return (
    <section className="pb-24  overflow-hidden">
      <div className="max-w-[1512px] mx-auto px-8 lg:px-[120px] flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 md:gap-20 max-w-[943px] w-full">
          <div className="flex flex-col gap-8 md:gap-10 w-full lg:w-[500px] text-center lg:text-start ">
            <h2 className="text-[#1a1a1a] text-5xl md:text-6xl lg:text-[56px] font-bold w-9/10 ">
              Хэзээ ч, хаанаас ч хүссэнээрээ суралцаарай
            </h2>

            <Link href="/signup">
              <Button className="px-6 py-6.5 rounded-[8px] bg-[#29cc57] text-white text-xl font-semibold hover:bg-[#24b34d] shadow-[0px_5px_0px_0px_#1f9941] hover:translate-y-[1px] hover:shadow-[0px_4px_0px_0px_#1f9941] transition-all cursor-pointer">
                Яг одоо эхлэх
              </Button>
            </Link>
          </div>

          <div className="relative w-full max-w-[360px] md:max-w-[370px] lg:w-[450px] lg:max-w-none h-[368px] mx-auto lg:mx-0">
            <Image
              src="/assets/home/cta-shape-1.png"
              alt="Shape 1"
              width={183}
              height={160}
              className="absolute left-0 top-0 "
            />

            <div className="absolute bg-[#79b933] left-[190px] rounded-xl w-[160px] h-[160px] top-[24px]" />

            <Image
              src="/assets/home/cta-shape-2.png"
              alt="Shape 2"
              width={188}
              height={160}
              className="absolute -left-4 top-[184px]"
            />

            <Image
              src="/assets/home/cta-shape-3.png"
              alt="Shape 3"
              width={160}
              height={160}
              className="absolute left-[190px] top-[194px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
