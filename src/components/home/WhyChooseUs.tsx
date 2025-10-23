import Image from "next/image";

export const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div>
            <h1 className="text-h1 mb-6">You can learn anything</h1>
            <p className="text-medium">
              Build a deep, solid understanding in math, science, and more.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/assets/frame-2.png"
              alt="Learning illustration"
              width={640}
              height={640}
              className="w-full max-w-[640px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
