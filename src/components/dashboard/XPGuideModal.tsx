"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Video, Trophy, Target, Flame, Sparkles } from "lucide-react";

const xpMethods = [
  { icon: Video, title: "Videos", xp: "50-95 XP", desc: "Base + duration bonus" },
  { icon: Trophy, title: "Quizzes", xp: "100-200 XP", desc: "Score-based (first attempt)" },
  { icon: Target, title: "Milestones", xp: "200-1,500 XP", desc: "Course completion bonuses" },
  { icon: Flame, title: "Streaks", xp: "100-1,000 XP", desc: "Daily consistency rewards" },
];

export const XPGuideModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-primary/10 cursor-pointer"
        >
          <Info className="h-4 w-4 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            XP & Rewards Guide
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="earn" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="earn">Earn XP</TabsTrigger>
            <TabsTrigger value="levels">Levels</TabsTrigger>
            <TabsTrigger value="streaks">Streaks</TabsTrigger>
            <TabsTrigger value="soon">Coming Soon</TabsTrigger>
          </TabsList>

          <TabsContent value="earn" className="space-y-4 mt-4">
            <div className="space-y-3">
              {xpMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {method.title}
                      </h4>
                      <p className="text-sm text-gray-600">{method.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        {method.xp}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Quick Win:</strong> Complete your profile for an easy
                150 XP bonus!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="levels" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3">How Levels Work</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Earn <strong>500 XP</strong> per level</li>
                  <li>✓ Level = (Total XP ÷ 500) + 1</li>
                  <li>✓ Progress updates automatically</li>
                  <li>✓ No level cap!</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">League Tiers</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg">
                    <span className="font-semibold">🥉 Bronze</span>
                    <span className="text-sm text-gray-700">Levels 1-4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-200 to-slate-200 rounded-lg">
                    <span className="font-semibold">🥈 Silver</span>
                    <span className="text-sm text-gray-700">Levels 5-9</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg">
                    <span className="font-semibold">🥇 Gold</span>
                    <span className="text-sm text-gray-700">Levels 10-14</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg">
                    <span className="font-semibold">💎 Platinum</span>
                    <span className="text-sm text-gray-700">Levels 15-19</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <span className="font-semibold">💠 Diamond</span>
                    <span className="text-sm text-gray-700">Level 20+</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="streaks" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                <h3 className="font-bold text-gray-900 mb-3">
                  🔥 Streak Milestones
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>3-Day Streak</span>
                    <span className="font-bold text-orange-600">100 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>7-Day Streak</span>
                    <span className="font-bold text-orange-600">250 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-Day Streak</span>
                    <span className="font-bold text-orange-600">1,000 XP</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  How to Maintain Streaks
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Complete at least one activity daily</li>
                  <li>• Learn at the same time each day</li>
                  <li>• Even 10 minutes counts!</li>
                  <li>• Missing a day resets to 0</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="soon" className="space-y-4 mt-4">
            <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <span className="text-4xl mb-3 block">🚀</span>
              <h3 className="font-bold text-gray-900 mb-2">Exciting Features Coming Soon!</h3>
              <ul className="space-y-2 text-sm text-gray-600 text-left max-w-md mx-auto mt-4">
                <li className="flex items-center gap-2">
                  <span>🏆</span>
                  <span><strong>38+ Badges</strong> - Collectible achievements</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🛍️</span>
                  <span><strong>Exclusive Shop</strong> - Redeem XP for rewards</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📊</span>
                  <span><strong>Leaderboards</strong> - Compete globally</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>⚡</span>
                  <span><strong>Streak Multipliers</strong> - Up to 1.5x XP</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-4 border-t">
          <Link href="/guide">
            <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
              View Full Guide
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
