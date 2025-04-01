/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#58009F',
        secondary: '#EDE4F4',
        background: '#F3F4F6',
        content: {
          primary: '#1D1D1D',
          secondary: '#6A6A6A',
          inverted: '#FFFFFF'
        },
        surface: '#FFFFFF'
      },
      borderRadius: {
        'button': '12px',
      }
    },
  },
  plugins: [],
} 