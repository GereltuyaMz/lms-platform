"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Step1Welcome } from "./Step1Welcome"
import { Step2Goal } from "./Step2Goal"
import { Step3Subject } from "./Step3Subject"
import { Step4Complete } from "./Step4Complete"
import { cn } from "@/lib/utils"

type OnboardingStep = 1 | 2 | 3 | 4

type OnboardingData = {
  goal: string | null
  subject: string | null
}

type OnboardingWizardProps = {
  userName: string
}

export const OnboardingWizard = ({ userName }: OnboardingWizardProps) => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [data, setData] = useState<OnboardingData>({
    goal: null,
    subject: null,
  })
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const totalSteps = 4
  const progressPercentage = (currentStep / totalSteps) * 100

  // Determine if continue button should be enabled
  const canContinue =
    currentStep === 1 ||
    currentStep === 4 ||
    (currentStep === 2 && selectedGoal !== null) ||
    (currentStep === 3 && selectedSubject !== null)

  const handleNext = () => {
    if (currentStep < 4) {
      // Save selections to data when moving forward
      if (currentStep === 2 && selectedGoal) {
        setData((prev) => ({ ...prev, goal: selectedGoal }))
      }
      if (currentStep === 3 && selectedSubject) {
        setData((prev) => ({ ...prev, subject: selectedSubject }))
      }
      setCurrentStep((prev) => (prev + 1) as OnboardingStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep)
    }
  }

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal)
  }

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Progress Bar Section */}
      <div className="w-full max-w-4xl mx-auto px-6 pt-16 pb-8">
        <div className="flex items-center gap-5">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(
              "p-2.5 rounded-full transition-all",
              currentStep === 1
                ? "opacity-0 pointer-events-none"
                : "hover:bg-gray-100 cursor-pointer"
            )}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 bg-[#e5e5e5] h-3 rounded-lg overflow-hidden">
            <div
              className="h-full bg-[#29cc57] transition-all duration-300 rounded-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4 md:px-6">
        {/* Step Content */}
        <div className="w-full max-w-4xl">
          {currentStep === 1 && (
            <Step1Welcome userName={userName} />
          )}
          {currentStep === 2 && (
            <Step2Goal
              selectedGoal={selectedGoal}
              onSelectGoal={handleSelectGoal}
            />
          )}
          {currentStep === 3 && (
            <Step3Subject
              selectedSubject={selectedSubject}
              onSelectSubject={handleSelectSubject}
            />
          )}
          {currentStep === 4 && (
            <Step4Complete goal={data.goal} subject={data.subject} />
          )}
        </div>
      </div>

      {/* Fixed Continue Button - Bottom Right */}
      {currentStep !== 4 && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className={cn(
              "px-6 py-3 rounded-lg font-bold text-base text-white font-[family-name:var(--font-nunito)]",
              "bg-[#29cc57] shadow-[0px_4px_0px_0px_#1f9941]",
              "hover:shadow-[0px_2px_0px_0px_#1f9941] hover:translate-y-[2px]",
              "active:shadow-none active:translate-y-1",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0px_4px_0px_0px_#1f9941]",
              "transition-all cursor-pointer"
            )}
          >
            Үргэлжлүүлэх
          </button>
        </div>
      )}
    </div>
  )
}
