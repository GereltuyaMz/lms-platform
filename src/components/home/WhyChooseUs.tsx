import Image from "next/image";

export const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div>
            <h1 className="text-h1 mb-6">Та юу ч байсан суралцаж чадна</h1>
            <p className="text-medium font-semibold">
              Математик, шинжлэх ухаан болон бусад хичээлийг гүн гүнзгий,
              бодитойгоор ойлгож эзэмшээрэй.
            </p>
          </div>

          <div className="relative flex justify-center md:justify-end">
            {/* Floating fun elements */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary/20 rounded-full animate-float-slow"></div>
            <div className="absolute top-10 -right-4 w-10 h-10 bg-secondary/20 rounded-full animate-float-slower"></div>
            <div className="absolute bottom-0 left-10 w-20 h-20 bg-accent/20 rounded-full animate-float"></div>

            {/* Main Image */}
            <Image
              src="/assets/frame-2.png"
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
