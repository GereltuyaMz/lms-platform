// Badge size configurations
export const BADGE_SIZES = {
  small: 64,
  medium: 80,
  large: 100,
} as const;

// Color themes matching the SVG badge structure
// c1: darkest (base layer, frame outer)
// c2: medium (second layer, frame inner)
// c3: lightest (diagonal shine stripes)
// c4: frame shadow (tilted frame behind)
export const CATEGORY_THEMES = {
  // Course Completion: Warm honey gold
  course_completion: {
    c1: "#FFB100",
    c2: "#FFC800",
    c3: "#FFD900",
    c4: "#F89701",
    icon: "#8B5A00",
    shadow: "rgba(255, 177, 0, 0.35)",
  },
  // Quiz Performance: Royal purple
  quiz_performance: {
    c1: "#9B59B6",
    c2: "#B07CC6",
    c3: "#C99FD6",
    c4: "#7D3C98",
    icon: "#4A235A",
    shadow: "rgba(155, 89, 182, 0.35)",
  },
  // Streak: Blazing orange
  streak: {
    c1: "#FF6B35",
    c2: "#FF8A5B",
    c3: "#FFAB91",
    c4: "#E55A2B",
    icon: "#8B2500",
    shadow: "rgba(255, 107, 53, 0.35)",
  },
  // Engagement: Fresh green
  engagement: {
    c1: "#27AE60",
    c2: "#4CD787",
    c3: "#7DECA5",
    c4: "#1E8449",
    icon: "#0B5345",
    shadow: "rgba(39, 174, 96, 0.35)",
  },
  // Milestone: Sky blue
  milestone: {
    c1: "#2980B9",
    c2: "#5DADE2",
    c3: "#85C1E9",
    c4: "#1A5276",
    icon: "#0A2D4D",
    shadow: "rgba(41, 128, 185, 0.35)",
  },
  // Social: Warm pink
  social: {
    c1: "#E74C8B",
    c2: "#F06FAA",
    c3: "#F8A5C9",
    c4: "#C2185B",
    icon: "#6D0F3A",
    shadow: "rgba(231, 76, 139, 0.35)",
  },
} as const;

// Locked state - grayscale
export const LOCKED_THEME = {
  c1: "#9E9E9E",
  c2: "#BDBDBD",
  c3: "#E0E0E0",
  c4: "#757575",
  icon: "#424242",
  shadow: "rgba(0, 0, 0, 0.15)",
} as const;

export type BadgeCategoryType = keyof typeof CATEGORY_THEMES;
