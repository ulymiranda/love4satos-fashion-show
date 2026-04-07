/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'satos-red': '#C0392B',
        'satos-gold': '#FFD700',
        'satos-dark': '#1a0000',
        'satos-maroon': '#8B0000',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
}
