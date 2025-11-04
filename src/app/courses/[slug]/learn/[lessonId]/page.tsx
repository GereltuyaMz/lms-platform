import { VideoPlayer } from "@/components/player/VideoPlayer";
import { LessonSidebar } from "@/components/player/LessonSidebar";
import { LessonContent } from "@/components/player/LessonContent";
import { NavigationButtons } from "@/components/player/NavigationButtons";
import { LessonPageClient } from "@/components/player/LessonPageClient";

// Placeholder data - will be fetched from database later
const mockCourseData = {
  course: {
    id: "1",
    slug: "basic-geometry-and-measurement",
    title: "Basic Geometry & Measurement",
    thumbnail_url: "/assets/courses/tangent.png",
  },
  currentLesson: {
    id: "lesson-1",
    title: "Welcome to Geometry",
    description: "Learn about basic geometry tools and concepts in this introductory lesson.",
    video_url: "https://www.youtube.com/watch?v=8G8gX3JSxQM",
    duration_minutes: 5,
    section_title: "Getting Started",
    order_index: 1,
    xp_reward: 50,
    is_completed: false,
  },
  lessons: [
    {
      section: "Getting Started",
      items: [
        { id: "1", title: "Welcome to Geometry", duration: "5:12", type: "video" as const, completed: true },
        { id: "2", title: "Basic Tools Overview", duration: "8:44", type: "video" as const, completed: false, current: true },
        { id: "3", title: "Practice Quiz", duration: "5 questions", type: "quiz" as const, completed: false },
      ],
    },
    {
      section: "Basic Concepts",
      items: [
        { id: "4", title: "Points and Lines", duration: "10:32", type: "video" as const, completed: false },
        { id: "5", title: "Angles Introduction", duration: "12:15", type: "video" as const, completed: false, locked: true },
        { id: "6", title: "Exercise: Identify Angles", duration: "10 questions", type: "quiz" as const, completed: false, locked: true },
      ],
    },
  ],
  progress: {
    completed: 3,
    total: 12,
    percentage: 25,
    streak: 3,
    totalXp: 450,
  },
};

export default function LessonPage() {
  return (
    <LessonPageClient>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[1600px]">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold">LMS</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">
              {mockCourseData.course.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
              <span className="text-amber-600 font-semibold text-sm">
                ⭐ {mockCourseData.progress.totalXp} XP
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <LessonSidebar
          courseTitle={mockCourseData.course.title}
          lessons={mockCourseData.lessons}
          progress={mockCourseData.progress}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={mockCourseData.currentLesson.video_url}
            title={mockCourseData.currentLesson.title}
          />

          {/* Lesson Info */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {mockCourseData.currentLesson.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>Duration: {mockCourseData.currentLesson.duration_minutes} min</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">
                +{mockCourseData.currentLesson.xp_reward} XP
              </span>
            </div>

            {/* Navigation Buttons */}
            <NavigationButtons
              hasPrevious={mockCourseData.currentLesson.order_index > 1}
              hasNext={true}
              isCompleted={mockCourseData.currentLesson.is_completed}
            />
          </div>

          {/* Lesson Content Tabs */}
          <LessonContent
            overview={mockCourseData.currentLesson.description}
            resources={[
              { name: "Lesson Notes.pdf", size: "2.3 MB", url: "#" },
              { name: "Practice Worksheet.pdf", size: "1.8 MB", url: "#" },
            ]}
          />
        </main>
      </div>
      </div>
    </LessonPageClient>
  );
}
