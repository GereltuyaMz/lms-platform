import type { SVGProps } from "react";

export const TestIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M1.5 1.125V9.375C1.5 10.2034 2.17157 10.875 3 10.875H10.5V9.375H3C2.58579 9.375 2.25 9.03921 2.25 8.625V1.125H1.5Z" />
    <path d="M4.5 7.125L6 5.625L7.5 7.125L10.5 4.125" />
    <path d="M8.25 4.125H10.5V6.375" />
  </svg>
);
