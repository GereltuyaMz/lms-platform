-- Migration: Add Category Hierarchy Support
-- Description: Adds parent_id for nested categories and category_type for classification
-- Dependencies: Requires categories table from 001_create_courses_schema.sql

-- =====================================================
-- 1. ADD HIERARCHY COLUMNS TO CATEGORIES
-- =====================================================

-- Add parent_id for self-referencing hierarchy
ALTER TABLE categories
  ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE CASCADE;

-- Add category_type to distinguish exam types from subjects
ALTER TABLE categories
  ADD COLUMN category_type TEXT NOT NULL DEFAULT 'subject'
  CHECK (category_type IN ('exam', 'subject'));

-- Add order_index for sorting within same parent
ALTER TABLE categories
  ADD COLUMN order_index INTEGER DEFAULT 0;

-- Add Mongolian name for display
ALTER TABLE categories
  ADD COLUMN name_mn TEXT;

-- Add icon for UI (emoji or icon name)
ALTER TABLE categories
  ADD COLUMN icon TEXT;

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_type ON categories(category_type);
CREATE INDEX idx_categories_parent_order ON categories(parent_id, order_index);

-- =====================================================
-- 3. HELPER FUNCTIONS
-- =====================================================

-- Function: Get full category path as text (e.g., "ЭЕШ > Математик")
CREATE OR REPLACE FUNCTION get_category_path(p_category_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_path TEXT := '';
  v_current_id UUID := p_category_id;
  v_name TEXT;
  v_parent_id UUID;
BEGIN
  LOOP
    SELECT name, parent_id INTO v_name, v_parent_id
    FROM categories
    WHERE id = v_current_id;

    IF NOT FOUND THEN
      EXIT;
    END IF;

    IF v_path = '' THEN
      v_path := v_name;
    ELSE
      v_path := v_name || ' > ' || v_path;
    END IF;

    IF v_parent_id IS NULL THEN
      EXIT;
    END IF;

    v_current_id := v_parent_id;
  END LOOP;

  RETURN v_path;
END;
$$ LANGUAGE plpgsql;

-- Function: Get all descendant category IDs (recursive)
CREATE OR REPLACE FUNCTION get_category_descendants(p_category_id UUID)
RETURNS TABLE(id UUID, depth INTEGER) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE category_tree AS (
    -- Base case: start with the given category
    SELECT c.id, 0 AS depth
    FROM categories c
    WHERE c.id = p_category_id

    UNION ALL

    -- Recursive case: get children
    SELECT c.id, ct.depth + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
  )
  SELECT ct.id, ct.depth FROM category_tree ct;
END;
$$ LANGUAGE plpgsql;

-- Function: Get category tree as JSON (for frontend)
CREATE OR REPLACE FUNCTION get_category_tree(p_parent_id UUID DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'name_mn', COALESCE(c.name_mn, c.name),
      'slug', c.slug,
      'category_type', c.category_type,
      'icon', c.icon,
      'order_index', c.order_index,
      'children', get_category_tree(c.id)
    ) ORDER BY c.order_index, c.name
  ), '[]'::jsonb) INTO v_result
  FROM categories c
  WHERE (p_parent_id IS NULL AND c.parent_id IS NULL)
     OR (p_parent_id IS NOT NULL AND c.parent_id = p_parent_id);

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Function: Get exam types only (top-level categories)
CREATE OR REPLACE FUNCTION get_exam_types()
RETURNS TABLE(
  id UUID,
  name TEXT,
  name_mn TEXT,
  slug TEXT,
  icon TEXT,
  order_index INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.name_mn, c.slug, c.icon, c.order_index
  FROM categories c
  WHERE c.category_type = 'exam' AND c.parent_id IS NULL
  ORDER BY c.order_index, c.name;
END;
$$ LANGUAGE plpgsql;

-- Function: Get subjects under an exam type
CREATE OR REPLACE FUNCTION get_subjects_by_exam(p_exam_id UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  name_mn TEXT,
  slug TEXT,
  icon TEXT,
  order_index INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.name_mn, c.slug, c.icon, c.order_index
  FROM categories c
  WHERE c.parent_id = p_exam_id AND c.category_type = 'subject'
  ORDER BY c.order_index, c.name;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. COMMENTS
-- =====================================================

COMMENT ON COLUMN categories.parent_id IS 'Self-referencing FK for nested categories (exam → subject)';
COMMENT ON COLUMN categories.category_type IS 'Type of category: exam (ЭЕШ, SAT) or subject (Math, Physics)';
COMMENT ON COLUMN categories.order_index IS 'Sort order within same parent level';
COMMENT ON COLUMN categories.name_mn IS 'Mongolian display name';
COMMENT ON COLUMN categories.icon IS 'Icon for UI display (emoji or icon class name)';

COMMENT ON FUNCTION get_category_path IS 'Returns full path like "ЭЕШ > Математик"';
COMMENT ON FUNCTION get_category_descendants IS 'Returns all child category IDs recursively';
COMMENT ON FUNCTION get_category_tree IS 'Returns nested JSON tree of categories';
COMMENT ON FUNCTION get_exam_types IS 'Returns top-level exam type categories';
COMMENT ON FUNCTION get_subjects_by_exam IS 'Returns subject categories under an exam type';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Successfully added category hierarchy support';
END $$;
