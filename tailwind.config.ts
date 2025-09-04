import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add custom breakpoint for extra small screens
      screens: {
        'xs': '475px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Design system friendly spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Enhanced shadows for professional look
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};

export default config; 