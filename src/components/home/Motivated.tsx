import Image from "next/image";

export const Motivated = () => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* TEXT */}
          <div>
            <h1 className="text-h1 mb-6">
              Сониуч хэвээр бай. Урам зоригтой бай.
            </h1>
            <p className="text-medium font-semibold">
              Оноо цуглуул. Шагнал аваарай.
            </p>
          </div>

          {/* IMAGE + gradient background */}
          <div className="relative flex justify-center md:justify-end">
            {/* Soft blurry gradient blobs */}
            <div className="absolute -top-6 -left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl"></div>
            <div className="absolute top-20 right-0 w-48 h-48 rounded-full bg-secondary/30 blur-3xl"></div>
            <div className="absolute bottom-0 left-20 w-56 h-56 rounded-full bg-accent/30 blur-3xl"></div>

            <Image
              src="/assets/frame-3.png"
              alt="Learning illustration"
              width={640}
              height={640}
              className="relative w-full max-w-[640px] z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
