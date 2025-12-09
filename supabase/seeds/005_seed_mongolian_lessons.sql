-- Seed: Mongolian ЭЕШ Lessons
-- Description: Creates 100+ lessons across 10 Mongolian courses
-- Dependencies: Requires courses seeded from 004_seed_mongolian_courses.sql

-- Delete existing lessons
DELETE FROM lessons;

-- =====================================================
-- МАТЕМАТИК - АЛГЕБР (14 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Математик - Алгебр';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Алгебрын танилцуулга', 'Алгебрын үндсэн ойлголт, хувьсагч, илэрхийлэл', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
  (course_id_var, 'Нэг хувьсагчтай тэгшитгэл', 'Нэг хувьсагчтай шугаман тэгшитгэл бодох арга', 'Тэгшитгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 2, 'video', true),
  (course_id_var, 'Тэгшитгэлийн практик дасгал', 'Тэгшитгэл бодох дасгалууд', 'Тэгшитгэл', NULL, 600, 3, 'quiz', false),
  (course_id_var, 'Тэгшитгэлийн систем', 'Хоёр ба гурван тэнхлэгт тэгшитгэлийн систем', 'Тэгшитгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 4, 'video', false),
  (course_id_var, 'Функцийн ойлголт', 'Функц гэж юу вэ? Функцийн утга олох', 'Функц', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 5, 'video', false),
  (course_id_var, 'Шугаман функц', 'y = kx + b хэлбэрийн функц, график зурах', 'Функц', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 6, 'video', false),
  (course_id_var, 'График дээрх дасгал', 'График зурах, уншиж тайлбарлах дасгалууд', 'Функц', NULL, 720, 7, 'quiz', false),
  (course_id_var, 'Квадрат тэгшитгэл', 'ax² + bx + c = 0 хэлбэрийн тэгшитгэл', 'Квадрат тэгшитгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 8, 'video', false),
  (course_id_var, 'Квадрат тэгшитгэл бодох аргууд', 'Үржигдэхүүнд задлах, томъёо ашиглах', 'Квадрат тэгшитгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 9, 'video', false),
  (course_id_var, 'Квадрат функцийн график', 'Параболын график, орой цэг олох', 'Квадрат тэгшитгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 10, 'video', false),
  (course_id_var, 'Квадрат тэгшитгэлийн тест', 'Квадрат тэгшитгэл бодох чадвар шалгах', 'Квадрат тэгшитгэл', NULL, 900, 11, 'quiz', false),
  (course_id_var, 'Тэнцэтгэл биш', 'Тэнцэтгэл биш бодох, график дээр дүрслэх', 'Тэнцэтгэл биш', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 12, 'video', false),
  (course_id_var, 'ЭЕШ-ийн жишээ бодлогууд', 'ЭЕШ-ийн алгебрын асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 13, 'video', false),
  (course_id_var, 'Эцсийн шалгалт', 'Алгебрын бүхий л хэсгийг хамарсан тест', 'Бэхжүүлэлт', NULL, 1800, 14, 'quiz', false);
END $$;

-- =====================================================
-- МАТЕМАТИК - ГЕОМЕТР (15 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Математик - Геометр';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Геометрын үндэс', 'Цэг, шугам, хавтгай гэсэн үндсэн ойлголтууд', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 660, 1, 'video', true),
  (course_id_var, 'Өнцөг ба төрлүүд', 'Хурц өнцөг, мохоо өнцөг, зөв өнцөг', 'Хавтгай геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 2, 'video', true),
  (course_id_var, 'Гурвалжин', 'Гурвалжны төрөл, талууд ба өнцгүүд', 'Хавтгай геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 3, 'video', false),
  (course_id_var, 'Пифагорын теорем', 'Зөв өнцөгт гурвалжны шинж чанар', 'Хавтгай геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 4, 'video', false),
  (course_id_var, 'Гурвалжны дасгал', 'Гурвалжны талбай, периметр олох', 'Хавтгай геометр', NULL, 720, 5, 'quiz', false),
  (course_id_var, 'Дөрвөлжин', 'Квадрат, тэгш өнцөгт, ромб, параллелограмм', 'Хавтгай геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 6, 'video', false),
  (course_id_var, 'Тойрог', 'Тойргийн радиус, диаметр, урт, талбай', 'Хавтгай геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 7, 'video', false),
  (course_id_var, 'Хавтгай геометрын тест', 'Хавтгай геометрын нийт асуудлууд', 'Хавтгай геометр', NULL, 900, 8, 'quiz', false),
  (course_id_var, 'Огторгуйн геометр танилцуулга', 'Гурван хэмжээст орон зай', 'Огторгуй геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 9, 'video', false),
  (course_id_var, 'Шоо', 'Шооны эзлэхүүн ба гадаргуугийн талбай', 'Огторгуй геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 10, 'video', false),
  (course_id_var, 'Цилиндр', 'Цилиндрийн эзлэхүүн, талбай', 'Огторгуй геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 11, 'video', false),
  (course_id_var, 'Бөмбөрцөг', 'Бөмбөрцгийн эзлэхүүн ба гадаргуугийн талбай', 'Огторгуй геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 12, 'video', false),
  (course_id_var, 'Огторгуйн тест', 'Огторгуйн биетүүдийн дасгал', 'Огторгуй геометр', NULL, 960, 13, 'quiz', false),
  (course_id_var, 'ЭЕШ-ийн геометр', 'ЭЕШ-т гарч байсан геометрын асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 14, 'video', false),
  (course_id_var, 'Геометрын эцсийн шалгалт', 'Бүхий л хэсгийг хамарсан шалгалт', 'Бэхжүүлэлт', NULL, 1800, 15, 'quiz', false);
END $$;

-- =====================================================
-- МАТЕМАТИК - ТООНЫ ОНОЛ (12 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Математик - Тооны онол';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Тооны онол танилцуулга', 'Тооны онол гэж юу вэ? Түүхэн хөгжил', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
  (course_id_var, 'Хуваагдах', 'Хуваагдах ойлголт, хуваагчийн шинж', 'Хуваагдах', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 2, 'video', true),
  (course_id_var, 'Анхны тоо', 'Анхны тоо гэж юу вэ? Эратосфенийн шигшүүр', 'Хуваагдах', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 3, 'video', false),
  (course_id_var, 'ХИНХ ба ХБНХ', 'Хамгийн их нийтлэг хуваагч, хамгийн бага нийтлэг хуваагдагч', 'Хуваагдах', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 4, 'video', false),
  (course_id_var, 'Хуваагдахын тест', 'Хуваагдах, ХИНХ, ХБНХ-ын дасгалууд', 'Хуваагдах', NULL, 900, 5, 'quiz', false),
  (course_id_var, 'Модулийн арифметик', 'Үлдэгдлийн арифметик, конгруэнц', 'Модуль', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 6, 'video', false),
  (course_id_var, 'Модулийн тэгшитгэл', 'Модулиар тэгшитгэл бодох', 'Модуль', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 7, 'video', false),
  (course_id_var, 'Диофантын тэгшитгэл', 'Бүхэл шийдтэй шугаман тэгшитгэл', 'Модуль', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 8, 'video', false),
  (course_id_var, 'Модулийн дасгал', 'Модулийн арифметикийн практик', 'Модуль', NULL, 1080, 9, 'quiz', false),
  (course_id_var, 'Олимпиадын асуудлууд', 'Математикийн олимпиадад гарсан тооны онол', 'Нэмэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 10, 'video', false),
  (course_id_var, 'ЭЕШ-ийн тооны онол', 'ЭЕШ-т гардаг тооны онолын асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 11, 'video', false),
  (course_id_var, 'Тооны онолын эцсийн тест', 'Бүхий л сэдвийг хамарсан шалгалт', 'Бэхжүүлэлт', NULL, 1800, 12, 'quiz', false);
END $$;

-- =====================================================
-- МАТЕМАТИК - ТОХРОМОЛ БА СТАТИСТИК (10 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Математик - Тохромол ба Статистик';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Магадлал гэж юу вэ', 'Магадлалын үндсэн ойлголт, тохиолдол', 'Магадлал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
  (course_id_var, 'Магадлалын шинж чанар', 'Магадлалын аксиом, үйлдлүүд', 'Магадлал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 2, 'video', true),
  (course_id_var, 'Комбинаторик', 'Хослол, тэгшилгээ, орилогоо', 'Магадлал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 3, 'video', false),
  (course_id_var, 'Магадлалын дасгал', 'Магадлал тооцоох практик дасгалууд', 'Магадлал', NULL, 900, 4, 'quiz', false),
  (course_id_var, 'Статистикийн үндэс', 'Өгөгдөл цуглуулах, боловсруулах', 'Статистик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 5, 'video', false),
  (course_id_var, 'Дундаж үзүүлэлтүүд', 'Арифметик дундаж, медиан, мод', 'Статистик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 6, 'video', false),
  (course_id_var, 'Дисперси ба стандарт хазайлт', 'Өгөгдлийн тархалтын хэмжүүр', 'Статистик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 7, 'video', false),
  (course_id_var, 'Статистикийн график', 'Гистограмм, тариал диаграмм, график', 'Статистик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 8, 'video', false),
  (course_id_var, 'ЭЕШ-ийн статистик', 'ЭЕШ-т гардаг статистикийн асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 9, 'video', false),
  (course_id_var, 'Эцсийн шалгалт', 'Магадлал ба статистикийн нийт тест', 'Бэхжүүлэлт', NULL, 1500, 10, 'quiz', false);
END $$;

-- =====================================================
-- ФИЗИК - МЕХАНИК (13 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Физик - Механик';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Механик танилцуулга', 'Механик гэж юу вэ? Кинематик ба динамик', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 660, 1, 'video', true),
  (course_id_var, 'Хөдөлгөөн ба зай', 'Байрлал, зай, хөдөлгөөний хурд', 'Кинематик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 2, 'video', true),
  (course_id_var, 'Хурдатгал', 'Хурдатгалын ойлголт, тэгш хурдасгасан хөдөлгөөн', 'Кинематик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 3, 'video', false),
  (course_id_var, 'Чөлөөт унах хөдөлгөөн', 'Таталцлын хурдатгал, хөл хөдөлгөөн', 'Кинематик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 4, 'video', false),
  (course_id_var, 'Кинематикийн дасгал', 'Хурд, хурдатгал, зай тооцох дасгалууд', 'Кинематик', NULL, 900, 5, 'quiz', false),
  (course_id_var, 'Ньютоны эхний хууль', 'Инерцийн хууль', 'Динамик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 6, 'video', false),
  (course_id_var, 'Ньютоны хоёрдугаар хууль', 'F = ma, хүч ба хурдатгал', 'Динамик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 7, 'video', false),
  (course_id_var, 'Ньютоны гуравдугаар хууль', 'Үйлдэл ба эсрэг үйлдэлкүүлэл', 'Динамик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 8, 'video', false),
  (course_id_var, 'Ажил ба энерги', 'Механик ажил, кинетик болон потенциал энерги', 'Энерги', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 9, 'video', false),
  (course_id_var, 'Чадал', 'Чадлын ойлголт, нэгж', 'Энерги', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 10, 'video', false),
  (course_id_var, 'Импульс', 'Импульс ба импульсийн хадгалалтын хууль', 'Энерги', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 11, 'video', false),
  (course_id_var, 'ЭЕШ-ийн механик', 'ЭЕШ-т гардаг механикийн асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 12, 'video', false),
  (course_id_var, 'Механикийн эцсийн тест', 'Механикийн нийт сэдвийг хамарсан', 'Бэхжүүлэлт', NULL, 1800, 13, 'quiz', false);
END $$;

-- =====================================================
-- ФИЗИК - ЦАХИЛГААН БА СОРОНЗОН (12 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Физик - Цахилгаан ба Соронзон';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Цахилгааны орон', 'Цахилгааны цэнэг, цахилгааны орон', 'Цахилгаан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 1, 'video', true),
  (course_id_var, 'Потенциал ба хүчдэл', 'Цахилгааны потенциал, хүчдэлийн ялгавар', 'Цахилгаан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 2, 'video', true),
  (course_id_var, 'Цахилгааны гүйдэл', 'Гүйдэл гэж юу вэ? Гүйдлийн хурд', 'Цахилгааны хэлхээ', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 3, 'video', false),
  (course_id_var, 'Эсэргүүцэл', 'Эсэргүүцэл, дамжуулагч, тусгаарлагч', 'Цахилгааны хэлхээ', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 4, 'video', false),
  (course_id_var, 'Омын хууль', 'U = IR, хүчдэл, гүйдэл, эсэргүүцлийн хамаарал', 'Цахилгааны хэлхээ', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 5, 'video', false),
  (course_id_var, 'Цахилгааны хэлхээний дасгал', 'Хэлхээ бодох практик дасгалууд', 'Цахилгааны хэлхээ', NULL, 1080, 6, 'quiz', false),
  (course_id_var, 'Соронзон орон', 'Соронзон гэж юу вэ? Соронзон орон', 'Соронзон', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 7, 'video', false),
  (course_id_var, 'Цахилгаан соронзон индукц', 'Фарадейн хууль, индукцийн гүйдэл', 'Соронзон', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 8, 'video', false),
  (course_id_var, 'Соронзон орны дасгал', 'Соронзон орон тооцох дасгалууд', 'Соронзон', NULL, 960, 9, 'quiz', false),
  (course_id_var, 'Цахилгаан соронзон долгион', 'Долгионы шинж чанар, гэрлийн хурд', 'Долгион', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 10, 'video', false),
  (course_id_var, 'ЭЕШ-ийн цахилгаан', 'ЭЕШ-т гардаг цахилгааны асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 11, 'video', false),
  (course_id_var, 'Эцсийн шалгалт', 'Цахилгаан ба соронзоны нийт тест', 'Бэхжүүлэлт', NULL, 1800, 12, 'quiz', false);
END $$;

-- =====================================================
-- ФИЗИК - ДУЛААНЫ ФИЗИК (10 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Физик - Дулааны Физик';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Температур', 'Температур гэж юу вэ? Температурын хэмжүүр', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
  (course_id_var, 'Дулаан', 'Дулаан дамжилт, зөөлт, цацраг', 'Дулааны шилжилт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 2, 'video', true),
  (course_id_var, 'Дотоод энерги', 'Системийн дотоод энерги', 'Термодинамик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 3, 'video', false),
  (course_id_var, 'Термодинамикийн эхний хууль', 'Энергийн хадгалалтын хууль', 'Термодинамик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 4, 'video', false),
  (course_id_var, 'Термодинамикийн хоёрдугаар хууль', 'Энтропи, системийн эмх замбараагүй байдал', 'Термодинамик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 5, 'video', false),
  (course_id_var, 'Хийн хуулиуд', 'Бойль-Мариоттын хууль, Шарлын хууль', 'Хий', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 6, 'video', false),
  (course_id_var, 'Төгс хийн тэгшитгэл', 'PV = nRT хийн төлөвийн тэгшитгэл', 'Хий', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 7, 'video', false),
  (course_id_var, 'Хийн дасгал', 'Хийн хуулиудын практик дасгалууд', 'Хий', NULL, 960, 8, 'quiz', false),
  (course_id_var, 'ЭЕШ-ийн дулааны физик', 'ЭЕШ-т гардаг дулааны физикийн асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 9, 'video', false),
  (course_id_var, 'Эцсийн тест', 'Дулааны физикийн нийт тест', 'Бэхжүүлэлт', NULL, 1500, 10, 'quiz', false);
END $$;

-- =====================================================
-- ХИМИ - ЭНГИЙН ХИМИ (11 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Хими - Энгийн Хими';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Хими танилцуулга', 'Хими гэж юу вэ? Бодисын шинж чанар', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
  (course_id_var, 'Атомын бүтэц', 'Электрон, протон, нейтрон', 'Атом', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 2, 'video', true),
  (course_id_var, 'Үелэх систем', 'Менделеевийн үелэх систем, элементийн бүлэг', 'Атом', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 3, 'video', false),
  (course_id_var, 'Химийн холбоо', 'Ионы холбоо, ковалент холбоо, металл холбоо', 'Холбоо', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 4, 'video', false),
  (course_id_var, 'Молекул', 'Молекулын бүтэц, Льюисийн бүтэц', 'Холбоо', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 5, 'video', false),
  (course_id_var, 'Атом ба молекулын тест', 'Атом, үелэх систем, холбооны дасгал', 'Холбоо', NULL, 900, 6, 'quiz', false),
  (course_id_var, 'Химийн урвал', 'Урвал гэж юу вэ? Урвалын тэгшитгэл', 'Урвал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 7, 'video', false),
  (course_id_var, 'Хүчил ба суурь', 'Хүчлийн болон суурийн шинж чанар, pH', 'Урвал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 8, 'video', false),
  (course_id_var, 'Химийн урвалын дасгал', 'Урвалын тэгшитгэл тэнцвэржүүлэх', 'Урвал', NULL, 1080, 9, 'quiz', false),
  (course_id_var, 'ЭЕШ-ийн энгийн хими', 'ЭЕШ-т гардаг энгийн химийн асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 10, 'video', false),
  (course_id_var, 'Эцсийн шалгалт', 'Энгийн химийн нийт тест', 'Бэхжүүлэлт', NULL, 1800, 11, 'quiz', false);
END $$;

-- =====================================================
-- ХИМИ - ОРГАНИК ХИМИ (13 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Хими - Органик Хими';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'Органик хими танилцуулга', 'Органик нэгдэл гэж юу вэ? Нүүрстөрөгч', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
  (course_id_var, 'Нэрлэх систем', 'Органик нэгдлийн нэрлэх, IUPAC систем', 'Үндэс', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 2, 'video', true),
  (course_id_var, 'Алкан', 'Ханасан нүүрсустөрөгч, алканы шинж чанар', 'Нүүрсустөрөгч', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 3, 'video', false),
  (course_id_var, 'Алкен', 'Давхар холбоот нүүрсустөрөгч', 'Нүүрсустөрөгч', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 4, 'video', false),
  (course_id_var, 'Алкин', 'Гурвалсан холбоот нүүрсустөрөгч', 'Нүүрсустөрөгч', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 5, 'video', false),
  (course_id_var, 'Ароматик нэгдэл', 'Бензол болон бусад ароматик нэгдлүүд', 'Нүүрсустөрөгч', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 6, 'video', false),
  (course_id_var, 'Нүүрсустөрөгчийн тест', 'Алкан, алкен, алкин, ароматикийн дасгал', 'Нүүрсустөрөгч', NULL, 1080, 7, 'quiz', false),
  (course_id_var, 'Спирт', 'Гидроксил бүлэгтэй нэгдэл', 'Функциональ бүлэг', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 8, 'video', false),
  (course_id_var, 'Альдегид ба кетон', 'Карбонил бүлэгтэй нэгдлүүд', 'Функциональ бүлэг', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 9, 'video', false),
  (course_id_var, 'Карбоны хүчил', 'Карбоксил бүлэгтэй нэгдлүүд', 'Функциональ бүлэг', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 10, 'video', false),
  (course_id_var, 'Органик урвал', 'Органик нэгдлийн урвалын төрлүүд', 'Урвал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 11, 'video', false),
  (course_id_var, 'ЭЕШ-ийн органик хими', 'ЭЕШ-т гардаг органик химийн асуултууд', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 12, 'video', false),
  (course_id_var, 'Эцсийн шалгалт', 'Органик химийн нийт тест', 'Бэхжүүлэлт', NULL, 1800, 13, 'quiz', false);
END $$;

-- =====================================================
-- АНГЛИ ХЭЛ - ЭЕШ БЭЛТГЭЛ (14 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE title = 'Англи хэл - ЭЕШ Бэлтгэл';

  INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
  (course_id_var, 'ЭЕШ-ийн танилцуулга', 'ЭЕШ-ийн англи хэлний шалгалтын бүтэц', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
  (course_id_var, 'Tenses - Цаг', 'Present, Past, Future болон түүний төрлүүд', 'Дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 2, 'video', true),
  (course_id_var, 'Passive Voice', 'Идэвхгүй хэлбэр, бүтэц болон хэрэглээ', 'Дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 3, 'video', false),
  (course_id_var, 'Conditionals', 'Нөхцөл өгүүлбэр, төрөл 0-3', 'Дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 4, 'video', false),
  (course_id_var, 'Дүрмийн тест', 'Грамматикийн практик дасгалууд', 'Дүрэм', NULL, 1200, 5, 'quiz', false),
  (course_id_var, 'Essay бичих', 'Эссэ бичих бүтэц, танилцуулга-их бие-дүгнэлт', 'Бичих', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 6, 'video', false),
  (course_id_var, 'Аргумент эссэ', 'Argue for/against эссэ бичих арга', 'Бичих', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 7, 'video', false),
  (course_id_var, 'Opinion эссэ', 'Саналын эссэ бичих', 'Бичих', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 8, 'video', false),
  (course_id_var, 'Reading Skills', 'Уншлагын стратеги, ойлголт', 'Унших', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 9, 'video', false),
  (course_id_var, 'Skimming & Scanning', 'Хурдан унших техник', 'Унших', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 10, 'video', false),
  (course_id_var, 'Vocabulary Building', 'Үг сангаа өргөжүүлэх арга', 'Үг', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 11, 'video', false),
  (course_id_var, 'Collocations & Idioms', 'Нийлмэл үг ба хэлц', 'Үг', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 12, 'video', false),
  (course_id_var, 'ЭЕШ-ийн жишээ шалгалт', 'Бодит ЭЕШ-ийн хэв маягийн шалгалт', 'Бэхжүүлэлт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 13, 'video', false),
  (course_id_var, 'Эцсийн тест', 'Англи хэлний бүхий л хэсгийг хамарсан', 'Бэхжүүлэлт', NULL, 2400, 14, 'quiz', false);
END $$;

-- Log completion
DO $$
DECLARE
  lesson_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO lesson_count FROM lessons;
  RAISE NOTICE 'Successfully seeded % Mongolian lessons across all courses', lesson_count;
END $$;
