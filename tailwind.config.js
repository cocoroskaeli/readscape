module.exports = {
  darkMode: 'class', // 👈 важно за class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ["animate-pulse"], // 👈 ако purge го вади
  theme: {
    extend: {},
  },
  plugins: [],
};