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
  { icon: Video, title: "Видео", xp: "50-95 XP", desc: "Үндсэн + үргэлжлэх хугацааны урамшуулал" },
  { icon: Trophy, title: "Тест", xp: "100-200 XP", desc: "Оноонд суурилсан (эхний оролдлого)" },
  { icon: Target, title: "Түвшин", xp: "200-1,500 XP", desc: "Хичээл дуусгасны урамшуулал" },
  { icon: Flame, title: "Cтрик", xp: "100-1,000 XP", desc: "Өдөр тутмын тогтвортой байдлын шагнал" },
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
            XP ба шагналын заавар
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="earn" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="earn">XP олох</TabsTrigger>
            <TabsTrigger value="levels">Түвшин</TabsTrigger>
            <TabsTrigger value="streaks">Цуваа</TabsTrigger>
            <TabsTrigger value="soon">Удахгүй</TabsTrigger>
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
                <strong>💡 Хурдан XP:</strong> Профайлаа бөглөөд хялбараар
                150 XP авна уу!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="levels" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3">Түвшин хэрхэн ажилладаг вэ</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Түвшин тус бүрт <strong>500 XP</strong> олно</li>
                  <li>✓ Түвшин = (Нийт XP ÷ 500) + 1</li>
                  <li>✓ Явц автоматаар шинэчлэгдэнэ</li>
                  <li>✓ Түвшингийн хязгааргүй!</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Лигийн шатлал</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg">
                    <span className="font-semibold">🥉 Хүрэл</span>
                    <span className="text-sm text-gray-700">Түвшин 1-4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-200 to-slate-200 rounded-lg">
                    <span className="font-semibold">🥈 Мөнгө</span>
                    <span className="text-sm text-gray-700">Түвшин 5-9</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg">
                    <span className="font-semibold">🥇 Алт</span>
                    <span className="text-sm text-gray-700">Түвшин 10-14</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg">
                    <span className="font-semibold">💎 Платин</span>
                    <span className="text-sm text-gray-700">Түвшин 15-19</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <span className="font-semibold">💠 Алмаз</span>
                    <span className="text-sm text-gray-700">Түвшин 20+</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="streaks" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                <h3 className="font-bold text-gray-900 mb-3">
                  🔥 Cтрик түвшин
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>3 өдрийн cтрик</span>
                    <span className="font-bold text-orange-600">100 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>7 өдрийн cтрик</span>
                    <span className="font-bold text-orange-600">250 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30 өдрийн cтрик</span>
                    <span className="font-bold text-orange-600">1,000 XP</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  cтрик хэрхэн хадгалах вэ
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Өдөр бүр дор хаяж нэг үйл ажиллагаа хий</li>
                  <li>• Өдөр бүр ижил цагт суралц</li>
                  <li>• 10 минут ч гэсэн хангалттай!</li>
                  <li>• Нэг өдөр алгасвал 0 болно</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="soon" className="space-y-4 mt-4">
            <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <span className="text-4xl mb-3 block">🚀</span>
              <h3 className="font-bold text-gray-900 mb-2">Сонирхолтой функцууд удахгүй нэмэгдэнэ!</h3>
              <ul className="space-y-2 text-sm text-gray-600 text-left max-w-md mx-auto mt-4">
                <li className="flex items-center gap-2">
                  <span>🏆</span>
                  <span><strong>38+ Тэмдэг</strong> - Цуглуулах боломжтой амжилтууд</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🛍️</span>
                  <span><strong>Онцгой дэлгүүр</strong> - XP ашиглан шагнал авах</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📊</span>
                  <span><strong>Тэргүүлэгчдийн самбар</strong> - Дэлхийд өрсөлдөх</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>⚡</span>
                  <span><strong>Цувааны үржүүлэгч</strong> - 1.5 дахин XP хүртэл</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-4 border-t">
          <Link href="/guide">
            <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
              Бүрэн заавар үзэх
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
