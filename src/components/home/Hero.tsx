import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { NaturalSciencesIcon } from "@/icons";

export const Hero = () => {
  return (
    <section className="bg-white  overflow-hidden">
      <div className="max-w-[1512px] mx-auto px-8 lg:px-[120px]">
        <div className="flex flex-col items-center gap-10 pt-16 md:pt-18">
          <div className="relative w-full max-w-[1200px] aspect-[2160/726]">
            <Image
              src="/assets/home/hero-image.png"
              alt="Learn by doing"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="flex flex-col gap-10 items-center w-full max-w-[484px]">
            <p className="text-[#131313] text-xl md:text-2xl leading-tight text-center whitespace-pre-wrap">
              Хэзээ ч, хаана ч, ойлгомжтой хичээлүүдээр өөрийгөө хөгжүүлээрэй.
            </p>

            <Link href="/signup">
              <Button className="px-6 py-3 rounded-lg bg-[#29cc57] text-white text-base font-bold hover:bg-[#24b34d] shadow-[0px_4px_0px_0px_#1f9941] hover:translate-y-[1px] hover:shadow-[0px_3px_0px_0px_#1f9941] transition-all cursor-pointer">
                Одоо эхлэх
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-[#e1e1e1] flex flex-wrap gap-6 md:gap-10 items-center justify-center px-0 py-6 mt-6">
          <div className="flex gap-3 items-center justify-center">
            <div className="grid grid-cols-1 grid-rows-1 justify-items-start leading-[0] relative shrink-0 w-[16.292px] h-[16.292px]">
              <div className="col-[1] row-[1] flex items-center justify-center relative w-[16.292px] h-[16.292px]">
                <div className="rotate-45 w-[11.52px] h-[11.52px] bg-[#7491ff]" />
              </div>
              <div className="col-[1] row-[1] ml-[16.32px] mt-[8.64px] w-[7.68px] h-[7.68px] bg-[#213c9d]" />
              <div className="col-[1] row-[1] ml-[8.64px] mt-[16.32px] w-[7.68px] h-[7.68px] bg-[#375cdf]" />
            </div>
            <p className="text-[#1a1a1a] text-base leading-tight">Математик</p>
          </div>

          <div className="flex gap-3 items-center justify-center">
            <div className="overflow-hidden relative shrink-0 w-6 h-6">
              <div className="absolute h-[25px] left-0 top-0 w-[26px]">
                <NaturalSciencesIcon width={24} height={24} />
              </div>
            </div>
            <p className="text-[#1a1a1a] text-base leading-tight">
              Байгалийн ухаан
            </p>
          </div>

          <div className="flex gap-3 items-center justify-center">
            <div className="bg-[#7491ff] overflow-hidden relative rounded-full shrink-0 w-6 h-6 flex items-center justify-center">
              <p className="font-extrabold leading-none text-xs text-white tracking-[0.84px]">
                EN
              </p>
            </div>
            <p className="text-[#1a1a1a] text-base leading-tight">Англи хэл</p>
          </div>
        </div>
      </div>
    </section>
  );
};
