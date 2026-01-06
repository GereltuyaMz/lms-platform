declare module 'react-katex' {
  import { ComponentType } from 'react';

  export interface KatexProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
    settings?: object;
  }

  export const BlockMath: ComponentType<{ math: string; errorColor?: string }>;
  export const InlineMath: ComponentType<{ math: string; errorColor?: string }>;
}
