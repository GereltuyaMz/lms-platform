"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import ReactLenis from "lenis/react";
import Image from "next/image";
import { useRef } from "react";

type StackingCardProps = {
  bgColor: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  textColor: string;
  descriptionColor: string;
  reverse?: boolean;
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  paddingTop?: string;
  paddingBottom?: string;
};

const StackingCard = ({
  bgColor,
  imageSrc,
  imageAlt,
  title,
  description,
  textColor,
  descriptionColor,
  reverse = false,
  index,
  progress,
  range,
  targetScale,
  paddingTop = "0",
  paddingBottom = "0",
}: StackingCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={containerRef}
      style={{
        paddingTop,
        paddingBottom,
      }}
      className="flex items-center justify-center sticky top-10"
    >
      <motion.div
        style={{
          backgroundColor: bgColor,
          scale,
          top: `${index * 40}px`,
        }}
        className="relative flex origin-top flex-col lg:flex-row items-center justify-between p-6 md:p-10 rounded-3xl gap-8 overflow-hidden w-full max-w-[1056px]"
      >
        <div
          className={`bg-[#f6f6f6] overflow-hidden relative rounded-[20px] w-full lg:w-[400px] h-[300px] lg:h-[400px] shrink-0 ${
            reverse ? "lg:order-2" : ""
          }`}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex flex-col gap-5 w-full lg:w-[518px]">
          <h2
            className="text-3xl md:text-[40px] font-semibold leading-none"
            style={{ color: textColor }}
          >
            {title}
          </h2>
          <p
            className="text-base md:text-lg leading-snug"
            style={{ color: descriptionColor }}
          >
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const FeatureCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <section ref={containerRef} className="relative -mt-20 md:-mt-32">
        <div className="max-w-[1512px] mx-auto px-8 lg:px-[120px]">
          <StackingCard
            bgColor="#c9e5ff"
            imageSrc="/assets/home/feature-1.png"
            imageAlt="Learn what you want"
            title="Та хүссэн зүйлээ сурч, эзэмшиж чадна"
            description="Математик, шинжлэх ухаан болон бусад хичээлийг гүнзгий, бодитойгоор ойлгож эзэмшээрэй."
            textColor="#131313"
            descriptionColor="#333"
            reverse={false}
            index={0}
            progress={scrollYProgress}
            range={[0, 1]}
            targetScale={0.9}
            paddingTop="90px"
            paddingBottom="90px"
          />

          <StackingCard
            bgColor="#fed29a"
            imageSrc="/assets/home/feature-2.png"
            imageAlt="Personalized learning"
            title="Таны түвшинд тохирсон сургалт"
            description="Харилцан идэвхтэй хичээлүүд нь төвөгтэй ойлголтыг ч энгийн, ойлгомжтой болгож өгнө."
            textColor="#131313"
            descriptionColor="#333"
            reverse={true}
            index={1}
            progress={scrollYProgress}
            range={[0.25, 1]}
            targetScale={0.95}
            paddingTop="90px"
            paddingBottom="90px"
          />

          <StackingCard
            bgColor="#4d98f4"
            imageSrc="/assets/home/feature-3.png"
            imageAlt="Stay curious and motivated"
            title="Сониуч хэвээр бай. Урам зоригтой бай."
            description="Оноо цуглуул. Шагнал аваарай."
            textColor="#ffffff"
            descriptionColor="#dedede"
            reverse={false}
            index={2}
            progress={scrollYProgress}
            range={[0.5, 1]}
            targetScale={1}
            paddingTop="90px"
            paddingBottom="90px"
          />
        </div>
      </section>
    </ReactLenis>
  );
};
