/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712', // Deep space base
          900: '#070c18', // Deep navy cosmic
          850: '#0b1324', // Card background
          800: '#111c35',
        },
        astro: {
          blue: '#38bdf8', // NASA ice blue
          accent: '#60a5fa',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Menlo', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'subtle-glow': '0 0 25px rgba(56, 189, 248, 0.08)',
        'card-glass': '0 12px 32px 0 rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
