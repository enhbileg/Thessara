/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // class-ээр dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",       // root app
    "./app/*/**/*.{js,ts,jsx,tsx,mdx}",     // nested lang folders
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "white",
        background: "white",      // Light mode background
        text: "black",
        //specialText: "yellow",
        backBanner: "gray",
        "dark-backBanner": "yellow",
        //"dark-specialText" : "yellow",            // Light mode text
        "dark-background": "#0f172a",
        "dark-text": "#e2e8f0",
        "dark-primary": "#1e293b",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      }
    },
  },
  plugins: [],
};
