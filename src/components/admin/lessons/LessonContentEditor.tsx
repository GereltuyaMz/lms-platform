"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentTabPanel } from "./ContentTabPanel";
import type { LessonContent } from "@/types/database/tables";

type LessonContentEditorProps = {
  lessonId: string;
  initialContent: LessonContent[];
};

export const LessonContentEditor = ({
  lessonId,
  initialContent,
}: LessonContentEditorProps) => {
  // Find theory and example content from initial data
  const theoryContent = initialContent.find((c) => c.content_type === "theory");
  const exampleContent = initialContent.find((c) => c.content_type === "example");

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Хичээлийн агуулга</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theory">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="theory">📚 Онол</TabsTrigger>
            <TabsTrigger value="examples">📝 Жишээ</TabsTrigger>
            <TabsTrigger value="test">✅ Тест</TabsTrigger>
          </TabsList>

          <TabsContent value="theory" className="space-y-6 mt-6">
            <ContentTabPanel
              lessonId={lessonId}
              contentType="theory"
              initialContent={theoryContent || null}
            />
          </TabsContent>

          <TabsContent value="examples" className="space-y-6 mt-6">
            <ContentTabPanel
              lessonId={lessonId}
              contentType="example"
              initialContent={exampleContent || null}
            />
          </TabsContent>

          <TabsContent value="test" className="mt-6">
            <div className="text-center py-12">
              <div className="text-5xl mb-4 opacity-40">✅</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Тестийн холболт удахгүй нэмэгдэнэ
              </h3>
              <p className="text-gray-500">
                Хичээлд тестийн асуулт холбох боломж удахгүй бэлэн болно.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
