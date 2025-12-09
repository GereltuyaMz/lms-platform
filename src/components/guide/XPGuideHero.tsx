"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

type XPGuideHeroProps = {
  userXP?: number;
  userLevel?: number;
  userStreak?: number;
};

export const XPGuideHero = ({
  userXP = 0,
  userLevel = 1,
  userStreak = 0,
}: XPGuideHeroProps) => {
  const [animatedXP, setAnimatedXP] = useState(0);

  useEffect(() => {
    if (userXP > 0) {
      const duration = 2000;
      const steps = 60;
      const increment = userXP / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= userXP) {
          setAnimatedXP(userXP);
          clearInterval(timer);
        } else {
          setAnimatedXP(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [userXP]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Суралцах аяллаа дараагийн түвшинд гаргаарай 🚀
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          XP олж, тэмдэг нээж, шинэ ур чадвар эзэмшихдээ онцгой шагналыг авна уу
        </p>

        {/* Stats */}
        {userXP > 0 && (
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                {animatedXP.toLocaleString()}
              </p>
              <p className="text-sm text-white/80">Нийт XP</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                {userLevel}
              </p>
              <p className="text-sm text-white/80">Түвшин</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                {userStreak} 🔥
              </p>
              <p className="text-sm text-white/80">Өдрийн cтрик</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
