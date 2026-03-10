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
        neon: {
          cyan: "#00d4ff",
          purple: "#a855f7",
          pink: "#ff006e",
          green: "#00ff88",
          bg: "#0a0a0f",
          surface: "#12121a",
          border: "#1e1e2e",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-share-tech)", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 10px rgba(0,212,255,0.5), 0 0 30px rgba(0,212,255,0.2)",
        "neon-cyan-lg": "0 0 20px rgba(0,212,255,0.7), 0 0 60px rgba(0,212,255,0.3)",
        "neon-purple": "0 0 10px rgba(168,85,247,0.5), 0 0 30px rgba(168,85,247,0.2)",
        "neon-purple-lg": "0 0 20px rgba(168,85,247,0.7), 0 0 60px rgba(168,85,247,0.3)",
        "neon-pink": "0 0 10px rgba(255,0,110,0.5), 0 0 30px rgba(255,0,110,0.2)",
        "neon-green": "0 0 10px rgba(0,255,136,0.5), 0 0 30px rgba(0,255,136,0.2)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "roll-die": "roll-die 0.6s ease-out",
        "spin-slow": "spin 3s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "confetti-fall": "confetti-fall 3s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "roll-die": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "25%": { transform: "rotate(-15deg) scale(1.1)" },
          "50%": { transform: "rotate(10deg) scale(0.95)" },
          "75%": { transform: "rotate(-5deg) scale(1.05)" },
          "100%": { transform: "rotate(0deg) scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
