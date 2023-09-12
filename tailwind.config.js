/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
    keyframes: {
      moveToCart: {
        'from': { transform: 'translate(0, 0)' },
        'to': { transform: 'translate(100px, 200px)' }, // You can adjust the final position here
      },
    },
    animation: {
      cartMove: 'moveToCart 0.5s',
    },
  },
  variants: {
    // ... other variants
    animation: ['responsive', 'motion-safe', 'motion-reduce'],
  },
  plugins: [],
}