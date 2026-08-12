/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.tsx",
    "./hooks/**/*.ts",
    "./pages/**/*.tsx",
    "./store/**/*.ts",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Lexend"', 'sans-serif'],
        display: ['"Lexend"', 'sans-serif'],
        sans: ['"Lexend"', 'sans-serif'],
        admin: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#F8F5F0',
          offwhite: '#F8F5F0',
          btn: '#23412F',
          'btn-hover': '#1B3225',
          price: '#23412F',
          border: '#E8E1D7',
          card: '#FFFFFF',
          icon: '#6B4A2F',
          charcoal: '#23412F',
          accent: '#23412F',
          muted: '#6B4A2F',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      }
    },
  },
  plugins: [],
}
