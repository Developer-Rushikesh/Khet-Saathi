/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        khet: {
          50: '#f2f9f3',
          100: '#e1f2e4',
          200: '#c4e5cb',
          300: '#97d1a4',
          400: '#64b476',
          500: '#3e9753',
          600: '#2d793f',
          700: '#266034',
          800: '#224d2c',
          900: '#1d4026',
          950: '#0c2313',
        },
        earth: {
          50: '#fbf8f5',
          100: '#f5edd6',
          200: '#e9d6ac',
          300: '#dcbb7c',
          400: '#d09f52',
          500: '#b78036',
          600: '#9c642c',
          700: '#7b4b27',
          800: '#653e26',
          900: '#543423',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
