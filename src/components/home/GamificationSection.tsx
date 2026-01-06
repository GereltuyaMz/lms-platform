import Image from "next/image";

export const GamificationSection = () => {
  return (
    <section className=" ">
      <div className="max-w-[1512px] mx-auto px-8 lg:px-[120px] flex items-center justify-center">
        <div className="bg-gradient-to-r from-[#eaf7f6] to-[rgba(234,247,246,0)] border flex flex-col gap-10 p-6 md:p-10 rounded-3xl w-full max-w-[1056px]">
          <h2 className="text-[#1a1a1a] text-3xl md:text-[40px] font-semibold leading-none max-w-[518px]">
            Амжилтаа ахиулж, ухаалгаар удирд
          </h2>

          <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className="bg-white border border-[rgba(0,0,0,0.1)] flex flex-col gap-6 p-4 rounded-[20px] flex-1">
              <div className="bg-[#fff2cd] border border-[#ffd900] overflow-hidden relative rounded-full w-14 h-14 flex items-center justify-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/assets/home/xp-icon.png"
                    alt="XP"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-[#1a1a1a] text-xl font-semibold leading-none">
                  XP оноо авах
                </h3>
                <p className="text-[#333] text-sm leading-snug">
                  Хичээл болон quiz бүрээс оноо цуглуулна.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[rgba(0,0,0,0.1)] flex flex-col gap-6 p-4 rounded-[20px] flex-1">
              <div className="bg-[#fff2cd] border border-[#ffd900] overflow-hidden relative rounded-full w-14 h-14 flex items-center justify-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/assets/home/xp-icon.png"
                    alt="Badge"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-[#1a1a1a] text-xl font-semibold leading-none">
                  Шагналтай
                </h3>
                <p className="text-[#333] text-sm leading-snug">
                  Амжилтаараа шинэ badge цуглуулна.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[rgba(0,0,0,0.1)] flex flex-col gap-6 p-4 rounded-[20px] flex-1">
              <div className="bg-[#fff2cd] border border-[#ffd900] overflow-hidden relative rounded-full w-14 h-14 flex items-center justify-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/assets/home/xp-icon.png"
                    alt="Rewards"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-[#1a1a1a] text-xl font-semibold leading-none">
                  Урамшуулал авах
                </h3>
                <p className="text-[#333] text-sm leading-snug">
                  Цуглуулсан оноогоороо бүтээгдэхүүн худалдан авах боломжтой.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
