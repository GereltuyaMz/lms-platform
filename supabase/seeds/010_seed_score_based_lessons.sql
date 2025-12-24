-- Seed: Score-Based Course Lessons
-- Description: Creates lessons for simplified score-based courses
-- Dependencies: Requires score-based courses to be created first

-- Delete existing lessons
DELETE FROM lessons;

-- =====================================================
-- ЭЕШ МАТЕМАТИК 500+ (8 lessons - Beginner)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-matematik-500';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'ЭЕШ-ийн танилцуулга', 'Шалгалтын бүтэц, оноо тооцоолол', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
    (course_id_var, 'Тоон үйлдлүүд', 'Бутархай, хувь, пропорц', 'Суурь математик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 2, 'video', true),
    (course_id_var, 'Энгийн тэгшитгэл', 'Нэг хувьсагчтай шугаман тэгшитгэл', 'Алгебр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 3, 'video', false),
    (course_id_var, 'Тэгшитгэл бодох дасгал', 'Практик дасгалууд', 'Алгебр', NULL, 900, 4, 'quiz', false),
    (course_id_var, 'Геометрын үндэс', 'Талбай, периметр тооцоолол', 'Геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 5, 'video', false),
    (course_id_var, 'Геометрын дасгал', 'Геометрын бодлогууд', 'Геометр', NULL, 840, 6, 'quiz', false),
    (course_id_var, 'Жишээ бодлогууд', 'ЭЕШ-ийн энгийн бодлогууд', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, '500+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 1800, 8, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ МАТЕМАТИК 600+ (10 lessons - Intermediate)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-matematik-600';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '600+ стратеги', 'Дунд түвшний бодлого бодох арга', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
    (course_id_var, 'Функц ба график', 'Шугаман болон квадрат функц', 'Алгебр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 2, 'video', true),
    (course_id_var, 'Квадрат тэгшитгэл', 'Квадрат тэгшитгэл бодох аргууд', 'Алгебр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 3, 'video', false),
    (course_id_var, 'Алгебрын дасгал', 'Функц, тэгшитгэлийн бодлогууд', 'Алгебр', NULL, 1200, 4, 'quiz', false),
    (course_id_var, 'Гурвалжин ба тригонометр', 'Пифагорын теорем, тригонометр', 'Геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 5, 'video', false),
    (course_id_var, 'Тойрог ба талбай', 'Тойргийн шинж чанар, секторын талбай', 'Геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 6, 'video', false),
    (course_id_var, 'Геометрын дасгал', 'Дунд түвшний геометрын бодлогууд', 'Геометр', NULL, 1080, 7, 'quiz', false),
    (course_id_var, 'Магадлал ба статистик', 'Магадлал тооцоолол, дундаж', 'Статистик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 8, 'video', false),
    (course_id_var, 'ЭЕШ-ийн бодлогууд', '600+ түвшний жишээ бодлогууд', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 9, 'video', false),
    (course_id_var, '600+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 2400, 10, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ МАТЕМАТИК 700+ (12 lessons - Advanced)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-matematik-700';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '700+ стратеги', 'Өндөр оноо авах арга барил', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 1, 'video', true),
    (course_id_var, 'Функцийн шинжилгээ', 'Функцийн уламжлал, экстремум', 'Ахисан алгебр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 2, 'video', true),
    (course_id_var, 'Тэгшитгэлийн систем', 'Олон хувьсагчтай тэгшитгэл', 'Ахисан алгебр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 3, 'video', false),
    (course_id_var, 'Полином ба үржигдэхүүн', 'Полиномын хуваалт, үржигдэхүүнд задлах', 'Ахисан алгебр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 4, 'video', false),
    (course_id_var, 'Алгебрын дасгал', 'Хүнд түвшний алгебрын бодлогууд', 'Ахисан алгебр', NULL, 1500, 5, 'quiz', false),
    (course_id_var, 'Огторгуйн геометр', 'Пирамид, конус, бөмбөрцөг', 'Ахисан геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1260, 6, 'video', false),
    (course_id_var, 'Координатын геометр', 'Шулуун, тойргийн тэгшитгэл', 'Ахисан геометр', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, 'Геометрын дасгал', 'Хүнд түвшний геометрын бодлогууд', 'Ахисан геометр', NULL, 1320, 8, 'quiz', false),
    (course_id_var, 'Тооны онол', 'ХИНХ, ХБНХ, модуль', 'Нэмэлт сэдэв', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 9, 'video', false),
    (course_id_var, 'Комбинаторик', 'Хослол, байрлуулалт', 'Нэмэлт сэдэв', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 10, 'video', false),
    (course_id_var, 'ЭЕШ-ийн хүнд бодлогууд', '700+ түвшний жишээ бодлогууд', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1500, 11, 'video', false),
    (course_id_var, '700+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 3000, 12, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ МАТЕМАТИК 800 (14 lessons - Master)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-matematik-800';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '800 оноо авах стратеги', 'Төгс оноо авах арга барил', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 1, 'video', true),
    (course_id_var, 'Олимпиадын алгебр', 'Олимпиадын түвшний алгебр', 'Олимпиад', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1500, 2, 'video', true),
    (course_id_var, 'Олимпиадын геометр', 'Олимпиадын түвшний геометр', 'Олимпиад', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1440, 3, 'video', false),
    (course_id_var, 'Олимпиадын тооны онол', 'Олимпиадын түвшний тооны онол', 'Олимпиад', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1380, 4, 'video', false),
    (course_id_var, 'Олимпиадын дасгал', 'Олимпиадын бодлогууд', 'Олимпиад', NULL, 1800, 5, 'quiz', false),
    (course_id_var, 'Цаг хэмнэх техник', 'Хурдан бодох арга', 'Стратеги', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 6, 'video', false),
    (course_id_var, 'Алдаа засах', 'Түгээмэл алдаа, засах арга', 'Стратеги', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 7, 'video', false),
    (course_id_var, 'ЭЕШ-ийн хамгийн хүнд бодлогууд 1', 'Хамгийн хүнд бодлогууд', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1800, 8, 'video', false),
    (course_id_var, 'ЭЕШ-ийн хамгийн хүнд бодлогууд 2', 'Хамгийн хүнд бодлогууд', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1800, 9, 'video', false),
    (course_id_var, 'Бүрэн жишээ шалгалт 1', 'Бодит шалгалтын хэв маяг', 'Шалгалт', NULL, 3600, 10, 'quiz', false),
    (course_id_var, 'Бүрэн жишээ шалгалт 2', 'Бодит шалгалтын хэв маяг', 'Шалгалт', NULL, 3600, 11, 'quiz', false),
    (course_id_var, 'Шалгалтын дүн шинжилгээ', 'Алдаа анализ, сайжруулалт', 'Шалгалт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 12, 'video', false),
    (course_id_var, 'Эцсийн бэлтгэл', 'Шалгалтын өмнөх зөвлөмж', 'Шалгалт', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 13, 'video', false),
    (course_id_var, '800 түвшний эцсийн тест', 'Эцсийн шалгалт', 'Шалгалт', NULL, 3600, 14, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ ФИЗИК 500+ (8 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-fizik-500';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'Физикийн танилцуулга', 'ЭЕШ физикийн бүтэц', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
    (course_id_var, 'Хөдөлгөөний үндэс', 'Хурд, хурдатгал, зам', 'Механик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 2, 'video', true),
    (course_id_var, 'Ньютоны хуулиуд', 'Хүч ба хөдөлгөөн', 'Механик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 3, 'video', false),
    (course_id_var, 'Механикийн дасгал', 'Практик бодлогууд', 'Механик', NULL, 1080, 4, 'quiz', false),
    (course_id_var, 'Энергийн үндэс', 'Кинетик ба потенциал энерги', 'Энерги', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 5, 'video', false),
    (course_id_var, 'Энергийн дасгал', 'Энергийн бодлогууд', 'Энерги', NULL, 900, 6, 'quiz', false),
    (course_id_var, 'Жишээ бодлогууд', 'ЭЕШ-ийн энгийн бодлогууд', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, '500+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 1800, 8, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ ФИЗИК 600+ (10 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-fizik-600';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '600+ стратеги', 'Дунд түвшний физик', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
    (course_id_var, 'Ажил ба чадал', 'Ажил, чадал, ашигт үйлийн коэффициент', 'Механик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 2, 'video', true),
    (course_id_var, 'Импульс', 'Импульс ба түүний хадгалалт', 'Механик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 3, 'video', false),
    (course_id_var, 'Механикийн дасгал', 'Дунд түвшний бодлогууд', 'Механик', NULL, 1200, 4, 'quiz', false),
    (course_id_var, 'Цахилгааны үндэс', 'Цэнэг, хүчдэл, гүйдэл', 'Цахилгаан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 5, 'video', false),
    (course_id_var, 'Омын хууль', 'Хэлхээний тооцоо', 'Цахилгаан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 6, 'video', false),
    (course_id_var, 'Цахилгааны дасгал', 'Цахилгааны бодлогууд', 'Цахилгаан', NULL, 1200, 7, 'quiz', false),
    (course_id_var, 'Дулааны физик', 'Температур, дулаан, энтальпи', 'Дулаан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 8, 'video', false),
    (course_id_var, 'ЭЕШ-ийн бодлогууд', '600+ түвшний жишээ', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 9, 'video', false),
    (course_id_var, '600+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 2400, 10, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ ФИЗИК 700+ (12 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-fizik-700';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '700+ стратеги', 'Өндөр оноо авах арга', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 1, 'video', true),
    (course_id_var, 'Эргэх хөдөлгөөн', 'Өнцгийн хурд, моментум', 'Ахисан механик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1260, 2, 'video', true),
    (course_id_var, 'Долгион', 'Долгионы шинж чанар', 'Ахисан механик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 3, 'video', false),
    (course_id_var, 'Механикийн дасгал', 'Хүнд түвшний бодлогууд', 'Ахисан механик', NULL, 1500, 4, 'quiz', false),
    (course_id_var, 'Цахилгаан соронзон', 'Соронзон орон, индукц', 'Ахисан цахилгаан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 5, 'video', false),
    (course_id_var, 'Хувьсах гүйдэл', 'AC хэлхээ', 'Ахисан цахилгаан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 6, 'video', false),
    (course_id_var, 'Цахилгааны дасгал', 'Хүнд түвшний бодлогууд', 'Ахисан цахилгаан', NULL, 1440, 7, 'quiz', false),
    (course_id_var, 'Оптик', 'Гэрэл, линз, толь', 'Оптик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 8, 'video', false),
    (course_id_var, 'Атомын физик', 'Атомын бүтэц, цацраг идэвхт', 'Орчин үеийн физик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 9, 'video', false),
    (course_id_var, 'Орчин үеийн физикийн дасгал', 'Практик бодлогууд', 'Орчин үеийн физик', NULL, 1320, 10, 'quiz', false),
    (course_id_var, 'ЭЕШ-ийн хүнд бодлогууд', '700+ түвшний жишээ', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1500, 11, 'video', false),
    (course_id_var, '700+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 3000, 12, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ ХИМИ 500+ (8 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-khimi-500';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'Химийн танилцуулга', 'ЭЕШ химийн бүтэц', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
    (course_id_var, 'Атомын бүтэц', 'Протон, нейтрон, электрон', 'Атом', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 2, 'video', true),
    (course_id_var, 'Үелэх систем', 'Элементийн шинж чанар', 'Атом', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 3, 'video', false),
    (course_id_var, 'Атомын дасгал', 'Практик бодлогууд', 'Атом', NULL, 900, 4, 'quiz', false),
    (course_id_var, 'Химийн холбоо', 'Ионы, ковалент холбоо', 'Холбоо', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 5, 'video', false),
    (course_id_var, 'Холбооны дасгал', 'Холбооны бодлогууд', 'Холбоо', NULL, 960, 6, 'quiz', false),
    (course_id_var, 'Жишээ бодлогууд', 'ЭЕШ-ийн энгийн бодлогууд', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, '500+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 1800, 8, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ ХИМИ 600+ (10 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-khimi-600';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '600+ стратеги', 'Дунд түвшний хими', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
    (course_id_var, 'Химийн урвал', 'Урвалын төрөл, тэнцвэржүүлэх', 'Урвал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 2, 'video', true),
    (course_id_var, 'Молийн тооцоо', 'Стехиометр, моль', 'Урвал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 3, 'video', false),
    (course_id_var, 'Урвалын дасгал', 'Урвалын бодлогууд', 'Урвал', NULL, 1080, 4, 'quiz', false),
    (course_id_var, 'Хүчил-суурь', 'pH, буфер уусмал', 'Уусмал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 5, 'video', false),
    (course_id_var, 'Редокс урвал', 'Исэлдэлт-ангижралт', 'Уусмал', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 6, 'video', false),
    (course_id_var, 'Уусмалын дасгал', 'Уусмалын бодлогууд', 'Уусмал', NULL, 1200, 7, 'quiz', false),
    (course_id_var, 'Органик танилцуулга', 'Органик нэгдлийн үндэс', 'Органик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 8, 'video', false),
    (course_id_var, 'ЭЕШ-ийн бодлогууд', '600+ түвшний жишээ', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 9, 'video', false),
    (course_id_var, '600+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 2400, 10, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ ХИМИ 700+ (12 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-khimi-700';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '700+ стратеги', 'Өндөр оноо авах арга', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 1, 'video', true),
    (course_id_var, 'Термодинамик', 'Энтальпи, энтропи, Гиббс энерги', 'Физик хими', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 2, 'video', true),
    (course_id_var, 'Кинетик', 'Урвалын хурд, катализатор', 'Физик хими', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 3, 'video', false),
    (course_id_var, 'Физик химийн дасгал', 'Хүнд түвшний бодлогууд', 'Физик хими', NULL, 1440, 4, 'quiz', false),
    (course_id_var, 'Органик урвал', 'Органик урвалын механизм', 'Ахисан органик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1380, 5, 'video', false),
    (course_id_var, 'Функциональ бүлэг', 'Спирт, альдегид, кетон, хүчил', 'Ахисан органик', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1260, 6, 'video', false),
    (course_id_var, 'Органик дасгал', 'Хүнд түвшний бодлогууд', 'Ахисан органик', NULL, 1500, 7, 'quiz', false),
    (course_id_var, 'Электрохими', 'Электролиз, гальваник элемент', 'Нэмэлт сэдэв', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 8, 'video', false),
    (course_id_var, 'Координацын хими', 'Комплекс нэгдэл', 'Нэмэлт сэдэв', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 9, 'video', false),
    (course_id_var, 'Нэмэлт дасгал', 'Практик бодлогууд', 'Нэмэлт сэдэв', NULL, 1320, 10, 'quiz', false),
    (course_id_var, 'ЭЕШ-ийн хүнд бодлогууд', '700+ түвшний жишээ', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1500, 11, 'video', false),
    (course_id_var, '700+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 3000, 12, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ АНГЛИ ХЭЛ 500+ (8 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-english-500';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'ЭЕШ танилцуулга', 'Англи хэлний шалгалтын бүтэц', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
    (course_id_var, 'Үндсэн дүрэм', 'Tenses, Articles, Prepositions', 'Дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 2, 'video', true),
    (course_id_var, 'Өгүүлбэрийн бүтэц', 'Subject-Verb-Object', 'Дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 3, 'video', false),
    (course_id_var, 'Дүрмийн дасгал', 'Грамматикийн бодлогууд', 'Дүрэм', NULL, 1200, 4, 'quiz', false),
    (course_id_var, 'Унших чадвар', 'Reading comprehension', 'Унших', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 5, 'video', false),
    (course_id_var, 'Уншлагын дасгал', 'Унших дасгалууд', 'Унших', NULL, 1080, 6, 'quiz', false),
    (course_id_var, 'Жишээ бодлогууд', 'ЭЕШ-ийн энгийн бодлогууд', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, '500+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 1800, 8, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ АНГЛИ ХЭЛ 600+ (10 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-english-600';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '600+ стратеги', 'Дунд түвшний англи хэл', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
    (course_id_var, 'Conditional sentences', 'If clauses, types 0-3', 'Ахисан дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 2, 'video', true),
    (course_id_var, 'Passive Voice', 'Идэвхгүй хэлбэр', 'Ахисан дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 3, 'video', false),
    (course_id_var, 'Reported Speech', 'Шууд бус яриа', 'Ахисан дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 4, 'video', false),
    (course_id_var, 'Дүрмийн дасгал', 'Ахисан дүрмийн бодлогууд', 'Ахисан дүрэм', NULL, 1320, 5, 'quiz', false),
    (course_id_var, 'Essay бичих', 'Эссэ бичих бүтэц', 'Бичих', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 6, 'video', false),
    (course_id_var, 'Vocabulary building', 'Үг сан өргөжүүлэх', 'Үг сан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 900, 7, 'video', false),
    (course_id_var, 'Үг санын дасгал', 'Үг санын бодлогууд', 'Үг сан', NULL, 1080, 8, 'quiz', false),
    (course_id_var, 'ЭЕШ-ийн бодлогууд', '600+ түвшний жишээ', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 9, 'video', false),
    (course_id_var, '600+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 2400, 10, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- ЭЕШ АНГЛИ ХЭЛ 700+ (12 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'esh-english-700';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '700+ стратеги', 'Өндөр оноо авах арга', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 1, 'video', true),
    (course_id_var, 'Complex sentences', 'Нийлмэл өгүүлбэр', 'Мастер дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 2, 'video', true),
    (course_id_var, 'Inversion', 'Урвуу дараалал', 'Мастер дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 3, 'video', false),
    (course_id_var, 'Subjunctive mood', 'Хүслийн хэлбэр', 'Мастер дүрэм', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 4, 'video', false),
    (course_id_var, 'Дүрмийн дасгал', 'Хүнд түвшний бодлогууд', 'Мастер дүрэм', NULL, 1500, 5, 'quiz', false),
    (course_id_var, 'Academic writing', 'Академик бичлэг', 'Бичих', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 6, 'video', false),
    (course_id_var, 'Critical reading', 'Шүүмжлэлт унших', 'Унших', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 7, 'video', false),
    (course_id_var, 'Advanced vocabulary', 'Ахисан үг сан', 'Үг сан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 8, 'video', false),
    (course_id_var, 'Idioms & Collocations', 'Хэлц, нийлмэл үг', 'Үг сан', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 9, 'video', false),
    (course_id_var, 'Үг санын дасгал', 'Хүнд түвшний бодлогууд', 'Үг сан', NULL, 1320, 10, 'quiz', false),
    (course_id_var, 'ЭЕШ-ийн хүнд бодлогууд', '700+ түвшний жишээ', 'Бэлтгэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1500, 11, 'video', false),
    (course_id_var, '700+ түвшний тест', 'Эцсийн шалгалт', 'Бэлтгэл', NULL, 3000, 12, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- SAT MATH 500+ (8 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'sat-math-500';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'SAT Math Overview', 'SAT Math structure and tips', 'Introduction', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
    (course_id_var, 'Heart of Algebra', 'Linear equations and systems', 'Algebra', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 2, 'video', true),
    (course_id_var, 'Linear Functions', 'Graphing and interpreting', 'Algebra', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 3, 'video', false),
    (course_id_var, 'Algebra Practice', 'Practice problems', 'Algebra', NULL, 1200, 4, 'quiz', false),
    (course_id_var, 'Problem Solving', 'Ratios, percentages, proportions', 'Problem Solving', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 5, 'video', false),
    (course_id_var, 'Data Analysis', 'Tables, graphs, statistics', 'Problem Solving', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 6, 'video', false),
    (course_id_var, 'Practice Test', 'Full practice questions', 'Prep', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, '500+ Level Test', 'Final assessment', 'Prep', NULL, 1800, 8, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- SAT MATH 600+ (10 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'sat-math-600';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '600+ Strategy', 'Mid-level score strategies', 'Introduction', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
    (course_id_var, 'Passport to Advanced Math', 'Quadratics and polynomials', 'Advanced Algebra', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 2, 'video', true),
    (course_id_var, 'Functions', 'Function notation and operations', 'Advanced Algebra', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 3, 'video', false),
    (course_id_var, 'Exponentials', 'Exponential growth and decay', 'Advanced Algebra', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 4, 'video', false),
    (course_id_var, 'Advanced Algebra Practice', 'Practice problems', 'Advanced Algebra', NULL, 1320, 5, 'quiz', false),
    (course_id_var, 'Geometry Essentials', 'Triangles, circles, angles', 'Geometry', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 6, 'video', false),
    (course_id_var, 'Trigonometry Basics', 'Sin, Cos, Tan', 'Geometry', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 7, 'video', false),
    (course_id_var, 'Geometry Practice', 'Practice problems', 'Geometry', NULL, 1200, 8, 'quiz', false),
    (course_id_var, 'SAT Practice Problems', '600+ level examples', 'Prep', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 9, 'video', false),
    (course_id_var, '600+ Level Test', 'Final assessment', 'Prep', NULL, 2400, 10, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- SAT MATH 700+ (12 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'sat-math-700';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '700+ Strategy', 'High score strategies', 'Introduction', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 1, 'video', true),
    (course_id_var, 'Complex Equations', 'Systems with 3+ variables', 'Master Algebra', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1260, 2, 'video', true),
    (course_id_var, 'Polynomial Division', 'Long division and synthetic', 'Master Algebra', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 3, 'video', false),
    (course_id_var, 'Radical and Rational', 'Complex expressions', 'Master Algebra', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 4, 'video', false),
    (course_id_var, 'Master Algebra Practice', 'Hard problems', 'Master Algebra', NULL, 1500, 5, 'quiz', false),
    (course_id_var, 'Advanced Geometry', 'Complex area and volume', 'Master Geometry', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 6, 'video', false),
    (course_id_var, 'Coordinate Geometry', 'Circles and parabolas', 'Master Geometry', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, 'Master Geometry Practice', 'Hard problems', 'Master Geometry', NULL, 1440, 8, 'quiz', false),
    (course_id_var, 'Statistics Deep Dive', 'Standard deviation, probability', 'Data Analysis', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 9, 'video', false),
    (course_id_var, 'Data Analysis Practice', 'Hard problems', 'Data Analysis', NULL, 1320, 10, 'quiz', false),
    (course_id_var, 'SAT Hardest Problems', '700+ level examples', 'Prep', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1500, 11, 'video', false),
    (course_id_var, '700+ Level Test', 'Final assessment', 'Prep', NULL, 3000, 12, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- SAT READING 500+, 600+, 700+ (Similar structure)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'sat-reading-500';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'SAT Reading Overview', 'Test structure and strategies', 'Introduction', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 600, 1, 'video', true),
    (course_id_var, 'Main Idea Questions', 'Finding central themes', 'Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 2, 'video', true),
    (course_id_var, 'Detail Questions', 'Finding specific information', 'Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 3, 'video', false),
    (course_id_var, 'Reading Practice', 'Practice passages', 'Reading', NULL, 1200, 4, 'quiz', false),
    (course_id_var, 'Grammar Rules', 'Essential grammar', 'Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 5, 'video', false),
    (course_id_var, 'Writing Practice', 'Grammar questions', 'Writing', NULL, 1080, 6, 'quiz', false),
    (course_id_var, 'Full Practice', '500+ level examples', 'Prep', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, '500+ Level Test', 'Final assessment', 'Prep', NULL, 1800, 8, 'quiz', false);
  END IF;
END $$;

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'sat-reading-600';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '600+ Strategy', 'Mid-level strategies', 'Introduction', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
    (course_id_var, 'Inference Questions', 'Reading between the lines', 'Advanced Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 2, 'video', true),
    (course_id_var, 'Evidence Questions', 'Supporting evidence', 'Advanced Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 3, 'video', false),
    (course_id_var, 'Vocabulary in Context', 'Word meaning questions', 'Advanced Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 4, 'video', false),
    (course_id_var, 'Reading Practice', 'Practice passages', 'Advanced Reading', NULL, 1320, 5, 'quiz', false),
    (course_id_var, 'Rhetoric', 'Author purpose and tone', 'Advanced Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 6, 'video', false),
    (course_id_var, 'Sentence Structure', 'Complex sentences', 'Advanced Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 7, 'video', false),
    (course_id_var, 'Writing Practice', 'Practice questions', 'Advanced Writing', NULL, 1200, 8, 'quiz', false),
    (course_id_var, 'Full Practice', '600+ level examples', 'Prep', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 9, 'video', false),
    (course_id_var, '600+ Level Test', 'Final assessment', 'Prep', NULL, 2400, 10, 'quiz', false);
  END IF;
END $$;

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'sat-reading-700';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, '700+ Strategy', 'High score strategies', 'Introduction', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 1, 'video', true),
    (course_id_var, 'Paired Passages', 'Comparing two texts', 'Master Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1260, 2, 'video', true),
    (course_id_var, 'Data Integration', 'Charts and passages', 'Master Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 3, 'video', false),
    (course_id_var, 'Historical Passages', 'Founding documents', 'Master Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 4, 'video', false),
    (course_id_var, 'Science Passages', 'Scientific texts', 'Master Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 5, 'video', false),
    (course_id_var, 'Reading Practice', 'Hard passages', 'Master Reading', NULL, 1500, 6, 'quiz', false),
    (course_id_var, 'Style and Tone', 'Advanced writing analysis', 'Master Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 7, 'video', false),
    (course_id_var, 'Conciseness', 'Eliminating wordiness', 'Master Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 8, 'video', false),
    (course_id_var, 'Writing Practice', 'Hard questions', 'Master Writing', NULL, 1320, 9, 'quiz', false),
    (course_id_var, 'SAT Hardest Problems', '700+ level examples', 'Prep', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1500, 10, 'video', false),
    (course_id_var, '700+ Level Test', 'Final assessment', 'Prep', NULL, 3000, 11, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- IELTS BAND 5.5+ (8 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'ielts-band-55';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'IELTS танилцуулга', 'IELTS шалгалтын бүтэц', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 720, 1, 'video', true),
    (course_id_var, 'Listening Basics', 'Сонсох чадварын суурь', 'Listening', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 2, 'video', true),
    (course_id_var, 'Listening Practice', 'Сонсох дасгал', 'Listening', NULL, 1200, 3, 'quiz', false),
    (course_id_var, 'Reading Basics', 'Унших чадварын суурь', 'Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1020, 4, 'video', false),
    (course_id_var, 'Reading Practice', 'Унших дасгал', 'Reading', NULL, 1200, 5, 'quiz', false),
    (course_id_var, 'Writing Task 1 & 2', 'Бичих даалгавар', 'Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 6, 'video', false),
    (course_id_var, 'Speaking Basics', 'Ярих чадварын суурь', 'Speaking', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 960, 7, 'video', false),
    (course_id_var, 'Band 5.5+ Test', 'Эцсийн шалгалт', 'Prep', NULL, 2400, 8, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- IELTS BAND 6.5+ (10 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'ielts-band-65';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'Band 6.5+ стратеги', 'Дунд түвшний стратеги', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 780, 1, 'video', true),
    (course_id_var, 'Academic Listening', 'Академик сонсгол', 'Listening', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 2, 'video', true),
    (course_id_var, 'Listening Practice', 'Сонсох дасгал', 'Listening', NULL, 1320, 3, 'quiz', false),
    (course_id_var, 'Academic Reading', 'Академик унших', 'Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 4, 'video', false),
    (course_id_var, 'Reading Practice', 'Унших дасгал', 'Reading', NULL, 1320, 5, 'quiz', false),
    (course_id_var, 'Task 1 Graphs', 'График тайлбарлах', 'Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 6, 'video', false),
    (course_id_var, 'Task 2 Essays', 'Эссэ бичих', 'Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 7, 'video', false),
    (course_id_var, 'Speaking Part 2 & 3', 'Cue card, Discussion', 'Speaking', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 8, 'video', false),
    (course_id_var, 'Full Practice', 'Бүрэн дасгал', 'Prep', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 9, 'video', false),
    (course_id_var, 'Band 6.5+ Test', 'Эцсийн шалгалт', 'Prep', NULL, 3000, 10, 'quiz', false);
  END IF;
END $$;

-- =====================================================
-- IELTS BAND 7.5+ (12 lessons)
-- =====================================================

DO $$
DECLARE
  course_id_var UUID;
BEGIN
  SELECT id INTO course_id_var FROM courses WHERE slug = 'ielts-band-75';

  IF course_id_var IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, section_title, video_url, duration_seconds, order_index, lesson_type, is_preview) VALUES
    (course_id_var, 'Band 7.5+ стратеги', 'Өндөр оноо авах арга', 'Эхлэл', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 840, 1, 'video', true),
    (course_id_var, 'Advanced Listening', 'Ахисан сонсгол', 'Listening', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1260, 2, 'video', true),
    (course_id_var, 'Speed Listening', 'Хурдан сонсох', 'Listening', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1140, 3, 'video', false),
    (course_id_var, 'Listening Practice', 'Хүнд дасгал', 'Listening', NULL, 1500, 4, 'quiz', false),
    (course_id_var, 'Advanced Reading', 'Ахисан унших', 'Reading', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1320, 5, 'video', false),
    (course_id_var, 'Reading Practice', 'Хүнд дасгал', 'Reading', NULL, 1500, 6, 'quiz', false),
    (course_id_var, 'High Band Writing', 'Өндөр оноотой бичлэг', 'Writing', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1440, 7, 'video', false),
    (course_id_var, 'Writing Practice', 'Бичих дасгал', 'Writing', NULL, 1800, 8, 'quiz', false),
    (course_id_var, 'Fluent Speaking', 'Чөлөөтэй яриа', 'Speaking', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1200, 9, 'video', false),
    (course_id_var, 'Idioms & Expressions', 'Хэлц, илэрхийлэл', 'Speaking', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1080, 10, 'video', false),
    (course_id_var, 'Full Practice', 'Бүрэн дасгал', 'Prep', 'https://www.youtube.com/watch?v=8G8gX3JSxQM', 1500, 11, 'video', false),
    (course_id_var, 'Band 7.5+ Test', 'Эцсийн шалгалт', 'Prep', NULL, 3600, 12, 'quiz', false);
  END IF;
END $$;

-- Log completion
DO $$
DECLARE
  lesson_count INTEGER;
  course_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO lesson_count FROM lessons;
  SELECT COUNT(DISTINCT course_id) INTO course_count FROM lessons;
  RAISE NOTICE 'Successfully seeded % lessons across % courses', lesson_count, course_count;
END $$;
