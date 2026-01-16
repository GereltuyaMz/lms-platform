#!/usr/bin/env python3
"""
Transform EYSH Seed Files to Current Schema
============================================
Removes deprecated columns from mock_tests INSERT statements:
- passing_score_percentage
- eysh_threshold_500, eysh_threshold_600, eysh_threshold_700, eysh_threshold_800
- created_at, updated_at (have defaults)
"""

import re
import os
from pathlib import Path

def transform_file(filepath):
    """Transform a single SQL file to match current schema."""
    print(f"  📝 Processing: {filepath.name}")

    # Read file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match INSERT INTO mock_tests with multi-line statement
    pattern = r'INSERT INTO mock_tests \((.*?)\) VALUES \((.*?)\);'

    def transform_insert(match):
        columns = match.group(1)
        values = match.group(2)

        # Clean up columns - remove deprecated fields
        columns = re.sub(r',?\s*passing_score_percentage', '', columns)
        columns = re.sub(r',?\s*eysh_threshold_500[^,]*', '', columns)
        columns = re.sub(r',?\s*eysh_threshold_600[^,]*', '', columns)
        columns = re.sub(r',?\s*eysh_threshold_700[^,]*', '', columns)
        columns = re.sub(r',?\s*eysh_threshold_800[^,]*', '', columns)
        columns = re.sub(r',?\s*created_at[^,]*', '', columns)
        columns = re.sub(r',?\s*updated_at[^,]*', '', columns)

        # Clean up values - remove corresponding values
        # Pattern: Look for values after 'math' category
        values_clean = re.sub(r'(true,\s*[\'"]math[\'"])[^)]*', r'\1', values)

        # Remove trailing commas and whitespace
        columns = re.sub(r',\s*$', '', columns.strip())
        columns = re.sub(r'\s+', ' ', columns)

        return f'INSERT INTO mock_tests ({columns}\n) VALUES ({values_clean}\n);'

    # Apply transformation
    content_new = re.sub(pattern, transform_insert, content, flags=re.DOTALL)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content_new)

    print(f"  ✅ Transformed: {filepath.name}")

def main():
    """Transform all seed files across years 2018-2023."""
    base_dir = Path(__file__).parent
    years = [2018, 2019, 2020, 2021, 2022, 2023]

    print("🔄 Transforming EYSH seed files (2018-2023)...\n")

    total_files = 0
    for year in years:
        year_dir = base_dir / str(year)
        if not year_dir.exists():
            print(f"⚠️  Directory not found: {year_dir}")
            continue

        print(f"📅 Year: {year}")
        sql_files = list(year_dir.glob('*.sql'))
        sql_files = [f for f in sql_files if not f.name.endswith('.backup')]

        if not sql_files:
            print(f"  ℹ️  No SQL files found")
            continue

        for sql_file in sql_files:
            # Create backup
            backup_file = sql_file.with_suffix('.sql.backup')
            if not backup_file.exists():
                import shutil
                shutil.copy2(sql_file, backup_file)

            transform_file(sql_file)
            total_files += 1

        print()

    print(f"✨ Transformation complete!")
    print(f"📊 Transformed {total_files} files across {len(years)} years")
    print(f"📁 Backup files saved with .backup extension\n")

if __name__ == '__main__':
    main()
