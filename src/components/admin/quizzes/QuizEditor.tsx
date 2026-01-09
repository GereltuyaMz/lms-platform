"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QuizMetadataTab } from "./QuizMetadataTab";
import { QuizQuestionsTab } from "./QuizQuestionsTab";
import { QuizEditorFooter } from "./QuizEditorFooter";
import {
  createQuiz,
  updateQuiz,
  type QuizWithQuestions,
  type QuizFormData,
} from "@/lib/actions/admin/quizzes";

type QuizEditorProps = {
  quiz?: QuizWithQuestions | null;
};

export const QuizEditor = ({ quiz }: QuizEditorProps) => {
  const router = useRouter();
  const isEditing = !!quiz;

  const [formData, setFormData] = useState<QuizFormData>({
    title: quiz?.title || "",
    description: quiz?.description || null,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const [initial] = useState({ formData: { ...formData } });

  useEffect(() => {
    const changed =
      JSON.stringify(formData) !== JSON.stringify(initial.formData);
    setHasChanges(changed);
  }, [formData, initial]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Гарчиг оруулна уу");
      setActiveTab("info");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && quiz) {
        const result = await updateQuiz(quiz.id, formData);
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        setHasChanges(false);
        router.refresh();
      } else {
        const result = await createQuiz(formData);
        if (!result.success || !result.data) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        // Redirect to the new quiz's edit page
        router.push(`/admin/quizzes/${result.data.id}`);
      }
    } catch (error) {
      toast.error("Алдаа гарлаа");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabTriggerClass = cn(
    "h-12 px-4 rounded-none border-b-2 border-transparent",
    "data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
    "text-gray-600 data-[state=active]:text-primary"
  );

  return (
    <div className="relative pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {formData.title || "Шинэ тест"}
        </h1>
        {isEditing && (
          <p className="text-gray-500 mt-1">{quiz.question_count} асуулт</p>
        )}
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-200 px-4">
              <TabsList className="h-12 w-full justify-start bg-transparent gap-1 p-0">
                <TabsTrigger value="info" className={tabTriggerClass}>
                  <Info className="h-4 w-4 mr-2" />
                  Мэдээлэл
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className={tabTriggerClass}
                  disabled={!isEditing}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Асуултууд
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="info" className="p-6 m-0">
              <QuizMetadataTab
                formData={formData}
                onChange={(data) =>
                  setFormData((prev) => ({ ...prev, ...data }))
                }
              />
            </TabsContent>

            <TabsContent value="questions" className="p-6 m-0">
              {quiz && (
                <QuizQuestionsTab
                  quizId={quiz.id}
                  initialQuestions={quiz.questions}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <QuizEditorFooter
        hasChanges={hasChanges}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={() => router.push("/admin/quizzes")}
      />
    </div>
  );
};
