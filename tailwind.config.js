/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff007f',
          purple: '#9d00ff',
          cyan: '#00f0ff',
          amber: '#ffaa00',
          lime: '#39ff14',
          rose: '#ff0055',
        },
        night: {
          950: '#050509',
          900: '#0b0a12',
          800: '#141320',
          700: '#1e1c30',
          600: '#2b2842',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 10px rgba(255, 0, 127, 0.4), 0 0 20px rgba(157, 0, 255, 0.3)' },
          'to': { boxShadow: '0 0 25px rgba(255, 0, 127, 0.8), 0 0 40px rgba(157, 0, 255, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
