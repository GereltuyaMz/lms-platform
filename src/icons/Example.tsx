import type { SVGProps } from "react";

export const ExampleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 1V1.5" />
    <path d="M10 6H10.5" />
    <path d="M1 6H1.5" />
    <path d="M8.5 3.5L8.85 3.15" />
    <path d="M3.15 3.15L3.5 3.5" />
    <path d="M4.5 10.5H7.5" />
    <path d="M4.5 9V8.25C4.5 7.5 3.75 7 3.75 6C3.75 4.75736 4.75736 3.75 6 3.75C7.24264 3.75 8.25 4.75736 8.25 6C8.25 7 7.5 7.5 7.5 8.25V9" />
  </svg>
);
