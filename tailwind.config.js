/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        cloud: {
          "0%, 100%": { transform: "translateX(0rem)" },
          "50%": { transform: "translateX(1rem)" },
        },
      },
      animation: {
        cloud: "cloud 10s ease infinite",
      },
    },
  },
  plugins: [],
};
