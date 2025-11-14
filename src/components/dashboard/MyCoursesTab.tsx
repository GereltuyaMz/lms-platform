import { CourseCard } from "./CourseCard"
import { EmptyCoursesState } from "./EmptyCoursesState"
import type { DashboardEnrollment, RecommendedCourse } from "@/types/database/queries"

type MyCoursesTabProps = {
  enrollments: DashboardEnrollment[]
  recommendedCourses?: RecommendedCourse[]
  isPersonalized?: boolean
}

export const MyCoursesTab = ({
  enrollments,
  recommendedCourses = [],
  isPersonalized = false,
}: MyCoursesTabProps) => {
  if (enrollments.length === 0) {
    return (
      <EmptyCoursesState
        recommendedCourses={recommendedCourses}
        isPersonalized={isPersonalized}
      />
    )
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">My Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrollments.map((enrollment) => {
          const course = enrollment.courses
          if (!course) return null

          return (
            <CourseCard
              key={enrollment.id}
              course={course}
              enrollment={{
                id: enrollment.id,
                enrolled_at: enrollment.enrolled_at,
                progress_percentage: enrollment.progress_percentage,
                lastLessonId: enrollment.lastLessonId,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
