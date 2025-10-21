import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        subnet: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#34CC99', // Primary green
          600: '#0d9488',
          700: '#006261', // Primary dark green
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#34CC99',
          600: '#0d9488',
          700: '#006261',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
          DEFAULT: '#34CC99',
          foreground: '#ffffff',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
          DEFAULT: '#006261',
          foreground: '#ffffff',
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#34CC99',
            600: '#0d9488',
            700: '#006261',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e',
            DEFAULT: '#34CC99',
            foreground: '#ffffff',
          },
          secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
            DEFAULT: '#006261',
            foreground: '#ffffff',
          },
        },
      },
      dark: {
        colors: {
          primary: {
            50: '#042f2e',
            100: '#134e4a',
            200: '#115e59',
            300: '#006261',
            400: '#0d9488',
            500: '#34CC99',
            600: '#2dd4bf',
            700: '#5eead4',
            800: '#99f6e4',
            900: '#ccfbf1',
            950: '#f0fdfa',
            DEFAULT: '#34CC99',
            foreground: '#000000',
          },
          secondary: {
            50: '#020617',
            100: '#0f172a',
            200: '#1e293b',
            300: '#334155',
            400: '#475569',
            500: '#64748b',
            600: '#94a3b8',
            700: '#cbd5e1',
            800: '#e2e8f0',
            900: '#f1f5f9',
            950: '#f8fafc',
            DEFAULT: '#006261',
            foreground: '#ffffff',
          },
        },
      },
    },
  })],
}

module.exports = config;