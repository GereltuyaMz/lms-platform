"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { completeOnboarding } from "@/lib/actions/onboarding"

type Step4CompleteProps = {
  goal: string | null
  subject: string | null
}

export const Step4Complete = ({ goal, subject }: Step4CompleteProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateProfile = async () => {
    setIsLoading(true)
    try {
      const result = await completeOnboarding({ goal, subject })
      if (result.success) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-16 md:space-y-20">
      {/* Mascots */}
      <div className="flex justify-center">
        <Image
          src="/assets/characters.png"
          alt="Character mascots"
          width={400}
          height={200}
          className="drop-shadow-lg"
        />
      </div>

      {/* Success message */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Your personalized learning path
          <br />
          is ready! Create your profile to
          <br />
          start your journey.
        </h1>
      </div>

      {/* Create Profile Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleCreateProfile}
          disabled={isLoading}
          size="lg"
          className="bg-teal-500 hover:bg-teal-600 text-white px-12 py-6 text-lg rounded-full"
        >
          {isLoading ? "Creating..." : "Create profile"}
        </Button>
      </div>
    </div>
  )
}
