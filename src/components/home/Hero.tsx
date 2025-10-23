import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="flex-col items-center justify-center mx-auto max-w-[1600px]">
      {/* <div
        className="bg-cover bg-center bg-no-repeat h-[700px]"
        style={{
          backgroundImage: "url('/assets/background.png')",
        }}
      /> */}
      <Image src="/assets/background.png" alt="bg" width={1400} height={600} />

      {/* Content */}
      <div className="container mx-auto px-4 text-center ">
        <h1 className="text-h1 mb-4 max-w-4xl mx-auto">
          Where learning feels like fun.
        </h1>

        <p className="text-medium mb-8 max-w-2xl mx-auto ">
          Learn anywhere, anytime with bite-sized lessons that make studying
          fun.
        </p>
        <Link href="/signup">
          <Button
            className="font-semibold rounded-3xl bg-primary cursor-pointer"
            size="lg"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
};
