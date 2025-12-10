"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

type Step3SubjectProps = {
  onSelectSubject: (subject: string) => void
  onSkip: () => void
}

const subjects = [
  {
    value: "Math",
    label: "Математик",
    icon: "#️⃣",
  },
  {
    value: "Science",
    label: "Шинжлэх ухаан",
    icon: "⚗️",
  },
  {
    value: "Chemistry",
    label: "Хими",
    icon: "🧪",
  },
]

export const Step3Subject = ({ onSelectSubject, onSkip }: Step3SubjectProps) => {
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
            Та эхлээд ямар хичээл
            <br />
            сурахыг хүсэж байна вэ?
          </p>
        </div>
      </div>

      {/* Subject options */}
      <div className="space-y-4">
        {subjects.map((subject) => (
          <button
            key={subject.value}
            onClick={() => onSelectSubject(subject.value)}
            className="w-full flex items-center gap-4 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-teal-500 hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-4xl">{subject.icon}</span>
            <span className="text-lg font-medium text-gray-900">
              {subject.label}
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
