"use client";

import { Sparkles, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ShopHeaderProps = {
  userXP: number;
};

export const ShopHeader = ({ userXP }: ShopHeaderProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-b border-border">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Ambient glow effects matching brand colors */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/8 rounded-full blur-[120px] animate-pulse-slow [animation-delay:2s]" />

      <div className="container relative mx-auto px-4 py-12 md:py-16 max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Title section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Rewards Shop
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              XP Дэлгүүр
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-md">
              Оноогоо бодит шагналд хувиргаарай
            </p>
          </div>

          {/* XP Balance Card */}
          <div className="group relative">
            {/* Subtle glow on hover */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

            <Card className="relative shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-5">
                  {/* XP Icon with pulse animation */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-md opacity-40 animate-pulse-slow" />
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
                    </div>
                  </div>

                  {/* XP Amount */}
                  <div className="min-w-[140px]">
                    <p className="text-sm text-muted-foreground font-semibold mb-1">
                      Таны XP
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl md:text-5xl font-black text-foreground tabular-nums">
                        {userXP.toLocaleString()}
                      </p>
                      <span className="text-lg font-bold text-amber-600">XP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
