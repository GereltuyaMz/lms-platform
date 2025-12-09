-- Seed: Badge System
-- Description: Inserts 40+ achievement badges with Mongolian translations
-- Dependencies: Requires badges table from 008_create_badge_system migration

-- ======================
-- COURSE COMPLETION BADGES
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('First Steps', 'Эхний алхам', 'Анхны хичээлээ дуусгах', 'course_completion', 'bronze', 1000, '👣', 'course_count', 1),
('Knowledge Seeker', 'Мэдлэг эрэгч', '5 хичээл дуусгах', 'course_completion', 'silver', 2500, '📚', 'course_count', 5),
('Course Master', 'Хичээлийн мастер', '10 хичээл дуусгах', 'course_completion', 'gold', 5000, '🎓', 'course_count', 10),
('Learning Legend', 'Суралцагчийн домог', '25 хичээл дуусгах', 'course_completion', 'platinum', 15000, '👑', 'course_count', 25);

-- ======================
-- QUIZ PERFORMANCE BADGES
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('Perfect Score', 'Төгс оноо', 'Анхны тестэнд 100% авах', 'quiz_performance', 'bronze', 200, '💯', 'quiz_perfect', 1),
('Quiz Ace', 'Тестийн ас', '10 тестэнд 100% авах', 'quiz_performance', 'silver', 1500, '⭐', 'quiz_perfect', 10),
('Quiz Master', 'Тестийн мастер', '25 тестэнд 100% авах', 'quiz_performance', 'gold', 4000, '🏆', 'quiz_perfect', 25),
('Genius', 'Суут ухаант', '50 тестэнд 95%-с дээш авах', 'quiz_performance', 'platinum', 10000, '🧠', 'quiz_90_plus', 50),
('No Mistakes', 'Алдаагүй', 'Дараалсан 3 тестэнд 100% авах', 'quiz_performance', 'silver', 500, '✅', 'quiz_perfect_streak', 3),
('Comeback Kid', 'Буцан ирсэн', 'Тестээ давтахдаа 40%-аар сайжруулах', 'quiz_performance', 'bronze', 300, '↗️', 'quiz_improvement', 40),
('Quiz Streak', 'Тестийн цуваа', 'Дараалсан 10 тестэнд 90%-с дээш авах', 'quiz_performance', 'gold', 1000, '🔥', 'quiz_streak', 10);

-- ======================
-- STREAK BADGES
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('Starting Streak', 'Эхлэл цуваа', '3 өдөр үргэлжлүүлэх', 'streak', 'bronze', 100, '🌱', 'streak_days', 3),
('Week Warrior', 'Долоо хоногийн баатар', '7 өдөр үргэлжлүүлэх', 'streak', 'silver', 250, '⚡', 'streak_days', 7),
('Month Master', 'Сарын мастер', '30 өдөр үргэлжлүүлэх', 'streak', 'gold', 1000, '🔥', 'streak_days', 30),
('Unstoppable', 'Зогсолтгүй', '100 өдөр үргэлжлүүлэх', 'streak', 'platinum', 5000, '💪', 'streak_days', 100),
('Weekend Learner', 'Амралтын суралцагч', 'Дараалсан 4 амралтын өдөр хичээллэх', 'streak', 'silver', 400, '🗓️', 'weekend_streak', 4),
('Early Bird', 'Эрт босогч', '7 өдөр өглөө 9 цагийн өмнө хичээллэх', 'streak', 'bronze', 350, '🌅', 'early_lessons', 7),
('Night Owl', 'Шөнийн шувуу', '10 хичээл орой 10 цагаас хойш хийх', 'streak', 'bronze', 300, '🦉', 'night_lessons', 10);

-- ======================
-- ENGAGEMENT BADGES
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('Marathon Learner', 'Марафончин', 'Нэг өдөрт 5 хичээл дуусгах', 'engagement', 'bronze', 200, '🏃', 'lessons_one_day', 5),
('Speedrunner', 'Хурдан дүүргэгч', 'Хичээлийг 24 цагт багтаан дуусгах', 'engagement', 'gold', 500, '⚡', 'course_24h', 1),
('Deep Diver', 'Гүн нэвтрэгч', '50+ цаг суралцах', 'engagement', 'gold', 2000, '🤿', 'learning_hours', 50),
('Century', 'Зуун', 'Нийт 100 хичээл дуусгах', 'engagement', 'gold', 3000, '💯', 'total_lessons', 100),
('Dedicated Student', 'Зүтгэлт оюутан', '200+ цаг суралцах', 'engagement', 'platinum', 8000, '📖', 'learning_hours', 200);

-- ======================
-- MILESTONE BADGES
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('XP Collector', 'XP цуглуулагч', '5,000 XP олох', 'milestone', 'bronze', 250, '💰', 'total_xp', 5000),
('XP Enthusiast', 'XP сонирхогч', '10,000 XP олох', 'milestone', 'silver', 500, '💎', 'total_xp', 10000),
('XP Master', 'XP мастер', '25,000 XP олох', 'milestone', 'gold', 1000, '🌟', 'total_xp', 25000),
('XP Legend', 'XP домог', '100,000 XP олох', 'milestone', 'platinum', 5000, '👑', 'total_xp', 100000),
('Shop Regular', 'Дэлгүүрийн үйлчлүүлэгч', 'Анхны худалдан авалт хийх', 'milestone', 'bronze', 500, '🛍️', 'shop_purchases', 1),
('Badge Hunter', 'Тэмдэг анчин', '10 тэмдэг нээх', 'milestone', 'silver', 1500, '🎖️', 'badges_unlocked', 10),
('Badge Master', 'Тэмдгийн мастер', '25 тэмдэг нээх', 'milestone', 'gold', 3000, '🏅', 'badges_unlocked', 25),
('Completionist', 'Бүх зүйлийг дуусгагч', '50 тэмдэг нээх', 'milestone', 'platinum', 10000, '🎯', 'badges_unlocked', 50);

-- ======================
-- SOCIAL & COMMUNITY BADGES (Future)
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('Helpful Hand', 'Туслах гар', 'Форум дээр 10 upvote авах', 'social', 'silver', 500, '🤝', 'forum_upvotes', 10),
('Mentor', 'Зөвлөх багш', '3 найзыг урьж хичээл дуусгуулах', 'social', 'gold', 1500, '👨‍🏫', 'referrals_completed', 3),
('Team Player', 'Багийн тоглогч', 'Бүлгийн даалгавар дуусгах', 'social', 'silver', 800, '👥', 'group_challenges', 1);

-- ======================
-- CATEGORY-SPECIFIC BADGES
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('Math Specialist', 'Математикийн мэргэжилтэн', 'Бүх математикийн хичээл дуусгах', 'course_completion', 'gold', 3000, '📐', 'category_math', 1),
('Physics Pro', 'Физикийн мастер', 'Бүх физикийн хичээл дуусгах', 'course_completion', 'gold', 3000, '⚛️', 'category_physics', 1),
('Chemistry Expert', 'Химийн мэргэжилтэн', 'Бүх химийн хичээл дуусгах', 'course_completion', 'gold', 3000, '🧪', 'category_chemistry', 1),
('Language Master', 'Хэлний мастер', 'Бүх хэлний хичээл дуусгах', 'course_completion', 'gold', 3000, '📝', 'category_language', 1),
('Full Stack Hero', 'Бүх зүйлийн баатар', '3+ төрлийн хичээл дуусгах', 'course_completion', 'platinum', 5000, '🌈', 'categories_completed', 3);

-- ======================
-- TIME-BASED BADGES
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('Morning Glory', 'Өглөөний гэрэл', '10 хичээл өглөө 8 цагийн өмнө хийх', 'engagement', 'bronze', 300, '☀️', 'morning_lessons', 10),
('Lunch Break Learner', 'Өдрийн завсарлагын суралцагч', '5 хичээл 12-2 цагийн хооронд хийх', 'engagement', 'bronze', 200, '🍱', 'midday_lessons', 5),
('Weekend Warrior', 'Амралтын баатар', 'Амралтын өдрүүдэд 10 хичээл хийх', 'engagement', 'silver', 400, '🎉', 'weekend_lessons', 10);

-- ======================
-- PROGRESS MILESTONES
-- ======================

INSERT INTO badges (name, name_mn, description_mn, category, rarity, xp_bonus, icon, requirement_type, requirement_value) VALUES
('Quick Start', 'Хурдан эхлэл', 'Анхны 3 өдөрт 5 хичээл дуусгах', 'engagement', 'bronze', 250, '🚀', 'quick_start', 5),
('Consistent Learner', 'Тогтвортой суралцагч', '4 долоо хоног дараалан суралцах', 'streak', 'silver', 600, '📅', 'weekly_streak', 4),
('Profile Perfectionist', 'Профайл төгөлдөр', 'Профайлыг бүрэн гүйцэд бөглөх', 'milestone', 'bronze', 150, '✨', 'profile_complete', 1);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Successfully seeded % badges', (SELECT COUNT(*) FROM badges);
END $$;
