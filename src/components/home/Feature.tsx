import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";

export const Feature = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-h2 text-center mb-12 md:mb-16">
          Explore Our Course Collection
        </h1>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Large Featured Math Card - Takes 2 columns, 1 row on desktop */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                🏆 FEATURED
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-h3 font-bold mb-3 text-gray-900">
                  Master Mathematics
                </h3>
                <p className="text-medium text-gray-600 mb-6">
                  Build problem-solving skills from algebra to calculus with
                  interactive lessons and real-world applications.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm">📚</span>
                    </div>
                    <span className="text-small text-gray-700">50 Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm">👥</span>
                    </div>
                    <span className="text-small text-gray-700">10K+ Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="text-small text-gray-700">
                      Interactive Quizzes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm">⭐</span>
                    </div>
                    <span className="text-small text-gray-700">Beginner Friendly</span>
                  </div>
                </div>

                <Link href="/courses">
                  <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 cursor-pointer">
                    Start Learning Math
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div>
                <Image
                  src="/assets/math.png"
                  alt="Math courses illustration"
                  width={350}
                  height={280}
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-orange-100">
            <h4 className="text-h5 font-bold mb-6 text-gray-900">
              Platform Overview
            </h4>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-h2 font-bold text-orange-600 mb-2">500+</p>
                <p className="text-medium text-gray-600">Interactive Lessons</p>
                <p className="text-small text-gray-500 mt-1">Across all subjects</p>
              </div>
              <div className="text-center">
                <p className="text-h2 font-bold text-orange-600 mb-2">12</p>
                <p className="text-medium text-gray-600">Course Categories</p>
                <p className="text-small text-gray-500 mt-1">And growing</p>
              </div>
            </div>
          </div>

          {/* Key Topics Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-100 flex flex-col">
            <h4 className="text-h5 font-bold mb-6 text-gray-900">
              Math Topics
            </h4>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-medium text-gray-700">Algebra</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-medium text-gray-700">Geometry</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-medium text-gray-700">Calculus</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-medium text-gray-700">Statistics</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-3 h-3 rounded-full bg-purple-300"></div>
                <span className="text-medium">+ Many more</span>
              </div>
            </div>
            <Link href="/courses" className="mt-6">
              <Button
                variant="outline"
                className="w-full rounded-lg border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer"
              >
                View All Topics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Achievements Card - Spans 2 columns */}
          <div className="md:col-span-2 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-yellow-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-xl bg-yellow-500 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="text-h4 font-bold text-gray-900">
                  Earn XP & Unlock Rewards
                </h4>
                <p className="text-small text-gray-600">
                  Your learning journey, gamified
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <span className="text-2xl">📚</span>
                </div>
                <h5 className="text-h6 font-semibold text-gray-900 mb-1">
                  Collect XP Points
                </h5>
                <p className="text-small text-gray-600">
                  Earn points by completing lessons and quizzes
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <span className="text-2xl">🏆</span>
                </div>
                <h5 className="text-h6 font-semibold text-gray-900 mb-1">
                  Unlock Badges
                </h5>
                <p className="text-small text-gray-600">
                  Achieve milestones and earn exclusive badges
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h5 className="text-h6 font-semibold text-gray-900 mb-1">
                  Shop with Points
                </h5>
                <p className="text-small text-gray-600">
                  Redeem XP for premium content and rewards
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-white/50 rounded-xl">
              <span className="text-3xl">⭐</span>
              <span className="text-3xl">🎯</span>
              <span className="text-3xl">💎</span>
              <span className="text-3xl">🔥</span>
              <span className="text-medium text-gray-600 font-semibold">
                + Many more achievements
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
