/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
    keyframes: {
      moveToCart: {
        from: { transform: "translate(0, 0)" },
        to: { transform: "translate(100px, 200px)" }, // You can adjust the final position here
      },
      shake: {
        "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
        "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
        "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
        " 40%, 60% ": { transform: "translate3d(4px, 0, 0) " },
      },
      gradientChange: {
        "0%": {
          background: "linear-gradient(to right, #FFFFE0, #c6f1c6)",
        },
        "50%": {
          background: "linear-gradient(to right, #FFFFE0, #c6f1c6)",
        },
        "100%": {
          background: "linear-gradient(to right, #FFFFE0, #c6f1c6)",
        },
      },
    },
    animation: {
      cartMove: "moveToCart 0.5s",
      shake: "shake 0.99s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite",
      gradientChange: "gradientChange 15s linear infinite",
    },
  },
  variants: {
    // ... other variants
    animation: [
      "responsive",
      "motion-safe",
      "motion-reduce",
      "shake",
      "gradientChange",
    ],
  },
  plugins: [],
};
