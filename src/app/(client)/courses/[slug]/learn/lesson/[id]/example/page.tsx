import { ExampleContent, LessonStickyNav } from "@/components/player";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  fetchQuizData,
  getAvailableSteps,
  getAllLessonsFromUnits,
} from "@/lib/lesson-utils";
import {
  getCourseUnits,
  getLessonWithContent,
} from "@/lib/actions/unit-actions";

export const revalidate = 0;

type PageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function ExamplePage({ params }: PageProps) {
  const { slug, id } = await params;
  const lessonId = id;
  const supabase = await createClient();

  // Fetch course by slug (needed for courseId)
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, slug")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Fetch lesson content
  const lessonWithContent = await getLessonWithContent(lessonId);

  // Fetch quiz data to determine available steps
  const quizData = await fetchQuizData(supabase, lessonId);
  const availableSteps = getAvailableSteps(
    lessonWithContent?.lesson_content,
    quizData
  );

  // Redirect if no example content
  const hasExample = lessonWithContent?.lesson_content?.some(
    (c) => c.content_type === "example"
  );
  if (!hasExample) {
    if (availableSteps.includes("theory")) {
      redirect(`/courses/${slug}/learn/lesson/${id}/theory`);
    } else if (availableSteps.includes("test")) {
      redirect(`/courses/${slug}/learn/lesson/${id}/test`);
    } else {
      notFound();
    }
  }

  // Get all lessons for sticky nav
  const units = await getCourseUnits(course.id);
  const hasUnits = units.length > 0;
  const allLessons = hasUnits ? getAllLessonsFromUnits(units) : [];

  return (
    <>
      <ExampleContent
        lessonContent={lessonWithContent?.lesson_content}
        courseId={course.id}
        lessonId={lessonId}
      />

      {/* Sticky Navigation */}
      <LessonStickyNav
        mode="navigation"
        navigationProps={{
          courseSlug: slug,
          lessonId,
          currentStep: "example",
          availableSteps,
          allLessons,
        }}
      />
    </>
  );
}
