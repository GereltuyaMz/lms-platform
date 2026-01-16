/**
 * Automatically detects and converts common math patterns to LaTeX
 */

type ConversionPattern = {
  pattern: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string);
  description: string;
};

/**
 * Conversion patterns for common math notations
 * Ordered by specificity (most specific first)
 */
const CONVERSION_PATTERNS: ConversionPattern[] = [
  // Exponent with fraction: 2^2/3 → $2^{\\frac{2}{3}}$
  // Must come BEFORE simple fraction patterns
  {
    pattern: /(?<!\$)([a-zA-Z0-9]+)\^(\d+)\/(\d+)(?![\/\d])/g,
    replacement: (match, base, num, den) => `$${base}^{\\frac{${num}}{${den}}}$`,
    description: "Exponent with fraction: 2^2/3",
  },

  // Exponent with fraction in parentheses: x^(2/3) → $x^{\\frac{2}{3}}$
  {
    pattern: /(?<!\$)([a-zA-Z0-9]+)\^\((\d+)\/(\d+)\)/g,
    replacement: (match, base, num, den) => `$${base}^{\\frac{${num}}{${den}}}$`,
    description: "Exponent with fraction in parentheses: x^(2/3)",
  },

  // Mixed numbers: 1(5/6) or 1 5/6 → $1\\frac{5}{6}$
  {
    pattern: /(\d+)\s*\((\d+)\/(\d+)\)/g,
    replacement: (match, whole, num, den) => `$${whole}\\frac{${num}}{${den}}$`,
    description: "Mixed number with parentheses: 1(5/6)",
  },
  {
    pattern: /(?<![\/\d])(\d+)\s+(\d+)\/(\d+)(?![\/\d])/g,
    replacement: (match, whole, num, den) => `$${whole}\\frac{${num}}{${den}}$`,
    description: "Mixed number with space: 1 5/6",
  },

  // Integral notation: e^(2x)/(e^x−1) dx → $\\frac{e^{2x}}{e^x−1}$ (dx outside)
  // Must come FIRST to catch integrals before other patterns
  {
    pattern: /(?<=^|\s)([a-zA-Z0-9^()+-]+)\/\(([^)$]+)\)\s+(d[a-zA-Z])(?=\s|$)/g,
    replacement: (match, num, den, diff) => {
      // Convert ^(...) to ^{...} in both numerator and denominator
      const convertExp = (text: string) =>
        text.replace(/\^(\([^)]+\))/g, (m, p1) => `^{${p1.slice(1, -1)}}`);

      const convertedNum = convertExp(num.trim());
      const convertedDen = convertExp(den.trim());

      return `$\\frac{${convertedNum}}{${convertedDen}}$ ${diff}`;
    },
    description: "Integral notation with differential at end: expr/(expr) dx",
  },

  // Differential notation: dx/dy, dx/dt, dx/√(...) → $\\frac{dx}{dy}$
  {
    pattern: /(?<![\/\w\$])(d[a-zA-Z])\/([^\/\s]+?)(?=\s|$|[−\-+·×])/g,
    replacement: (match, num, den) => {
      // Convert Unicode math symbols in denominator to LaTeX
      let convertedDen = den;
      // √(...) → \\sqrt{...}
      convertedDen = convertedDen.replace(/√\(([^)]+)\)/g, '\\sqrt{$1}');
      // √x → \\sqrt{x}
      convertedDen = convertedDen.replace(/√([a-zA-Z0-9]+)/g, '\\sqrt{$1}');
      return `$\\frac{${num}}{${convertedDen}}$`;
    },
    description: "Differential notation: dx/dy, dx/√(3x+1)",
  },

  // Complex fractions: (x²+3x)/(x²-4), (x+2)/x, x/(2x-4) → $\\frac{...}{...}$
  // This must come BEFORE simpler patterns to catch complex expressions first
  {
    pattern: /\(([^)$]+)\)\/\(([^)$]+)\)/g,
    replacement: (match, num, den) => {
      // Only convert if it contains variables (not pure number fractions)
      if (/[a-zA-Z]/.test(match)) {
        return `$\\frac{${num}}{${den}}$`;
      }
      return match;
    },
    description: "Complex fraction with both sides parenthesized: (x²+3x)/(x²-4)",
  },

  // Expression in parentheses over variable: (x+2)/x, (2x-4)/y → $\\frac{x+2}{x}$
  {
    pattern: /\(([^)$]+)\)\/([a-zA-Z]\w*)(?![\/\w])/g,
    replacement: (match, num, den) => `$\\frac{${num}}{${den}}$`,
    description: "Parenthesized expression over variable: (x+2)/x",
  },

  // Variable over expression in parentheses: x/(2x-4), y/(x+3) → $\\frac{x}{2x-4}$
  {
    pattern: /(?<![\/\w\$])([a-zA-Z]\w*)\/\(([^)$]+)\)/g,
    replacement: (match, num, den) => `$\\frac{${num}}{${den}}$`,
    description: "Variable over parenthesized expression: x/(2x-4)",
  },

  // Number over expression in parentheses: 1/(5x), 2/(x+3) → $\\frac{1}{5x}$
  {
    pattern: /(?<![\/\w\$])(\d+)\/\(([^)$]+)\)/g,
    replacement: (match, num, den) => `$\\frac{${num}}{${den}}$`,
    description: "Number over parenthesized expression: 1/(5x)",
  },

  // Simple fractions with variables in parentheses: (5/x) or (x/5) → $\\frac{5}{x}$
  {
    pattern: /\(([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\)/g,
    replacement: (match, num, den) => {
      // Only convert if at least one part contains a letter
      if (/[a-zA-Z]/.test(num) || /[a-zA-Z]/.test(den)) {
        return `$\\frac{${num}}{${den}}$`;
      }
      return match;
    },
    description: "Simple fraction with variable in parentheses: (5/x)",
  },

  // Number divided by variable: 1/x, 5/x, 12/abc → $\\frac{1}{x}$
  {
    pattern: /(?<![\/\w\$])(\d+)\/([a-zA-Z]\w*)(?![\/\w])/g,
    replacement: (match, num, den) => `$\\frac{${num}}{${den}}$`,
    description: "Number over variable: 1/x, 5/x",
  },

  // Variable divided by number: x/5, abc/12 → $\\frac{x}{5}$
  {
    pattern: /(?<![\/\w\$])([a-zA-Z]\w*)\/(\d+)(?![\/\w])/g,
    replacement: (match, num, den) => `$\\frac{${num}}{${den}}$`,
    description: "Variable over number: x/5",
  },

  // Variable divided by variable: x/y, abc/xyz → $\\frac{x}{y}$
  {
    pattern: /(?<![\/\w\$])([a-zA-Z]\w*)\/([a-zA-Z]\w*)(?![\/\w])/g,
    replacement: (match, num, den) => `$\\frac{${num}}{${den}}$`,
    description: "Variable over variable: x/y",
  },

  // Standalone fractions (numbers only): 1/2 → $\\frac{1}{2}$
  // Negative lookbehind/lookahead to avoid URLs, dates, and already converted fractions
  {
    pattern: /(?<![\/\d\$\^])(\d+)\/(\d+)(?![\/\d])/g,
    replacement: (match, num, den) => `$\\frac{${num}}{${den}}$`,
    description: "Simple fraction: 1/2",
  },

  // Square root: sqrt(25) → $\\sqrt{25}$
  {
    pattern: /sqrt\(([^)]+)\)/gi,
    replacement: (match, content) => `$\\sqrt{${content}}$`,
    description: "Square root: sqrt(25)",
  },

  // Unicode square root: √(25) or √25 → $\\sqrt{25}$
  {
    pattern: /√\(([^)]+)\)/g,
    replacement: (match, content) => `$\\sqrt{${content}}$`,
    description: "Unicode square root with parentheses: √(25)",
  },
  {
    pattern: /√([a-zA-Z0-9]+)/g,
    replacement: (match, content) => `$\\sqrt{${content}}$`,
    description: "Unicode square root: √25",
  },

  // Exponents already in LaTeX format: x^2 (just wrap in $)
  {
    pattern: /(?<!\$)([a-zA-Z])\^(\d+)(?!\$)/g,
    replacement: (match, base, exp) => `$${base}^${exp}$`,
    description: "Exponent: x^2",
  },

  // Subscript: x_1 → $x_1$
  {
    pattern: /(?<!\$)([a-zA-Z])_(\d+)(?!\$)/g,
    replacement: (match, base, sub) => `$${base}_${sub}$`,
    description: "Subscript: x_1",
  },
];

/**
 * Auto-converts common math patterns to LaTeX
 */
export function autoConvertMath(text: string): string {
  if (!text) return text;

  let converted = text;

  // Apply each pattern
  for (const { pattern, replacement } of CONVERSION_PATTERNS) {
    if (typeof replacement === "string") {
      converted = converted.replace(pattern, replacement);
    } else {
      converted = converted.replace(pattern, replacement);
    }
  }

  return converted;
}

/**
 * Detects if text contains convertible math patterns
 */
export function hasConvertibleMath(text: string): boolean {
  if (!text) return false;

  return CONVERSION_PATTERNS.some(({ pattern }) => {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

/**
 * Preview what the conversion would produce
 */
export function previewConversion(text: string): {
  original: string;
  converted: string;
  hasChanges: boolean;
  patterns: string[];
} {
  const converted = autoConvertMath(text);
  const matchedPatterns: string[] = [];

  // Find which patterns matched
  CONVERSION_PATTERNS.forEach(({ pattern, description }) => {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      matchedPatterns.push(description);
    }
  });

  return {
    original: text,
    converted,
    hasChanges: converted !== text,
    patterns: matchedPatterns,
  };
}

/**
 * Smart conversion that avoids double-wrapping
 */
export function smartConvertMath(text: string): string {
  // Don't convert if already has LaTeX (contains $ signs)
  if (text.includes("$")) {
    return text;
  }

  return autoConvertMath(text);
}
