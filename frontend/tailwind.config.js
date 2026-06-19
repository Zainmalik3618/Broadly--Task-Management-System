/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#5457e5",
          700: "#4548c7"
        }
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, .06), 0 6px 18px rgba(15, 23, 42, .05)",
        lift: "0 16px 35px rgba(15, 23, 42, .16)"
      }
    }
  },
  plugins: []
};
