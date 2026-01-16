#!/bin/bash
# =====================================================
# Transform EYSH 2024 Seed Files to Current Schema
# =====================================================
# This script updates seed files to match the current database structure
# Changes:
# - Remove eysh_threshold_* columns (removed in migration 049)
# - Remove passing_score_percentage (removed in migration 049)
# - Keep category column (added in migration 024)
# - Preserve all other data (problems, questions, options)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔄 Transforming EYSH 2024 seed files..."

for file in eysh_2024_math_*.sql; do
  if [[ ! -f "$file" ]]; then
    continue
  fi

  echo "  Processing: $file"

  # Create backup
  cp "$file" "${file}.backup"

  # Transform the INSERT statement for mock_tests
  # Remove the EYSH threshold columns and passing_score_percentage
  sed -i.tmp 's/passing_score_percentage, is_published, category,$/is_published, category/' "$file"
  sed -i.tmp 's/eysh_threshold_500, eysh_threshold_600, eysh_threshold_700, eysh_threshold_800$//' "$file"
  sed -i.tmp '/INSERT INTO mock_tests/,/^);$/ {
    s/, 60, true, '\''math'\'', 60, 70, 80, 90$/, true, '\''math'\''/
    s/, 60, true, '\''physics'\'', 60, 70, 80, 90$/, true, '\''physics'\''/
    s/, 60, true, '\''chemistry'\'', 60, 70, 80, 90$/, true, '\''chemistry'\''/
    s/, 60, true, '\''english'\'', 60, 70, 80, 90$/, true, '\''english'\''/
  }' "$file"

  # Clean up temporary files
  rm -f "${file}.tmp"

  echo "  ✅ Transformed: $file"
done

echo ""
echo "✨ Transformation complete!"
echo "📁 Backup files saved with .backup extension"
echo ""
echo "Next steps:"
echo "  1. Review the transformed files"
echo "  2. Test with: psql -d your_db -f eysh_2024_math_a_complete.sql"
echo "  3. If successful, remove .backup files"
