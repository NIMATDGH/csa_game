/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        arenaPurple: '#6C63FF',
        arenaPink: '#FF5DA2',
        arenaYellow: '#FFCD38',
        arenaTeal: '#2DD4BF',
      },
    },
  },
  plugins: [],
};
