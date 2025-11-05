-- =====================================================
-- SEED DATA: Quiz Questions and Options
-- =====================================================
-- Run this after 002_seed_lessons.sql
-- Creates quiz questions for quiz-type lessons

-- =====================================================
-- Basic Geometry and Measurement - Geometry Basics Quiz
-- =====================================================
DO $$
DECLARE
  lesson_uuid UUID;
  question1_uuid UUID;
  question2_uuid UUID;
  question3_uuid UUID;
  question4_uuid UUID;
  question5_uuid UUID;
BEGIN
  -- Get the lesson ID for "Geometry Basics Quiz"
  SELECT l.id INTO lesson_uuid
  FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.slug = 'basic-geometry-and-measurement'
    AND l.slug = 'geometry-basics-quiz';

  IF lesson_uuid IS NOT NULL THEN
    -- Question 1: Sum of angles in a triangle
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'What is the sum of angles in a triangle?',
      'The sum of all interior angles in any triangle is always 180°.',
      1,
      20
    ) RETURNING id INTO question1_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question1_uuid, '90°', false, 0),
      (question1_uuid, '180°', true, 1),
      (question1_uuid, '270°', false, 2),
      (question1_uuid, '360°', false, 3);

    -- Question 2: Tool to measure angles
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'Which tool is used to measure angles?',
      'A protractor is specifically designed to measure angles in degrees.',
      2,
      20
    ) RETURNING id INTO question2_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question2_uuid, 'Ruler', false, 0),
      (question2_uuid, 'Compass', false, 1),
      (question2_uuid, 'Protractor', true, 2),
      (question2_uuid, 'Set Square', false, 3);

    -- Question 3: Value of π
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'What is the value of π (pi) approximately?',
      'Pi (π) is approximately 3.14159, commonly rounded to 3.14.',
      3,
      20
    ) RETURNING id INTO question3_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question3_uuid, '2.14', false, 0),
      (question3_uuid, '3.14', true, 1),
      (question3_uuid, '4.14', false, 2),
      (question3_uuid, '5.14', false, 3);

    -- Question 4: Hexagon sides
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'How many sides does a hexagon have?',
      'A hexagon is a polygon with six sides and six angles.',
      4,
      20
    ) RETURNING id INTO question4_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question4_uuid, '4', false, 0),
      (question4_uuid, '5', false, 1),
      (question4_uuid, '6', true, 2),
      (question4_uuid, '7', false, 3);

    -- Question 5: Rectangle area formula
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'What is the area formula for a rectangle?',
      'The area of a rectangle is calculated by multiplying its length by its width.',
      5,
      20
    ) RETURNING id INTO question5_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question5_uuid, 'length × width', true, 0),
      (question5_uuid, '2 × (length + width)', false, 1),
      (question5_uuid, 'length + width', false, 2),
      (question5_uuid, 'length² + width²', false, 3);
  END IF;
END $$;

-- =====================================================
-- Introduction to Algebra - Equation Practice Quiz
-- =====================================================
DO $$
DECLARE
  lesson_uuid UUID;
  question1_uuid UUID;
  question2_uuid UUID;
  question3_uuid UUID;
BEGIN
  -- Get the lesson ID for "Equation Practice Quiz"
  SELECT l.id INTO lesson_uuid
  FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.slug = 'introduction-to-algebra'
    AND l.slug = 'equation-practice-quiz';

  IF lesson_uuid IS NOT NULL THEN
    -- Question 1: Solve for x
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'Solve for x: 2x + 5 = 13',
      'Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4.',
      1,
      30
    ) RETURNING id INTO question1_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question1_uuid, 'x = 3', false, 0),
      (question1_uuid, 'x = 4', true, 1),
      (question1_uuid, 'x = 5', false, 2),
      (question1_uuid, 'x = 6', false, 3);

    -- Question 2: PEMDAS
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'What does PEMDAS stand for?',
      'PEMDAS is the order of operations: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction.',
      2,
      30
    ) RETURNING id INTO question2_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question2_uuid, 'Please Excuse My Dear Aunt Sally', true, 0),
      (question2_uuid, 'Please Enter My Data And Save', false, 1),
      (question2_uuid, 'Perfect Equations Make Dreams A Success', false, 2),
      (question2_uuid, 'Practice Every Math Day And Study', false, 3);

    -- Question 3: Linear equation
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'Which is a linear equation?',
      'A linear equation has variables raised to the first power only. y = 2x + 3 is linear.',
      3,
      30
    ) RETURNING id INTO question3_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question3_uuid, 'y = x²', false, 0),
      (question3_uuid, 'y = 2x + 3', true, 1),
      (question3_uuid, 'y = 1/x', false, 2),
      (question3_uuid, 'y = √x', false, 3);
  END IF;
END $$;

-- =====================================================
-- Advanced Calculus - Derivatives Quiz
-- =====================================================
DO $$
DECLARE
  lesson_uuid UUID;
  question1_uuid UUID;
  question2_uuid UUID;
BEGIN
  -- Get the lesson ID for "Derivatives Quiz"
  SELECT l.id INTO lesson_uuid
  FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.slug = 'advanced-calculus'
    AND l.slug = 'derivatives-quiz';

  IF lesson_uuid IS NOT NULL THEN
    -- Question 1: Derivative of constant
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'What is the derivative of a constant?',
      'The derivative of any constant is always 0, since constants do not change.',
      1,
      40
    ) RETURNING id INTO question1_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question1_uuid, '0', true, 0),
      (question1_uuid, '1', false, 1),
      (question1_uuid, 'The constant itself', false, 2),
      (question1_uuid, 'Undefined', false, 3);

    -- Question 2: Power rule
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'Using the power rule, what is the derivative of x³?',
      'The power rule states: d/dx(xⁿ) = n·xⁿ⁻¹. So d/dx(x³) = 3x².',
      2,
      40
    ) RETURNING id INTO question2_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question2_uuid, 'x²', false, 0),
      (question2_uuid, '3x²', true, 1),
      (question2_uuid, '3x³', false, 2),
      (question2_uuid, 'x³/3', false, 3);
  END IF;
END $$;

-- =====================================================
-- Statistics Essentials - Probability Quiz
-- =====================================================
DO $$
DECLARE
  lesson_uuid UUID;
  question1_uuid UUID;
  question2_uuid UUID;
  question3_uuid UUID;
BEGIN
  -- Get the lesson ID for "Probability Quiz"
  SELECT l.id INTO lesson_uuid
  FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.slug = 'statistics-essentials'
    AND l.slug = 'probability-quiz';

  IF lesson_uuid IS NOT NULL THEN
    -- Question 1: Coin flip
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'What is the probability of flipping a coin and getting heads?',
      'A fair coin has two equally likely outcomes: heads or tails. Probability = 1/2 = 0.5 or 50%.',
      1,
      30
    ) RETURNING id INTO question1_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question1_uuid, '0.25 or 25%', false, 0),
      (question1_uuid, '0.5 or 50%', true, 1),
      (question1_uuid, '0.75 or 75%', false, 2),
      (question1_uuid, '1.0 or 100%', false, 3);

    -- Question 2: Dice roll
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'What is the probability of rolling a 6 on a standard die?',
      'A standard die has 6 faces, each equally likely. Probability of any single number = 1/6 ≈ 0.167.',
      2,
      30
    ) RETURNING id INTO question2_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question2_uuid, '1/12', false, 0),
      (question2_uuid, '1/6', true, 1),
      (question2_uuid, '1/3', false, 2),
      (question2_uuid, '1/2', false, 3);

    -- Question 3: Independent events
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'Which events are independent?',
      'Independent events are when one outcome does not affect the other. Flipping two separate coins are independent events.',
      3,
      30
    ) RETURNING id INTO question3_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question3_uuid, 'Drawing two cards without replacement', false, 0),
      (question3_uuid, 'Flipping two separate coins', true, 1),
      (question3_uuid, 'Picking two marbles from a bag without replacement', false, 2),
      (question3_uuid, 'The weather today and tomorrow', false, 3);
  END IF;
END $$;

-- =====================================================
-- Математикийн үндэс - Эцсийн шалгалт (Final Quiz)
-- =====================================================
DO $$
DECLARE
  lesson_uuid UUID;
  question1_uuid UUID;
  question2_uuid UUID;
BEGIN
  -- Get the lesson ID for "Эцсийн шалгалт"
  SELECT l.id INTO lesson_uuid
  FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.slug = 'matematikiin-undes'
    AND l.slug = 'etsiin-shalgalt';

  IF lesson_uuid IS NOT NULL THEN
    -- Question 1: Бутархай
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      '1/2 + 1/4 = ?',
      '1/2 = 2/4 тул 2/4 + 1/4 = 3/4',
      1,
      40
    ) RETURNING id INTO question1_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question1_uuid, '2/6', false, 0),
      (question1_uuid, '3/4', true, 1),
      (question1_uuid, '1/3', false, 2),
      (question1_uuid, '2/4', false, 3);

    -- Question 2: Хувь
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      '100-ын 25% нь хэд вэ?',
      '25% = 25/100 = 0.25, тиймээс 100 × 0.25 = 25',
      2,
      40
    ) RETURNING id INTO question2_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question2_uuid, '20', false, 0),
      (question2_uuid, '25', true, 1),
      (question2_uuid, '30', false, 2),
      (question2_uuid, '50', false, 3);
  END IF;
END $$;

-- =====================================================
-- English Grammar Fundamentals - Grammar Practice Test
-- =====================================================
DO $$
DECLARE
  lesson_uuid UUID;
  question1_uuid UUID;
  question2_uuid UUID;
  question3_uuid UUID;
BEGIN
  -- Get the lesson ID for "Grammar Practice Test"
  SELECT l.id INTO lesson_uuid
  FROM lessons l
  INNER JOIN courses c ON l.course_id = c.id
  WHERE c.slug = 'english-grammar-fundamentals'
    AND l.slug = 'grammar-practice-test';

  IF lesson_uuid IS NOT NULL THEN
    -- Question 1: Parts of speech
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'What part of speech is the word "quickly"?',
      'Words ending in -ly that describe how an action is performed are typically adverbs.',
      1,
      30
    ) RETURNING id INTO question1_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question1_uuid, 'Noun', false, 0),
      (question1_uuid, 'Verb', false, 1),
      (question1_uuid, 'Adjective', false, 2),
      (question1_uuid, 'Adverb', true, 3);

    -- Question 2: Verb tense
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'Which sentence uses the present perfect tense?',
      'Present perfect uses "have/has + past participle" to describe actions that started in the past and continue to the present.',
      2,
      30
    ) RETURNING id INTO question2_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question2_uuid, 'I eat breakfast', false, 0),
      (question2_uuid, 'I ate breakfast', false, 1),
      (question2_uuid, 'I have eaten breakfast', true, 2),
      (question2_uuid, 'I will eat breakfast', false, 3);

    -- Question 3: Subject-verb agreement
    INSERT INTO quiz_questions (lesson_id, question, explanation, order_index, points)
    VALUES (
      lesson_uuid,
      'Which sentence is grammatically correct?',
      'Plural subject "students" requires plural verb "are". Singular "student" would use "is".',
      3,
      30
    ) RETURNING id INTO question3_uuid;

    INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
      (question3_uuid, 'The students is studying', false, 0),
      (question3_uuid, 'The students are studying', true, 1),
      (question3_uuid, 'The students was studying', false, 2),
      (question3_uuid, 'The students been studying', false, 3);
  END IF;
END $$;
