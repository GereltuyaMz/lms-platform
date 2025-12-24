import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CoursesClientWrapper } from "@/components/courses";

// Revalidate page every 5 minutes (300 seconds) to cache course data
export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const CoursesPage = async ({ searchParams }: PageProps) => {
  const supabase = await createClient();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const pageSize = 10;
  // URL params use slugs
  const examSlug = params.exam as string | undefined;
  const subjectSlugs = params.subjects as string | undefined;

  // Fetch exam types (top-level categories)
  const { data: examTypes } = await supabase
    .from("categories")
    .select("*")
    .eq("category_type", "exam")
    .is("parent_id", null)
    .order("order_index");

  // Fetch subject categories (children of exam types)
  const { data: subjectCategories } = await supabase
    .from("categories")
    .select("*")
    .eq("category_type", "subject")
    .order("order_index");

  // Convert slugs to IDs for filtering
  const selectedExam = examTypes?.find((e) => e.slug === examSlug);
  const selectedSubjectSlugsArray = subjectSlugs?.split(",") || [];
  const selectedSubjects = subjectCategories?.filter((s) =>
    selectedSubjectSlugsArray.includes(s.slug)
  );

  // Build query for courses with filters
  let query = supabase
    .from("courses_with_stats")
    .select(
      `
      *,
      course_categories (
        category_id,
        categories (
          id,
          name,
          slug,
          parent_id
        )
      ),
      teacher:teachers!instructor_id (
        id,
        full_name,
        full_name_mn,
        avatar_url
      )
    `,
      { count: "exact" }
    )
    .eq("is_published", true);

  // Filter by subjects via course_categories
  if (selectedSubjects && selectedSubjects.length > 0) {
    const subjectIds = selectedSubjects.map((s) => s.id);
    // Get course IDs that belong to selected subjects
    const { data: courseCategories } = await supabase
      .from("course_categories")
      .select("course_id")
      .in("category_id", subjectIds);

    const courseIds = courseCategories?.map((cc) => cc.course_id) || [];
    if (courseIds.length > 0) {
      query = query.in("id", courseIds);
    } else {
      // No courses match, return empty
      query = query.eq("id", "00000000-0000-0000-0000-000000000000");
    }
  } else if (selectedExam) {
    // Filter by exam - get courses in subjects under this exam
    const relevantSubjectIds = subjectCategories
      ?.filter((s) => s.parent_id === selectedExam.id)
      .map((s) => s.id) || [];

    if (relevantSubjectIds.length > 0) {
      const { data: courseCategories } = await supabase
        .from("course_categories")
        .select("course_id")
        .in("category_id", relevantSubjectIds);

      const courseIds = courseCategories?.map((cc) => cc.course_id) || [];
      if (courseIds.length > 0) {
        query = query.in("id", courseIds);
      } else {
        query = query.eq("id", "00000000-0000-0000-0000-000000000000");
      }
    }
  }

  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;

  const { data: courses, count } = await query
    .order("created_at", { ascending: false })
    .range(startIndex, endIndex);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="container mx-auto px-4 py-20">
      <section>
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div>
              <Image
                src="/assets/courses/courses-frame.png"
                alt="Potential"
                width={548}
                height={460}
                className="w-full max-w-[640px]"
              />
            </div>
            <div>
              <h1 className="text-h1 mb-6">
                Боломжоо бүрэн <span className="text-primary">нээе</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Pass hierarchical data to client wrapper */}
      <CoursesClientWrapper
        examTypes={examTypes || []}
        subjectCategories={subjectCategories || []}
        initialCourses={courses || []}
        currentPage={page}
        totalPages={totalPages}
        totalCount={count || 0}
      />
    </div>
  );
};

export default CoursesPage;
