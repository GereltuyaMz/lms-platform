import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkEnrollment } from "@/lib/actions";
import { CheckoutForm } from "@/components/courses/checkout/CheckoutForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signin?redirectTo=/courses/${slug}/checkout`);
  }

  // Fetch course data first to get course ID
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      slug,
      description,
      price,
      original_price,
      thumbnail_url,
      level,
      teacher:instructor_id (
        id,
        full_name,
        full_name_mn,
        avatar_url
      )
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Run all access checks in parallel
  const [enrollmentResult, purchaseCheck] = await Promise.all([
    checkEnrollment(course.id),
    supabase
      .from("course_purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "completed")
      .maybeSingle(),
  ]);

  // Redirect if course is free
  if (course.price === 0) {
    redirect(`/courses/${slug}`);
  }

  // Redirect if already enrolled or purchased
  if (enrollmentResult.isEnrolled || purchaseCheck.data) {
    redirect(`/courses/${slug}`);
  }

  // Get course stats
  const { data: stats } = await supabase.rpc("calculate_course_stats", {
    course_uuid: course.id,
  });

  const courseStats = stats?.[0] || {
    lesson_count: 0,
    total_duration_seconds: 0,
    exercise_count: 0,
    total_xp: 0,
  };

  // Get first lesson for redirect after purchase
  const { data: firstLesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", course.id)
    .order("order_index")
    .limit(1)
    .single();

  const teacher = Array.isArray(course.teacher)
    ? course.teacher[0]
    : course.teacher;

  const courseData = {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    price: course.price,
    originalPrice: course.original_price,
    thumbnailUrl: course.thumbnail_url,
    level: course.level,
    lessonCount: courseStats.lesson_count,
    totalDurationSeconds: courseStats.total_duration_seconds,
    exerciseCount: courseStats.exercise_count,
    totalXp: courseStats.total_xp,
    teacher: teacher
      ? {
          name: teacher.full_name_mn || teacher.full_name || "Unknown",
          avatarUrl: teacher.avatar_url,
        }
      : null,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 max-w-[1200px]">
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Буцах
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-[1200px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Элсэлтээ баталгаажуулах
          </h1>
        </div>

        <CheckoutForm
          key={course.id}
          course={courseData}
          firstLessonId={firstLesson?.id || null}
        />
      </main>
    </div>
  );
}
