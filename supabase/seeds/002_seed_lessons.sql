-- =====================================================
-- SEED DATA: Lessons for Courses
-- =====================================================
-- Run this after 001_seed_courses.sql
-- Creates lessons with sections, varied types, and preview lessons

-- =====================================================
-- Basic Geometry and Measurement
-- =====================================================
INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Welcome to Geometry', 'Introduction to the course structure and what you will learn', 'Getting Started', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 5, 1, 'video', true
FROM courses c WHERE c.slug = 'basic-geometry-and-measurement'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Points, Lines, and Planes', 'Understanding the basic building blocks of geometry', 'Fundamentals', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 12, 2, 'video', true
FROM courses c WHERE c.slug = 'basic-geometry-and-measurement'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Angles and Their Types', 'Learn about acute, obtuse, right, and straight angles', 'Fundamentals', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 15, 3, 'video', false
FROM courses c WHERE c.slug = 'basic-geometry-and-measurement'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Geometry Basics Quiz', 'Test your knowledge of basic geometry concepts', 'Fundamentals', NULL, NULL, 10, 4, 'quiz', false
FROM courses c WHERE c.slug = 'basic-geometry-and-measurement'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Triangles and Their Properties', 'Explore different types of triangles and their characteristics', 'Shapes', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 18, 5, 'video', false
FROM courses c WHERE c.slug = 'basic-geometry-and-measurement'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Quadrilaterals: Squares, Rectangles, and More', 'Understanding four-sided shapes and their properties', 'Shapes', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 16, 6, 'video', false
FROM courses c WHERE c.slug = 'basic-geometry-and-measurement'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Perimeter and Area', 'Learn to calculate perimeter and area of basic shapes', 'Measurement', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 20, 7, 'video', false
FROM courses c WHERE c.slug = 'basic-geometry-and-measurement'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Practice Problems', 'Apply what you learned with real-world problems', 'Measurement', NULL, NULL, 15, 8, 'assignment', false
FROM courses c WHERE c.slug = 'basic-geometry-and-measurement'
ON CONFLICT DO NOTHING;

-- =====================================================
-- Introduction to Algebra
-- =====================================================
INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'What is Algebra?', 'Introduction to algebraic thinking and notation', 'Introduction', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 8, 1, 'video', true
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Variables and Expressions', 'Understanding variables and how to write algebraic expressions', 'Introduction', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 12, 2, 'video', true
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Order of Operations', 'Master PEMDAS and evaluate complex expressions', 'Fundamentals', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 14, 3, 'video', false
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Solving Linear Equations', 'Learn step-by-step techniques for solving equations', 'Equations', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 18, 4, 'video', false
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Equation Practice Quiz', 'Test your equation-solving skills', 'Equations', NULL, NULL, 12, 5, 'quiz', false
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Graphing Linear Functions', 'Plot linear equations on the coordinate plane', 'Functions', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 20, 6, 'video', false
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Slope and Intercept', 'Understanding slope-intercept form (y = mx + b)', 'Functions', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 16, 7, 'video', false
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Systems of Equations', 'Solve multiple equations with multiple variables', 'Advanced Topics', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 22, 8, 'video', false
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Final Assessment', 'Comprehensive test covering all topics', 'Advanced Topics', NULL, NULL, 20, 9, 'assignment', false
FROM courses c WHERE c.slug = 'introduction-to-algebra'
ON CONFLICT DO NOTHING;

-- =====================================================
-- Advanced Calculus
-- =====================================================
INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Course Overview', 'What to expect from this advanced calculus course', 'Introduction', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 10, 1, 'video', true
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Limits and Continuity', 'Deep dive into limits and continuous functions', 'Limits', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 25, 2, 'video', true
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Derivatives: The Basics', 'Introduction to derivatives and differentiation rules', 'Derivatives', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 30, 3, 'video', false
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Chain Rule and Implicit Differentiation', 'Master advanced differentiation techniques', 'Derivatives', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 28, 4, 'video', false
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Derivative Applications', 'Using derivatives to solve real-world problems', 'Derivatives', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 26, 5, 'video', false
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Derivatives Quiz', 'Test your understanding of differentiation', 'Derivatives', NULL, NULL, 18, 6, 'quiz', false
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Integration Fundamentals', 'Introduction to integrals and antiderivatives', 'Integration', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 32, 7, 'video', false
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Integration Techniques', 'U-substitution, integration by parts, and more', 'Integration', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 35, 8, 'video', false
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Definite Integrals and Area', 'Calculate area under curves using definite integrals', 'Integration', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 30, 9, 'video', false
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Final Calculus Challenge', 'Comprehensive problem set covering all topics', 'Integration', NULL, NULL, 25, 10, 'assignment', false
FROM courses c WHERE c.slug = 'advanced-calculus'
ON CONFLICT DO NOTHING;

-- =====================================================
-- Statistics Essentials
-- =====================================================
INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Welcome to Statistics', 'Introduction to statistical thinking', 'Getting Started', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 8, 1, 'video', true
FROM courses c WHERE c.slug = 'statistics-essentials'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Data Types and Collection', 'Understanding qualitative and quantitative data', 'Data Basics', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 12, 2, 'video', true
FROM courses c WHERE c.slug = 'statistics-essentials'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Measures of Central Tendency', 'Mean, median, and mode explained', 'Descriptive Statistics', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 16, 3, 'video', false
FROM courses c WHERE c.slug = 'statistics-essentials'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Variance and Standard Deviation', 'Measuring data spread and variability', 'Descriptive Statistics', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 18, 4, 'video', false
FROM courses c WHERE c.slug = 'statistics-essentials'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Probability Basics', 'Introduction to probability theory', 'Probability', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 20, 5, 'video', false
FROM courses c WHERE c.slug = 'statistics-essentials'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Probability Quiz', 'Test your probability knowledge', 'Probability', NULL, NULL, 15, 6, 'quiz', false
FROM courses c WHERE c.slug = 'statistics-essentials'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Normal Distribution', 'Understanding the bell curve and z-scores', 'Distributions', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 22, 7, 'video', false
FROM courses c WHERE c.slug = 'statistics-essentials'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Statistics Final Project', 'Analyze a real dataset and present findings', 'Distributions', NULL, NULL, 20, 8, 'assignment', false
FROM courses c WHERE c.slug = 'statistics-essentials'
ON CONFLICT DO NOTHING;

-- =====================================================
-- Математикийн үндэс (matematikiin-undes)
-- =====================================================
INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Танилцуулга', 'Математикийн үндсэн ойлголтууд', 'Эхлэл', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 8, 1, 'video', true
FROM courses c WHERE c.slug = 'matematikiin-undes'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Тооны системүүд', 'Натурал, бүхэл, бутархай тоонууд', 'Тоо тоолол', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 15, 2, 'video', true
FROM courses c WHERE c.slug = 'matematikiin-undes'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Үйлдлүүдийн дараалал', 'Нэмэх, хасах, үржүүлэх, хуваах', 'Үндсэн үйлдлүүд', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 18, 3, 'video', false
FROM courses c WHERE c.slug = 'matematikiin-undes'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Бутархай тоо', 'Бутархай тоотой ажиллах', 'Үндсэн үйлдлүүд', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 20, 4, 'video', false
FROM courses c WHERE c.slug = 'matematikiin-undes'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Хувь тооцоолол', 'Хувь тооцох арга зүй', 'Практик хэрэглээ', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 16, 5, 'video', false
FROM courses c WHERE c.slug = 'matematikiin-undes'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Эцсийн шалгалт', 'Сурсан зүйлээ шалгаарай', 'Практик хэрэглээ', NULL, NULL, 15, 6, 'quiz', false
FROM courses c WHERE c.slug = 'matematikiin-undes'
ON CONFLICT DO NOTHING;

-- =====================================================
-- English Grammar Fundamentals
-- =====================================================
INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Introduction to English Grammar', 'Overview of English grammar rules', 'Getting Started', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 10, 1, 'video', true
FROM courses c WHERE c.slug = 'english-grammar-fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Parts of Speech', 'Nouns, verbs, adjectives, and more', 'Grammar Basics', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 15, 2, 'video', true
FROM courses c WHERE c.slug = 'english-grammar-fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Sentence Structure', 'Subject, predicate, and clauses', 'Grammar Basics', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 18, 3, 'video', false
FROM courses c WHERE c.slug = 'english-grammar-fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Verb Tenses', 'Present, past, and future tenses explained', 'Verbs', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 20, 4, 'video', false
FROM courses c WHERE c.slug = 'english-grammar-fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Common Grammar Mistakes', 'Avoid these frequent errors', 'Advanced Topics', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 16, 5, 'video', false
FROM courses c WHERE c.slug = 'english-grammar-fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Grammar Practice Test', 'Comprehensive grammar quiz', 'Advanced Topics', NULL, NULL, 18, 6, 'quiz', false
FROM courses c WHERE c.slug = 'english-grammar-fundamentals'
ON CONFLICT DO NOTHING;

-- =====================================================
-- Logic and Problem Solving
-- =====================================================
INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Introduction to Logic', 'What is logical thinking?', 'Foundations', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 10, 1, 'video', true
FROM courses c WHERE c.slug = 'logic-and-problem-solving'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Deductive Reasoning', 'Drawing conclusions from premises', 'Reasoning', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 14, 2, 'video', true
FROM courses c WHERE c.slug = 'logic-and-problem-solving'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Inductive Reasoning', 'Pattern recognition and generalization', 'Reasoning', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 14, 3, 'video', false
FROM courses c WHERE c.slug = 'logic-and-problem-solving'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Logic Puzzles', 'Practice with classic logic puzzles', 'Problem Solving', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 16, 4, 'video', false
FROM courses c WHERE c.slug = 'logic-and-problem-solving'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Critical Thinking Skills', 'Analyzing arguments and identifying fallacies', 'Problem Solving', NULL, 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 18, 5, 'video', false
FROM courses c WHERE c.slug = 'logic-and-problem-solving'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, description, section_title, content, video_url, duration_minutes, order_index, lesson_type, is_preview)
SELECT c.id, 'Final Logic Challenge', 'Complex problems to test your skills', 'Problem Solving', NULL, NULL, 20, 6, 'assignment', false
FROM courses c WHERE c.slug = 'logic-and-problem-solving'
ON CONFLICT DO NOTHING;
