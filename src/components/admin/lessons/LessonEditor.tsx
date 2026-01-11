"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info, BookOpen, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LessonInfoTab } from "./LessonInfoTab";
import { LessonContentTab } from "./LessonContentTab";
import { LessonEditorFooter } from "./LessonEditorFooter";
import {
  createLesson,
  updateLesson,
  type LessonFormData,
  type LessonWithRelations,
} from "@/lib/actions/admin/lessons";
import { upsertLessonContent } from "@/lib/actions/admin/lesson-content";
import type { LessonContent } from "@/types/database/tables";
import type { QuizForSelect } from "@/lib/actions/admin/quizzes";

type UnitOption = {
  id: string;
  title: string;
  title_mn: string | null;
  course_id: string;
  course_title: string;
};

type ContentState = { videoUrl: string | null; lessonVideoId: string | null; content: string };

type LessonEditorProps = {
  lesson?: LessonWithRelations | null;
  units: UnitOption[];
  quizzes: QuizForSelect[];
  initialContent?: LessonContent[];
  defaultUnitId?: string;
};

export const LessonEditor = ({
  lesson,
  units,
  quizzes,
  initialContent = [],
  defaultUnitId,
}: LessonEditorProps) => {
  const router = useRouter();
  const isEditing = !!lesson;

  const theoryContent = initialContent.find((c) => c.content_type === "theory");
  const exampleContent = initialContent.find((c) => c.content_type === "example");

  // Find default unit if provided
  const defaultUnit = defaultUnitId ? units.find((u) => u.id === defaultUnitId) : null;

  const [formData, setFormData] = useState<LessonFormData>({
    course_id: lesson?.course_id || defaultUnit?.course_id || "",
    unit_id: lesson?.unit_id || defaultUnitId || null,
    title: lesson?.title || "",
    description: lesson?.description || "",
    order_in_unit: lesson?.order_in_unit || 0,
    quiz_id: lesson?.quiz_id || null,
  });

  const [theory, setTheory] = useState<ContentState>({
    videoUrl: theoryContent?.video_url || null,
    lessonVideoId: theoryContent?.lesson_video_id || null,
    content: theoryContent?.content || "",
  });

  const [example, setExample] = useState<ContentState>({
    videoUrl: exampleContent?.video_url || null,
    lessonVideoId: exampleContent?.lesson_video_id || null,
    content: exampleContent?.content || "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const [initial] = useState({
    formData: { ...formData },
    theory: { ...theory },
    example: { ...example },
  });

  useEffect(() => {
    const changed =
      JSON.stringify(formData) !== JSON.stringify(initial.formData) ||
      JSON.stringify(theory) !== JSON.stringify(initial.theory) ||
      JSON.stringify(example) !== JSON.stringify(initial.example);
    setHasChanges(changed);
  }, [formData, theory, example, initial]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const handleSave = async () => {
    if (!formData.title.trim()) { toast.error("Гарчиг оруулна уу"); setActiveTab("info"); return; }
    if (!formData.course_id) { toast.error("Бүлэг сонгоно уу"); setActiveTab("info"); return; }

    setIsSubmitting(true);
    try {
      let lessonId = lesson?.id;

      if (isEditing && lessonId) {
        // Update existing lesson
        const lessonResult = await updateLesson(lessonId, formData);
        if (!lessonResult.success) { toast.error(lessonResult.message); return; }
      } else {
        // Create new lesson
        const lessonResult = await createLesson(formData);
        if (!lessonResult.success || !lessonResult.data) {
          toast.error(lessonResult.message);
          return;
        }
        lessonId = lessonResult.data.id;
      }

      // Save content only if there's content and we have a lesson ID
      if (lessonId) {
        if (theory.videoUrl || theory.lessonVideoId || theory.content) {
          await upsertLessonContent(lessonId, "theory", {
            title: "Онол",
            video_url: theory.videoUrl,
            lesson_video_id: theory.lessonVideoId,
            content: theory.content || null,
            duration_seconds: null,
          });
        }

        if (example.videoUrl || example.lessonVideoId || example.content) {
          await upsertLessonContent(lessonId, "example", {
            title: "Жишээ",
            video_url: example.videoUrl,
            lesson_video_id: example.lessonVideoId,
            content: example.content || null,
            duration_seconds: null,
          });
        }
      }

      toast.success(isEditing ? "Хичээл амжилттай шинэчлэгдлээ" : "Хичээл амжилттай үүсгэгдлээ");
      setHasChanges(false);

      if (isEditing) {
        router.refresh();
      } else {
        // Redirect to the lessons table view
        router.push("/admin/lessons");
      }
    } catch (error) {
      toast.error("Алдаа гарлаа");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentUnit = units.find((u) => u.id === formData.unit_id);

  const tabTriggerClass = cn(
    "h-12 px-4 rounded-none border-b-2 border-transparent",
    "data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
    "text-gray-600 data-[state=active]:text-blue-600"
  );

  return (
    <div className="relative pb-24">
      <div className="mb-6">
        {currentUnit && (
          <Badge variant="secondary" className="text-xs font-normal mb-2">
            {currentUnit.course_title} / {currentUnit.title_mn || currentUnit.title}
          </Badge>
        )}
        <h1 className="text-2xl font-semibold text-gray-900">
          {formData.title || "Шинэ хичээл"}
        </h1>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-200 px-4">
              <TabsList className="h-12 w-full justify-start bg-transparent gap-1 p-0">
                <TabsTrigger value="info" className={tabTriggerClass}>
                  <Info className="h-4 w-4 mr-2" />Мэдээлэл
                </TabsTrigger>
                <TabsTrigger value="theory" className={tabTriggerClass}>
                  <BookOpen className="h-4 w-4 mr-2" />Онол
                </TabsTrigger>
                <TabsTrigger value="examples" className={tabTriggerClass}>
                  <FileText className="h-4 w-4 mr-2" />Жишээ
                </TabsTrigger>
                <TabsTrigger value="test" className={tabTriggerClass}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />Тест
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="info" className="p-6 m-0">
              <LessonInfoTab
                formData={formData}
                onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                units={units}
                quizzes={quizzes}
              />
            </TabsContent>

            <TabsContent value="theory" className="p-6 m-0">
              <LessonContentTab type="theory" value={theory} onChange={setTheory} />
            </TabsContent>

            <TabsContent value="examples" className="p-6 m-0">
              <LessonContentTab type="example" value={example} onChange={setExample} />
            </TabsContent>

            <TabsContent value="test" className="p-6 m-0">
              {formData.quiz_id ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Тест холбогдсон
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {quizzes.find((q) => q.id === formData.quiz_id)?.title || "Тест"} -{" "}
                    {quizzes.find((q) => q.id === formData.quiz_id)?.question_count || 0} асуулт
                  </p>
                  <a
                    href={`/admin/quizzes/${formData.quiz_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Тестийг засах →
                  </a>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Тест холбогдоогүй байна
                  </h3>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <LessonEditorFooter
        hasChanges={hasChanges}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={() => router.push("/admin/lessons")}
      />
    </div>
  );
};
