// Mock course data - temporary until we connect to Supabase
export const mockCourses = [
  {
    id: 1,
    title: "Basic geometry and measurement",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim...",
    instructor: {
      name: "David Easdown",
      avatar: undefined,
    },
    duration: "1 hour",
    lessons: 30,
    level: "Advanced" as const,
    price: 10.99,
    originalPrice: 19.99,
    thumbnail: undefined,
  },
  {
    id: 2,
    title: "Introduction to Algebra",
    description: "Explore the foundations of algebra with clear explanations and practical examples.",
    instructor: {
      name: "Sarah Johnson",
      avatar: undefined,
    },
    duration: "2 hours",
    lessons: 25,
    level: "Intermediate" as const,
    price: 14.99,
    originalPrice: 29.99,
    thumbnail: undefined,
  },
  {
    id: 3,
    title: "Statistics Essentials",
    description: "Learn about data analysis, probability, and statistical concepts in a simple way.",
    instructor: {
      name: "Michael Smith",
      avatar: undefined,
    },
    duration: "1.5 hours",
    lessons: 20,
    level: "Beginner" as const,
    price: 12.49,
    originalPrice: 24.99,
    thumbnail: undefined,
  },
  {
    id: 4,
    title: "Calculus Fundamentals",
    description: "Dive into limits, derivatives, and integrals with comprehensive lectures and exercises.",
    instructor: {
      name: "Emily Chen",
      avatar: undefined,
    },
    duration: "3 hours",
    lessons: 30,
    level: "Advanced" as const,
    price: 19.99,
    originalPrice: 39.99,
    thumbnail: undefined,
  },
  {
    id: 5,
    title: "Data Science with Python",
    description: "A hands-on course that introduces data analysis and visualization techniques using Python.",
    instructor: {
      name: "James Lee",
      avatar: undefined,
    },
    duration: "4 hours",
    lessons: 15,
    level: "Intermediate" as const,
    price: 22.99,
    originalPrice: 45.99,
    thumbnail: undefined,
  },
  {
    id: 6,
    title: "Web Development Basics",
    description: "Learn how to build responsive websites using HTML, CSS, and JavaScript from scratch.",
    instructor: {
      name: "Laura Martinez",
      avatar: undefined,
    },
    duration: "5 hours",
    lessons: 10,
    level: "Beginner" as const,
    price: 15.99,
    originalPrice: 29.99,
    thumbnail: undefined,
  },
];

// ============================================
// Dashboard Mock Data (Phase 0 - UI Only)
// ============================================

export type MockUserStats = {
  username: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streak: number;
  league: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
};

export type MockEnrolledCourse = {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  progress: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  lastAccessed: Date;
  estimatedTimeRemaining: string; // e.g., "2h 30min"
};

export type MockAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  level: number;
  progress: number; // 0-100
  currentValue: number;
  targetValue: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  color: "red" | "green" | "blue" | "purple" | "amber" | "pink";
};

// Mock user stats
export const mockUserStats: MockUserStats = {
  username: "gegiimz96",
  avatarUrl: "", // Empty to show default hexagon avatar
  level: 3,
  xp: 1250,
  streak: 0,
  league: "Silver",
};

// Mock enrolled courses
export const mockEnrolledCourses: MockEnrolledCourse[] = [
  {
    id: "1",
    title: "Basic geometry",
    slug: "basic-geometry",
    thumbnailUrl: "/assets/courses/geometry.png",
    progress: 40,
    totalLessons: 10,
    completedLessons: 4,
    lastAccessed: new Date("2025-11-05T14:30:00"),
    estimatedTimeRemaining: "1h 30min",
  },
  {
    id: "2",
    title: "Algebra 1",
    slug: "algebra-1",
    thumbnailUrl: "/assets/courses/algebra.png",
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    lastAccessed: new Date("2025-11-03T10:00:00"),
    estimatedTimeRemaining: "3h 20min",
  },
  {
    id: "3",
    title: "Introduction to Calculus",
    slug: "intro-calculus",
    thumbnailUrl: "/assets/courses/calculus.png",
    progress: 75,
    totalLessons: 8,
    completedLessons: 6,
    lastAccessed: new Date("2025-11-04T16:45:00"),
    estimatedTimeRemaining: "45min",
  },
];

// Mock achievements
export const mockAchievements: MockAchievement[] = [
  {
    id: "1",
    title: "Wildfire",
    description: "Earn 2000 XP",
    icon: "🔥",
    level: 2,
    progress: 62.5,
    currentValue: 1250,
    targetValue: 2000,
    isUnlocked: false,
    color: "red",
  },
  {
    id: "2",
    title: "Week Streak",
    description: "Reach a 7 day streak",
    icon: "🌱",
    level: 1,
    progress: 0,
    currentValue: 0,
    targetValue: 7,
    isUnlocked: false,
    color: "green",
  },
  {
    id: "3",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "👣",
    level: 1,
    progress: 100,
    currentValue: 1,
    targetValue: 1,
    isUnlocked: true,
    unlockedAt: new Date("2025-11-01T12:00:00"),
    color: "blue",
  },
  {
    id: "4",
    title: "Scholar",
    description: "Complete 5 courses",
    icon: "🎓",
    level: 3,
    progress: 0,
    currentValue: 0,
    targetValue: 5,
    isUnlocked: false,
    color: "purple",
  },
  {
    id: "5",
    title: "Quiz Master",
    description: "Score 100% on 10 quizzes",
    icon: "⭐",
    level: 2,
    progress: 30,
    currentValue: 3,
    targetValue: 10,
    isUnlocked: false,
    color: "amber",
  },
  {
    id: "6",
    title: "Early Bird",
    description: "Complete a lesson before 8 AM",
    icon: "🌅",
    level: 1,
    progress: 100,
    currentValue: 1,
    targetValue: 1,
    isUnlocked: true,
    unlockedAt: new Date("2025-11-02T07:30:00"),
    color: "pink",
  },
];

// Helper function to calculate level from XP
export const calculateLevel = (xp: number): number => {
  // Simple formula: level = floor(xp / 500) + 1
  return Math.floor(xp / 500) + 1;
};

// Helper function to get XP for next level
export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  return currentLevel * 500;
};

// Helper function to get XP progress percentage for current level
export const getLevelProgress = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  const xpForCurrentLevel = (currentLevel - 1) * 500;
  const xpForNextLevel = currentLevel * 500;
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  return Math.round((xpInCurrentLevel / xpNeededForLevel) * 100);
};

// Helper function to format last accessed date
export const formatLastAccessed = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};
