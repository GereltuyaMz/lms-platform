-- =====================================================
-- SEED: UNITS, LESSONS, AND CONTENT
-- =====================================================
-- Creates units with lessons that have multiple content items:
-- - Theory video with description
-- - Easy example video with description
-- - Hard example video with description
-- Plus lesson quizzes and unit quizzes
-- Run after migration 021_add_description_to_lesson_content.sql

-- =====================================================
-- CLEAR EXISTING DATA
-- =====================================================

-- Clear in order to avoid foreign key issues
DELETE FROM quiz_answers;
DELETE FROM quiz_attempts;
DELETE FROM quiz_options;
DELETE FROM quiz_questions;
DELETE FROM lesson_content;
DELETE FROM lesson_progress;
DELETE FROM lessons;
DELETE FROM units;

-- =====================================================
-- ЭЕШ МАТЕМАТИК 500+ (Beginner - 3 units, multiple lessons each)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
  unit_id_var UUID;
  lesson_id_var UUID;
  question_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-matematik-500';

  IF course_id_var IS NOT NULL THEN
    -- =====================================================
    -- Unit 1: Тоон үйлдлүүд (Number Operations)
    -- =====================================================
    INSERT INTO units (course_id, title, title_mn, description, order_index)
    VALUES (course_id_var, 'Тоон үйлдлүүд', 'Тоон үйлдлүүд', 'Бутархай, хувь, пропорц', 1)
    RETURNING id INTO unit_id_var;

    -- Lesson 1.1: Бутархай тоо
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Бутархай тоо', 'Бутархай тоон дээрх үндсэн үйлдлүүд', 1, 1, 'video', true)
    RETURNING id INTO lesson_id_var;

    -- Lesson 1.1 Content with descriptions
    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Бутархай тоо нь бүхэл тоог хэсэгчлэн илэрхийлэхэд хэрэглэгддэг. Хүртвэр нь дээд хэсэгт, хуваарь нь доод хэсэгт байрлана. Жишээ нь: 3/4 гэдэг нь бүхлийг 4 хуваасны 3 хэсэг гэсэн утгатай.',
     600, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Энэ жишээнд бид энгийн бутархай тоонуудыг нэмэх, хасах үйлдлийг хийж үзнэ. Хуваарийг тэнцүүлж, хүртвэрүүдийг нэмэх/хасах аргыг сурна.',
     420, 2),
    (lesson_id_var, 'Хүнд жишээ', 'hard_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Энэ хэсэгт олон үйлдэлтэй бутархай тооны бодлогууд, холимог тоотой ажиллах аргуудыг авч үзнэ. Үйлдлийн дараалал чухал!',
     540, 3);

    -- Lesson 1.1 Quiz (3 questions)
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '3/4 + 1/2 = ?', '3/4 + 2/4 = 5/4 = 1.25', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '5/4', true, 0),
    (question_id_var, '4/6', false, 1),
    (question_id_var, '2/3', false, 2),
    (question_id_var, '1/2', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '2/5 × 3/4 = ?', 'Хүртвэр хүртвэрээрээ, хуваарь хуваарьаараа үржинэ: 6/20 = 3/10', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '3/10', true, 0),
    (question_id_var, '6/9', false, 1),
    (question_id_var, '5/9', false, 2),
    (question_id_var, '1/2', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '1/3 ÷ 2/5 = ?', 'Хуваах үед урвуугаар нь үржинэ: 1/3 × 5/2 = 5/6', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '5/6', true, 0),
    (question_id_var, '2/15', false, 1),
    (question_id_var, '3/5', false, 2),
    (question_id_var, '1/3', false, 3);

    -- Lesson 1.2: Хувь
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Хувь', 'Хувь тооцоолох, хувийн өөрчлөлт', 2, 2, 'video', false)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Хувь гэдэг нь 100-д харьцуулсан харьцаа юм. 50% гэдэг нь 50/100 = 0.5 = 1/2 гэсэн утгатай. Хувийг бутархай болон аравтын бутархай руу хөрвүүлэх чадвар чухал.',
     540, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Өгөгдсөн тооноос хувь олох: тоо × хувь/100. Жишээ нь: 200-ын 25% = 200 × 25/100 = 50',
     360, 2),
    (lesson_id_var, 'Хүнд жишээ', 'hard_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Хувийн өөрчлөлт тооцоолох: (шинэ - хуучин) / хуучин × 100%. Хямдрал, өсөлт зэргийг тооцоолоход ашиглана.',
     480, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '200-ын 25% = ?', '200 × 0.25 = 50', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '50', true, 0),
    (question_id_var, '25', false, 1),
    (question_id_var, '75', false, 2),
    (question_id_var, '100', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '80 нь 200-ын хэдэн хувь вэ?', '80/200 × 100 = 40%', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '40%', true, 0),
    (question_id_var, '25%', false, 1),
    (question_id_var, '50%', false, 2),
    (question_id_var, '80%', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'Үнэ 100₮-с 120₮ болсон. Хэдэн хувиар өссөн бэ?', '(120-100)/100 × 100% = 20%', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '20%', true, 0),
    (question_id_var, '12%', false, 1),
    (question_id_var, '120%', false, 2),
    (question_id_var, '80%', false, 3);

    -- Lesson 1.3: Пропорц
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Пропорц', 'Пропорц ба харьцаа', 3, 3, 'video', false)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Пропорц гэдэг нь хоёр харьцааны тэнцэтгэл юм. a:b = c:d хэлбэрт a×d = b×c (крест дүрэм) биелнэ. Энэ дүрмийг ашиглан үл мэдэгдэгчийг олно.',
     480, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Крест дүрэм ашиглан пропорцын үл мэдэгдэгчийг олох. Жишээ: 2:3 = 6:x бол 2x = 18, x = 9',
     300, 2);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '2:3 = 6:x бол x = ?', '2x = 18, x = 9', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '9', true, 0),
    (question_id_var, '4', false, 1),
    (question_id_var, '12', false, 2),
    (question_id_var, '6', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '5:x = 15:9 бол x = ?', '15x = 45, x = 3', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '3', true, 0),
    (question_id_var, '5', false, 1),
    (question_id_var, '27', false, 2),
    (question_id_var, '45', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'x:4 = 12:16 бол x = ?', '16x = 48, x = 3', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '3', true, 0),
    (question_id_var, '4', false, 1),
    (question_id_var, '8', false, 2),
    (question_id_var, '12', false, 3);

    -- Unit 1 Quiz (comprehensive, 5+ questions)
    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'Бутархай 2/3 ба 3/4-ийг нэмэхэд хэд гарах вэ?', '8/12 + 9/12 = 17/12', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '17/12', true, 0),
    (question_id_var, '5/7', false, 1),
    (question_id_var, '6/7', false, 2),
    (question_id_var, '1', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '150-ын 20% нь хэд вэ?', '150 × 0.20 = 30', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '30', true, 0),
    (question_id_var, '20', false, 1),
    (question_id_var, '15', false, 2),
    (question_id_var, '50', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '5/6 ÷ 2/3 = ?', '5/6 × 3/2 = 15/12 = 5/4', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '5/4', true, 0),
    (question_id_var, '10/18', false, 1),
    (question_id_var, '5/9', false, 2),
    (question_id_var, '1', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '3:5 = x:25 бол x = ?', '5x = 75, x = 15', 4, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '15', true, 0),
    (question_id_var, '5', false, 1),
    (question_id_var, '75', false, 2),
    (question_id_var, '125', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '60 нь аль тооны 30% вэ?', 'x × 0.30 = 60, x = 200', 5, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '200', true, 0),
    (question_id_var, '18', false, 1),
    (question_id_var, '180', false, 2),
    (question_id_var, '90', false, 3);

    -- =====================================================
    -- Unit 2: Тэгшитгэл (Equations)
    -- =====================================================
    INSERT INTO units (course_id, title, title_mn, description, order_index)
    VALUES (course_id_var, 'Тэгшитгэл', 'Тэгшитгэл', 'Нэг хувьсагчтай шугаман тэгшитгэл', 2)
    RETURNING id INTO unit_id_var;

    -- Lesson 2.1: Шугаман тэгшитгэл
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Шугаман тэгшитгэл', 'ax + b = c хэлбэрийн тэгшитгэл бодох', 4, 1, 'video', false)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Шугаман тэгшитгэл гэдэг нь ax + b = c хэлбэрийн тэгшитгэл юм. Бодох зарчим: x-ийг нэг талд, тоонуудыг нөгөө талд цуглуулж x-ийн утгыг олно.',
     720, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Энгийн шугаман тэгшитгэл бодох. Жишээ: 2x + 3 = 7 → 2x = 4 → x = 2. Хоёр талаас ижил тоо хасах, хуваах үйлдлүүд хийнэ.',
     480, 2),
    (lesson_id_var, 'Хүнд жишээ', 'hard_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Хаалттай, бутархайтай тэгшитгэл. Эхлээд хаалтыг задалж, дараа нь хуваарийг арилгаад бодно.',
     600, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '2x + 3 = 7, x = ?', '2x = 7 - 3 = 4, x = 2', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '2', true, 0),
    (question_id_var, '3', false, 1),
    (question_id_var, '4', false, 2),
    (question_id_var, '5', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '3x - 5 = 10, x = ?', '3x = 15, x = 5', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '5', true, 0),
    (question_id_var, '3', false, 1),
    (question_id_var, '4', false, 2),
    (question_id_var, '6', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '4x + 8 = 20, x = ?', '4x = 12, x = 3', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '3', true, 0),
    (question_id_var, '4', false, 1),
    (question_id_var, '7', false, 2),
    (question_id_var, '28', false, 3);

    -- Lesson 2.2: Хоёр талд хувьсагчтай тэгшитгэл
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Хоёр талд хувьсагчтай тэгшитгэл', '4x + 2 = 2x + 10 хэлбэрийн тэгшитгэл', 5, 2, 'video', false)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Хоёр талдаа x агуулсан тэгшитгэлийг бодохдоо x-үүдийг нэг талд, тоонуудыг нөгөө талд цуглуулна. Тэмдэг өөрчлөгдөхийг анхаар!',
     600, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Жишээ: 4x + 2 = 2x + 10 → 4x - 2x = 10 - 2 → 2x = 8 → x = 4',
     420, 2),
    (lesson_id_var, 'Хүнд жишээ', 'hard_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Хаалттай, коэффициент бутархайтай тэгшитгэлүүд. Эхлээд хаалтыг задалж, хуваарийг арилгаад бодно.',
     540, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '4x + 2 = 2x + 10, x = ?', '2x = 8, x = 4', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '4', true, 0),
    (question_id_var, '2', false, 1),
    (question_id_var, '3', false, 2),
    (question_id_var, '5', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '5x - 3 = 2x + 9, x = ?', '3x = 12, x = 4', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '4', true, 0),
    (question_id_var, '3', false, 1),
    (question_id_var, '6', false, 2),
    (question_id_var, '2', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '7x + 1 = 3x + 13, x = ?', '4x = 12, x = 3', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '3', true, 0),
    (question_id_var, '4', false, 1),
    (question_id_var, '2', false, 2),
    (question_id_var, '12', false, 3);

    -- Unit 2 Quiz (comprehensive)
    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '6x - 4 = 3x + 5, x = ?', '3x = 9, x = 3', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '3', true, 0),
    (question_id_var, '1', false, 1),
    (question_id_var, '9', false, 2),
    (question_id_var, '2', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '3(x + 2) = 15, x = ?', '3x + 6 = 15, 3x = 9, x = 3', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '3', true, 0),
    (question_id_var, '5', false, 1),
    (question_id_var, '7', false, 2),
    (question_id_var, '4', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '2(x - 4) = x + 1, x = ?', '2x - 8 = x + 1, x = 9', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '9', true, 0),
    (question_id_var, '5', false, 1),
    (question_id_var, '7', false, 2),
    (question_id_var, '3', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'x/2 + 3 = 7, x = ?', 'x/2 = 4, x = 8', 4, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '8', true, 0),
    (question_id_var, '4', false, 1),
    (question_id_var, '14', false, 2),
    (question_id_var, '2', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '5(2x - 1) = 3(x + 4), x = ?', '10x - 5 = 3x + 12, 7x = 17, x = 17/7', 5, 15)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '17/7', true, 0),
    (question_id_var, '2', false, 1),
    (question_id_var, '3', false, 2),
    (question_id_var, '7/17', false, 3);

    -- =====================================================
    -- Unit 3: Геометр (Geometry)
    -- =====================================================
    INSERT INTO units (course_id, title, title_mn, description, order_index)
    VALUES (course_id_var, 'Геометр', 'Геометр', 'Талбай ба периметр', 3)
    RETURNING id INTO unit_id_var;

    -- Lesson 3.1: Тэгш өнцөгт ба квадрат
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Тэгш өнцөгт ба квадрат', 'Талбай, периметр тооцоолол', 6, 1, 'video', false)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Тэгш өнцөгтийн талбай S = a × b, периметр P = 2(a + b). Квадратын талбай S = a², периметр P = 4a. Эдгээр томьёог цээжлэх шаардлагатай.',
     660, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Өгөгдсөн хэмжээнүүдээр талбай, периметр тооцоолох. Жишээ: 5 см тал бүхий квадратын талбай = 25 см²',
     420, 2),
    (lesson_id_var, 'Хүнд жишээ', 'hard_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Талбай эсвэл периметр өгөгдсөн бол талуудыг олох. Жишээ: Периметр 20 см тэгш өнцөгтийн талбай хамгийн их байхын тулд тал бүр 5 см байх ёстой (квадрат).',
     540, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'Тал нь 5 см квадратын талбай?', 'S = a² = 5² = 25 см²', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '25 см²', true, 0),
    (question_id_var, '20 см²', false, 1),
    (question_id_var, '10 см²', false, 2),
    (question_id_var, '15 см²', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'Урт 6, өргөн 4 тэгш өнцөгтийн периметр?', 'P = 2(a + b) = 2(6 + 4) = 20', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '20', true, 0),
    (question_id_var, '24', false, 1),
    (question_id_var, '10', false, 2),
    (question_id_var, '16', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'Урт 8 см, өргөн 3 см тэгш өнцөгтийн талбай?', 'S = 8 × 3 = 24 см²', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '24 см²', true, 0),
    (question_id_var, '22 см²', false, 1),
    (question_id_var, '11 см²', false, 2),
    (question_id_var, '32 см²', false, 3);

    -- Lesson 3.2: Тойрог
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Тойрог', 'Тойргийн талбай, тойрог', 7, 2, 'video', false)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Тойргийн талбай S = πr². Тойргийн урт (периметр) C = 2πr = πd. π ≈ 3.14 эсвэл 22/7 гэж авна. r - радиус, d - диаметр (d = 2r).',
     540, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Радиус өгөгдсөн үед талбай, тойргийн урт олох. Жишээ: r = 7 см бол S = π × 49 ≈ 154 см²',
     360, 2);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'Радиус 7 тойргийн талбай? (π = 22/7)', 'S = πr² = 22/7 × 49 = 154 см²', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '154 см²', true, 0),
    (question_id_var, '44 см²', false, 1),
    (question_id_var, '49 см²', false, 2),
    (question_id_var, '100 см²', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'Радиус 10 см тойргийн урт? (π = 3.14)', 'C = 2πr = 2 × 3.14 × 10 = 62.8 см', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '62.8 см', true, 0),
    (question_id_var, '31.4 см', false, 1),
    (question_id_var, '314 см', false, 2),
    (question_id_var, '20 см', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'Диаметр 14 см тойргийн талбай? (π = 22/7)', 'r = 7, S = 22/7 × 49 = 154 см²', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '154 см²', true, 0),
    (question_id_var, '308 см²', false, 1),
    (question_id_var, '44 см²', false, 2),
    (question_id_var, '616 см²', false, 3);

    -- Unit 3 Quiz (comprehensive)
    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'Тал нь 8 см квадратын периметр?', 'P = 4a = 4 × 8 = 32 см', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '32 см', true, 0),
    (question_id_var, '64 см', false, 1),
    (question_id_var, '16 см', false, 2),
    (question_id_var, '24 см', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'Урт 10, өргөн 5 тэгш өнцөгтийн талбай?', 'S = a × b = 10 × 5 = 50 см²', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '50 см²', true, 0),
    (question_id_var, '30 см²', false, 1),
    (question_id_var, '15 см²', false, 2),
    (question_id_var, '100 см²', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'Талбай нь 36 см² квадратын тал?', 'a² = 36, a = 6 см', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '6 см', true, 0),
    (question_id_var, '9 см', false, 1),
    (question_id_var, '18 см', false, 2),
    (question_id_var, '4 см', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'Радиус 5 см тойргийн урт? (π ≈ 3.14)', 'C = 2πr = 2 × 3.14 × 5 = 31.4 см', 4, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '31.4 см', true, 0),
    (question_id_var, '78.5 см', false, 1),
    (question_id_var, '15.7 см', false, 2),
    (question_id_var, '10 см', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'Периметр 28 см тэгш өнцөгтийн урт 8 см бол өргөн?', 'P = 2(a+b), 28 = 2(8+b), b = 6 см', 5, 15)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '6 см', true, 0),
    (question_id_var, '7 см', false, 1),
    (question_id_var, '10 см', false, 2),
    (question_id_var, '20 см', false, 3);

    RAISE NOTICE 'Created units and lessons for Математик 500+';
  END IF;
END $$;

-- =====================================================
-- ЭЕШ МАТЕМАТИК 600+ (Intermediate)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
  unit_id_var UUID;
  lesson_id_var UUID;
  question_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-matematik-600';

  IF course_id_var IS NOT NULL THEN
    -- Unit 1: Функц
    INSERT INTO units (course_id, title, title_mn, description, order_index)
    VALUES (course_id_var, 'Функц', 'Функц', 'Шугаман ба квадрат функц', 1)
    RETURNING id INTO unit_id_var;

    -- Lesson 1.1: Функцийн тодорхойлолт
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Функцийн тодорхойлолт', 'Функц, түүний график, домэйн, рэнж', 1, 1, 'video', true)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Функц гэдэг нь нэг утгаас нөгөө утга руу харгалзуулах дүрэм юм. f(x) = y гэж тэмдэглэнэ. Домэйн (тодорхойлогдох муж) ба рэнж (утгын муж) гэсэн ойлголтуудыг сурна.',
     780, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Функцийн утга олох: f(x) = 2x + 1 бол f(3) = 2(3) + 1 = 7. x-ийн оронд тоо орлуулна.',
     480, 2),
    (lesson_id_var, 'Хүнд жишээ', 'hard_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Функцийн домэйн олох. Жишээ: f(x) = √(x-2) функцийн домэйн нь x ≥ 2, учир нь сөрөг тооноос язгуур авч болохгүй.',
     600, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'y = 2x + 3 функцийн налалт?', 'y = mx + b хэлбэрт m = 2', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '2', true, 0),
    (question_id_var, '3', false, 1),
    (question_id_var, '1', false, 2),
    (question_id_var, '5', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'f(x) = 3x - 2, f(4) = ?', 'f(4) = 3(4) - 2 = 12 - 2 = 10', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '10', true, 0),
    (question_id_var, '14', false, 1),
    (question_id_var, '2', false, 2),
    (question_id_var, '6', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'f(x) = x² + 1, f(-2) = ?', 'f(-2) = (-2)² + 1 = 4 + 1 = 5', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '5', true, 0),
    (question_id_var, '-3', false, 1),
    (question_id_var, '3', false, 2),
    (question_id_var, '-5', false, 3);

    -- Lesson 1.2: Шугаман функц
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Шугаман функц', 'y = mx + b хэлбэрийн функц', 2, 2, 'video', false)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Шугаман функц y = mx + b хэлбэртэй. m - налалт (өсөлт/бууралтын хурд), b - y тэнхлэгийг огтлох цэг. m > 0 бол өсөх, m < 0 бол буурах функц.',
     660, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Хоёр цэг өгөгдсөн бол шугаман функцийн томьёо олох. (x₁,y₁) ба (x₂,y₂) цэгүүд дээр m = (y₂-y₁)/(x₂-x₁)',
     420, 2);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'y = -3x + 5 функцийн y тэнхлэгийг огтлох цэг?', 'x = 0 үед y = 5', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '(0, 5)', true, 0),
    (question_id_var, '(5, 0)', false, 1),
    (question_id_var, '(-3, 0)', false, 2),
    (question_id_var, '(0, -3)', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'y = 2x - 4 функцийн x тэнхлэгийг огтлох цэг?', 'y = 0 үед 2x - 4 = 0, x = 2', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '(2, 0)', true, 0),
    (question_id_var, '(0, 2)', false, 1),
    (question_id_var, '(-4, 0)', false, 2),
    (question_id_var, '(0, -4)', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, '(1, 3) ба (3, 7) цэгүүдийг дайрсан шулууны налалт?', 'm = (7-3)/(3-1) = 4/2 = 2', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '2', true, 0),
    (question_id_var, '4', false, 1),
    (question_id_var, '1/2', false, 2),
    (question_id_var, '3', false, 3);

    -- Unit 1 Quiz
    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'f(x) = x² - 4, f(3) = ?', 'f(3) = 9 - 4 = 5', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '5', true, 0),
    (question_id_var, '13', false, 1),
    (question_id_var, '-1', false, 2),
    (question_id_var, '0', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'y = 4x - 8 функц x тэнхлэгийг хаана огтлох вэ?', 'y = 0 үед 4x = 8, x = 2', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, 'x = 2', true, 0),
    (question_id_var, 'x = -8', false, 1),
    (question_id_var, 'x = 4', false, 2),
    (question_id_var, 'x = -2', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'f(x) = 2x + 1, g(x) = x - 3 бол f(g(2)) = ?', 'g(2) = -1, f(-1) = 2(-1) + 1 = -1', 3, 15)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '-1', true, 0),
    (question_id_var, '3', false, 1),
    (question_id_var, '1', false, 2),
    (question_id_var, '5', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'y = -2x + 6 шулуун буурах уу өсөх үү?', 'Налалт m = -2 < 0 тул буурах функц', 4, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, 'Буурах', true, 0),
    (question_id_var, 'Өсөх', false, 1),
    (question_id_var, 'Тогтмол', false, 2),
    (question_id_var, 'Тодорхойгүй', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'f(x) = |x - 2| функцийн хамгийн бага утга?', '|x-2| ≥ 0 учир хамгийн бага нь 0 (x=2 үед)', 5, 15)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '0', true, 0),
    (question_id_var, '2', false, 1),
    (question_id_var, '-2', false, 2),
    (question_id_var, 'Байхгүй', false, 3);

    -- Unit 2: Квадрат тэгшитгэл
    INSERT INTO units (course_id, title, title_mn, description, order_index)
    VALUES (course_id_var, 'Квадрат тэгшитгэл', 'Квадрат тэгшитгэл', 'ax² + bx + c = 0 хэлбэрийн тэгшитгэл', 2)
    RETURNING id INTO unit_id_var;

    -- Lesson 2.1: Квадрат тэгшитгэл бодох
    INSERT INTO lessons (course_id, unit_id, title, description, order_index, order_in_unit, lesson_type, is_preview)
    VALUES (course_id_var, unit_id_var, 'Квадрат тэгшитгэл бодох', 'Дискриминант, Виетийн теорем', 3, 1, 'video', false)
    RETURNING id INTO lesson_id_var;

    INSERT INTO lesson_content (lesson_id, title, content_type, video_url, description, duration_seconds, order_index) VALUES
    (lesson_id_var, 'Теори', 'theory', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Квадрат тэгшитгэл ax² + bx + c = 0 хэлбэртэй. Шийдийг олохдоо дискриминант D = b² - 4ac ашиглана. D > 0 бол 2 шийдтэй, D = 0 бол 1 шийдтэй (давхар язгуур), D < 0 бол шийдгүй.',
     840, 1),
    (lesson_id_var, 'Хялбар жишээ', 'easy_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Квадрат тэгшитгэлийг үржигдэхүүнд задлах. Жишээ: x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x = 2 эсвэл x = 3',
     540, 2),
    (lesson_id_var, 'Хүнд жишээ', 'hard_example', 'https://www.youtube.com/watch?v=8G8gX3JSxQM',
     'Дискриминант томьёо ашиглах: x = (-b ± √D) / 2a. Виетийн теорем: x₁ + x₂ = -b/a, x₁ × x₂ = c/a',
     660, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'x² - 5x + 6 = 0 тэгшитгэлийн шийд?', '(x-2)(x-3) = 0, x = 2 эсвэл x = 3', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, 'x = 2, x = 3', true, 0),
    (question_id_var, 'x = 1, x = 6', false, 1),
    (question_id_var, 'x = -2, x = -3', false, 2),
    (question_id_var, 'x = 5', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'x² - 9 = 0 тэгшитгэлийн шийд?', 'x² = 9, x = ±3', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, 'x = 3, x = -3', true, 0),
    (question_id_var, 'x = 9', false, 1),
    (question_id_var, 'x = 3', false, 2),
    (question_id_var, 'x = -9, x = 9', false, 3);

    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_id_var, 'x² + 2x - 8 = 0 тэгшитгэлийн шийд?', '(x+4)(x-2) = 0, x = -4 эсвэл x = 2', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, 'x = -4, x = 2', true, 0),
    (question_id_var, 'x = 4, x = -2', false, 1),
    (question_id_var, 'x = 4, x = 2', false, 2),
    (question_id_var, 'x = -8, x = 1', false, 3);

    -- Unit 2 Quiz
    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'x² + 4x + 4 = 0 тэгшитгэлийн шийд?', '(x+2)² = 0, x = -2 (давхар язгуур)', 1, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, 'x = -2', true, 0),
    (question_id_var, 'x = 2', false, 1),
    (question_id_var, 'x = ±2', false, 2),
    (question_id_var, 'Шийдгүй', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'x² + x + 1 = 0 тэгшитгэлийн дискриминант?', 'D = 1 - 4 = -3 < 0 (шийдгүй)', 2, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '-3', true, 0),
    (question_id_var, '3', false, 1),
    (question_id_var, '5', false, 2),
    (question_id_var, '0', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'x² - 6x + 9 = 0 тэгшитгэлийн шийд хэд вэ?', '(x-3)² = 0, x = 3 (нэг давхар язгуур)', 3, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, 'Нэг шийдтэй', true, 0),
    (question_id_var, 'Хоёр шийдтэй', false, 1),
    (question_id_var, 'Шийдгүй', false, 2),
    (question_id_var, 'Гурван шийдтэй', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, 'Виетийн теоремоор: x² - 7x + 12 = 0 язгууруудын нийлбэр?', 'x₁ + x₂ = -(-7)/1 = 7', 4, 10)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, '7', true, 0),
    (question_id_var, '12', false, 1),
    (question_id_var, '-7', false, 2),
    (question_id_var, '5', false, 3);

    INSERT INTO quiz_questions (unit_id, question, explanation, order_index, points)
    VALUES (unit_id_var, '2x² - 8x + 6 = 0 тэгшитгэлийн шийд?', '2(x² - 4x + 3) = 0, (x-1)(x-3) = 0, x = 1 эсвэл x = 3', 5, 15)
    RETURNING id INTO question_id_var;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (question_id_var, 'x = 1, x = 3', true, 0),
    (question_id_var, 'x = 2, x = 3', false, 1),
    (question_id_var, 'x = 1, x = 6', false, 2),
    (question_id_var, 'x = 2, x = 6', false, 3);

    RAISE NOTICE 'Created units and lessons for Математик 600+';
  END IF;
END $$;

-- =====================================================
-- LOG COMPLETION
-- =====================================================

DO $$
DECLARE
  unit_count INTEGER;
  lesson_count INTEGER;
  content_count INTEGER;
  lesson_quiz_count INTEGER;
  unit_quiz_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unit_count FROM units;
  SELECT COUNT(*) INTO lesson_count FROM lessons;
  SELECT COUNT(*) INTO content_count FROM lesson_content;
  SELECT COUNT(*) INTO lesson_quiz_count FROM quiz_questions WHERE lesson_id IS NOT NULL;
  SELECT COUNT(*) INTO unit_quiz_count FROM quiz_questions WHERE unit_id IS NOT NULL;

  RAISE NOTICE 'Seeded: % units, % lessons, % content items', unit_count, lesson_count, content_count;
  RAISE NOTICE 'Quizzes: % lesson quiz questions, % unit quiz questions', lesson_quiz_count, unit_quiz_count;
END $$;
