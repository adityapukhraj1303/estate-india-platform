import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: '#e5e8f0',
          100: '#bcc4da',
          200: '#909ec3',
          300: '#6479ab',
          400: '#385394',
          500: '#1b346d',  // Primary Navy
          600: '#132856',
          700: '#0c1b3f',
          800: '#060f28',
          900: '#020511',
        },
        gold: {
          400: '#f9d261',
          500: '#f7b928',  // Accent Gold
          600: '#d99718',
        },
        surface: 'var(--surface)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
      backgroundImage: {
        'glass': 'linear-gradient(108deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
