-- Seed: Standalone Quizzes for Quiz Builder
-- Description: Creates sample standalone quizzes that can be attached to lessons/units
-- Dependencies: Requires 051_create_standalone_quizzes.sql migration

-- =====================================================
-- SAMPLE STANDALONE QUIZZES
-- =====================================================

-- Quiz 1: Алгебрийн үндэс
DO $$
DECLARE
  quiz_uuid UUID;
  q_uuid UUID;
BEGIN
  INSERT INTO quizzes (title, description)
  VALUES ('Алгебрийн үндэс', 'Алгебрийн суурь ойлголтуудыг шалгах шалгалт')
  RETURNING id INTO quiz_uuid;

  -- Q1
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'Дараах тэгшитгэлийг бод: 2x + 5 = 13',
  'Эхлээд 5-ыг баруун тал руу шилжүүлнэ: 2x = 8, дараа нь хоёр талыг 2-т хувааж x = 4', 0, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'x = 4', true, 0), (q_uuid, 'x = 6', false, 1), (q_uuid, 'x = 8', false, 2), (q_uuid, 'x = 9', false, 3);

  -- Q2
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, '3(x - 2) = 15 тэгшитгэлийг бод',
  'Эхлээд хаалтыг задална: 3x - 6 = 15. Дараа нь 3x = 21, x = 7', 1, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'x = 5', false, 0), (q_uuid, 'x = 7', true, 1), (q_uuid, 'x = 9', false, 2), (q_uuid, 'x = 11', false, 3);

  -- Q3
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'x/4 + 3 = 7 тэгшитгэлийг бод',
  'x/4 = 4, тиймээс x = 16', 2, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'x = 12', false, 0), (q_uuid, 'x = 16', true, 1), (q_uuid, 'x = 20', false, 2), (q_uuid, 'x = 28', false, 3);

  -- Q4
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, '5x - 2 = 3x + 8 тэгшитгэлийг бод',
  '5x - 3x = 8 + 2, 2x = 10, x = 5', 3, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'x = 3', false, 0), (q_uuid, 'x = 5', true, 1), (q_uuid, 'x = 7', false, 2), (q_uuid, 'x = 10', false, 3);

  RAISE NOTICE 'Created quiz: Алгебрийн үндэс with ID %', quiz_uuid;
END $$;

-- Quiz 2: Геометрийн үндэс
DO $$
DECLARE
  quiz_uuid UUID;
  q_uuid UUID;
BEGIN
  INSERT INTO quizzes (title, description)
  VALUES ('Геометрийн үндэс', 'Геометрийн суурь ойлголтуудыг шалгах шалгалт')
  RETURNING id INTO quiz_uuid;

  -- Q1
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'Гурвалжны өнцгүүдийн нийлбэр хэд градус вэ?',
  'Ямар ч гурвалжны дотоод өнцгүүдийн нийлбэр үргэлж 180° байна.', 0, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, '90°', false, 0), (q_uuid, '180°', true, 1), (q_uuid, '270°', false, 2), (q_uuid, '360°', false, 3);

  -- Q2
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'Зөв өнцөгт гурвалжны хувьд a² + b² = c² нь ямар теорем вэ?',
  'Энэ бол Пифагорын теорем юм.', 1, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'Евклидийн теорем', false, 0), (q_uuid, 'Пифагорын теорем', true, 1), (q_uuid, 'Фалесын теорем', false, 2), (q_uuid, 'Кординатын теорем', false, 3);

  -- Q3
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'Суурь нь 8 см, өндөр нь 5 см гурвалжны талбайг ол',
  'S = (суурь × өндөр) / 2 = (8 × 5) / 2 = 20 см²', 2, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, '13 см²', false, 0), (q_uuid, '20 см²', true, 1), (q_uuid, '40 см²', false, 2), (q_uuid, '80 см²', false, 3);

  -- Q4
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'Зөв өнцөгт гурвалжны катетууд 3 ба 4 бол гипотенуз хэд вэ?',
  'c² = 3² + 4² = 9 + 16 = 25, тиймээс c = 5', 3, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, '5', true, 0), (q_uuid, '7', false, 1), (q_uuid, '12', false, 2), (q_uuid, '25', false, 3);

  -- Q5
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'Тэнцүү хажуут гурвалжны хоёр өнцөг 50° бол гуравдахь өнцөг хэд вэ?',
  'Нийлбэр 180°: 50° + 50° + x = 180°, x = 80°', 4, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, '60°', false, 0), (q_uuid, '70°', false, 1), (q_uuid, '80°', true, 2), (q_uuid, '100°', false, 3);

  RAISE NOTICE 'Created quiz: Геометрийн үндэс with ID %', quiz_uuid;
END $$;

-- Quiz 3: Квадрат тэгшитгэл
DO $$
DECLARE
  quiz_uuid UUID;
  q_uuid UUID;
BEGIN
  INSERT INTO quizzes (title, description)
  VALUES ('Квадрат тэгшитгэл', 'Квадрат тэгшитгэлийн бодлогууд')
  RETURNING id INTO quiz_uuid;

  -- Q1
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'x² - 5x + 6 = 0 тэгшитгэлийг үржигдэхүүнд задал',
  '(x - 2)(x - 3) = 0, тиймээс x = 2 эсвэл x = 3', 0, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, '(x-2)(x-3)', true, 0), (q_uuid, '(x-1)(x-6)', false, 1), (q_uuid, '(x+2)(x+3)', false, 2), (q_uuid, '(x-5)(x-1)', false, 3);

  -- Q2
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'x² - 9 = 0 тэгшитгэлийг бод',
  'x² = 9, x = ±3', 1, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'x = 3', false, 0), (q_uuid, 'x = ±3', true, 1), (q_uuid, 'x = 9', false, 2), (q_uuid, 'x = ±9', false, 3);

  -- Q3
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'x² + 4x + 4 = 0 тэгшитгэлийг бод',
  '(x + 2)² = 0, x = -2 (давхар язгуур)', 2, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'x = -2', true, 0), (q_uuid, 'x = 2', false, 1), (q_uuid, 'x = ±2', false, 2), (q_uuid, 'x = 4', false, 3);

  RAISE NOTICE 'Created quiz: Квадрат тэгшитгэл with ID %', quiz_uuid;
END $$;

-- Quiz 4: Физикийн кинематик
DO $$
DECLARE
  quiz_uuid UUID;
  q_uuid UUID;
BEGIN
  INSERT INTO quizzes (title, description)
  VALUES ('Физикийн кинематик', 'Кинематикийн үндсэн бодлогууд')
  RETURNING id INTO quiz_uuid;

  -- Q1
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, '10 м/с хурдтай хөдөлж буй автомашин 5 секундын дараа хаана байх вэ?',
  'Тэгш хурдтай хөдөлгөөнд: s = vt = 10 × 5 = 50 метр', 0, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, '15 м', false, 0), (q_uuid, '50 м', true, 1), (q_uuid, '100 м', false, 2), (q_uuid, '150 м', false, 3);

  -- Q2
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'Биеийн хурд 5 м/с-аас 15 м/с болтол 2 секундэд өссөн бол хурдатгал хэд вэ?',
  'a = Δv/Δt = (15-5)/2 = 5 м/с²', 1, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, '2.5 м/с²', false, 0), (q_uuid, '5 м/с²', true, 1), (q_uuid, '10 м/с²', false, 2), (q_uuid, '20 м/с²', false, 3);

  -- Q3
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'Чөлөөт унах хөдөлгөөнд хурдатгал (g) хэд вэ?',
  'Дэлхийн таталцлын хурдатгал g ≈ 9.8 м/с²', 2, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, '5 м/с²', false, 0), (q_uuid, '9.8 м/с²', true, 1), (q_uuid, '15 м/с²', false, 2), (q_uuid, '20 м/с²', false, 3);

  RAISE NOTICE 'Created quiz: Физикийн кинематик with ID %', quiz_uuid;
END $$;

-- Quiz 5: Англи хэлний дүрэм
DO $$
DECLARE
  quiz_uuid UUID;
  q_uuid UUID;
BEGIN
  INSERT INTO quizzes (title, description)
  VALUES ('Англи хэлний дүрэм', 'Англи хэлний үндсэн дүрмийн шалгалт')
  RETURNING id INTO quiz_uuid;

  -- Q1
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'She ___ to school every day.',
  'Present Simple: үргэлжилж буй үйл явдалд хэрэглэнэ. He/She/It-д -s нэмнэ.', 0, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'go', false, 0), (q_uuid, 'goes', true, 1), (q_uuid, 'going', false, 2), (q_uuid, 'gone', false, 3);

  -- Q2
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'If I ___ rich, I would travel the world.',
  'Second Conditional: If + Past Simple, would + V₁', 1, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'am', false, 0), (q_uuid, 'was', false, 1), (q_uuid, 'were', true, 2), (q_uuid, 'will be', false, 3);

  -- Q3
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'They ___ TV when I arrived. (Past Continuous)',
  'Past Continuous: was/were + V-ing. They (мн.тоо) тул were.', 2, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'watch', false, 0), (q_uuid, 'watched', false, 1), (q_uuid, 'were watching', true, 2), (q_uuid, 'have watched', false, 3);

  -- Q4
  INSERT INTO quiz_questions (quiz_id, question, explanation, order_index, points)
  VALUES (quiz_uuid, 'I have ___ finished my homework.',
  'Present Perfect-д already/just/ever/never зэрэг үг хэрэглэгдэнэ.', 3, 10)
  RETURNING id INTO q_uuid;
  INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
  (q_uuid, 'yet', false, 0), (q_uuid, 'already', true, 1), (q_uuid, 'ago', false, 2), (q_uuid, 'yesterday', false, 3);

  RAISE NOTICE 'Created quiz: Англи хэлний дүрэм with ID %', quiz_uuid;
END $$;

-- Log completion
DO $$
DECLARE
  quiz_count INTEGER;
  question_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO quiz_count FROM quizzes;
  SELECT COUNT(*) INTO question_count FROM quiz_questions WHERE quiz_id IS NOT NULL;
  RAISE NOTICE 'Successfully seeded % standalone quizzes with % questions', quiz_count, question_count;
END $$;
