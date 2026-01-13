-- ================================================
-- Allow Multiple Sections Per Subject
-- ================================================
-- Removes the unique constraint on (mock_test_id, subject) to allow
-- multiple sections of the same subject in a single test.
-- This is needed for full-length exams like ЭЕШ that have multiple parts
-- (e.g., Нэгдүгээр хэсэг - Сонгох, Хоёрдугаар хэсэг - Нөхөх)

-- Drop the unique constraint that prevents multiple sections per subject
ALTER TABLE mock_test_sections
DROP CONSTRAINT IF EXISTS mock_test_sections_mock_test_id_subject_key;

-- The constraint mock_test_sections_mock_test_id_order_index_key remains
-- to ensure unique ordering within each test
 