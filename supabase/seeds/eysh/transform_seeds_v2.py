#!/usr/bin/env python3
"""
Transform EYSH Seed Files to Current Schema (Version 2)
=======================================================
Handles both single-line and multi-line INSERT statements.
Removes deprecated columns and their values.
"""

import re
from pathlib import Path

def transform_mock_test_insert(content):
    """Transform INSERT INTO mock_tests statements."""

    # Find the INSERT INTO mock_tests statement (can be multi-line or single-line)
    pattern = r'INSERT INTO mock_tests\s*\([^)]+\)\s*VALUES\s*\([^;]+\);'

    def replace_insert(match):
        full_match = match.group(0)

        # Extract column names section
        cols_match = re.search(r'\(([^)]+)\)\s*VALUES', full_match, re.DOTALL)
        if not cols_match:
            return full_match

        cols_text = cols_match.group(1)

        # Extract values section
        vals_match = re.search(r'VALUES\s*\((.+)\)', full_match, re.DOTALL)
        if not vals_match:
            return full_match

        vals_text = vals_match.group(1)

        # Parse columns
        cols = [c.strip() for c in re.split(r',', cols_text)]
        cols = [c for c in cols if c]  # Remove empty

        # Parse values - be careful with strings containing commas
        # Use a simple state machine to handle quoted strings
        vals = []
        current_val = ""
        in_string = False
        quote_char = None
        paren_depth = 0

        for char in vals_text:
            if char in ('"', "'") and (not in_string or char == quote_char):
                in_string = not in_string
                quote_char = char if in_string else None
                current_val += char
            elif char == '(' and not in_string:
                paren_depth += 1
                current_val += char
            elif char == ')' and not in_string:
                paren_depth -= 1
                current_val += char
            elif char == ',' and not in_string and paren_depth == 0:
                vals.append(current_val.strip())
                current_val = ""
            else:
                current_val += char

        if current_val.strip():
            vals.append(current_val.strip())

        # Build column-value pairs
        col_val_pairs = list(zip(cols, vals))

        # Filter out deprecated columns
        deprecated = {
            'passing_score_percentage',
            'eysh_threshold_500',
            'eysh_threshold_600',
            'eysh_threshold_700',
            'eysh_threshold_800',
            'created_at',
            'updated_at'
        }

        new_pairs = [(c, v) for c, v in col_val_pairs if c not in deprecated]

        if not new_pairs:
            return full_match

        # Rebuild the INSERT statement
        new_cols = [c for c, v in new_pairs]
        new_vals = [v for c, v in new_pairs]

        result = "INSERT INTO mock_tests (\n    "
        result += ",\n    ".join(new_cols)
        result += "\n) VALUES (\n    "
        result += ",\n    ".join(new_vals)
        result += "\n);"

        return result

    return re.sub(pattern, replace_insert, content, flags=re.DOTALL)

def transform_file(filepath):
    """Transform a single SQL file."""
    print(f"  📝 {filepath.name}")

    # Read
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Transform
    new_content = transform_mock_test_insert(content)

    # Write
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  ✅ {filepath.name}")

def main():
    base_dir = Path(__file__).parent
    years = [2018, 2019, 2020, 2021, 2022, 2023]

    print("🔄 Transforming EYSH seed files...\n")

    for year in years:
        year_dir = base_dir / str(year)
        if not year_dir.exists():
            continue

        print(f"📅 Year: {year}")

        for sql_file in sorted(year_dir.glob('*.sql')):
            if sql_file.name.endswith('.backup'):
                continue

            # Restore from backup first
            backup = sql_file.with_suffix('.sql.backup')
            if backup.exists():
                import shutil
                shutil.copy2(backup, sql_file)

            transform_file(sql_file)

        print()

    print("✨ Complete!\n")

if __name__ == '__main__':
    main()
