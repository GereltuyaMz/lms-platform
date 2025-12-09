import Image from "next/image";

export const PersonalizedLearning = () => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* IMAGE AREA WITH EFFECTS */}
          <div className="relative flex justify-center">
            {/* Math symbols */}
            <span className="math-symbol top-6 left-10">+</span>
            <span className="math-symbol top-24 right-8">√</span>
            <span className="math-symbol bottom-10 left-20">π</span>
            <span className="math-symbol bottom-4 right-10">+</span>
            <span className="math-symbol top-1/2 left-1/3">√</span>

            <Image
              src="/assets/frame-1.png"
              alt="Learning illustration"
              width={640}
              height={640}
              className="relative w-full max-w-[640px] z-10"
            />
          </div>

          {/* TEXT AREA */}
          <div>
            <h1 className="text-h1 mb-6">Таны түвшинд тохирсон сургалт</h1>
            <p className="text-medium font-semibold leading-relaxed">
              Харилцан идэвхтэй хичээлүүд нь төвөгтэй ойлголтыг ч энгийн,
              ойлгомжтой болгож өгнө.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
