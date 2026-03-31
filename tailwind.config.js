/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#0b0d14',
          800: '#111422',
          700: '#1a1e2e',
        },
        glow: {
          500: '#7cf2c4',
          400: '#9be7ff',
          300: '#e7ff9b',
        },
      },
      boxShadow: {
        soft: '0 20px 50px -30px rgba(15, 23, 42, 0.6)',
        card: '0 25px 60px -40px rgba(15, 23, 42, 0.8)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
