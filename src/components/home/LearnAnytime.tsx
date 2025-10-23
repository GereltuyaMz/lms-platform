import Image from "next/image";
import { Button } from "../ui/button";

export const LearnAnytime = () => {
  return (
    <section className="relative py-16 md:py-24 md:px-16 h-[800px]">
      <div className="bg-secondary h-full flex flex-col justify-center items-center gap-4">
        <h1 className="text-h1 text-white">Learn anytime, anywhere</h1>
        <Button size="lg" className="bg-primary rounded-2xl font-bold">
          Get Started
        </Button>
      </div>
      <div className="absolute -top-10">
        <Image
          src="/assets/frame-5.png"
          alt="Learning"
          width={400}
          height={400}
        />
      </div>
      <div className="absolute bottom-20 left-[20%]">
        <Image
          src="/assets/frame-6.png"
          alt="Learning"
          width={400}
          height={400}
        />
      </div>
      <div className="absolute bottom-20 right-0">
        <Image
          src="/assets/frame-7.png"
          alt="Learning"
          width={400}
          height={400}
        />
      </div>
    </section>
  );
};
