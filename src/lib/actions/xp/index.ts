/**
 * XP actions barrel export
 * Provides unified access to XP awarding and querying functionality
 */

// Types
export type { XPResult, XPTransaction, XPCalculation } from "./types";

// Award XP
export {
  awardVideoCompletionXP,
  awardQuizCompletionXP,
  awardUnitQuizCompletionXP,
} from "./award-xp";

// Get XP data
export { getUserTotalXP, getXPTransactions, getCourseXPEarned } from "./get-xp";

// Milestones
export { awardMilestoneXP } from "./milestones";
