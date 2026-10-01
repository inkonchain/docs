/** @type {import('tailwindcss').Config} */

// Colors map to the CSS variables in src/globals.css (RGB triplets), so
// light/dark switch automatically and opacity modifiers like `bg-ink/10` work.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,md,mdx}", "./theme.config.tsx"],
  theme: {
    extend: {
      // Radii scale with --round, set by the ink tuner on the home page
      // (components/InkHero/tune.ts): 0 = square, 1 = default, capped above.
      borderRadius: {
        DEFAULT: "min(calc(0.25rem * var(--round, 1)), 0.75rem)",
        md: "min(calc(0.375rem * var(--round, 1)), 1rem)",
        lg: "min(calc(0.5rem * var(--round, 1)), 1.25rem)",
        xl: "min(calc(0.75rem * var(--round, 1)), 1.5rem)",
        "2xl": "min(calc(1rem * var(--round, 1)), 2.5rem)",
        "3xl": "min(calc(1.5rem * var(--round, 1)), 4rem)",
        // 24px at rest: pills up to 48px tall are fully round, and they ease
        // from square instead of snapping
        full: "calc(1.5rem * var(--round, 1))",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem", // This is a very large radius
      },
      colors: {
        background: token("background"),
        container: token("container"),
        "container-2": token("container-2"),
        primary: token("primary"),
        secondary: token("secondary"),
        outline: {
          DEFAULT: token("outline"),
          // Hairline dividers and card borders (ink-web-app --border-subtle)
          subtle: token("outline-subtle"),
        },
        ink: {
          DEFAULT: token("ink"),
          light: token("ink-light"),
          soft: token("ink-soft"),
        },
        positive: {
          DEFAULT: token("positive"),
          bg: token("positive-bg"),
        },
        warning: {
          DEFAULT: token("warning"),
          bg: token("warning-bg"),
        },
      },
      fontFamily: {
        sans: [
          "var(--font-satoshi)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
      },
    },
  },
  plugins: [],
};
