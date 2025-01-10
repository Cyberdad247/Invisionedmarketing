/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4a3f54',
        secondary: '#5e5066',
        accent: '#72617e',
      },
    },
  },
  plugins: [],
};