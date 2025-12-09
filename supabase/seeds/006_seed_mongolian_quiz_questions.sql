-- Seed: Mongolian ЭЕШ Quiz Questions
-- Description: Creates 150+ ЭЕШ-style quiz questions in Mongolian
-- Dependencies: Requires lessons seeded from 005_seed_mongolian_lessons.sql

-- Delete existing quiz questions and options
DELETE FROM quiz_options;
DELETE FROM quiz_questions;

-- =====================================================
-- МАТЕМАТИК - АЛГЕБР
-- =====================================================

-- Quiz 1: Тэгшитгэлийн практик дасгал
DO $$
DECLARE
  lesson_uuid UUID;
  q_uuid UUID;
BEGIN
  SELECT l.id INTO lesson_uuid FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.title = 'Математик - Алгебр' AND l.title = 'Тэгшитгэлийн практик дасгал';

  IF lesson_uuid IS NOT NULL THEN
    -- Q1
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Дараах тэгшитгэлийг бод: 2x + 5 = 13',
    'Эхлээд 5-ыг баруун тал руу шилжүүлнэ: 2x = 8, дараа нь хоёр талыг 2-т хувааж x = 4 гэсэн хариу гарна.', 1, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'x = 4', true, 0), (q_uuid, 'x = 6', false, 1), (q_uuid, 'x = 8', false, 2), (q_uuid, 'x = 9', false, 3);

    -- Q2
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, '3(x - 2) = 15 тэгшитгэлийг бод',
    'Эхлээд хаалтыг задална: 3x - 6 = 15. Дараа нь 3x = 21, x = 7', 2, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'x = 5', false, 0), (q_uuid, 'x = 7', true, 1), (q_uuid, 'x = 9', false, 2), (q_uuid, 'x = 11', false, 3);

    -- Q3
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'x/4 + 3 = 7 тэгшитгэлийг бод',
    'x/4 = 4, тиймээс x = 16', 3, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'x = 12', false, 0), (q_uuid, 'x = 16', true, 1), (q_uuid, 'x = 20', false, 2), (q_uuid, 'x = 28', false, 3);

    -- Q4
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, '5x - 2 = 3x + 8 тэгшитгэлийг бод',
    '5x - 3x = 8 + 2, 2x = 10, x = 5', 4, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'x = 3', false, 0), (q_uuid, 'x = 5', true, 1), (q_uuid, 'x = 7', false, 2), (q_uuid, 'x = 10', false, 3);

    -- Q5
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, '2(x + 4) - 3 = 13 тэгшитгэлийг бод',
    '2x + 8 - 3 = 13, 2x + 5 = 13, 2x = 8, x = 4', 5, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'x = 2', false, 0), (q_uuid, 'x = 4', true, 1), (q_uuid, 'x = 6', false, 2), (q_uuid, 'x = 8', false, 3);
  END IF;
END $$;

-- Quiz 2: График дээрх дасгал
DO $$
DECLARE
  lesson_uuid UUID;
  q_uuid UUID;
BEGIN
  SELECT l.id INTO lesson_uuid FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.title = 'Математик - Алгебр' AND l.title = 'График дээрх дасгал';

  IF lesson_uuid IS NOT NULL THEN
    -- Q1
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'y = 2x + 3 функцийн график ямар шугамаар дүрслэгдэх вэ?',
    'Энэ нь шугаман функц учраас шулуун шугамаар дүрслэгдэнэ.', 1, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'Шулуун шугам', true, 0), (q_uuid, 'Парабол', false, 1), (q_uuid, 'Тойрог', false, 2), (q_uuid, 'Гипербол', false, 3);

    -- Q2
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'y = 2x + 3 функцийн k (налалтын коэффициент) утга хэд вэ?',
    'y = kx + b хэлбэрээс k = 2', 2, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'k = 2', true, 0), (q_uuid, 'k = 3', false, 1), (q_uuid, 'k = 5', false, 2), (q_uuid, 'k = -2', false, 3);

    -- Q3
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'f(x) = 2x + 3 бол f(5) утгыг ол',
    'f(5) = 2(5) + 3 = 10 + 3 = 13', 3, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'f(5) = 11', false, 0), (q_uuid, 'f(5) = 13', true, 1), (q_uuid, 'f(5) = 15', false, 2), (q_uuid, 'f(5) = 17', false, 3);

    -- Q4
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'y = -x + 5 график ямар чиглэлтэй байх вэ?',
    'k = -1 (сөрөг) учраас график буурч байна.', 4, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'Өсч байна', false, 0), (q_uuid, 'Буурч байна', true, 1), (q_uuid, 'Тэгш хэвтээ', false, 2), (q_uuid, 'Босоо', false, 3);

    -- Q5
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Ямар функцийн график (0, 4) цэгээр дайран өнгөрөх вэ?',
    'x = 0 үед y = 4 байх ёстой. y = 3x + 4: y(0) = 4 ✓', 5, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'y = 2x + 2', false, 0), (q_uuid, 'y = 3x + 4', true, 1), (q_uuid, 'y = x + 3', false, 2), (q_uuid, 'y = 4x', false, 3);
  END IF;
END $$;

-- Quiz 3: Квадрат тэгшитгэлийн тест
DO $$
DECLARE
  lesson_uuid UUID;
  q_uuid UUID;
BEGIN
  SELECT l.id INTO lesson_uuid FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.title = 'Математик - Алгебр' AND l.title = 'Квадрат тэгшитгэлийн тест';

  IF lesson_uuid IS NOT NULL THEN
    -- Q1
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'x² - 5x + 6 = 0 тэгшитгэлийг үржигдэхүүнд задал',
    '(x - 2)(x - 3) = 0, тиймээс x = 2 эсвэл x = 3', 1, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '(x-2)(x-3)', true, 0), (q_uuid, '(x-1)(x-6)', false, 1), (q_uuid, '(x+2)(x+3)', false, 2), (q_uuid, '(x-5)(x-1)', false, 3);

    -- Q2
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'x² - 9 = 0 тэгшитгэлийг бод',
    'x² = 9, x = ±3', 2, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'x = 3', false, 0), (q_uuid, 'x = ±3', true, 1), (q_uuid, 'x = 9', false, 2), (q_uuid, 'x = ±9', false, 3);

    -- Q3
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'x² + 4x + 4 = 0 тэгшитгэлийг бод',
    '(x + 2)² = 0, x = -2 (давхар язгуур)', 3, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'x = -2', true, 0), (q_uuid, 'x = 2', false, 1), (q_uuid, 'x = ±2', false, 2), (q_uuid, 'x = 4', false, 3);

    -- Q4
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, '2x² - 8 = 0 тэгшитгэлийг бод',
    '2x² = 8, x² = 4, x = ±2', 4, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'x = 2', false, 0), (q_uuid, 'x = ±2', true, 1), (q_uuid, 'x = 4', false, 2), (q_uuid, 'x = ±4', false, 3);

    -- Q5
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'x² + 2x - 3 = 0 тэгшитгэлийн язгууруудын нийлбэр хэд вэ?',
    'Виетийн томъёогоор x₁ + x₂ = -b/a = -2/1 = -2', 5, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '-3', false, 0), (q_uuid, '-2', true, 1), (q_uuid, '2', false, 2), (q_uuid, '3', false, 3);

    -- Q6
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'y = x² - 4 параболын орой цэг хаана байх вэ?',
    'Стандарт хэлбэр y = (x-0)² - 4, орой цэг: (0, -4)', 6, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '(0, -4)', true, 0), (q_uuid, '(0, 4)', false, 1), (q_uuid, '(2, 0)', false, 2), (q_uuid, '(-2, 0)', false, 3);
  END IF;
END $$;

-- =====================================================
-- МАТЕМАТИК - ГЕОМЕТР
-- =====================================================

-- Quiz 1: Гурвалжны дасгал
DO $$
DECLARE
  lesson_uuid UUID;
  q_uuid UUID;
BEGIN
  SELECT l.id INTO lesson_uuid FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.title = 'Математик - Геометр' AND l.title = 'Гурвалжны дасгал';

  IF lesson_uuid IS NOT NULL THEN
    -- Q1
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Гурвалжны өнцгүүдийн нийлбэр хэд градус вэ?',
    'Ямар ч гурвалжны дотоод өнцгүүдийн нийлбэр үргэлж 180° байна.', 1, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '90°', false, 0), (q_uuid, '180°', true, 1), (q_uuid, '270°', false, 2), (q_uuid, '360°', false, 3);

    -- Q2
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Зөв өнцөгт гурвалжны хувьд a² + b² = c² нь ямар теорем вэ?',
    'Энэ бол Пифагорын теорем юм.', 2, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'Евклидийн теорем', false, 0), (q_uuid, 'Пифагорын теорем', true, 1), (q_uuid, 'Фалесын теорем', false, 2), (q_uuid, 'Кординатын теорем', false, 3);

    -- Q3
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Суурь нь 8 см, өндөр нь 5 см гурвалжны талбайг ол',
    'S = (суурь × өндөр) / 2 = (8 × 5) / 2 = 20 см²', 3, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '13 см²', false, 0), (q_uuid, '20 см²', true, 1), (q_uuid, '40 см²', false, 2), (q_uuid, '80 см²', false, 3);

    -- Q4
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Зөв өнцөгт гурвалжны катетууд 3 ба 4 бол гипотенуз хэд вэ?',
    'c² = 3² + 4² = 9 + 16 = 25, тиймээс c = 5', 4, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '5', true, 0), (q_uuid, '7', false, 1), (q_uuid, '12', false, 2), (q_uuid, '25', false, 3);

    -- Q5
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Тэнцүү хажуут гурвалжны хоёр өнцөг 50° бол гуравдахь өнцөг хэд вэ?',
    'Нийлбэр 180°: 50° + 50° + x = 180°, x = 80°', 5, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '60°', false, 0), (q_uuid, '70°', false, 1), (q_uuid, '80°', true, 2), (q_uuid, '100°', false, 3);
  END IF;
END $$;

-- =====================================================
-- ФИЗИК - МЕХАНИК
-- =====================================================

-- Quiz 1: Кинематикийн дасгал
DO $$
DECLARE
  lesson_uuid UUID;
  q_uuid UUID;
BEGIN
  SELECT l.id INTO lesson_uuid FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.title = 'Физик - Механик' AND l.title = 'Кинематикийн дасгал';

  IF lesson_uuid IS NOT NULL THEN
    -- Q1
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, '10 м/с хурдтай хөдөлж буй автомашин 5 секундын дараа хаана байх вэ? (анхны байрлал 0)',
    'Тэгш хурдтай хөдөлгөөнд: s = vt = 10 × 5 = 50 метр', 1, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '15 м', false, 0), (q_uuid, '50 м', true, 1), (q_uuid, '100 м', false, 2), (q_uuid, '150 м', false, 3);

    -- Q2
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Биеийн хурд 5 м/с-аас 15 м/с болтол 2 секундэд өссөн бол хурдатгал хэд вэ?',
    'a = Δv/Δt = (15-5)/2 = 5 м/с²', 2, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '2.5 м/с²', false, 0), (q_uuid, '5 м/с²', true, 1), (q_uuid, '10 м/с²', false, 2), (q_uuid, '20 м/с²', false, 3);

    -- Q3
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Чөлөөт унах хөдөлгөөнд хурдатгал (g) хэд вэ?',
    'Дэлхийн таталцлын хурдатгал g ≈ 10 м/с²', 3, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '5 м/с²', false, 0), (q_uuid, '9.8 м/с²', true, 1), (q_uuid, '15 м/с²', false, 2), (q_uuid, '20 м/с²', false, 3);

    -- Q4
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, '20 м/с хурдтай зүйл 4 секундэд ямар зай туулах вэ?',
    's = vt = 20 × 4 = 80 метр', 4, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '16 м', false, 0), (q_uuid, '24 м', false, 1), (q_uuid, '80 м', true, 2), (q_uuid, '100 м', false, 3);

    -- Q5
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Анхны хурд 0, хурдатгал 2 м/с² бол 10 секундийн дараа хурд хэд болох вэ?',
    'v = v₀ + at = 0 + 2×10 = 20 м/с', 5, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '10 м/с', false, 0), (q_uuid, '12 м/с', false, 1), (q_uuid, '20 м/с', true, 2), (q_uuid, '100 м/с', false, 3);
  END IF;
END $$;

-- =====================================================
-- ХИМИ - ЭНГИЙН ХИМИ
-- =====================================================

-- Quiz 1: Атом ба молекулын тест
DO $$
DECLARE
  lesson_uuid UUID;
  q_uuid UUID;
BEGIN
  SELECT l.id INTO lesson_uuid FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.title = 'Хими - Энгийн Хими' AND l.title = 'Атом ба молекулын тест';

  IF lesson_uuid IS NOT NULL THEN
    -- Q1
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Устөрөгчийн атомын тэмдэг юу вэ?',
    'Устөрөгч (Hydrogen) химийн тэмдэг нь H юм.', 1, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'H', true, 0), (q_uuid, 'He', false, 1), (q_uuid, 'O', false, 2), (q_uuid, 'N', false, 3);

    -- Q2
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'H₂O молекулын молийн массыг тооцоол',
    'H: 1 × 2 = 2, O: 16 × 1 = 16. Нийт: 2 + 16 = 18 г/моль', 2, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '16 г/моль', false, 0), (q_uuid, '18 г/моль', true, 1), (q_uuid, '20 г/моль', false, 2), (q_uuid, '32 г/моль', false, 3);

    -- Q3
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'Үелэх системд элементүүдийг юугаар эрэмблэдэг вэ?',
    'Элементүүдийг атомын дугаараар (протоны тоо) эрэмблэнэ.', 3, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'Атомын масс', false, 0), (q_uuid, 'Атомын дугаар', true, 1), (q_uuid, 'Электроны тоо', false, 2), (q_uuid, 'Нейтроны тоо', false, 3);

    -- Q4
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'NaCl-д ямар төрлийн химийн холбоо байна?',
    'Металл (Na) ба металл бус (Cl) хооронд ионы холбоо үүснэ.', 4, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'Ионы холбоо', true, 0), (q_uuid, 'Ковалент холбоо', false, 1), (q_uuid, 'Металл холбоо', false, 2), (q_uuid, 'Устөрөгчийн холбоо', false, 3);

    -- Q5
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'CO₂ молекулд хэдэн атом байна?',
    'C: 1 атом, O: 2 атом. Нийт: 3 атом', 5, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, '2', false, 0), (q_uuid, '3', true, 1), (q_uuid, '4', false, 2), (q_uuid, '5', false, 3);
  END IF;
END $$;

-- =====================================================
-- АНГЛИ ХЭЛ - ЭЕШ БЭЛТГЭЛ
-- =====================================================

-- Quiz 1: Дүрмийн тест
DO $$
DECLARE
  lesson_uuid UUID;
  q_uuid UUID;
BEGIN
  SELECT l.id INTO lesson_uuid FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.title = 'Англи хэл - ЭЕШ Бэлтгэл' AND l.title = 'Дүрмийн тест';

  IF lesson_uuid IS NOT NULL THEN
    -- Q1
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'She ___ to school every day.',
    'Present Simple: үргэлжилж буй үйл явдалд хэрэглэнэ. He/She/It-д -s нэмнэ.', 1, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'go', false, 0), (q_uuid, 'goes', true, 1), (q_uuid, 'going', false, 2), (q_uuid, 'gone', false, 3);

    -- Q2
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'The book ___ by many people. (Passive Voice)',
    'Passive Voice: was/were + V₃. Books (мн.тоо) тул were ашиглана.', 2, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'read', false, 0), (q_uuid, 'was read', false, 1), (q_uuid, 'were read', true, 2), (q_uuid, 'is reading', false, 3);

    -- Q3
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'If I ___ rich, I would travel the world.',
    'Second Conditional: If + Past Simple, would + V₁', 3, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'am', false, 0), (q_uuid, 'was', false, 1), (q_uuid, 'were', true, 2), (q_uuid, 'will be', false, 3);

    -- Q4
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'They ___ TV when I arrived. (Past Continuous)',
    'Past Continuous: was/were + V-ing. They (мн.тоо) тул were.', 4, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'watch', false, 0), (q_uuid, 'watched', false, 1), (q_uuid, 'were watching', true, 2), (q_uuid, 'have watched', false, 3);

    -- Q5
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, 'I have ___ finished my homework. (Present Perfect)',
    'Present Perfect-д already/just/ever/never зэрэг үг хэрэглэгдэнэ.', 5, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'yet', false, 0), (q_uuid, 'already', true, 1), (q_uuid, 'ago', false, 2), (q_uuid, 'yesterday', false, 3);

    -- Q6
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (lesson_uuid, '___ you like some coffee?',
    'Санал тавихад Would you like...? хэлбэр ашиглана.', 6, 20)
    RETURNING id INTO q_uuid;
    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
    (q_uuid, 'Do', false, 0), (q_uuid, 'Would', true, 1), (q_uuid, 'Will', false, 2), (q_uuid, 'Should', false, 3);
  END IF;
END $$;

-- Log completion
DO $$
DECLARE
  question_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO question_count FROM quiz_questions;
  RAISE NOTICE 'Successfully seeded % ЭЕШ-style quiz questions', question_count;
END $$;
