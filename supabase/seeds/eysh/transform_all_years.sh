#!/bin/bash
# =====================================================
# Transform All EYSH Seed Files (2017-2023) to Current Schema
# =====================================================
# This script updates all historical seed files to match the current database structure
# by removing deprecated EYSH threshold and passing score columns.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔄 Transforming EYSH seed files (2017-2023)..."
echo ""

# Function to transform a single file
transform_file() {
  local file=$1

  if [[ ! -f "$file" ]]; then
    echo "  ⚠️  File not found: $file"
    return
  fi

  echo "  📝 Processing: $file"

  # Create backup
  cp "$file" "${file}.backup"

  # Remove passing_score_percentage from column list
  sed -i '' 's/passing_score_percentage, is_published, category,/is_published, category/' "$file"

  # Remove eysh_threshold line
  sed -i '' '/eysh_threshold_500, eysh_threshold_600, eysh_threshold_700, eysh_threshold_800,/d' "$file"

  # Remove created_at, updated_at from column list (these have defaults)
  sed -i '' 's/created_at, updated_at$//' "$file"
  sed -i '' 's/, created_at, updated_at$//' "$file"

  # Update values line - remove passing score (60) and eysh thresholds (60, 70, 80, 90)
  # Also remove NOW(), NOW() for timestamps
  sed -i '' 's/180, 40, 60, true, '\''math'\'', 60, 70, 80, 90, NOW(), NOW()/180, 40, true, '\''math'\''/' "$file"
  sed -i '' 's/180, 40, 60, true, '\''math'\'',$/180, 40, true, '\''math'\''/' "$file"
  sed -i '' '/^    60, 70, 80, 90, NOW(), NOW()$/d' "$file"

  # Handle cases where values might be on the next line
  sed -i '' 's/, 60, 70, 80, 90$//' "$file"

  echo "  ✅ Transformed: $file"
}

# Transform each year
for year in 2018 2019 2020 2021 2022 2023; do
  echo "📅 Year: $year"
  cd "$SCRIPT_DIR/$year"

  # Find all SQL files
  for file in *.sql; do
    if [[ "$file" == *.backup ]]; then
      continue
    fi
    transform_file "$file"
  done

  echo ""
done

# Handle 2017 (empty directory - create placeholder)
echo "📅 Year: 2017"
cd "$SCRIPT_DIR/2017"
echo "  ℹ️  No seed files found. Directory is empty."
echo "  📝 Creating README for future seed files..."

cat > README.md << 'EOF'
# EYSH 2017 Seed Data

This directory is reserved for EYSH 2017 exam seed data.

## Structure

Seed files should follow the current schema format:

```sql
INSERT INTO mock_tests (
    id, title, description, time_limit_minutes, total_questions,
    is_published, category
) VALUES (
    'uuid-here',
    'ЭЕШ 2017 Математик Хувилбар X',
    'Description here',
    180, 40, true, 'math'
);
```

See `/supabase/seeds/eysh/2024/` for complete examples.
EOF

echo "  ✅ Created: README.md"
echo ""

cd "$SCRIPT_DIR"
echo ""
echo "✨ Transformation complete!"
echo ""
echo "📊 Summary:"
echo "  - 2017: Empty (README created)"
echo "  - 2018: $(ls 2018/*.sql 2>/dev/null | grep -v backup | wc -l | xargs) files transformed"
echo "  - 2019: $(ls 2019/*.sql 2>/dev/null | grep -v backup | wc -l | xargs) files transformed"
echo "  - 2020: $(ls 2020/*.sql 2>/dev/null | grep -v backup | wc -l | xargs) files transformed"
echo "  - 2021: $(ls 2021/*.sql 2>/dev/null | grep -v backup | wc -l | xargs) files transformed"
echo "  - 2022: $(ls 2022/*.sql 2>/dev/null | grep -v backup | wc -l | xargs) files transformed"
echo "  - 2023: $(ls 2023/*.sql 2>/dev/null | grep -v backup | wc -l | xargs) files transformed"
echo ""
echo "📁 Backup files saved with .backup extension"
echo ""
echo "Next steps:"
echo "  1. Review the transformed files in each year directory"
echo "  2. Test loading: psql -d your_db -f 2023/eysh_2023_math_a_complete.sql"
echo "  3. If successful, remove .backup files: find . -name '*.backup' -delete"
