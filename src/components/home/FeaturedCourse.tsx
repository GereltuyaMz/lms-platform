import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const FeaturedCourse = () => {
  return (
    <section className="py-10 md:py-0">
      <div className="max-w-[1512px] mx-auto px-8 lg:px-[120px] flex items-center justify-center">
        <div className="bg-gradient-to-r from-[#eaf7f6] to-[rgba(234,247,246,0)] border border-[rgba(77,152,244,0.2)] flex flex-col lg:flex-row items-end justify-between p-6 md:p-10 rounded-3xl gap-8 w-full max-w-[1056px]">
          <div className="flex flex-col gap-6 w-full lg:w-[518px]">
            <div className="flex flex-col gap-4 w-full">
              <div className="bg-[#d3fbb1] border border-[#afee7c] inline-flex items-center justify-center px-3 py-2 rounded-lg self-start">
                <p className="text-[#25700e] text-sm font-semibold leading-snug">
                  Онцлох курс
                </p>
              </div>

              <div className="flex flex-col gap-6 w-full">
                <h2 className="text-[#131313] text-3xl md:text-[40px] font-semibold leading-none">
                  ЭЕШ Математикийн бүрэн хөтөлбөр
                </h2>
                <p className="text-[#333] text-base leading-snug">
                  ЭЕШ-ын математикийн гол сэдвүүдийг нэг дор цогцоор нь
                  багтаасан хөтөлбөр. Шат дараалсан тайлбар, ойлгомжтой жишээ,
                  практик дасгалуудын тусламжтайгаар алгебр, геометр, тооны
                  онол, статистикийн үндсийг баттай эзэмшинэ.
                </p>
              </div>
            </div>

            <Link href="/courses">
              <Button className="px-6 py-3 rounded-lg bg-[#29cc57] text-white text-base font-bold hover:bg-[#24b34d] shadow-[0px_4px_0px_0px_#1f9941] hover:translate-y-[1px] hover:shadow-[0px_3px_0px_0px_#1f9941] transition-all cursor-pointer">
                Дэлгэрэнгүй
              </Button>
            </Link>
          </div>

          <div className="relative w-full lg:w-auto h-[400px] lg:h-[520px] rounded-[20px] overflow-hidden lg:min-w-[400px]">
            <Image
              src="/assets/home/featured-course-bg.png"
              alt="Featured course"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.57642)] via-[69.758%] to-transparent rounded-[20px]" />

            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
              <div className="bg-white px-4 py-2 rounded-full">
                <p className="text-[#1a1a1a] text-base leading-snug">
                  30+ хичээл
                </p>
              </div>
              <div className="bg-white px-4 py-2 rounded-full">
                <p className="text-[#1a1a1a] text-base leading-snug">
                  10 үндсэн курс
                </p>
              </div>
              <div className="bg-white px-4 py-2 rounded-full">
                <p className="text-[#1a1a1a] text-base leading-snug">
                  Практик дасгал
                </p>
              </div>
              <div className="bg-white px-4 py-2 rounded-full">
                <p className="text-[#1a1a1a] text-base leading-snug">
                  ЭЕШ стандарт дасгал
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
