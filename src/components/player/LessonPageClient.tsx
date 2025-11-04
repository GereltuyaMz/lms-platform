"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuizModal } from "./QuizModal";

type LessonPageClientProps = {
  children: React.ReactNode;
};

export const LessonPageClient = ({ children }: LessonPageClientProps) => {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <>
      {children}

      {/* Demo Quiz Button (Floating) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => setShowQuiz(true)}
          className="shadow-lg"
        >
          📝 Try Demo Quiz
        </Button>
      </div>

      <QuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </>
  );
};
