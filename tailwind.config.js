/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        fcs: {
          void:          '#0a0a0a',
          depth:         '#1a3a5c',
          output:        '#f5f3ee',
          signal:        '#c8a84b',
          'signal-dark': '#a08538',
          'signal-light':'#e8c870',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2',  fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3',  fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '1.4',  fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.65', fontWeight: '400' }],
        'sm':   ['14px', { lineHeight: '1.5',  fontWeight: '400' }],
      },
      borderRadius: {
        fcs:    '8px',
        'fcs-lg': '12px',
        'fcs-xl': '16px',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'pulse-signal': 'pulse-signal 1.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':      'fade-in 200ms ease-in-out forwards',
        'slide-up':     'slide-up 220ms ease-out forwards',
      },
      keyframes: {
        'pulse-signal': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.35' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'void-radial': 'radial-gradient(ellipse at 60% 0%, rgba(26,58,92,0.18) 0%, transparent 70%)',
      },
      boxShadow: {
        'signal-focus': '0 0 0 3px rgba(200,168,75,0.45)',
        'signal-glow':  '0 0 0 1px rgba(200,168,75,0.3)',
      },
    },
  },
  plugins: [],
}
