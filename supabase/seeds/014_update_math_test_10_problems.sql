-- ================================================
-- Update Math Test with 10 Simple Standalone Problems
-- ================================================
-- Replaces the 4 big multi-part problems with 10 simple standalone questions
-- Each problem has exactly 1 question (no sub-questions)

-- Delete existing math test data
DELETE FROM mock_tests WHERE id = '10000000-0000-0000-0000-000000000001';

-- Create new math test with 10 questions
INSERT INTO mock_tests (id, category, title, description, time_limit_minutes, total_questions, passing_score_percentage, is_published)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'math',
  'ЭЕШ Математик - Тест 1',
  'ЭЕШ-ийн математикийн 10 асуулт бүхий 60 минутын тест',
  60,
  10,
  60,
  true
);

INSERT INTO mock_test_sections (id, mock_test_id, subject, title, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'math',
  'Математик',
  1
);

-- Problem 1: Квадрат тэгшитгэл
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000101',
  '10000000-0000-0000-0001-000000000001',
  1,
  'Асуулт 1',
  NULL,
  1
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000111', '10000000-0000-0000-0001-000000000101', '1', 'x² - 5x + 6 = 0 тэгшитгэлийг шийд', 'x² - 5x + 6 = (x-2)(x-3) = 0, иймээс x = 2 эсвэл x = 3', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001111', '10000000-0000-0000-0001-000000000111', 'x = 2, x = 3', true, 0),
  ('10000000-0000-0000-0001-000000001112', '10000000-0000-0000-0001-000000000111', 'x = 1, x = 6', false, 1),
  ('10000000-0000-0000-0001-000000001113', '10000000-0000-0000-0001-000000000111', 'x = -2, x = -3', false, 2),
  ('10000000-0000-0000-0001-000000001114', '10000000-0000-0000-0001-000000000111', 'x = 5, x = 1', false, 3);

-- Problem 2: Функц
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000102',
  '10000000-0000-0000-0001-000000000001',
  2,
  'Асуулт 2',
  NULL,
  2
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000121', '10000000-0000-0000-0001-000000000102', '2', 'f(x) = 2x + 3 бол f(5) хэд вэ?', 'f(5) = 2(5) + 3 = 10 + 3 = 13', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001211', '10000000-0000-0000-0001-000000000121', '13', true, 0),
  ('10000000-0000-0000-0001-000000001212', '10000000-0000-0000-0001-000000000121', '10', false, 1),
  ('10000000-0000-0000-0001-000000001213', '10000000-0000-0000-0001-000000000121', '8', false, 2),
  ('10000000-0000-0000-0001-000000001214', '10000000-0000-0000-0001-000000000121', '16', false, 3);

-- Problem 3: Геометр - Пифагор
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000103',
  '10000000-0000-0000-0001-000000000001',
  3,
  'Асуулт 3',
  NULL,
  3
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000131', '10000000-0000-0000-0001-000000000103', '3', 'Тэгш өнцөгт гурвалжны катетууд a=3, b=4 бол гипотенуз c хэд вэ?', 'Пифагорын теорем: c² = 3² + 4² = 9 + 16 = 25, c = 5', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001311', '10000000-0000-0000-0001-000000000131', '5', true, 0),
  ('10000000-0000-0000-0001-000000001312', '10000000-0000-0000-0001-000000000131', '7', false, 1),
  ('10000000-0000-0000-0001-000000001313', '10000000-0000-0000-0001-000000000131', '6', false, 2),
  ('10000000-0000-0000-0001-000000001314', '10000000-0000-0000-0001-000000000131', '4', false, 3);

-- Problem 4: Зэрэг
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000104',
  '10000000-0000-0000-0001-000000000001',
  4,
  'Асуулт 4',
  NULL,
  4
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000141', '10000000-0000-0000-0001-000000000104', '4', '2⁵ × 2³ = ?', 'Ижил үндэстэй зэрэгийг үржихдээ зэрэгийг нэмнэ: 2⁵⁺³ = 2⁸ = 256', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001411', '10000000-0000-0000-0001-000000000141', '256', true, 0),
  ('10000000-0000-0000-0001-000000001412', '10000000-0000-0000-0001-000000000141', '128', false, 1),
  ('10000000-0000-0000-0001-000000001413', '10000000-0000-0000-0001-000000000141', '64', false, 2),
  ('10000000-0000-0000-0001-000000001414', '10000000-0000-0000-0001-000000000141', '32', false, 3);

-- Problem 5: Хувь
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000105',
  '10000000-0000-0000-0001-000000000001',
  5,
  'Асуулт 5',
  NULL,
  5
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000151', '10000000-0000-0000-0001-000000000105', '5', '100-ын 25% хэд вэ?', '100 × 25/100 = 100 × 0.25 = 25', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001511', '10000000-0000-0000-0001-000000000151', '25', true, 0),
  ('10000000-0000-0000-0001-000000001512', '10000000-0000-0000-0001-000000000151', '20', false, 1),
  ('10000000-0000-0000-0001-000000001513', '10000000-0000-0000-0001-000000000151', '30', false, 2),
  ('10000000-0000-0000-0001-000000001514', '10000000-0000-0000-0001-000000000151', '50', false, 3);

-- Problem 6: Арифметик прогресс
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000106',
  '10000000-0000-0000-0001-000000000001',
  6,
  'Асуулт 6',
  NULL,
  6
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000161', '10000000-0000-0000-0001-000000000106', '6', '2, 5, 8, 11, ... дарааллын 5 дахь гишүүн хэд вэ?', 'a₁=2, d=3, a₅ = a₁ + 4d = 2 + 4×3 = 2 + 12 = 14', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001611', '10000000-0000-0000-0001-000000000161', '14', true, 0),
  ('10000000-0000-0000-0001-000000001612', '10000000-0000-0000-0001-000000000161', '13', false, 1),
  ('10000000-0000-0000-0001-000000001613', '10000000-0000-0000-0001-000000000161', '15', false, 2),
  ('10000000-0000-0000-0001-000000001614', '10000000-0000-0000-0001-000000000161', '17', false, 3);

-- Problem 7: Тэгшитгэл систем
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000107',
  '10000000-0000-0000-0001-000000000001',
  7,
  'Асуулт 7',
  NULL,
  7
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000171', '10000000-0000-0000-0001-000000000107', '7', 'x + y = 10 ба x - y = 2 бол x хэд вэ?', 'Нэмэхэд: 2x = 12, x = 6', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001711', '10000000-0000-0000-0001-000000000171', '6', true, 0),
  ('10000000-0000-0000-0001-000000001712', '10000000-0000-0000-0001-000000000171', '4', false, 1),
  ('10000000-0000-0000-0001-000000001713', '10000000-0000-0000-0001-000000000171', '8', false, 2),
  ('10000000-0000-0000-0001-000000001714', '10000000-0000-0000-0001-000000000171', '5', false, 3);

-- Problem 8: Тойргийн талбай
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000108',
  '10000000-0000-0000-0001-000000000001',
  8,
  'Асуулт 8',
  NULL,
  8
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000181', '10000000-0000-0000-0001-000000000108', '8', 'Радиус r=5 тойргийн талбай S хэд вэ? (π ≈ 3)', 'S = πr² = 3 × 5² = 3 × 25 = 75', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001811', '10000000-0000-0000-0001-000000000181', '75', true, 0),
  ('10000000-0000-0000-0001-000000001812', '10000000-0000-0000-0001-000000000181', '50', false, 1),
  ('10000000-0000-0000-0001-000000001813', '10000000-0000-0000-0001-000000000181', '100', false, 2),
  ('10000000-0000-0000-0001-000000001814', '10000000-0000-0000-0001-000000000181', '25', false, 3);

-- Problem 9: Бутархай
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000109',
  '10000000-0000-0000-0001-000000000001',
  9,
  'Асуулт 9',
  NULL,
  9
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000191', '10000000-0000-0000-0001-000000000109', '9', '3/4 + 1/2 = ?', '3/4 + 2/4 = 5/4', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000001911', '10000000-0000-0000-0001-000000000191', '5/4', true, 0),
  ('10000000-0000-0000-0001-000000001912', '10000000-0000-0000-0001-000000000191', '4/6', false, 1),
  ('10000000-0000-0000-0001-000000001913', '10000000-0000-0000-0001-000000000191', '1', false, 2),
  ('10000000-0000-0000-0001-000000001914', '10000000-0000-0000-0001-000000000191', '3/2', false, 3);

-- Problem 10: Үржвэр задлах
INSERT INTO mock_test_problems (id, section_id, problem_number, title, context, order_index)
VALUES (
  '10000000-0000-0000-0001-000000000110',
  '10000000-0000-0000-0001-000000000001',
  10,
  'Асуулт 10',
  NULL,
  10
);

INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES
  ('10000000-0000-0000-0001-000000000201', '10000000-0000-0000-0001-000000000110', '10', '(x + 3)(x - 3) = ?', 'Ялгаврын квадрат: a² - b² = (a+b)(a-b), иймээс x² - 9', 10, 1);

INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('10000000-0000-0000-0001-000000002011', '10000000-0000-0000-0001-000000000201', 'x² - 9', true, 0),
  ('10000000-0000-0000-0001-000000002012', '10000000-0000-0000-0001-000000000201', 'x² + 9', false, 1),
  ('10000000-0000-0000-0001-000000002013', '10000000-0000-0000-0001-000000000201', 'x² - 6x + 9', false, 2),
  ('10000000-0000-0000-0001-000000002014', '10000000-0000-0000-0001-000000000201', 'x² + 6x - 9', false, 3);
