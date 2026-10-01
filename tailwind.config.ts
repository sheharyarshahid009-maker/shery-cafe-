import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0f0f11",
          900: "#141416",
          800: "#1c1c1f",
          700: "#26262b",
          600: "#333338",
        },
        gold: {
          400: "#F59E0B",
          500: "#D97706",
          600: "#B45309",
        },
        slate: {
          850: "#1e293b",
        },
      },
      fontFamily: {
        display: ["Georgia", "'Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(217, 119, 6, 0.35)",
        "glow-sm": "0 0 12px rgba(217, 119, 6, 0.25)",
        card: "0 8px 32px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      },
    },
  },
  plugins: [],
};

export default config;
