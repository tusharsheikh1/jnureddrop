/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        red: {
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      keyframes: {
        'fade-slide-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-slide-in': 'fade-slide-in 0.25s ease-out both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
