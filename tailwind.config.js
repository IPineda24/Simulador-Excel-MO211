/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        'sim-bg': '#0a0e1a',
        'sim-surface': '#111827',
        'sim-card': '#1a2235',
        'sim-border': '#1e2d45',
        'sim-accent': '#00d4ff',
        'sim-accent2': '#7c3aed',
        'sim-green': '#10b981',
        'sim-yellow': '#f59e0b',
        'sim-red': '#ef4444',
        'sim-text': '#e2e8f0',
        'sim-muted': '#64748b',
        'challenge-accent': '#f97316',
        'challenge-glow': '#ea580c',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,212,255,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(0,212,255,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
