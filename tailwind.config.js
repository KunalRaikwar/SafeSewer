/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070B19',
          900: '#0B132B',
          850: '#111B38',
          800: '#1C2541',
          700: '#2C3A5A',
          600: '#3A4B75',
          500: '#4D6293',
        },
        safety: {
          blue: '#2563EB',
          'blue-light': '#3B82F6',
          'blue-dark': '#1D4ED8',
          green: '#16A34A',
          'green-light': '#22C55E',
          'green-dark': '#15803D',
          amber: '#D97706',
          'amber-light': '#F59E0B',
          'amber-dark': '#B45309',
          red: '#DC2626',
          'red-light': '#EF4444',
          'red-dark': '#B91C1C',
          gray: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'radar-ping': {
          '0%': { transform: 'scale(0.8)', opacity: 0.8 },
          '100%': { transform: 'scale(2.2)', opacity: 0 },
        },
        'beacon': {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.15)', opacity: 0.85 },
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-ping': 'radar-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'beacon': 'beacon 1.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
