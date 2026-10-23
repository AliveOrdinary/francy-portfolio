/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#191021",
        primary: {
          DEFAULT: "#B065FF",
          dark: "#3A0068",
        },
        accent: {
          red: "#E94E35",
        },
      },
      fontFamily: {
        sans: ["'PP Neue Montreal'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'PP Neue Montreal'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
