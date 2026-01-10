import type { SVGProps } from "react";

export const TheoryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 13"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M1.5 1.625V11.375H10.5V3.875L8.25 1.625H1.5Z" />
    <path d="M3.75 5.375H8.25" />
    <path d="M3.75 7.625H8.25" />
    <path d="M3.75 9.875H6" />
  </svg>
);
