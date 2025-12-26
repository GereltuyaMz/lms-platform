import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { fetchQuizData, getAvailableSteps } from "@/lib/lesson-utils";
import { checkEnrollment } from "@/lib/actions";
import { getLessonWithContent } from "@/lib/actions/unit-actions";

export const revalidate = 0;

type PageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function LessonPage({ params }: PageProps) {
  const { slug, id } = await params;
  const lessonId = id;
  const supabase = await createClient();

  // Fetch course
  const { data: course } = await supabase
    .from("courses")
    .select("id, slug")
    .eq("slug", slug)
    .single();

  if (!course) {
    notFound();
  }

  // Check enrollment
  const enrollmentStatus = await checkEnrollment(course.id);
  if (!enrollmentStatus.isEnrolled) {
    redirect(`/courses/${slug}`);
  }

  // Fetch lesson content and quiz
  const lessonWithContent = await getLessonWithContent(lessonId);
  const quizData = await fetchQuizData(supabase, lessonId);

  // Determine available steps and redirect to first one
  const availableSteps = getAvailableSteps(
    lessonWithContent?.lesson_content,
    quizData
  );

  if (availableSteps.length === 0) {
    notFound();
  }

  // Redirect to first available step
  const firstStep = availableSteps[0];
  redirect(`/courses/${slug}/learn/lesson/${id}/${firstStep}`);
}
