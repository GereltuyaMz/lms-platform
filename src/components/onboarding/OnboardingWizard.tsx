"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Step1Welcome } from "./Step1Welcome"
import { Step2Goal } from "./Step2Goal"
import { Step3Subject } from "./Step3Subject"
import { Step4Complete } from "./Step4Complete"
import { skipOnboarding } from "@/lib/actions/onboarding"

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

  const totalSteps = 4
  const progressPercentage = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep)
    }
  }

  const handleSkip = async () => {
    await skipOnboarding()
    router.push("/dashboard")
  }

  const handleSelectGoal = (goal: string) => {
    setData((prev) => ({ ...prev, goal: goal || null }))
    handleNext()
  }

  const handleSelectSubject = (subject: string) => {
    setData((prev) => ({ ...prev, subject: subject || null }))
    handleNext()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-16 md:mb-20">
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="h-full bg-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="w-full">
          {currentStep === 1 && (
            <Step1Welcome userName={userName} onContinue={handleNext} onSkip={handleSkip} />
          )}
          {currentStep === 2 && (
            <Step2Goal onSelectGoal={handleSelectGoal} onSkip={handleSkip} />
          )}
          {currentStep === 3 && (
            <Step3Subject onSelectSubject={handleSelectSubject} onSkip={handleSkip} />
          )}
          {currentStep === 4 && (
            <Step4Complete goal={data.goal} subject={data.subject} />
          )}
        </div>
      </div>
    </div>
  )
}
