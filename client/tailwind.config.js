/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'satos-red':    '#7B1D32',   // Baldwin burgundy
        'satos-gold':   '#C0C0C0',   // Silver (replaces gold)
        'satos-dark':   '#0D0509',   // Near-black with burgundy tint
        'satos-maroon': '#5A1525',   // Deep dark burgundy
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
}
