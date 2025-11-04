export const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 transition-colors"
    case "Intermediate":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900 transition-colors"
    case "Advanced":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900 transition-colors"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 transition-colors"
  }
}

export const getLessonIconType = (lessonType: string) => {
  switch (lessonType) {
    case "video":
      return "video"
    case "text":
      return "text"
    case "quiz":
      return "quiz"
    case "assignment":
      return "assignment"
    default:
      return "video"
  }
}
