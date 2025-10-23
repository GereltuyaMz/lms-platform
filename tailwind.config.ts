import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        h1: ["56px", { fontWeight: "400" }],
        h2: ["48px", { fontWeight: "400" }],
        h3: ["40px", { fontWeight: "400" }],
        h4: ["32px", { fontWeight: "400" }],
        h5: ["24px", { fontWeight: "400" }],
        h6: ["20px", { fontWeight: "400" }],
        large: ["20px"],
        medium: ["18px"],
        // regular: ["16px"],
        small: ["14px"],
        tiny: ["12px"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
    },
  },
};

export default config;
