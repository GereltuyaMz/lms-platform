# 🏅 Badge & Achievement System

**Version:** 1.0
**Last Updated:** November 12, 2025

---

## 📖 Overview

The badge system rewards learning milestones with **permanent collectible achievements**. Badges complement the XP economy by celebrating accomplishments and providing long-term goals.

**Key Principles:**
- Badges are **permanent** (cannot be lost)
- Each badge awards **bonus XP** on unlock (one-time)
- Badges have **4 rarity tiers** (Bronze → Silver → Gold → Platinum)
- Users can **display 3 badges** on their public profile
- Certain badges **unlock exclusive shop items**

---

## 🎨 Rarity Tiers

| Rarity | XP Range | Visual | Purpose |
|--------|----------|--------|---------|
| **Bronze** | 100-500 XP | #CD7F32, subtle glow | Quick wins, first achievements |
| **Silver** | 500-2,500 XP | #C0C0C0, medium glow | Medium commitment goals |
| **Gold** | 2,500-10,000 XP | #FFD700, bright glow | Long-term achievements |
| **Platinum** | 10,000+ XP | #E5E4E2, rainbow glow | Elite status, rare accomplishments |

---

## 🎯 Badge Categories

### **1. Course Completion Badges** 🎓

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **First Steps** | Complete 1st course | 1,000 XP | Bronze |
| **Knowledge Seeker** | Complete 5 courses | 2,500 XP | Silver |
| **Course Master** | Complete 10 courses | 5,000 XP | Gold |
| **Learning Legend** | Complete 25 courses | 15,000 XP | Platinum |

#### Category-Specific

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **JavaScript Specialist** | Complete all JS courses | 3,000 XP | Gold |
| **Design Pro** | Complete all design courses | 3,000 XP | Gold |
| **Python Expert** | Complete all Python courses | 3,000 XP | Gold |
| **Full Stack Hero** | Complete courses from 3+ categories | 5,000 XP | Platinum |

---

### **2. Quiz Performance Badges** 📝

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **Perfect Score** | Get 100% on first quiz | 200 XP | Bronze |
| **Quiz Ace** | Get 100% on 10 quizzes | 1,500 XP | Silver |
| **Quiz Master** | Get 100% on 25 quizzes | 4,000 XP | Gold |
| **Genius** | Get 95%+ on 50 quizzes | 10,000 XP | Platinum |

#### Special Quiz Badges

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **No Mistakes** | 3 consecutive 100% quizzes | 500 XP | Silver |
| **Comeback Kid** | Improve retry score by 40%+ | 300 XP | Bronze |
| **Quiz Streak** | Get 90%+ on 10 consecutive quizzes | 1,000 XP | Gold |

---

### **3. Streak Badges** 🔥

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **Starting Streak** | 3-day learning streak | 100 XP | Bronze |
| **Week Warrior** | 7-day learning streak | 250 XP | Silver |
| **Month Master** | 30-day learning streak | 1,000 XP | Gold |
| **Unstoppable** | 100-day learning streak | 5,000 XP | Platinum |

#### Special Streak Badges

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **Weekend Learner** | Complete lessons on 4 consecutive weekends | 400 XP | Silver |
| **Early Bird** | Complete lessons before 9 AM on 7 days | 350 XP | Bronze |
| **Night Owl** | Complete 10 lessons after 10 PM | 300 XP | Bronze |

---

### **4. Engagement Badges** ⚡

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **Marathon Learner** | Complete 5 lessons in one day | 200 XP | Bronze |
| **Speedrunner** | Complete a course in <24 hours | 500 XP | Gold |
| **Deep Diver** | Spend 50+ hours learning | 2,000 XP | Gold |
| **Century** | Complete 100 total lessons | 3,000 XP | Gold |
| **Dedicated Student** | Learn for 200+ hours | 8,000 XP | Platinum |

---

### **5. Milestone Badges** 🎉

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **XP Collector** | Earn 5,000 total XP | 250 XP | Bronze |
| **XP Enthusiast** | Earn 10,000 total XP | 500 XP | Silver |
| **XP Master** | Earn 25,000 total XP | 1,000 XP | Gold |
| **XP Legend** | Earn 100,000 total XP | 5,000 XP | Platinum |

#### Collection Badges

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **Shop Regular** | Make first shop purchase | 500 XP | Bronze |
| **Badge Hunter** | Unlock 10 badges | 1,500 XP | Silver |
| **Badge Master** | Unlock 25 badges | 3,000 XP | Gold |
| **Completionist** | Unlock 50 badges | 10,000 XP | Platinum |

---

### **6. Social & Community Badges** 👥

(Future implementation)

| Badge Name | Requirement | XP Bonus | Rarity |
|------------|-------------|----------|--------|
| **Helpful Hand** | Get 10 upvotes on forum answers | 500 XP | Silver |
| **Mentor** | Refer 3 friends who complete a course | 1,500 XP | Gold |
| **Team Player** | Complete group challenge | 800 XP | Silver |

---

## 🎁 Badge-Gated Shop Items

Certain shop items require specific badges to unlock, creating dual progression:

| Shop Item | Required Badge | XP Price |
|-----------|----------------|----------|
| **Gold T-Shirt** | Course Master (10 courses) | 5,000 XP |
| **Platinum Hoodie** | Learning Legend (25 courses) | 12,000 XP |
| **Custom Certificate** | Any Gold badge | 3,000 XP |
| **Exclusive Sticker Pack** | 5 badges unlocked | 2,000 XP |

---

## 🔗 Integration with XP System

| System | Purpose | Rewards |
|--------|---------|---------|
| **XP** | Short-term motivation, shop currency | Continuous rewards |
| **Badges** | Long-term goals, social status | Milestone celebrations |

**Synergy:**
- Badges award bonus XP → More shop purchasing power
- XP milestones unlock badges → More collectibles
- Both systems encourage course completion and engagement

**User Psychology:**
- **XP** = "I'm making progress" (quantitative)
- **Badges** = "I achieved something special" (qualitative)

---

**Related Documentation:**
- [XP System](/XP-SYSTEM.md) - Points economy and shop pricing
- [Database Schema](/supabase/migrations/) - Current table structures

**Next Step:** Design database schema and implement core badge system
