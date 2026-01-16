"use client";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

type MathTextProps = {
  children: string;
  className?: string;
};

/**
 * Renders text with LaTeX math expressions
 *
 * Syntax:
 * - Inline math: $expression$ or \(expression\)
 * - Block math: $$expression$$ or \[expression\]
 *
 * Examples:
 * - Inline: "The fraction $\frac{4}{9}$ is less than..."
 * - Block: "$$\frac{4}{9}x + 1\frac{5}{6} = 2$$"
 * - Mixed number: "$1\frac{5}{6}$" renders as 1⅚
 */
export const MathText = ({ children, className = "" }: MathTextProps) => {
  if (!children) return null;

  // Split text by math delimiters while preserving them
  const parts: { type: "text" | "inline" | "block"; content: string }[] = [];
  let remaining = children;

  // Process block math first ($$...$$)
  const blockMathRegex = /\$\$(.*?)\$\$/g;
  let lastIndex = 0;
  let match;

  while ((match = blockMathRegex.exec(children)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const textBefore = children.slice(lastIndex, match.index);
      parts.push({ type: "text", content: textBefore });
    }

    // Add the block math
    parts.push({ type: "block", content: match[1] });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < children.length) {
    remaining = children.slice(lastIndex);
  } else {
    remaining = "";
  }

  // Process inline math in remaining text ($...$)
  if (remaining) {
    const inlineMathRegex = /\$(.*?)\$/g;
    lastIndex = 0;

    while ((match = inlineMathRegex.exec(remaining)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const textBefore = remaining.slice(lastIndex, match.index);
        parts.push({ type: "text", content: textBefore });
      }

      // Add the inline math
      parts.push({ type: "inline", content: match[1] });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < remaining.length) {
      parts.push({ type: "text", content: remaining.slice(lastIndex) });
    }
  }

  // If no math found, return plain text
  if (parts.length === 0) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.type === "block") {
          return (
            <div key={idx} className="my-4">
              <BlockMath math={part.content} />
            </div>
          );
        } else if (part.type === "inline") {
          return (
            <span key={idx} style={{ verticalAlign: 'middle', display: 'inline-block' }}>
              <InlineMath math={part.content} />
            </span>
          );
        } else {
          return <span key={idx}>{part.content}</span>;
        }
      })}
    </span>
  );
};

/**
 * Helper function to check if text contains LaTeX math
 */
export const hasMath = (text: string): boolean => {
  return /\$.*?\$|\$\$.*?\$\$/.test(text);
};

/**
 * LaTeX syntax examples for common math expressions
 */
export const LATEX_EXAMPLES = {
  fraction: "\\frac{4}{9}",
  mixedNumber: "1\\frac{5}{6}",
  equation: "\\frac{4}{9}x + 1\\frac{5}{6} = 2",
  squareRoot: "\\sqrt{25}",
  exponent: "x^2",
  subscript: "x_1",
  sum: "\\sum_{i=1}^{n}",
  integral: "\\int_{a}^{b}",
  greekLetters: "\\alpha, \\beta, \\gamma",
  operators: "\\times, \\div, \\pm, \\neq, \\leq, \\geq",
};
