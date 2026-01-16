import { useState, useEffect } from 'react';
import { AsciiMath } from 'asciimath-parser';

// Initialize AsciiMath parser
const am = new AsciiMath({ display: false });

type UseMathPreviewReturn = {
  latex: string;
  error: string | null;
  isConverting: boolean;
};

/**
 * Hook for live math preview using asciimath-parser
 * Converts AsciiMath syntax to LaTeX in real-time
 *
 * @param input - AsciiMath expression (e.g., "x/2 + sqrt(y)")
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 * @returns Object with latex output, error state, and conversion status
 *
 * @example
 * ```tsx
 * const { latex, error } = useMathPreview(inputValue);
 * return <MathText>{latex}</MathText>;
 * ```
 */
export function useMathPreview(
  input: string,
  debounceMs: number = 300
): UseMathPreviewReturn {
  const [latex, setLatex] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    // Clear previous results
    setIsConverting(true);
    setError(null);

    // Debounce conversion
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setLatex('');
        setIsConverting(false);
        return;
      }

      try {
        // Convert using asciimath-parser
        const result = am.toTex(input);

        // Clean up the output (remove \displaystyle{} wrapper)
        const cleaned = result
          .replace(/^\\displaystyle\{\s*/, '')
          .replace(/\s*\}$/, '')
          .replace(/\s+/g, ' ')
          .replace(/\{\s+/g, '{')
          .replace(/\s+\}/g, '}')
          .trim();

        setLatex(cleaned ? `$${cleaned}$` : '');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid AsciiMath syntax');
        setLatex('');
      } finally {
        setIsConverting(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [input, debounceMs]);

  return { latex, error, isConverting };
}
