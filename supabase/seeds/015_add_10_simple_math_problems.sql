-- ================================================
-- Add 4 Big Multi-Part Problems to Existing Test
-- ================================================
-- Adds 4 big multi-part problems to the existing 10 standalone questions
-- Existing: 10 simple problems (order_index 1-10)
-- Adding: 4 big problems with sub-questions (order_index 11-14)
-- New total: 10 (standalone) + 9 (from 4 big problems) = 19 questions

-- Update the total_questions count and time limit
UPDATE mock_tests
SET
  total_questions = 19,
  time_limit_minutes = 90,
  description = 'ЭЕШ-ийн математикийн 19 асуулт бүхий 90 минутын тест'
WHERE id = '10000000-0000-0000-0000-000000000001';

-- Problem 11: Квадрат тэгшитгэл (3 sub-questions)
WITH new_problem AS (
  INSERT INTO mock_test_problems (section_id, problem_number, title, context, order_index)
  VALUES (
    '10000000-0000-0000-0001-000000000001',
    11,
    'Асуулт 11: Квадрат тэгшитгэл',
    'Дараах квадрат тэгшитгэлүүдийг бод',
    11
  )
  RETURNING id
),
question_a AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'a', 'x² + 6x + 9 = 0 тэгшитгэлийг шийд', '(x + 3)² = 0, иймээс x = -3', 10, 1
  FROM new_problem
  RETURNING id
),
question_b AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'b', 'x² - 4 = 0 тэгшитгэлийг шийд', 'x² = 4, иймээс x = ±2', 10, 2
  FROM new_problem
  RETURNING id
),
question_c AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'c', '2x² - 8 = 0 тэгшитгэлийг шийд', '2x² = 8, x² = 4, иймээс x = ±2', 10, 3
  FROM new_problem
  RETURNING id
),
options_a AS (
  INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
  SELECT id, 'x = -3', true, 0 FROM question_a
  UNION ALL SELECT id, 'x = 3', false, 1 FROM question_a
  UNION ALL SELECT id, 'x = ±3', false, 2 FROM question_a
  UNION ALL SELECT id, 'Язгуургүй', false, 3 FROM question_a
  RETURNING id
),
options_b AS (
  INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
  SELECT id, 'x = ±2', true, 0 FROM question_b
  UNION ALL SELECT id, 'x = 2', false, 1 FROM question_b
  UNION ALL SELECT id, 'x = -2', false, 2 FROM question_b
  UNION ALL SELECT id, 'x = ±4', false, 3 FROM question_b
  RETURNING id
)
INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
SELECT id, 'x = ±2', true, 0 FROM question_c
UNION ALL SELECT id, 'x = ±4', false, 1 FROM question_c
UNION ALL SELECT id, 'x = 2', false, 2 FROM question_c
UNION ALL SELECT id, 'x = 4', false, 3 FROM question_c;

-- Problem 12: Хуваалт (2 sub-questions)
WITH new_problem AS (
  INSERT INTO mock_test_problems (section_id, problem_number, title, context, order_index)
  VALUES (
    '10000000-0000-0000-0001-000000000001',
    12,
    'Асуулт 12: Хуваалт',
    'Дараах тоонуудыг хуваахад үлдэгдлийг ол',
    12
  )
  RETURNING id
),
question_a AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'a', '48-г 6-д хуваахад үлдэгдэл хэд болох вэ?', '48 ÷ 6 = 8, үлдэгдэл 0', 10, 1
  FROM new_problem
  RETURNING id
),
question_b AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'b', '50-г 7-д хуваахад үлдэгдэл хэд болох вэ?', '50 ÷ 7 = 7 үлдэгдэл 1', 10, 2
  FROM new_problem
  RETURNING id
),
options_a AS (
  INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
  SELECT id, '0', true, 0 FROM question_a
  UNION ALL SELECT id, '2', false, 1 FROM question_a
  UNION ALL SELECT id, '6', false, 2 FROM question_a
  UNION ALL SELECT id, '8', false, 3 FROM question_a
  RETURNING id
)
INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
SELECT id, '1', true, 0 FROM question_b
UNION ALL SELECT id, '0', false, 1 FROM question_b
UNION ALL SELECT id, '7', false, 2 FROM question_b
UNION ALL SELECT id, '3', false, 3 FROM question_b;

-- Problem 13: Анхны тоо (2 sub-questions)
WITH new_problem AS (
  INSERT INTO mock_test_problems (section_id, problem_number, title, context, order_index)
  VALUES (
    '10000000-0000-0000-0001-000000000001',
    13,
    'Асуулт 13: Анхны тоо',
    'Анхны тоотой холбоотой асуултууд',
    13
  )
  RETURNING id
),
question_a AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'a', '1-ээс 10 хүртэл анхны тоо хэд байна?', 'Анхны тоонууд: 2, 3, 5, 7 = 4 тоо', 10, 1
  FROM new_problem
  RETURNING id
),
question_b AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'b', '11-20 хүртэл анхны тоо хэд байна?', 'Анхны тоонууд: 11, 13, 17, 19 = 4 тоо', 10, 2
  FROM new_problem
  RETURNING id
),
options_a AS (
  INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
  SELECT id, '4', true, 0 FROM question_a
  UNION ALL SELECT id, '5', false, 1 FROM question_a
  UNION ALL SELECT id, '3', false, 2 FROM question_a
  UNION ALL SELECT id, '6', false, 3 FROM question_a
  RETURNING id
)
INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
SELECT id, '4', true, 0 FROM question_b
UNION ALL SELECT id, '3', false, 1 FROM question_b
UNION ALL SELECT id, '5', false, 2 FROM question_b
UNION ALL SELECT id, '6', false, 3 FROM question_b;

-- Problem 14: Дундаж (2 sub-questions)
WITH new_problem AS (
  INSERT INTO mock_test_problems (section_id, problem_number, title, context, order_index)
  VALUES (
    '10000000-0000-0000-0001-000000000001',
    14,
    'Асуулт 14: Дундаж',
    'Дараах тоонуудын дундаж утгыг ол',
    14
  )
  RETURNING id
),
question_a AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'a', '10, 20, 30, 40, 50 тоонуудын дундаж хэд вэ?', '(10 + 20 + 30 + 40 + 50) / 5 = 150 / 5 = 30', 10, 1
  FROM new_problem
  RETURNING id
),
question_b AS (
  INSERT INTO mock_test_questions (problem_id, question_number, question_text, explanation, points, order_index)
  SELECT id, 'b', '5, 10, 15 тоонуудын дундаж хэд вэ?', '(5 + 10 + 15) / 3 = 30 / 3 = 10', 10, 2
  FROM new_problem
  RETURNING id
),
options_a AS (
  INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
  SELECT id, '30', true, 0 FROM question_a
  UNION ALL SELECT id, '25', false, 1 FROM question_a
  UNION ALL SELECT id, '35', false, 2 FROM question_a
  UNION ALL SELECT id, '20', false, 3 FROM question_a
  RETURNING id
)
INSERT INTO mock_test_options (question_id, option_text, is_correct, order_index)
SELECT id, '10', true, 0 FROM question_b
UNION ALL SELECT id, '15', false, 1 FROM question_b
UNION ALL SELECT id, '5', false, 2 FROM question_b
UNION ALL SELECT id, '12', false, 3 FROM question_b;
