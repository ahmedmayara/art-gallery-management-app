/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      display: ['Volkhov', 'serif'],
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
