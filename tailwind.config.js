/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f0f4ef',
          100: '#dce5da',
          200: '#b8ccb4',
          300: '#8BA888',
          400: '#6f8e6c',
          500: '#567854',
          600: '#435f42',
          700: '#354b35',
          800: '#2b3c2b',
          900: '#243224',
        },
        terracotta: {
          50: '#fdf2ee',
          100: '#fbe0d6',
          200: '#f5bfad',
          300: '#E07A5F',
          400: '#d4613f',
          500: '#c04e2e',
          600: '#a33d24',
          700: '#872f1f',
          800: '#6e261d',
          900: '#5b211b',
        },
        tomato: {
          50: '#fff1f0',
          100: '#ffe0de',
          200: '#ffc7c3',
          300: '#FF5A5F',
          400: '#E63946',
          500: '#cf2f3c',
          600: '#b02533',
          700: '#8f1d2a',
          800: '#751a25',
          900: '#611823',
        },
        charcoal: {
          DEFAULT: '#2B2D42',
          light: '#3d3f56',
          lighter: '#8d8fa3',
        },
        headline: '#2B2D42',
        gold: {
          DEFAULT: '#FFC300',
          light: '#FFD95A',
          dark: '#E0AB00',
        },
        primary: {
          DEFAULT: '#E07A5F',
          300: '#E07A5F',
        },
        cream: '#F9F8F6',
        crisp: '#F8F9FA',
        'cream-dark': '#f0eeea',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
