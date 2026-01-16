# Automatic Math Conversion Feature

## Overview

The admin panel now **automatically converts** common math patterns to beautifully formatted LaTeX - **instantly and silently** when you finish typing. No buttons, no popups, no confirmations!

## How It Works

### Detection Patterns

The system **automatically** detects and converts these patterns when you click away:

| Pattern | Example Input | LaTeX Output | Visual Result |
|---------|--------------|--------------|---------------|
| **Simple fraction** | `5/9` | `$\frac{5}{9}$` | ⁵⁄₉ |
| Fraction in parentheses | `(4/9)` | `$\frac{4}{9}$` | ⁴⁄₉ |
| **Variable in fraction** | `5/x` | `$\frac{5}{x}$` | ⁵⁄ₓ |
| Variable numerator | `x/5` | `$\frac{x}{5}$` | ˣ⁄₅ |
| Mixed number with parentheses | `1(5/6)` | `$1\frac{5}{6}$` | 1⅚ |
| Mixed number with space | `1 5/6` | `$1\frac{5}{6}$` | 1⅚ |
| Square root | `sqrt(25)` | `$\sqrt{25}$` | √25 |
| Exponent | `x^2` | `$x^2$` | x² |
| **Exponent with fraction** | `2^2/3` | `$2^{\frac{2}{3}}$` | 2^(²⁄₃) |
| Subscript | `x_1` | `$x_1$` | x₁ |
| Unicode square root | `√(3x+1)` | `$\sqrt{3x+1}$` | √(3x+1) |
| **Differential notation** | `dx/dy` | `$\frac{dx}{dy}$` | ᵈˣ⁄ᵈʸ |
| Differential with radical | `dx/√(3x+1)` | `$\frac{dx}{\sqrt{3x+1}}$` | ᵈˣ⁄√(3x+1) |
| **Integral notation** | `e^(2x)/(e^x−1) dx` | `$\frac{e^{2x}}{e^x−1}$ dx` | Integrand with dx at end |

**All conversions happen instantly when you Tab or click away - no popups!**

### User Experience

#### Step 1: Type Naturally
```
Type: The solution is 5/9 x + 1 5/6 = 2
```
Just type math expressions naturally using standard notation.

#### Step 2: Click Away (Automatic Conversion)
- **Click away** from the field (or press Tab)
- **Instant conversion** happens silently
- **No popup**, no confirmation dialog
- Text updates immediately to LaTeX

#### Step 3: See Preview
- Blue preview box appears below showing: ⁵⁄₉ x + 1⅚ = 2
- Confirms the conversion worked correctly
- No action needed - already converted!

#### What You See:
- **In field**: `The solution is $\frac{5}{9}$ x + $1\frac{5}{6}$ = 2`
- **Preview**: The solution is ⁵⁄₉ x + 1⅚ = 2
- **Database**: Stores the LaTeX format for consistency

## Technical Implementation

### Components

1. **Math Converter Utility** (`src/lib/utils/math-converter.ts`)
   - Pattern detection engine
   - Conversion logic
   - Preview generation

2. **MathConverter Component** (`src/components/admin/mock-tests/form/MathConverter.tsx`)
   - Auto-detection UI
   - Popover preview
   - One-click conversion

3. **Integration Points**
   - Problem context textarea
   - Question text textarea
   - Explanation textarea
   - Option text inputs

### Smart Detection

The system is intelligent about what to convert:
- ✅ **Converts**: `The answer is 5/9` → `The answer is $\frac{5}{9}$`
- ✅ **Converts**: `(4/9)x` → `$\frac{4}{9}$x`
- ❌ **Skips**: `The answer is correct` (no math patterns)
- ❌ **Skips**: `$\frac{4}{9}$` (already LaTeX - no double conversion)
- ❌ **Skips**: `http://example.com/page` (URL, not math)

### Conversion Examples

#### Example 1: Simple Fraction (NEW!)
```
Type:   "The probability is 5/9"
[Tab]   → Instantly converts
Result: "The probability is $\frac{5}{9}$"
```
*Now works without parentheses!*

#### Example 2: Mixed Numbers
```
Type:   "Answer: 1(5/6) miles"
[Tab]   → Instantly converts
Result: "Answer: $1\frac{5}{6}$ miles"
```
*Silent conversion - no popup.*

#### Example 3: Equation
```
Type:   "(4/9)x + 1 5/6 = 2 болно"
[Tab]   → Instantly converts
Result: "$\frac{4}{9}$x + $1\frac{5}{6}$ = 2 болно"
```
*All patterns converted at once.*

#### Example 4: Multiple Patterns
```
Type:   "If x^2 = 5/9 then x_1 = sqrt(0.555)"
[Tab]   → Instantly converts
Result: "If $x^2$ = $\frac{5}{9}$ then $x_1$ = $\sqrt{0.555}$"
```
*Seamless multi-pattern detection.*

## Benefits

### For Admins
- ✅ **No popups**: Instant, silent conversion
- ✅ **No LaTeX syntax**: Just type 5/9, x^2, etc.
- ✅ **Zero clicks**: Automatic on blur (Tab or click away)
- ✅ **Instant preview**: See beautiful math immediately
- ✅ **Much faster**: No interruptions in workflow

### For Students
- ✅ Beautiful, readable math
- ✅ Professional appearance
- ✅ Consistent formatting
- ✅ Better understanding

## Usage Guidelines

### Best Practices

1. **Type naturally**: Write `5/9` instead of trying to remember LaTeX
2. **Click away**: Just Tab or click elsewhere - conversion is instant
3. **Check preview**: Blue box shows how it will display
4. **Mix and match**: Can use both auto-convert and manual LaTeX
5. **Edit after**: Can still edit the LaTeX manually if needed

### When to Use Auto-Convert

✅ **Good for:**
- Simple fractions: `(4/9)`
- Mixed numbers: `1(5/6)`
- Basic equations: `x^2 + 5`
- Square roots: `sqrt(25)`

❌ **Manual LaTeX better for:**
- Complex nested fractions
- Greek letters (α, β, π)
- Special symbols (≠, ≤, ÷)
- Integrals, summations
- Multi-line equations

### Pattern Recognition Tips

For best detection:
- **Simple fractions**: `5/9` works directly (NEW!)
- **Parentheses also work**: `(4/9)` converts the same
- **Mixed numbers**: `1 5/6` or `1(5/6)` both work
- **Square roots**: `sqrt(25)` converts to √25
- **Exponents**: `x^2` works perfectly

## Troubleshooting

### Button Not Showing?

Check if your text contains these patterns:
- Fractions must be in parentheses: `(4/9)` ✓ vs `4/9` ✗
- Mixed numbers need space or parentheses: `1 5/6` ✓ vs `15/6` ✗
- Already LaTeX? Button won't show: `$\frac{4}{9}$` ✗

### Conversion Not Working?

1. **Check pattern syntax**: Follow the examples above
2. **Avoid existing LaTeX**: Auto-convert skips text with `$` signs
3. **Review preview**: Shows exactly what will happen

### Wrong Conversion?

1. **Click "Болих"**: Cancel the conversion
2. **Use manual LaTeX**: Write LaTeX syntax directly
3. **Edit after**: Can manually fix the generated LaTeX

## Examples in Context

### Problem Context
```
Original:
"Дараах асуултууд (4/9)x + 1(5/6) = 2 тэгшитгэлтэй холбоотой"

After Auto-Convert:
"Дараах асуултууд $\frac{4}{9}$x + $1\frac{5}{6}$ = 2 тэгшитгэлтэй холбоотой"
```

### Question Text
```
Original:
"Хэрэв (4/9)x = (1/6) бол x-ийн утга ол"

After Auto-Convert:
"Хэрэв $\frac{4}{9}$x = $\frac{1}{6}$ бол x-ийн утга ол"
```

### Answer Options
```
Original:
A) (3/8)
B) (2/3)
C) 1(1/2)
D) (9/24)

After Auto-Convert:
A) $\frac{3}{8}$
B) $\frac{2}{3}$
C) $1\frac{1}{2}$
D) $\frac{9}{24}$
```

### Explanation
```
Original:
"(4/9)x = 2 - 1(5/6) гэхэд
(4/9)x = (1/6)
x = (1/6) × (9/4) = (3/8)"

After Auto-Convert:
"$\frac{4}{9}$x = 2 - $1\frac{5}{6}$ гэхэд
$\frac{4}{9}$x = $\frac{1}{6}$
x = $\frac{1}{6}$ × $\frac{9}{4}$ = $\frac{3}{8}$"
```

## Performance

- **Detection**: Instant (< 1ms)
- **Preview**: Real-time
- **Conversion**: Immediate
- **No server calls**: All client-side

## Future Enhancements

Potential improvements:
- [ ] Auto-convert on paste
- [ ] Batch convert all fields
- [ ] More pattern types (inequalities, etc.)
- [ ] Undo/redo support
- [ ] Keyboard shortcut (Ctrl+M)
