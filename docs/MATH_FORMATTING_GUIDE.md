# Mathematical Formatting in Mock Tests

## Overview

The mock test system now supports beautiful mathematical notation using LaTeX syntax powered by KaTeX. This allows you to display fractions, equations, and mathematical symbols properly formatted.

**NEW!** ✨ **Automatic Conversion**: Just type `1/2` and click away - it automatically converts to beautiful fractions! No buttons, no LaTeX syntax needed!

## How to Use

### Automatic Conversion (Easiest Way!)

Just type naturally and **click away** - conversion happens instantly and silently:

1. **Type naturally**: `The fraction 5/9 equals 0.555...`
2. **Click away** (or press Tab)
3. **Instantly converts**: `The fraction $\frac{5}{9}$ equals 0.555...`
4. **Done!** ✨ No popups, no confirmations!

**How it works:**
- Type math naturally (5/9, x^2, sqrt(25), etc.)
- Click away from the field or press Tab
- Automatic, instant conversion - no interruption
- Preview appears below showing the beautiful result
- Stored in database as LaTeX for consistency

**Supported Patterns:**
- **Fractions**: `5/9` or `(4/9)` → `$\frac{5}{9}$`, `$\frac{4}{9}$`
- **Variable fractions**: `5/x` or `x/5` → `$\frac{5}{x}$`, `$\frac{x}{5}$`
- **Complex expressions**: `(x+2)/x` or `(x²+3x)/(x²-4)` → formatted fractions
- **Mixed numbers**: `1 5/6` or `1(5/6)` → `$1\frac{5}{6}$`
- **Square root**: `sqrt(25)` or `√(25)` → `$\sqrt{25}$`
- **Exponents**: `x^2` → `$x^2$`
- **Exponent with fraction**: `2^2/3` → `$2^{\frac{2}{3}}$`
- **Subscripts**: `x_1` → `$x_1$`
- **Differential notation**: `dx/dy` or `dx/√(3x+1)` → `$\frac{dx}{dy}$`
- **Integral notation**: `e^(2x)/(e^x−1) dx` → `$\frac{e^{2x}}{e^x−1}$ dx`

### Manual LaTeX (Advanced)

For complex expressions or full control:

### Basic Syntax

- **Inline math**: Wrap expressions in single dollar signs: `$expression$`
- **Block math**: Wrap expressions in double dollar signs: `$$expression$$`

### Common Examples

#### Fractions
```
Input:  $\frac{4}{9}$
Output: ⁴⁄₉

Input:  The fraction $\frac{4}{9}$ is less than half.
Output: The fraction ⁴⁄₉ is less than half.
```

#### Mixed Numbers
```
Input:  $1\frac{5}{6}$
Output: 1⅚

Input:  $2\frac{3}{4}$ miles
Output: 2¾ miles
```

#### Equations
```
Input:  $\frac{4}{9}x + 1\frac{5}{6} = 2$
Output: ⁴⁄₉x + 1⅚ = 2

Input:  Solve: $x^2 + 5x + 6 = 0$
Output: Solve: x² + 5x + 6 = 0
```

#### More Math Symbols

| Description | LaTeX | Result |
|------------|-------|--------|
| Square root | `$\sqrt{25}$` | √25 |
| Exponent | `$x^2$` | x² |
| Subscript | `$x_1$` | x₁ |
| Multiply | `$a \times b$` | a × b |
| Divide | `$a \div b$` | a ÷ b |
| Plus/minus | `$\pm 5$` | ± 5 |
| Not equal | `$x \neq 0$` | x ≠ 0 |
| Less/greater or equal | `$x \leq 5$` | x ≤ 5 |
| Greek letters | `$\alpha, \beta, \pi$` | α, β, π |

### Block Equations

For centered, display-style equations:

```
Input:
$$\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Output: (centered equation display)
```

## Where You Can Use Math

Math formatting works in:

1. ✅ **Problem Context** - Shared context for sub-questions
2. ✅ **Question Text** - The main question text
3. ✅ **Answer Options** - Multiple choice options
4. ✅ **Explanations** - The explanation shown after completion

## Admin Panel Features

### Live Preview

When you type LaTeX in the admin panel, you'll see a **live preview** showing how it will appear to students:

- Blue background box appears when math is detected
- Shows exactly how students will see it
- Updates as you type

### Math Guide

Click the **"LaTeX Математик томъёо бичих заавар"** button in the question editor to see:

- Common examples with visual previews
- Copy-paste ready syntax
- Quick reference for symbols

## Tips

1. **Always test**: Use the preview to verify your math looks correct
2. **Keep it simple**: Start with basic fractions, add complexity as needed
3. **Consistent style**: Use inline `$...$` for small expressions, block `$$...$$` for important equations
4. **Escape special characters**: If you need a literal `$`, use `\$`

## Examples from Real Tests

### Example 1: Fraction in Question
```
Question Text:
Дараах бутархайг бодоорой: $\frac{4}{9} + \frac{2}{3} = ?$

Options:
A) $\frac{10}{9}$ ✓
B) $\frac{6}{12}$
C) $\frac{2}{3}$
D) $\frac{8}{9}$
```

### Example 2: Equation with Mixed Numbers
```
Question Text:
$(4/9)x + 1(5/6) = 2$ тэгшитгэлийг бод.

Better with LaTeX:
$\frac{4}{9}x + 1\frac{5}{6} = 2$ тэгшитгэлийг бод.
```

### Example 3: Explanation with Steps
```
Explanation:
$$\frac{4}{9}x = 2 - 1\frac{5}{6}$$

$$\frac{4}{9}x = \frac{1}{6}$$

$$x = \frac{1}{6} \times \frac{9}{4} = \frac{3}{8}$$
```

## Troubleshooting

### Math Not Rendering?

1. **Check syntax**: Make sure you have matching `$` signs
2. **Backslashes**: Use `\frac{a}{b}` not `/frac{a}{b}`
3. **Preview**: If preview doesn't show, there's a syntax error

### Common Mistakes

❌ `$1/2$` - Shows as plain text "1/2"
✅ `$\frac{1}{2}$` - Shows as beautiful fraction

❌ `$sqrt{25}$` - Missing backslash
✅ `$\sqrt{25}$` - Correct

❌ `$x^2 + y^2$ = 25` - Mismatched `$`
✅ `$x^2 + y^2 = 25$` - Correct

## Resources

- Full LaTeX math guide: https://katex.org/docs/supported.html
- Interactive preview: https://katex.org/

---

**Note**: The math rendering uses KaTeX, which is fast and works offline. All math is rendered client-side for best performance.
