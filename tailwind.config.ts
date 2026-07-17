import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#0B0C0E",
          50: "#F4F4F5",
          100: "#E3E4E6",
          200: "#C3C5C9",
          300: "#9CA0A6",
          400: "#6B6F76",
          500: "#44474D",
          600: "#2E3035",
          700: "#1E1F23",
          800: "#141517",
          900: "#0B0C0E",
          950: "#050506",
        },
        concrete: {
          DEFAULT: "#8A8D92",
          50: "#F6F6F6",
          100: "#EDEDED",
          200: "#D9DADB",
          300: "#BFC1C3",
          400: "#A3A6A9",
          500: "#8A8D92",
          600: "#6E7176",
          700: "#56585C",
          800: "#3D3E41",
          900: "#252628",
        },
        warmwhite: {
          DEFAULT: "#F8F6F2",
          soft: "#F2EFE9",
          muted: "#EAE6DE",
        },
        gold: {
          DEFAULT: "#B08A4E",
          50: "#F8F3EA",
          100: "#EFE3CC",
          200: "#DEC698",
          300: "#CCAA6E",
          400: "#BB9A5D",
          500: "#B08A4E",
          600: "#8F6F3D",
          700: "#6E5530",
          800: "#4D3B22",
          900: "#2E2314",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      backgroundImage: {
        "gold-line": "linear-gradient(90deg, transparent, #B08A4E, transparent)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-line": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
        "grow-line": "grow-line 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      boxShadow: {
        premium: "0 20px 60px -15px rgba(11,12,14,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
