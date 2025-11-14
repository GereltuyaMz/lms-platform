import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Star } from "lucide-react"
import { CourseCard } from "./CourseCard"
import type { RecommendedCourse } from "@/types/database/queries"

type EmptyCoursesStateProps = {
  recommendedCourses: RecommendedCourse[]
  isPersonalized: boolean
}

export const EmptyCoursesState = ({
  recommendedCourses,
  isPersonalized,
}: EmptyCoursesStateProps) => {
  if (recommendedCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          You haven&apos;t enrolled in any courses yet
        </p>
        <Link href="/courses">
          <Button className="cursor-pointer">Browse Courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        {isPersonalized ? (
          <>
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">
              Recommended For You
            </h2>
          </>
        ) : (
          <>
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl md:text-3xl font-bold">Popular Courses</h2>
          </>
        )}
      </div>

      {isPersonalized && (
        <p className="text-muted-foreground mb-6">
          Based on your learning goals, we think you&apos;ll love these courses
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/courses">
          <Button variant="outline" size="lg" className="cursor-pointer">
            Browse All Courses
          </Button>
        </Link>
      </div>
    </div>
  )
}
