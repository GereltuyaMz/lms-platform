"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

type Step1WelcomeProps = {
  userName: string
  onContinue: () => void
  onSkip: () => void
}

export const Step1Welcome = ({ userName, onContinue, onSkip }: Step1WelcomeProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-16 md:space-y-20">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Сайн байна уу, {userName}! Тавтай морил
        </h1>
      </div>

      {/* Mascot */}
      <div className="flex justify-center">
        <div className="relative">
          <Image
            src="/assets/character.png"
            alt="Character mascot"
            width={200}
            height={200}
            className="drop-shadow-lg"
          />

          {/* Speech bubble */}
          <div className="absolute -top-4 -right-48 bg-teal-50 border-2 border-teal-500 rounded-2xl px-6 py-3 shadow-md">
            <p className="text-sm md:text-base font-medium text-teal-900 whitespace-nowrap">
              Таны хувийн суралцах
              <br />
              замыг хамтдаа зохиоцгооё
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-teal-500 hover:bg-teal-600 text-white px-12 py-6 text-lg rounded-full cursor-pointer"
        >
          Үргэлжлүүлэх
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          Алгасах
        </Button>
      </div>
    </div>
  )
}
