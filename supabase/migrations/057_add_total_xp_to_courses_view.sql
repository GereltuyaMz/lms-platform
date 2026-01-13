-- Migration: Add total_xp to courses_with_stats view
-- NOTE: This migration is superseded by 058_update_course_stats_xp_v2.sql
-- which updates the XP calculation to match XP System V2
--
-- This file adds the total_xp column structure; 058 updates the formula.

DROP VIEW IF EXISTS courses_with_stats;

CREATE VIEW courses_with_stats AS
SELECT
  c.*,
  COALESCE(stats.lesson_count, 0)::INTEGER as lesson_count,
  COALESCE(stats.total_duration_seconds, 0)::INTEGER as total_duration_seconds,
  COALESCE(stats.total_xp, 0)::INTEGER as total_xp
FROM courses c
LEFT JOIN LATERAL calculate_course_stats(c.id) stats ON true;

COMMENT ON VIEW courses_with_stats IS 'Courses with pre-calculated stats from calculate_course_stats RPC.';
