-- =====================================================
-- MIGRATION: Add description field to lesson_content
-- =====================================================
-- Purpose: Add a text description field that appears below video content
-- to provide additional explanations or context for learners.

ALTER TABLE lesson_content
ADD COLUMN description TEXT;

COMMENT ON COLUMN lesson_content.description IS 'Text description/explanation shown below video content';
