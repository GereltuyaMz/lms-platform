import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CourseHero,
  CourseContent,
  Instructor,
} from "@/components/courses/detail";
import { ResponsiveSidebar } from "@/components/courses/detail/ResponsiveSidebar";
import { checkEnrollment } from "@/lib/actions";
import { hasCourseAccess } from "@/lib/actions/purchase";
import { getCourseUnits } from "@/lib/actions/unit-actions";
import { fetchUnitsWithQuiz } from "@/lib/lesson-utils";
import { formatDuration } from "@/lib/utils/formatters";
import {
  fetchCourseWithRelations,
  fetchCourseStats,
  fetchApplicableCoupon,
  fetchUserProgress,
  buildContinueUrl,
} from "@/lib/actions/course-detail-helpers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

const CourseDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const supabase = await createClient();

  const { course, error: courseError } = await fetchCourseWithRelations(slug);

  if (courseError || !course) {
    notFound();
  }

  const units = await getCourseUnits(course.id);
  const hasUnits = units.length > 0;

  const courseStats = await fetchCourseStats(course.id);

  const [enrollmentStatus, hasPurchased] = await Promise.all([
    checkEnrollment(course.id),
    hasCourseAccess(course.id),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let applicableCoupon = null;
  if (user) {
    applicableCoupon = await fetchApplicableCoupon(user.id, course.id);
  }

  let completedLessonIds: string[] = [];
  let completedUnitQuizIds: string[] = [];
  let claimedUnitIds: string[] = [];
  let claimedUnitContentGroups: string[] = [];
  let unitQuizMap = new Map<string, boolean>();

  if (enrollmentStatus.isEnrolled && user) {
    const progress = await fetchUserProgress(user.id, course.id);
    completedLessonIds = progress.completedLessonIds;
    completedUnitQuizIds = progress.completedUnitQuizIds;
    claimedUnitIds = progress.claimedUnitIds;
    claimedUnitContentGroups = progress.claimedUnitContentGroups;
  }

  if (hasUnits) {
    unitQuizMap = await fetchUnitsWithQuiz(
      supabase,
      units.map((u) => u.id)
    );
  }

  const continueButtonUrl = await buildContinueUrl(
    course.id,
    slug,
    enrollmentStatus.isEnrolled
  );

  return (
    <div className="min-h-screen bg-white">
      <CourseHero course={course} teacher={course.teacher} />

      <div className="container mx-auto pt-2 pb-10 md:pb-16 lg:pb-20 max-w-[1510px] px-4 sm:px-6 md:px-8 lg:px-[120px]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-6 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
          <div className="w-full lg:max-w-7/10">
            <div className="pb-10 sm:pb-12 md:pb-14 lg:hidden">
              <ResponsiveSidebar
                courseId={course.id}
                courseSlug={course.slug}
                price={course.price}
                originalPrice={course.original_price}
                thumbnailUrl={course.thumbnail_url}
                continueButtonUrl={continueButtonUrl}
                isEnrolled={enrollmentStatus.isEnrolled}
                hasPurchased={hasPurchased}
                applicableCoupon={applicableCoupon}
                title={course.title}
                videoDuration={formatDuration(
                  courseStats.total_duration_seconds
                )}
                lessonCount={courseStats.lesson_count}
                exerciseCount={courseStats.exercise_count}
                totalXP={courseStats.total_xp}
              />
            </div>

            <CourseContent
              units={hasUnits ? units : undefined}
              lessonsBySection={undefined}
              courseSlug={course.slug}
              courseId={course.id}
              completedLessonIds={completedLessonIds}
              completedUnitQuizIds={completedUnitQuizIds}
              unitQuizMap={unitQuizMap}
              claimedUnitIds={claimedUnitIds}
              claimedUnitContentGroups={claimedUnitContentGroups}
              isAuthenticated={!!user}
              hasAccess={enrollmentStatus.isEnrolled || hasPurchased}
              price={course.price}
            />

            <div id="instructor" className="mt-12 sm:mt-14 md:mt-16 lg:mt-20">
              <Instructor teacher={course.teacher} />
            </div>
          </div>

          <div className="hidden lg:block">
            <ResponsiveSidebar
              courseId={course.id}
              courseSlug={course.slug}
              price={course.price}
              originalPrice={course.original_price}
              thumbnailUrl={course.thumbnail_url}
              continueButtonUrl={continueButtonUrl}
              isEnrolled={enrollmentStatus.isEnrolled}
              hasPurchased={hasPurchased}
              applicableCoupon={applicableCoupon}
              title={course.title}
              videoDuration={formatDuration(courseStats.total_duration_seconds)}
              lessonCount={courseStats.lesson_count}
              exerciseCount={courseStats.exercise_count}
              totalXP={courseStats.total_xp}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
