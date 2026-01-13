/**
 * @deprecated This file is maintained for backward compatibility.
 * Import from "./xp" instead for new code.
 * NOTE: No "use server" here - the individual modules have it, and this file exports types
 */

// Re-export types
export type { XPResult, XPTransaction, XPCalculation } from "./xp";

// Re-export functions
export {
  awardVideoCompletionXP,
  awardQuizCompletionXP,
  awardUnitQuizCompletionXP,
  getUserTotalXP,
  getXPTransactions,
  getCourseXPEarned,
  awardMilestoneXP,
} from "./xp";
