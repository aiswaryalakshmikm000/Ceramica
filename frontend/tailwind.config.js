/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      ceramic: {
        blue: {
          DEFAULT: '#3c73a8',
          light: '#4f8bc7',
          dark: '#2a5b8a',
          50: '#e6f0f9',
          100: '#cce1f3',
          200: '#99c2e7',
          300: '#66a4db',
          400: '#3385cf',
          500: '#3c73a8',
          600: '#305c86',
          700: '#244565',
          800: '#182e43',
          900: '#0c1722',
        },
    }},
  },
  plugins: [],
}
}


