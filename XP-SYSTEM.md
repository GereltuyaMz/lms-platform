# 🎮 XP & Gamification System

**Version:** 1.1
**Last Updated:** November 13, 2025

---

## 🎯 XP Award System

### **Core Completion Rewards**

#### Video Lessons
- **Complete any video**: 50 XP base
- **First video in a course**: +25 XP bonus (75 XP total)
- **Lesson duration bonus**: +5 XP per 5 minutes (e.g., 20min video = 50 + 20 = 70 XP)

#### Quiz Lessons (Hybrid System - First Attempt Only)
- **Base reward**: 10 XP per correct answer
- **Mastery bonuses** (added to base):
  - **Pass (80-89%)**: +25 XP bonus
  - **Good (90-94%)**: +50 XP bonus
  - **Excellent (95-99%)**: +75 XP bonus
  - **Perfect (100%)**: +100 XP bonus
- **Example**: 8/10 correct (80%) = 80 XP base + 25 bonus = **105 XP total**
- **Retry attempts**: 0 XP (no points awarded for retries)

#### Text/Reading Lessons
- **Complete text lesson**: 30 XP base
- **Long-form content (>1000 words)**: 50 XP

#### Assignment Submissions
- **Submit assignment**: 150 XP (future phase)

---

### **Onboarding Rewards**

#### Profile Completion
- **Complete your profile**: 150 XP (one-time bonus)
  - Add profile photo
  - Set date of birth
  - Choose learning goals
  - Profile completion indicator shows your progress

---

### **Milestone Bonuses**

#### Course Progress
- **First lesson complete**: 50 XP (already counted in first video bonus)
- **25% course completion**: 200 XP bonus
- **50% course completion**: 300 XP bonus
- **75% course completion**: 400 XP bonus
- **100% course completion**: 500 XP bonus + course badge

#### Streak Bonuses
- **3-day learning streak**: 100 XP
- **7-day streak**: 250 XP
- **30-day streak**: 1,000 XP
- **Daily streak multiplier**: 1.1x XP on all activities (up to 1.5x at 30+ days)

---

### **Special Achievements**

- **Complete first course ever**: 1,000 XP
- **Complete 5 courses**: 2,500 XP
- **Complete 10 courses**: 5,000 XP
- **Achieve 100% on 10 quizzes**: 1,500 XP
- **Earn all badges in a category**: 750 XP

---

## 📊 XP Economy & Shop Pricing

### **Economy Overview**

**Base Unit:** 10,000 XP = 1 hoodie

#### Example Course Completion XP

**Course: "React Fundamentals" (12 lessons)**
- 8 video lessons × 70 XP avg = 560 XP
- 3 quizzes × 105 XP avg (assuming 80% pass) = 315 XP
- 1 text lesson × 30 XP = 30 XP
- Milestone bonuses (25%, 50%, 75%, 100%) = 1,400 XP
- **Total per course**: ~2,305 XP

**To earn 10,000 XP (1 hoodie):**
- Complete ~4-5 courses
- OR 3 courses + active streak bonuses + achievements

### **Shop Pricing Tiers**

#### Budget Items (encourage early purchases)
- Course certificate PDF: 500 XP
- Profile badge: 750 XP
- Custom avatar frame: 1,000 XP

#### Mid-tier Rewards
- Sticker pack: 2,500 XP
- T-shirt: 5,000 XP
- Water bottle: 6,500 XP

#### Premium Rewards
- Hoodie: 10,000 XP
- Backpack: 15,000 XP
- Laptop stickers + shirt bundle: 12,000 XP

#### Exclusive
- 1-on-1 mentorship session: 25,000 XP
- Course creation credit: 50,000 XP

---

## 🔄 Implementation Phases

### **Phase 4A: Core XP Awards** ✅ Priority
1. Create `xp_transactions` table
2. Award XP on video completion (50 XP base + duration bonus)
3. Award XP on quiz completion (hybrid: 10 XP/correct + mastery bonus)
4. Update `total_xp` in user_profiles via trigger
5. Display real XP in dashboard

### **Phase 4B: Milestone Bonuses**
6. Award course progress milestones (25%, 50%, 75%, 100%)
7. First course completion bonus (1,000 XP)
8. XP transaction history page in dashboard

### **Phase 4C: Profile Completion**
9. Award 150 XP for completing profile (one-time)
10. Dashboard banner for incomplete profiles
11. Profile completion indicator

### **Phase 4D: Streak System**
12. Track daily activity in `last_activity_date`
13. Calculate and update streak counters
14. Apply streak multipliers to XP gains
15. Streak bonus awards (3/7/30 day milestones)

### **Phase 4E: Polish**
16. XP gain animations (toast notifications)
17. XP progress bar to next reward
18. Transaction history with filters

---

## 🎮 Gamification Psychology

This system encourages:

✅ **Profile investment** - Complete profile for instant 150 XP reward
✅ **Regular engagement** - Daily streaks multiply XP
✅ **Quality learning** - Higher quiz scores = more XP (first attempt only)
✅ **Course completion** - Big bonuses at 100%
✅ **Long-term goals** - 10,000 XP requires real effort (4-5 courses)
✅ **Early wins** - Small shop items accessible quickly (500-1,000 XP)
✅ **First-time success** - Rewards getting it right on the first try

---

## 📈 Balancing Analysis

### **Time Investment**

**10,000 XP breakdown:**
- 1 complete course ≈ 2,400 XP
- 4 courses = 9,600 XP
- +Streaks/achievements = 10,000+ XP

**Time required:**
- Each course takes 3-5 hours
- 4 courses = 12-20 hours of learning
- **10,000 XP = ~15 hours of platform engagement**

### **Economic Value**

For a $30-50 hoodie:
- 10,000 XP = 15 hours
- Value: **$2-3.50/hour** in rewards

This ensures meaningful engagement while providing real value for learning effort.


## 🔮 Future Enhancements

### **Phase 5+**

- **Leaderboards**: Weekly/monthly top learners
- **Leagues**: Bronze/Silver/Gold/Platinum tiers
- **Team challenges**: Group learning goals
- **Referral bonuses**: 500 XP per friend who completes first course
- **Seasonal events**: 2x XP weekends
- **Achievement badges**: Visual collectibles beyond XP → See [BADGE-SYSTEM.md](/BADGE-SYSTEM.md) for complete specifications
- **XP decay prevention**: Login rewards for returning users

---

## 📋 Success Metrics

Track these KPIs:

- Average XP per user per week
- Course completion rate before/after XP system
- Daily active users (DAU) improvement
- Shop item redemption rate
- Streak retention (% users maintaining 7+ day streaks)
- Time to first shop purchase

**Target:** 20% increase in course completion rate within 3 months of XP launch.

---

## 🚀 Implementation Status

### ✅ Completed (Phase 4A-4D)
- **Video Completion XP** - Awards base XP + duration bonus + first lesson bonus
- **Quiz Completion XP** - Hybrid system: 10 XP per correct answer + mastery bonus (25-100 XP), first attempt only
- **Milestone XP** - 25%, 50%, 75%, 100% course completion bonuses
- **First Course Bonus** - 1,000 XP for completing first course ever
- **Streak System** - Daily activity tracking with 3/7/30-day bonuses
- **Profile Completion** - 150 XP one-time bonus for completing avatar, DOB, learning goals
- **XP Transactions** - Database table with auto-updating total_xp
- **Toast Notifications** - Real-time XP feedback for all awards
- **Dashboard Display** - Live XP, level, streak, and league calculations

### 🔧 In Progress
- **Avatar Upload to Storage** - Currently uses preview URLs only

### ⏳ Pending
- **Shop System** - Item catalog, purchase flow, inventory
- **Badge System** - Achievement definitions and awards
- **Leaderboards** - Weekly/monthly rankings
- **Referral System** - Friend invites with XP rewards


