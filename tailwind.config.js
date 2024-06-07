/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode : 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './theme.config.tsx'
  ],
  theme: {
    extend: {
      colors: {
        magic: {
          purple: "#7132F5",
          'deep-purple': "#2B1463",
          black: "#101114",
          white: "#F0EFFF",
          'soft-pink': "#F7D2FE",
        }
      }
    },
  },
  plugins: [],
}