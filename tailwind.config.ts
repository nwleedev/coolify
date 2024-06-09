import tailwindTypography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway"],
        lato: ["Lato"],
        inter: ["Inter"],
      },
    },
  },
  plugins: [tailwindTypography],
} satisfies Config;
