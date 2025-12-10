"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

type Step2GoalProps = {
  onSelectGoal: (goal: string) => void
  onSkip: () => void
}

const goals = [
  {
    value: "Professional growth",
    label: "Мэргэжлийн өсөлт",
    icon: "🌳",
  },
  {
    value: "Excel in school",
    label: "Сургуульд тэргүүлэх",
    icon: "➕",
  },
  {
    value: "Lifelong learning",
    label: "Насан туршийн суралцах",
    icon: "🕐",
  },
  {
    value: "Explore new subjects",
    label: "Шинэ сэдвүүд судлах",
    icon: "🔔",
  },
]

export const Step2Goal = ({ onSelectGoal, onSkip }: Step2GoalProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-16 md:space-y-20">
      {/* Mascot with speech bubble */}
      <div className="flex items-start gap-8 justify-center">
        {/* Mascot */}
        <Image
          src="/assets/character.png"
          alt="Character mascot"
          width={120}
          height={120}
          className="drop-shadow-lg flex-shrink-0"
        />

        {/* Speech bubble */}
        <div className="bg-teal-50 border-2 border-teal-500 rounded-2xl px-6 py-3 shadow-md relative mt-8">
          <p className="text-base font-medium text-teal-900">
            Таны гол зорилго юу вэ?
          </p>
        </div>
      </div>

      {/* Goal options */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <button
            key={goal.value}
            onClick={() => onSelectGoal(goal.value)}
            className="w-full flex items-center gap-4 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-teal-500 hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-4xl">{goal.icon}</span>
            <span className="text-lg font-medium text-gray-900">
              {goal.label}
            </span>
          </button>
        ))}
      </div>

      {/* Skip Button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onSkip}
        >
          Алгасах
        </Button>
      </div>
    </div>
  )
}
