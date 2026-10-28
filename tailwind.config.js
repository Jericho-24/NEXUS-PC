/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090d13",
        panel: "#111821",
        line: "#202b37",
        cyan: "#33d6f2",
        blue: "#2788ff",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 42px rgba(39, 136, 255, .18)",
      },
    },
  },
  plugins: [],
};
