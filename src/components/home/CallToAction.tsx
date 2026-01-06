import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const CallToAction = () => {
  return (
    <section className="pb-24 md:pb-32 overflow-hidden">
      <div className="max-w-[1512px] mx-auto px-8 lg:px-[120px] flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 md:gap-20 max-w-[1056px] w-full">
          <div className="flex flex-col gap-12 md:gap-14 w-full lg:w-[500px]">
            <h2 className="text-[#1a1a1a] text-5xl md:text-6xl lg:text-[64px] font-bold leading-tight">
              Хэзээ ч, хаанаас ч хүссэнээрээ суралцаарай
            </h2>

            <Link href="/signup">
              <Button className="px-8 py-4 rounded-xl bg-[#29cc57] text-white text-2xl font-semibold hover:bg-[#24b34d] shadow-[0px_5px_0px_0px_#1f9941] hover:translate-y-[1px] hover:shadow-[0px_4px_0px_0px_#1f9941] transition-all cursor-pointer">
                Яг одоо эхлэх
              </Button>
            </Link>
          </div>

          <div className="relative w-full max-w-[360px] md:max-w-[370px] lg:w-[450px] lg:max-w-none h-[400px] md:h-[420px] lg:h-[500px] mx-auto lg:mx-0">
            <div className="absolute bg-[#ff9600] left-0 rounded-xl w-[170px] h-[170px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] top-0 overflow-hidden">
              <div className="absolute inset-[10%] flex items-center justify-center">
                <Image
                  src="/assets/home/cta-shape-1.png"
                  alt="Shape 1"
                  width={240}
                  height={180}
                  className="rotate-180 scale-y-[-1]"
                />
              </div>
            </div>

            <div className="absolute bg-[#79b933] left-[180px] md:left-[185px] lg:left-[230px] rounded-xl w-[170px] h-[170px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] top-[25px] md:top-[20px] lg:top-[30px]" />

            <div className="absolute left-0 w-[170px] h-[170px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] top-[190px] md:top-[195px] lg:top-[250px]">
              <div className="bg-[#49c0f8] relative rounded-xl w-full h-full rotate-180 scale-y-[-1] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/assets/home/cta-shape-2.png"
                    alt="Shape 2"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>

            <div className="absolute left-[180px] md:left-[185px] lg:left-[230px] w-[170px] h-[170px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] top-[215px] md:top-[215px] lg:top-[280px]">
              <div className="bg-[#ff9600] relative rounded-xl w-full h-full rotate-180 scale-y-[-1] overflow-hidden">
                <div className="absolute inset-[10%] flex items-center justify-center">
                  <Image
                    src="/assets/home/cta-shape-3.png"
                    alt="Shape 3"
                    width={206}
                    height={240}
                    className="rotate-180 scale-y-[-1]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
