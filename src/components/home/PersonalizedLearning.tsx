import Image from "next/image";

export const PersonalizedLearning = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div>
            <Image
              src="/assets/frame-1.png"
              alt="Learning illustration"
              width={640}
              height={640}
              className="w-full max-w-[640px]"
            />
          </div>
          <div>
            <h1 className="text-h1 mb-6">Learn at your level</h1>
            <p className="text-medium">
              Interactive lessons make even complex ideas easy to grasp.
              Instant, custom feedback accelerates your understanding.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
