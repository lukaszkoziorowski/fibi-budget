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
      },
      keyframes: {
        'float-vertical': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-horizontal': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
        'float-diagonal': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(8px, -8px)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'float-slow': 'float-vertical 6s ease-in-out infinite',
        'float-medium': 'float-diagonal 4s ease-in-out infinite',
        'float-fast': 'float-horizontal 3s ease-in-out infinite',
        'blink': 'blink 1s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
} 