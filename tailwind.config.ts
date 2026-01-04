import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "250% 50%" },
          "100%": { backgroundPosition: "-150% 50%" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
    },
  },
};

export default config;
