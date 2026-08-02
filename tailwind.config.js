/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        rose: {
          50: '#fff5f6',
          100: '#ffe8eb',
          200: '#ffd0d8',
          300: '#ffabb9',
          400: '#ff7d96',
          500: '#f94f73',
          600: '#e6315c',
          700: '#c02048',
          800: '#9d1b3e',
          900: '#7a1838',
          950: '#4a0a1f',
        },
        gold: {
          50: '#fffbeb',
          100: '#fdf2c0',
          200: '#f9e28a',
          300: '#f2cc4e',
          400: '#e8b62a',
          500: '#d09a16',
          600: '#b07a10',
          700: '#8a5c10',
          800: '#6b4612',
          900: '#4d3211',
        },
        cream: {
          50: '#fffefb',
          100: '#fdf9ef',
          200: '#faf0db',
          300: '#f5e3c0',
          400: '#ecd09a',
          500: '#e0b974',
        },
        wine: {
          400: '#7a2d45',
          500: '#5e2236',
          600: '#4a1830',
          700: '#371124',
          800: '#260b1a',
          900: '#170610',
        },
      },
      backgroundImage: {
        'rose-radial': 'radial-gradient(circle at 50% 0%, rgba(249,79,115,0.16), transparent 60%)',
        'gold-radial': 'radial-gradient(circle at 50% 0%, rgba(232,182,42,0.18), transparent 55%)',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(94, 34, 54, 0.25)',
        glow: '0 0 40px -8px rgba(232, 182, 42, 0.5)',
        card: '0 18px 50px -20px rgba(74, 24, 48, 0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-22px) rotate(6deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'heart-beat': {
          '0%,100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.18)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.12)' },
        },
        'balloon-rise': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-110vh) rotate(8deg)', opacity: '0' },
        },
        'draw-line': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.7) translateY(20px)' },
          '60%': { opacity: '1', transform: 'scale(1.04) translateY(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 1s ease both',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
        'shimmer': 'shimmer 6s linear infinite',
        'heart-beat': 'heart-beat 1.6s ease-in-out infinite',
        'balloon-rise': 'balloon-rise 7s ease-in forwards',
        'draw-line': 'draw-line 0.9s ease forwards',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
      },
    },
  },
  plugins: [],
};
