import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          0: "var(--void-0)",
          1: "var(--void-1)",
          2: "var(--void-2)",
          3: "var(--void-3)",
          4: "var(--void-4)",
          5: "var(--void-5)",
        },
        acid: {
          300: "var(--acid-300)",
          400: "var(--acid-400)",
          500: "var(--acid-500)",
          600: "var(--acid-600)",
        },
        pink: {
          300: "var(--pink-300)",
          400: "var(--pink-400)",
          500: "var(--pink-500)",
          600: "var(--pink-600)",
        },
        cyan: {
          400: "var(--cyan-400)",
          500: "var(--cyan-500)",
          600: "var(--cyan-600)",
        },
        paper: {
          100: "var(--paper-100)",
          200: "var(--paper-200)",
        },
        ink: {
          900: "var(--ink-900)",
        },
        sunset: {
          500: "var(--sunset-500)",
          600: "var(--sunset-600)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        acid: "var(--glow-acid)",
        "acid-strong": "var(--glow-acid-strong)",
        pink: "var(--glow-pink)",
        cyan: "var(--glow-cyan)",
        purple: "var(--glow-purple)",
        sticker: "var(--shadow-sticker)",
        elevated: "var(--shadow-elevated)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        snap: "var(--ease-snap)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "360ms",
      },
      maxWidth: {
        container: "var(--container-lg)",
      },
    },
  },
  plugins: [],
};

export default config;
