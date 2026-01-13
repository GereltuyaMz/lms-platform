# Fix Bug Command (Regression-Safe)

You are in bug-fixing mode.

## Bug Description

$ARG

## Step 1 — Understand

- Identify:
  - Expected behavior
  - Actual behavior
  - Root cause
- Explicitly state **why the bug happens**

## Step 2 — Impact Analysis (CRITICAL)

- List what parts of the system this code touches
- Identify:
  - Who/what could be affected by this change
  - Edge cases
  - Similar flows that might break

## Step 3 — Fix Strategy

- Choose the **smallest possible fix**
- Do NOT refactor unless the refactor is required to fix the bug
- Prefer:
  - Guards
  - Condition checks
  - Narrow logic changes
- Avoid:
  - Global behavior changes
  - Shared utility changes unless unavoidable

## Step 4 — Implement Fix

- Apply the fix with minimal diff
- Keep existing behavior intact
- Do not introduce new dependencies

## Step 5 — Regression Check

Before finishing, verify:

- Original bug is resolved
- Existing behavior still works:
  - Happy path
  - Edge cases
- If uncertainty exists, explain the risk clearly

## Completion

- Git commit with descriptive message:
  - `fix: <bug summary without side effects>`
