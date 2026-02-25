/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{tsx,ts}',
    './components/**/*.{tsx,ts}',
    './services/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1b6fb',
          400: '#6d8bf7',
          500: '#435ef1',
          600: '#2d3fe4',
          700: '#2430ca',
          800: '#232aa3',
          900: '#212981',
          950: '#14174d',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
