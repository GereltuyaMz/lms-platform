import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CoursesClientWrapper } from "@/components/courses/CoursesClientWrapper";

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
  const topicsParam = params.topics as string | undefined;
  const levelParam = params.level as string | undefined;

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Build query for courses with filters using the optimized view
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
          slug
        )
      )
    `,
      { count: "exact" }
    )
    .eq("is_published", true);

  // Apply category filter if provided
  if (topicsParam) {
    const topics = topicsParam.split(",");
    const categoryIds = categories
      ?.filter((cat) => topics.includes(cat.name))
      .map((cat) => cat.id);

    if (categoryIds && categoryIds.length > 0) {
      // Get course IDs that have at least one of the selected categories
      const { data: courseCategoryData } = await supabase
        .from("course_categories")
        .select("course_id")
        .in("category_id", categoryIds);

      const courseIds = courseCategoryData?.map((cc) => cc.course_id) || [];

      if (courseIds.length > 0) {
        query = query.in("id", courseIds);
      } else {
        // No courses match the filter, return empty result
        query = query.eq("id", "00000000-0000-0000-0000-000000000000");
      }
    }
  }

  if (levelParam && levelParam !== "All") {
    query = query.eq("level", levelParam);
  }

  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;

  const {
    data: courses,
    error: coursesError,
    count,
  } = await query
    .order("created_at", { ascending: false })
    .range(startIndex, endIndex);

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
  }

  // No need to fetch lesson counts separately - they're already in the view!
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
              <h1 className="text-h1 mb-6">Explore your potential</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Pass categories and courses to client wrapper */}
      <CoursesClientWrapper
        categories={categories || []}
        initialCourses={courses || []}
        currentPage={page}
        totalPages={totalPages}
        totalCount={count || 0}
      />
    </div>
  );
};

export default CoursesPage;
