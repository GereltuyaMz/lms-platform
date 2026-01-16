import { useCallback } from "react";
import { smartConvertMath } from "@/lib/utils/math-converter";

type UseAutoMathConvertOptions = {
  enabled?: boolean;
  onConvert?: (converted: string) => void;
};

/**
 * Hook for automatic math conversion on blur
 *
 * Usage:
 * ```tsx
 * const handleAutoConvert = useAutoMathConvert({
 *   onConvert: (converted) => setValue(converted)
 * });
 *
 * <Textarea onBlur={(e) => handleAutoConvert(e.target.value)} />
 * ```
 */
export function useAutoMathConvert(options: UseAutoMathConvertOptions = {}) {
  const { enabled = true, onConvert } = options;

  const handleAutoConvert = useCallback(
    (text: string) => {
      if (!enabled || !text) return;

      const converted = smartConvertMath(text);

      // Only call onConvert if something changed
      if (converted !== text && onConvert) {
        onConvert(converted);
      }

      return converted;
    },
    [enabled, onConvert]
  );

  return handleAutoConvert;
}
